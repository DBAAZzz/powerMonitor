import WebTrackerBrowser from '@aliyun-sls/web-track-browser'
import { initPerformance } from './performance'
import { initErrorListen } from './error'
import { initClientInfo } from './clientInfo'
import { initAliyunTracking } from './aliyunTracking'
import { addListenClickEvent, initProxy } from './hacker'
import { Options } from '../types/index'

export default class PowerMonitor {
  options: Options
  aliyunTracker?: WebTrackerBrowser

  constructor(
    options: Options = {
      listenClick: false
    }
  ) {
    this.options = options
    this.init()
  }

  init() {
    let { listenClick, aliyunLog } = this.options
    initClientInfo()
    initPerformance()
    initErrorListen()
    initProxy()
    if (listenClick) addListenClickEvent()
    if (aliyunLog) this.aliyunTracker = initAliyunTracking(aliyunLog)
  }
}
