import { TimeoutList } from 'types/index'
import observe from 'utils/observe'
import { isPerformanceObserverSupported, isPerformanceSupported } from 'utils/supported'

export function getNavTimes() {
  let navTimes: any
  // 判断浏览器是否支持该API
  if (typeof window.PerformanceNavigationTiming === 'function') {
    try {
      var nt2Timing = performance.getEntriesByType('navigation')[0]
      if (nt2Timing) {
        navTimes = nt2Timing
      }
    } catch (err) {}
  } else {
    navTimes = window.performance.timing
  }

  return navTimes
}

/**
 * 获取页面性能
 */
export function getPerformance() {
  let timer: number | undefined

  let getTimes = () => {
    const {
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      domContentLoadedEventEnd,
      responseEnd,
      loadEventEnd
    } = getNavTimes()

    // 如果 loadEventEnd 的值为 0 ，那么就定时
    if (loadEventEnd <= 0) {
      timer = window.setTimeout(() => {
        getTimes()
      }, 500)
      return
    }

    clearTimeout(timer)

    let times = {
      dnsTime: domainLookupEnd - domainLookupStart, // DNS 查询耗时
      tcpTime: connectEnd - connectStart, // TCP 连接耗时
      sslTime: connectEnd - secureConnectionStart, // SSL 连接耗时
      domContentLoadedTime: domContentLoadedEventEnd - responseEnd, // DOMContentLoaded 耗时
      assetsTime: loadEventEnd - domContentLoadedEventEnd, // 资源加载耗时
      pageRenderTime: loadEventEnd - responseEnd, // 页面渲染耗时
      firstTime: loadEventEnd - fetchStart // Load 耗时
    }

    let table = [
      { 属性: 'DNS 查询耗时', ms: times.dnsTime },
      { 属性: 'TCP 连接耗时', ms: times.tcpTime },
      { 属性: 'SSL 连接耗时', ms: times.sslTime },
      { 属性: 'DOMContentLoaded 耗时', ms: times.domContentLoadedTime },
      { 属性: '资源加载耗时', ms: times.assetsTime },
      { 属性: '页面渲染耗时', ms: times.pageRenderTime },
      { 属性: 'Load 耗时', ms: times.firstTime }
    ]
    console.table(table)
  }

  getTimes()
}

/**
 * First Contentful Paint （最大内容绘制）
 * 浏览器开始渲染 dom 元素，包括任何 text、images、非空白 canvas 和 svg
 * @returns
 */
export function getFCP(): Promise<PerformanceEntry> {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(new Error('browser do not support performance'))
      } else {
        const [entry] = performance.getEntriesByName('first-contentful-paint')

        if (entry) {
          resolve(entry)
        }

        reject(new Error('browser has no fcp'))
      }
    } else {
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.name === 'first-contentful-paint') {
          if (po) {
            po.disconnect()
          }
          resolve(entry)
        }
      }

      const po = observe('paint', entryHandler)
    }
  })
}

/**
 * layout-shift
 * 最大内容绘画度量标准报告视口内可见的最大图像或文本块的渲染时间
 * @returns
 */
export function getLCP(): Promise<PerformanceEntry> {
  return new Promise((resolve, reject) => {
    const entryHandler = (entry: PerformanceEntry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        if (po) {
          po.disconnect()
        }
        resolve(entry)
      }
    }

    const po = observe('largest-contentful-paint', entryHandler)
  })
}

/**
 * First Input Delay （首次输入延迟）
 * FID 测量的是当用户第一次在页面上交互的时候，到浏览器实际开始处理这个事件的时间
 * @returns
 */
export function getFID(): Promise<PerformanceEntry> {
  return new Promise((resolve, reject) => {
    const entryHandler = (entry: PerformanceEntry) => {
      if (po) {
        po.disconnect()
      }
      resolve(entry)
    }

    const po = observe('first-input', entryHandler)
  })
}

/**
 * First Paint
 * 首次绘制，即浏览器绘制页面第一个像素的时间
 * @returns
 */
export function getFP(): Promise<PerformanceEntry> | undefined {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(new Error('browser do not support performance'))
      } else {
        const [entry] = performance.getEntriesByName('first-paint')

        if (entry) {
          resolve(entry)
        }

        reject(new Error('browser has no fp'))
      }
    } else {
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.name === 'first-paint') {
          if (po) {
            po.disconnect()
          }
          resolve(entry)
        }
      }

      const po = observe('paint', entryHandler)
    }
  })
}

/**
 * Cumulative Layout Shift （累计布局偏移）
 * CLS 是 Google 衡量网页加载和交互时发生的布局偏移总量，即意外移动网页主要内容的布局偏移数量
 * Google 建议 CLS 分数为 0.1 或 耕地
 * @param cls
 * @returns
 */
export function getCLS(cls: any): Promise<PerformanceObserver> | undefined {
  return new Promise((resove, reject) => {
    if (!isPerformanceObserverSupported()) {
      reject('browser do not support performanceObserver')
    } else {
      const entryHandler = (entry: any) => {
        if (po) {
          po.disconnect()
        }
        if (!entry.hadRecentInput) {
          cls.value += entry.value
        }
        resove(cls)
      }
      const po = observe('layout-shift', entryHandler)
    }
  })
}

/**
 * 获取资源的加载情况
 */
export function getSourceInfo() {
  const resourceTimes: Partial<PerformanceResourceTiming>[] = performance.getEntriesByType('resource')
  // 设置资源加载的超时时间10s
  const TIMEOUT: number = 1000 * 10
  const getLoadTime = (startTime: number | undefined, endTime: number | undefined) => {
    return Number((Number(endTime) - Number(startTime)).toFixed(2))
  }
  // 超时列表
  let timeoutList: TimeoutList[] = []
  for (let i = 0; i < resourceTimes.length; i++) {
    if (getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
      let { name, nextHopProtocol, startTime, responseEnd, initiatorType } = resourceTimes[i]
      timeoutList.push({
        name,
        nextHopProtocol,
        initiatorType,
        loadTime: getLoadTime(startTime, responseEnd)
      })
    }
  }
  if (timeoutList.length == 0) {
    console.log('没有资源加载超时')
  } else {
    console.warn('有资源加载超时了')
    console.table(timeoutList)
  }
}

export function initPerformance() {
  window.addEventListener('load', () => {
    getPerformance()
    getSourceInfo()
    getFCP().then((res) => {
      console.log('getFCP', res)
    })
    getLCP().then((res) => {
      console.log('getLCP', res)
    })
    getFID().then((res) => {
      console.log('getFID', res)
    })
    getFP()?.then((res) => {
      console.log('getFP', res)
    })
    getCLS({ value: 0 })?.then((res) => {
      console.log('getCLS', res)
    })
  })
}
