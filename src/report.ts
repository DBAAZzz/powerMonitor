import config from './config'
import { objectKeyToString } from 'src/utils'
import { getNetWork, getNetworkOnline, getUserAgent } from './utils/getClientInfo'
import type { AliyunTracking, Log, Options } from 'src/types'

function getAliyunReportUrl(opts: AliyunTracking) {
  return `http://${opts.project}.${opts.host}/logstores/${opts.logstore}/track?APIVersion=0.6.0&`
}

export function reportLog(log: Log) {
  console.log(getNetworkOnline() ? '在线' : '没有网络')
  // 网络不处于离线状态就立即上传日志
  if (getNetworkOnline()) {
    const { aliyunLog, projectKey } = config as Options
    const defaultReportLog = {
      projectKey: projectKey,
      url: window.location.href,
      network: getNetWork().effectiveType,
      userAgent: getUserAgent()
    }
    const reportLog = {
      ...defaultReportLog,
      ...log
    }
    if (aliyunLog) {
      let aliyunFetchUrl = getAliyunReportUrl(aliyunLog) + objectKeyToString(reportLog)
      fetch(aliyunFetchUrl, {
        method: 'get',
        mode: 'cors'
      })
      return
    }
  }
}
