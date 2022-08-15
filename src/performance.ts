import { TimeoutList } from 'types/index'
import observe from 'utils/observe'
import { isPerformanceObserverSupported, isPerformanceSupported, roundByFour } from 'utils/index'

export function getNavTimes() {
  let navTimes: any
  // 判断浏览器是否支持该API
  if (typeof window.PerformanceNavigationTiming === 'function') {
    try {
      var nt2Timing = performance.getEntriesByType('navigation')[0]
      if (nt2Timing) {
        navTimes = nt2Timing
      }
    } catch (err) {
    }
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
      domInteractive,
      domComplete,
      loadEventEnd
    } = getNavTimes();
    // 如果 loadEventEnd 的值为 0 ，那么就定时
    if (loadEventEnd <= 0) {
      timer = setTimeout(() => {
        getTimes()
      }, 500);
      return
    }

    clearTimeout(timer)

    let times = {
      dnsTime: domainLookupEnd - domainLookupStart, // dns查询耗时
      tcpTime: connectEnd - connectStart, // TCP 连接耗时
      analysicsTime: domComplete - domInteractive, // 解析DOM耗时
      blankTime: domInteractive - fetchStart, // 白屏时间
      firstTime: loadEventEnd - fetchStart, // 首屏时间
    }

    let table = [
      { '属性': 'dns查询耗时', 'ms': times.dnsTime },
      { '属性': 'TCP 连接耗时', 'ms': times.tcpTime },
      { '属性': '解析DOM耗时', 'ms': times.analysicsTime },
      { '属性': '白屏时间', 'ms': times.blankTime },
      { '属性': '首屏时间', 'ms': times.firstTime }
    ]
    console.table(table)
  }

  getTimes()
}

/**
 * First Contentful Paint
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
      if (entry.name === 'largest-contentful-paint') {
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
 * First Input Delay
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
 * 使用 requestAnimationFrame 来计算页面的 fps
 * @param count 
 * @returns 
 */
export function calculateFps(count: number): Promise<number> {
  return new Promise((resolve) => {
    let frame = 0
    let lastFrameTime = +new Date()
    const fpsQueue: any[] = []
    let timerId: number

    const calculate = () => {
      const now = +new Date()

      frame = frame + 1

      if (now > 1000 + lastFrameTime) {
        const fps = Math.round(frame / ((now - lastFrameTime) / 1000))
        fpsQueue.push(fps)
        frame = 0
        lastFrameTime = +new Date()

        if (fpsQueue.length > count) {
          cancelAnimationFrame(timerId)
          resolve(
            roundByFour(
              fpsQueue.reduce((sum, fps) => {
                sum = sum + fps
                return sum
              }, 0) / fpsQueue.length, 
              2
            )
          )
        } else {
          timerId = requestAnimationFrame(calculate)
        }
      } else {
        timerId = requestAnimationFrame(calculate)
      }
    }

    calculate()
  })
}

/**
 * 获取资源的加载情况
 */
export function getSourceInfo() {
  const resourceTimes: Partial<PerformanceResourceTiming>[] = performance.getEntriesByType('resource');
  // 设置资源加载的超时时间10s
  const TIMEOUT: number = 1000 * 10;
  const getLoadTime = (startTime: number | undefined, endTime: number | undefined) => {
    return Number((Number(endTime) - Number(startTime)).toFixed(2));
  }
  // 超时列表
  let timeoutList: TimeoutList[] = [];
  for (let i = 0; i < resourceTimes.length; i++) {
    if (getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
      let { name, nextHopProtocol, startTime, responseEnd, initiatorType } = resourceTimes[i];
      timeoutList.push({
        name, nextHopProtocol, initiatorType,
        loadTime: getLoadTime(startTime, responseEnd)
      });
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
    calculateFps(20).then((res) => {
      console.log('calculateFps', res)
    })
  })
}