import { handleClick } from './utils/index'
import { proxyXhr, proxyFetch } from './lib/proxyHandler'

export function addListenClickEvent() {
  window.addEventListener('click', (event) => {
    handleClick(event)
  })
}

export function initProxy() {
  proxyXhr()
  proxyFetch()
}
