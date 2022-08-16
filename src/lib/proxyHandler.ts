function proxyXhr(beforeHandler: (...args: Array<any>) => void, afterHandler: (...args: Array<any>) => void): void {
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
        console.log('请求接口响应时间为：', endTime - startTime)
        afterHandler && afterHandler(args[1])
      })
    }
  }
}