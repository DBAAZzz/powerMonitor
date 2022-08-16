export declare function getNavTimes(): any;
/**
 * 获取页面性能
 */
export declare function getPerformance(): void;
/**
 * First Contentful Paint （最大内容绘制）
 * 浏览器开始渲染 dom 元素，包括任何 text、images、非空白 canvas 和 svg
 * @returns
 */
export declare function getFCP(): Promise<PerformanceEntry>;
/**
 * layout-shift
 * 最大内容绘画度量标准报告视口内可见的最大图像或文本块的渲染时间
 * @returns
 */
export declare function getLCP(): Promise<PerformanceEntry>;
/**
 * First Input Delay （首次输入延迟）
 * FID 测量的是当用户第一次在页面上交互的时候，到浏览器实际开始处理这个事件的时间
 * @returns
 */
export declare function getFID(): Promise<PerformanceEntry>;
/**
 * First Paint
 * 首次绘制，即浏览器绘制页面第一个像素的时间
 * @returns
 */
export declare function getFP(): Promise<PerformanceEntry> | undefined;
/**
 * Cumulative Layout Shift （累计布局偏移）
 * CLS 是 Google 衡量网页加载和交互时发生的布局偏移总量，即意外移动网页主要内容的布局偏移数量
 * Google 建议 CLS 分数为 0.1 或 耕地
 * @param cls
 * @returns
 */
export declare function getCLS(cls: any): Promise<PerformanceObserver> | undefined;
/**
 * 获取资源的加载情况
 */
export declare function getSourceInfo(): void;
export declare function initPerformance(): void;
