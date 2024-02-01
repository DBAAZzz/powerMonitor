export {}

declare global {
  interface Window {
    __proxy_xhr__: boolean
    __monitor_fetch__: boolean
  }
}
