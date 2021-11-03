import { addListenVueError } from './listenEvent.js'

export let _Vue

export function install(Vue) {
    console.log('Vue', Vue)
    if (install.installed && _Vue === Vue) return
    install.installed = true

    _Vue = Vue
    
    // 监听Vue抛出的Error
    addListenVueError(Vue)

}