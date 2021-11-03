import { handleClick, handlerError } from './handler.js';
import { uploadReport } from './utils/index.js'

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
        let { reason } = error;
        console.log('promise error', reason.stack || reason.message)
    })
}

export function addListenVueError(Vue) {
    Vue.config.errorHandler = (err, vm, info) => {
        console.log('err', err)
        console.log('err', err.stack.toString())
        console.log('xxxxx', err.stack.toString().split('\n'))
        let errorArr = err.stack.toString().split('\n');
        console.log(errorArr[1].match(/\((.+?)\)/g))
        uploadReport({
            err: err.stack.toString()
        })
        throw err
    }
}