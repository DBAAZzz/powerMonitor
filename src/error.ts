import { reportLog } from './report'
import { ClientEnum } from 'src/types'

export function handlerError(error: any) {
  if (error instanceof ErrorEvent) {
    let { message, filename, lineno, colno } = error
    reportLog({
      client: ClientEnum.WEB,
      message,
      level: 'error',
      timestamp: +new Date()
    })
  } else if (error instanceof Event) {
    console.log('资源加载错误')
    reportLog({
      client: ClientEnum.WEB,
      level: 'error',
      message: '资源加载错误',
      timestamp: +new Date(),
      // @ts-ignore
      extra: error.target.tagName
    })
  }
}

// 监听语法错误和资源加载错误
export function addListenNormalError() {
  window.addEventListener(
    'error',
    (error) => {
      handlerError(error)
    },
    true
  )
}

// 监听 promise 引发的错误
export function addListenPromise() {
  window.addEventListener('unhandledrejection', (error) => {
    let { reason } = error
    reportLog({
      client: ClientEnum.WEB,
      message: encodeURIComponent(reason.stack || reason.message),
      level: 'error',
      timestamp: +new Date()
    })
  })
}

export function initErrorListen() {
  addListenNormalError()
  addListenPromise()
}
