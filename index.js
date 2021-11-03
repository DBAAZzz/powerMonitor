import { getPerformance, getSourceInfo } from './performance.js'
import { addListenClick, addListenPromise, addListenNormalError } from './listenEvent.js'
import { install } from './install.js'

export default class PowerMonitor {
    constructor() {
        this.options = {};
        this.init()
    }

    init(options) {
        this.options = options
        window.onload = () => {
            getPerformance()
            getSourceInfo();
            this.addListenEvent();
            this.addListenError();
        }
    }

    // 监听用户交互事件
    addListenEvent() {
        // 监听用户的点击事件
        addListenClick();
    }

    // 监听程序异常报错
    addListenError() {
        // 监听JS和资源加载异常
        addListenNormalError();
        // 监听Promise抛出的异常
        addListenPromise();
    }
}

PowerMonitor.install = install

