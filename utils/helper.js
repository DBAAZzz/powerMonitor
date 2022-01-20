/**
 * 判断 element 元素是否在屏幕中
 * @param {Element} element 
 * @returns 
 */
export function isInScreen(element) {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    let elementRectInfo = element.getBoundingClientRect()

    let { left, top } = elementRectInfo

    return left >= 0 && left < viewportWidth && top >= 0 && top < viewportHeight;
}

/**
 * 判断是否为可以忽略的节点
 * @param {Element} node 
 * @returns 
 */
export function isIgnoreNode(node) {
    if (window.getComputedStyle(node).display === 'node') return true

    return node.tagName == 'IMG' && node.width > 2 && node.height > 3 ? true : false
}

/**
 * 获取节点的样式
 * @param {Element} element 
 * @param {string} attr 
 */
export function getStyleByElement(element, attr) {
    //特性侦测
    if (window.getComputedStyle) {
        //优先使用W3C规范
        return window.getComputedStyle(element)[attr];
    } else {
        //针对IE9以下兼容
        return element.currentStyle[attr];
    }
}
