import WebTrackerBrowser from '@aliyun-sls/web-track-browser'
import SlsTracker from '@aliyun-sls/web-track-browser'
import { AliyunTracking } from 'types'

/** 初始化阿里云Web Tracking JavaScript SDK */
export function initAliyunTracking(opts: AliyunTracking): WebTrackerBrowser {
  const tracker = new SlsTracker(opts)
  return tracker
}
