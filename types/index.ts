enum ClientEnum {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios'
}

export type Log = {
  client: ClientEnum
  logKey: 'network' | 'userAgent' | 'error'
  /** 日志等级 */
  level: 'info' | 'warning' | 'error'
  /** 日志信息 */
  message: string
  extra?: string
}

export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void
}

export interface AliyunTracking {
  /** Project名称 */
  project: string
  /** 日志服务所在地域的Endpoint */
  host: string
  /** Logstore名称 */
  logstore: string
  /** 发送日志的时间间隔 */
  time?: number
  /** 发送日志的数量大小 */
  count?: number
  /** 日志主题 */
  topic?: string
  /** 日志来源 */
  source?: string
}

export interface Options {
  dns?: string
  listenClick?: boolean
  aliyunLog?: AliyunTracking
}

export interface TimeoutList extends Partial<PerformanceResourceTiming> {
  loadTime?: number
}

export interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}
