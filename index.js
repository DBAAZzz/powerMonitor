import {handleClick} from './handler.js'
import {getPerformance, getSourceInfo} from './performance.js'
import {addListenClick, addListenPromise, addListenNormalError} from './listenEvent.js'

export default class PowerMonitor {
    constructor(options) {
        this.init(options)
    }

    init() {
        window.onload = () => {
            getPerformance()
            getSourceInfo();
            this.addListenEvent();
            this.addListenError();
        }
    }

    // 监听用户交互事件
    addListenEvent() {
        addListenClick();
    }

    // 监听程序异常报错
    addListenError() {
        addListenPromise();
        addListenNormalError();
    }
}