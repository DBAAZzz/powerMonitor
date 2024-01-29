import { isNavigatorSupported } from 'utils/supported'
import { roundByFour } from 'utils/index'

// 获取网络情况
export function getNetWork() {
  if (!isNavigatorSupported()) {
    console.warn('不支持 navigator，无法获取网络情况！')
    return
  }

  console.log('网络情况为：', navigator['connection'])
}

// 获取设备信息
export function getUserAgent() {
  if (!isNavigatorSupported()) {
    console.warn('不支持 navigator，无法获取设备信息！')
    return
  }
  let { userAgent } = window.navigator
  console.log('设备信息为：', userAgent)
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

        if (fpsQueue.length > count + 5) {
          cancelAnimationFrame(timerId)
          resolve(
            roundByFour(
              fpsQueue.slice(5).reduce((sum, fps) => {
                sum = sum + fps
                return sum
              }, 0) /
                (fpsQueue.length - 5),
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

export function initClientInfo() {
  getNetWork()
  getUserAgent()
  calculateFps(5).then((res) => {
    console.log('页面的帧数为：', res)
  })
}
