import config from './config'
import { objectKeyToString } from 'utils'
import type { AliyunTracking, Log } from 'types'

function getAliyunReportUrl(opts: AliyunTracking) {
  return `http://${opts.project}.${opts.host}/logstores/${opts.logstore}/track?APIVersion=0.6.0&`
}

export function reportLog(log: Log) {
  let { aliyunLog } = config
  if (aliyunLog) {
    let aliyunFetchUrl = getAliyunReportUrl(aliyunLog) + objectKeyToString(log)
    fetch(aliyunFetchUrl, {
      method: 'get',
      mode: 'cors'
    })
    return
  }
}
