declare global {
  interface Window {
    __proxy_xhr__: boolean
  }
  interface Window {
    __monitor_fetch__: boolean
  }
}

export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void
}

export interface Options {
  dns?: string,
  listenClick?: boolean,
}

export interface TimeoutList extends Partial<PerformanceResourceTiming> {
  loadTime?: number
}

export interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}