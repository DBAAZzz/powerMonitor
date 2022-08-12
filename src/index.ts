import { initPerformance } from './performance'
import { initErrorListen } from './error'
import { addListenClickEvent } from './hacker'
import { Options } from '../types/index'

export default class PowerMonitor {
  options: Options;

  constructor(options: Options = {
    listenClick: false
  }) {
    this.options = options
    initPerformance()
    initErrorListen()
    options.listenClick && addListenClickEvent()
  }

  init() {
  }
}