import { reportLog } from './report'
import { ClientEnum } from 'src/types'

export function handlerError(error: any) {
  if (error instanceof ErrorEvent) {
    console.log('JS错误')
    let { message, filename, lineno, colno } = error
    console.table({ message, filename, lineno, colno })
  } else if (error instanceof Event) {
    console.log('资源加载错误')
    reportLog({
      client: ClientEnum.WEB,
      level: 'error',
      message: '资源加载错误',
      createTime: +new Date(),
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
    console.log('promise error', reason.stack || reason.message)
  })
}

export function initErrorListen() {
  addListenNormalError()
  addListenPromise()
}
