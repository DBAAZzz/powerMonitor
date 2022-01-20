import { getStyleByElement } from './helper.js';

let navTimes

if (typeof window.PerformanceNavigationTiming === 'function') {
    navTimes = performance.getEntriesByType('navigation')[0]
} else {
    navTimes = window.performance.timing
}

const START_TIME = navTimes.responseEnd;

// 可以忽略的节点
const IGNORE_TAG_SET = ["SCRIPT", "STYLE", "META", "HEAD", "LINK", 'NOSCRIPT'];

// 标签权重
const TAG_WEIGHT_MAP = {
    SVG: 2,
    IMG: 2,
    CANVAS: 4,
    OBJECT: 4,
    EMBED: 4,
    VIDEO: 4
};

const LIMIT = 1000;

const WW = window.innerWidth;

const WH = window.innerHeight;

const DELAY = 500;

export default class FMPTiming {
    constructor() {
        this.statusCollector = [];
        this.flag = true;
        this.muo = MutationObserver;
        this.observer = null;
        this.callbackCount = 1;
        this.mp = {};

        this.initObserver();
    }

    firstSnapshot() {

        let t = performance.now() - START_TIME;

        let bodyTarget = document.body;

        if (bodyTarget) {
            this.doTag(bodyTarget, this.callbackCount++);
        }

        this.statusCollector.push({ t });
    }
    initObserver() {
        // 记录代码执行之前加载的元素的时间点
        this.firstSnapshot();

        let callback = () => {
            let t = performance.now() - START_TIME;
            let bodyTarget = document.body;

            if (bodyTarget) {
                this.doTag(bodyTarget, this.callbackCount++);
            }
            this.statusCollector.push({
                t
            });
        }
        // 初始化 MutationObserver
        this.observer = new MutationObserver(callback);

        // 并且开始监听 document 的加载情况
        this.observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 只有当 document 的状态为 complete 或 load事件执行的时候才会计算最终分数
        if (document.readyState === "complete") {
            this.calFinallScore();
        } else {
            window.addEventListener("load", () => {
                this.calFinallScore();
            }, true);
        }
    }

    initResourceMap() {
        // 获取所有元素最大的加载时间，作为页面加载的 FMP 时间
        performance.getEntries().forEach(item => {
            this.mp[item.name] = item.responseEnd;
        });
    }

    doTag(target, callbackCount) {
        let tagName = target.tagName;
        if (IGNORE_TAG_SET.indexOf(tagName) === -1) {
            let childrenLen = target.children ? target.children.length : 0;
            if (childrenLen > 0) {
                for (let childs = target.children, i = childrenLen - 1; i >= 0; i--) {
                    if (childs[i].getAttribute("f_c") === null) {
                        childs[i].setAttribute("f_c", callbackCount);
                    }
                    this.doTag(childs[i], callbackCount);
                }
            }
        }
    }

    calFinallScore() {
        if (MutationObserver && this.flag) {
            // 检查是否停止监听
            if (!this.checkCanCal(START_TIME)) {
                console.time("calTime");
                this.observer.disconnect();

                this.flag = false;

                let res = this.deepTraversal(document.body);

                let tp;

                res.dpss.forEach(item => {
                    if (tp && tp.st) {
                        if (tp.st < item.st) {
                            tp = item;
                        }
                    } else {
                        tp = item;
                    }
                });

                this.initResourceMap();

                let resultSet = this.filterTheResultSet(tp.els);

                let fmpTiming = this.calResult(resultSet);

                console.log("fmp : ", fmpTiming);

                console.timeEnd("calTime");
            } else {
                setTimeout(() => {
                    this.calFinallScore();
                }, DELAY);
            }
        }
    }

    calResult(resultSet) {
        let rt = 0;
        resultSet.forEach(item => {
            let t = 0;
            if (item.weight === 1) {
                let index = +item.node.getAttribute("f_c") - 1;
                t = this.statusCollector[index].t;
            } else if (item.weight === 2) {
                if (item.node.tagName === "IMG") {
                    t = this.mp[item.node.src];
                } else if (item.node.tagName === "SVG") {
                    let index = +item.node.getAttribute("f_c") - 1;
                    t = this.statusCollector[index].t;
                } else {
                    //background image
                    let match = getStyleByElement(item.node, 'background-image').match(/url\(\"(.*?)\"\)/);

                    let s;
                    if (match && match[1]) {
                        s = match[1];
                    }
                    if (s.indexOf("http") == -1) {
                        s = location.protocol + match[1];
                    }
                    t = this.mp[s];
                }
            } else if (item.weight === 4) {
                if (item.node.tagName === "CANVAS") {
                    let index = +item.node.getAttribute("f_c") - 1;
                    t = this.statusCollector[index].t;
                } else if (item.node.tagName === "VIDEO") {
                    t = this.mp[item.node.src];

                    !t && (t = this.mp[item.node.poster]);
                }
            }

            console.log(t, item.node);
            rt < t && (rt = t);
        });

        return rt;
    }

    filterTheResultSet(els) {
        let sum = 0;
        els.forEach(item => {
            sum += item.st;
        });

        let avg = sum / els.length;

        return els.filter(item => {
            return item.st >= avg;
        });
    }

    deepTraversal(node) {
        if (node) {
            let dpss = [];

            for (let i = 0, child; (child = node.children[i]); i++) {
                let s = this.deepTraversal(child);
                if (s.st) {
                    dpss.push(s);
                }
            }

            return this.calScore(node, dpss);
        }
        return {};
    }

    calScore(node, dpss) {
        let {
            width,
            height,
            left,
            top,
            bottom,
            right
        } = node.getBoundingClientRect();
        let f = 1;

        if (WH < top || WW < left) {
            // 不在可视 viewport 中
            f = 0;
        }

        let sdp = 0;

        dpss.forEach(item => {
            sdp += item.st;
        });

        let weight = TAG_WEIGHT_MAP[node.tagName] || 1;

        if (
            weight === 1 &&
            getStyleByElement(node, 'background-image') &&
            getStyleByElement(node, 'background-image') !== "initial" &&
            getStyleByElement(node, 'background-image') !== "none"
        ) {
            weight = TAG_WEIGHT_MAP["IMG"]; //将有图片背景的普通元素 权重设置为img
        }

        let st = width * height * weight * f;

        let els = [{ node, st, weight }];

        let areaPercent = this.calAreaPercent(node);

        if (sdp > st * areaPercent || areaPercent === 0) {
            st = sdp;
            els = [];

            dpss.forEach(item => {
                els = els.concat(item.els);
            });
        }

        return {
            dpss,
            st,
            els
        };
    }

    checkCanCal(start) {
        let ti = Date.now() - start;
        return !(
            ti > LIMIT ||
            ti -
            ((this.statusCollector &&
                this.statusCollector.length &&
                this.statusCollector[this.statusCollector.length - 1].t) ||
                0) >
            1000
        );
    }

    calAreaPercent(node) {
        let {
            left,
            right,
            top,
            bottom,
            width,
            height
        } = node.getBoundingClientRect();
        let wl = 0;
        let wt = 0;
        let wr = WW;
        let wb = WH;

        let overlapX =
            right - left + (wr - wl) - (Math.max(right, wr) - Math.min(left, wl));
        if (overlapX <= 0) {
            //x 轴无交点
            return 0;
        }

        let overlapY =
            bottom - top + (wb - wt) - (Math.max(bottom, wb) - Math.min(top, wt));
        if (overlapY <= 0) {
            return 0;
        }

        return (overlapX * overlapY) / (width * height);
    }
}