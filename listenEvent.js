import { handleClick, handlerError } from "./handler.js";


// 监听点击事件
export function addListenClick() {
    window.addEventListener('click', (event) => {
        handleClick(event)
    })
}

// 监听语法错误和资源加载错误
export function addListenNormalError() {
    window.addEventListener('error', (error) => {        
        handlerError(error)
        
    }, true)
}

// 监听promise引发的错误
export function addListenPromise() {
    window.addEventListener('unhandledrejection', (error) => {
        console.log('promise error', error);
        let { reason } = error;
        console.log('promise error', reason.stack || reason.message)
    })
}