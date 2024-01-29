import { initPerformance } from './performance'
import { initErrorListen } from './error'
import { initClientInfo } from './clientInfo'
import { addListenClickEvent, initProxy } from './hacker'
import { Options } from '../types/index'

export default class PowerMonitor {
  options: Options

  constructor(
    options: Options = {
      listenClick: false
    }
  ) {
    this.options = options
    initClientInfo()
    initPerformance()
    initErrorListen()
    initProxy()
    options.listenClick && addListenClickEvent()
  }

  init() {}
}
