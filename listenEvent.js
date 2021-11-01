import { getUserAgent } from "./util/index.js";
import { handleClick, handlerError } from "./handler.js";

function addEvent(element, type, callback) {
    if (element.addEventListener) {
        element.addEventListener(type, callback)
    } else {
        element.attachEvent('on' + type, callback)
    }
}

// 监听点击事件
export function addListenClick() {
    addEvent(window, 'click', (event) => {
        handleClick(event)
    })
}

// 语法错误和资源加载错误
export function addListenNormalError() {
    addEvent(window, 'error', (error) => {
        console.log(getUserAgent());
        let { message, filename, lineno, colno } = error;
        console.log({
            type: 'error'
        })
        handlerError(error)
        // uploadReport({
        //     type: 'error',
        //     message, filename, lineno, colno
        // })
        console.table({ message, filename, lineno, colno })
    })
}

// 监听promise引发的错误
export function addListenPromise() {
    addEvent(window, 'unhandledrejection', (error) => {
        console.log('promise error', error);
        let { reason } = error;
        console.log('promise error', reason.stack || reason.message)
    })
}