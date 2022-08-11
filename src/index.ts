import { initPerformance } from './performance'
import { Options } from '@types/index'

export default class PowerMonitor {
  options: Options;

  constructor(options: Options) {
    initPerformance()
    this.options = options
  }

  init() {
  }
}