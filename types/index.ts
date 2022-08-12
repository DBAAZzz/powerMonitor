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