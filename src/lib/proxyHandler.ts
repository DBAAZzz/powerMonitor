// 重写 XMLHttpRequest 的 open 方法
export function proxyXhr(beforeHandler?: Function, afterHandler?: Function): void {
  if ('XMLHttpRequest' in window && !window.__proxy_xhr__) {
    const origin = window.XMLHttpRequest
    const originOpen = origin.prototype.open
    window.__proxy_xhr__ = true
    origin.prototype.open = function (this: XMLHttpRequest, ...args: Array<any>) {
      const startTime: number = +new Date()
      beforeHandler && beforeHandler(args[1])
      originOpen.apply(this, args)
      this.addEventListener('loadend', () => {
        const endTime: number = +new Date()
        console.table(args)
        console.log(`请求接口响应时间为：${endTime - startTime}ms`)
        afterHandler && afterHandler(args[1])
      })
    }
  }
}

// 重写 fetch 方法
export function proxyFetch(beforeHandler?: Function, afterHandler?: Function): void {
  if ('fetch' in window && !window.__monitor_fetch__) {
    const origin = window.fetch
    window.__monitor_fetch__ = true
    window.fetch = function (resource: string, init: Partial<Request>) {
      const startTime: number = +new Date()
      beforeHandler && beforeHandler(resource, init)
      return origin.call(window, resource, init).then(
        (response: Response) => {
          const endTime: number = +new Date()
          console.log(`请求接口响应时间为：${endTime - startTime}ms`)
          afterHandler && afterHandler(resource, init)
          return response
        },
        (err: Error) => {
          throw err
        }
      )
    }
  }
}