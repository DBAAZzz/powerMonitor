import { initPerformance } from './performance'
import { initErrorListen } from './error'
import { addListenClickEvent, initProxy } from './hacker'
import config from './config'
import type { Options } from './types/index'

function init(opts: Options) {
  let { listenClick } = opts
  initPerformance()
  initErrorListen()
  /** 重写 ajax 和 fetch */
  initProxy()
  if (listenClick) addListenClickEvent()
}

export default function PowerMonitor(opts: Options) {
  init(opts)
  return Object.assign(config, opts)
}
