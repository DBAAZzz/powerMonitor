import { addListenVueError } from './listenEvent.js'
import FMPTiming from './utils/fmp.js'

export let _Vue, startTime

export function install(Vue) {
    if (install.installed && _Vue === Vue) return
    install.installed = true

    _Vue = Vue

    // 监听Vue抛出的Error
    addListenVueError(Vue)

    addListenVuePage()
    new FMPTiming()
}

// 监听 vue 路由变化
function addListenVuePage() {
    history.pushState = coverFN('pushState'); // 覆盖 history 原生的 pushState 方法，通过dispatchEvent手动触发一个事件  
    history.replaceState = coverFN('replaceState'); // 覆盖 history 原生的 replaceState 方法

    window.addEventListener('pushState', () => {
        console.log(document.readyState)
    })

    window.addEventListener('replaceState', () => {
        
    })
}

// 覆盖原生的方法
function coverFN(type) {
    let original = history[type]
    return function () {
        var rv = original.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
}

// 通过 MutationObserver 监听 DOM 的变化
function observeDOM() {

    const observer = new MutationObserver(callback)


    observer.observe(document, {
        attributes: false, // 设为 true 以观察受监视元素的属性值变更。
        childList: true, // 设为 ture 以目标节点添加删除或删除新的子节点
        subtree: true // 设为 true 以将监视范围扩展至目标节点整个节点树中的所有节点
    })
}





