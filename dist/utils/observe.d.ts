import { PerformanceEntryHandler } from '../types/index';
declare const observe: (type: string, callback: PerformanceEntryHandler) => PerformanceObserver | undefined;
export default observe;
