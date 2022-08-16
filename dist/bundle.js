(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PowerMonitor = factory());
})(this, (function () { 'use strict';

  var observe = function (type, callback) {
      var _a;
      try {
          if ((_a = PerformanceObserver.supportedEntryTypes) === null || _a === void 0 ? void 0 : _a.includes(type)) {
              var po = new PerformanceObserver(function (l) { return l.getEntries().map(callback); });
              po.observe({ type: type, buffered: true });
              return po;
          }
      }
      catch (e) {
          throw e;
      }
  };

  var isPerformanceObserverSupported = function () {
      return !!window.PerformanceObserver;
  };
  var isPerformanceSupported = function () {
      return !!window.performance && !!window.performance.getEntriesByType && !!window.performance.mark;
  };
  var isNavigatorSupported = function () {
      return !!window.navigator;
  };

  function getNavTimes() {
      var navTimes;
      // 判断浏览器是否支持该API
      if (typeof window.PerformanceNavigationTiming === 'function') {
          try {
              var nt2Timing = performance.getEntriesByType('navigation')[0];
              if (nt2Timing) {
                  navTimes = nt2Timing;
              }
          }
          catch (err) {
          }
      }
      else {
          navTimes = window.performance.timing;
      }
      return navTimes;
  }
  /**
   * 获取页面性能
   */
  function getPerformance() {
      var timer;
      var getTimes = function () {
          var _a = getNavTimes(), fetchStart = _a.fetchStart, domainLookupStart = _a.domainLookupStart, domainLookupEnd = _a.domainLookupEnd, connectStart = _a.connectStart, connectEnd = _a.connectEnd, domInteractive = _a.domInteractive, domComplete = _a.domComplete, responseEnd = _a.responseEnd, loadEventEnd = _a.loadEventEnd;
          // 如果 loadEventEnd 的值为 0 ，那么就定时
          if (loadEventEnd <= 0) {
              timer = setTimeout(function () {
                  getTimes();
              }, 500);
              return;
          }
          clearTimeout(timer);
          var times = {
              dnsTime: domainLookupEnd - domainLookupStart,
              tcpTime: connectEnd - connectStart,
              analysicsTime: domComplete - domInteractive,
              domParse: domInteractive - responseEnd,
              firstTime: loadEventEnd - fetchStart
          };
          var table = [
              { '属性': 'dns查询耗时', 'ms': times.dnsTime },
              { '属性': 'TCP 连接耗时', 'ms': times.tcpTime },
              { '属性': '解析DOM耗时', 'ms': times.analysicsTime },
              { '属性': 'DOM 解析时间', 'ms': times.domParse },
              { '属性': '首屏时间', 'ms': times.firstTime }
          ];
          console.table(table);
      };
      getTimes();
  }
  /**
   * First Contentful Paint （最大内容绘制）
   * 浏览器开始渲染 dom 元素，包括任何 text、images、非空白 canvas 和 svg
   * @returns
   */
  function getFCP() {
      return new Promise(function (resolve, reject) {
          if (!isPerformanceObserverSupported()) {
              if (!isPerformanceSupported()) {
                  reject(new Error('browser do not support performance'));
              }
              else {
                  var entry = performance.getEntriesByName('first-contentful-paint')[0];
                  if (entry) {
                      resolve(entry);
                  }
                  reject(new Error('browser has no fcp'));
              }
          }
          else {
              var entryHandler = function (entry) {
                  if (entry.name === 'first-contentful-paint') {
                      if (po_1) {
                          po_1.disconnect();
                      }
                      resolve(entry);
                  }
              };
              var po_1 = observe('paint', entryHandler);
          }
      });
  }
  /**
   * layout-shift
   * 最大内容绘画度量标准报告视口内可见的最大图像或文本块的渲染时间
   * @returns
   */
  function getLCP() {
      return new Promise(function (resolve, reject) {
          var entryHandler = function (entry) {
              if (entry.entryType === 'largest-contentful-paint') {
                  if (po) {
                      po.disconnect();
                  }
                  resolve(entry);
              }
          };
          var po = observe('largest-contentful-paint', entryHandler);
      });
  }
  /**
   * First Input Delay （首次输入延迟）
   * FID 测量的是当用户第一次在页面上交互的时候，到浏览器实际开始处理这个事件的时间
   * @returns
   */
  function getFID() {
      return new Promise(function (resolve, reject) {
          var entryHandler = function (entry) {
              if (po) {
                  po.disconnect();
              }
              resolve(entry);
          };
          var po = observe('first-input', entryHandler);
      });
  }
  /**
   * First Paint
   * 首次绘制，即浏览器绘制页面第一个像素的时间
   * @returns
   */
  function getFP() {
      return new Promise(function (resolve, reject) {
          if (!isPerformanceObserverSupported()) {
              if (!isPerformanceSupported()) {
                  reject(new Error('browser do not support performance'));
              }
              else {
                  var entry = performance.getEntriesByName('first-paint')[0];
                  if (entry) {
                      resolve(entry);
                  }
                  reject(new Error('browser has no fp'));
              }
          }
          else {
              var entryHandler = function (entry) {
                  if (entry.name === 'first-paint') {
                      if (po_2) {
                          po_2.disconnect();
                      }
                      resolve(entry);
                  }
              };
              var po_2 = observe('paint', entryHandler);
          }
      });
  }
  /**
   * Cumulative Layout Shift （累计布局偏移）
   * CLS 是 Google 衡量网页加载和交互时发生的布局偏移总量，即意外移动网页主要内容的布局偏移数量
   * Google 建议 CLS 分数为 0.1 或 耕地
   * @param cls
   * @returns
   */
  function getCLS(cls) {
      return new Promise(function (resove, reject) {
          if (!isPerformanceObserverSupported()) {
              reject('browser do not support performanceObserver');
          }
          else {
              var entryHandler = function (entry) {
                  if (po_3) {
                      po_3.disconnect();
                  }
                  if (!entry.hadRecentInput) {
                      cls.value += entry.value;
                  }
                  resove(cls);
              };
              var po_3 = observe('layout-shift', entryHandler);
          }
      });
  }
  /**
   * 获取资源的加载情况
   */
  function getSourceInfo() {
      var resourceTimes = performance.getEntriesByType('resource');
      // 设置资源加载的超时时间10s
      var TIMEOUT = 1000 * 10;
      var getLoadTime = function (startTime, endTime) {
          return Number((Number(endTime) - Number(startTime)).toFixed(2));
      };
      // 超时列表
      var timeoutList = [];
      for (var i = 0; i < resourceTimes.length; i++) {
          if (getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
              var _a = resourceTimes[i], name_1 = _a.name, nextHopProtocol = _a.nextHopProtocol, startTime = _a.startTime, responseEnd = _a.responseEnd, initiatorType = _a.initiatorType;
              timeoutList.push({
                  name: name_1,
                  nextHopProtocol: nextHopProtocol,
                  initiatorType: initiatorType,
                  loadTime: getLoadTime(startTime, responseEnd)
              });
          }
      }
      if (timeoutList.length == 0) {
          console.log('没有资源加载超时');
      }
      else {
          console.warn('有资源加载超时了');
          console.table(timeoutList);
      }
  }
  function initPerformance() {
      window.addEventListener('load', function () {
          var _a, _b;
          getPerformance();
          getSourceInfo();
          getFCP().then(function (res) {
              console.log('getFCP', res);
          });
          getLCP().then(function (res) {
              console.log('getLCP', res);
          });
          getFID().then(function (res) {
              console.log('getFID', res);
          });
          (_a = getFP()) === null || _a === void 0 ? void 0 : _a.then(function (res) {
              console.log('getFP', res);
          });
          (_b = getCLS({ value: 0 })) === null || _b === void 0 ? void 0 : _b.then(function (res) {
              console.log('getCLS', res);
          });
      });
  }

  function handlerError(error) {
      if (error instanceof ErrorEvent) {
          console.log('JS错误');
          var message = error.message, filename = error.filename, lineno = error.lineno, colno = error.colno;
          console.table({ message: message, filename: filename, lineno: lineno, colno: colno });
      }
      else if (error instanceof Event) {
          console.log('资源加载错误', error);
      }
  }
  // 监听语法错误和资源加载错误
  function addListenNormalError() {
      window.addEventListener('error', function (error) {
          handlerError(error);
      }, true);
  }
  // 监听 promise 引发的错误
  function addListenPromise() {
      window.addEventListener('unhandledrejection', function (error) {
          var reason = error.reason;
          console.log('promise error', reason.stack || reason.message);
      });
  }
  function initErrorListen() {
      addListenNormalError();
      addListenPromise();
  }

  navigator.userAgent.toLowerCase();
  var roundByFour = function (num, digits) {
      if (digits === void 0) { digits = 4; }
      try {
          return parseFloat(num.toFixed(digits));
      }
      catch (err) {
          return num;
      }
  };
  // 处理单个节点
  function normalizeNode(Node) {
      var nodeName = Node.nodeName.toLowerCase();
      var classNameString = Node.className ? ".".concat(Node.className) : '';
      var idString = Node.id ? "#".concat(Node.id) : '';
      var nodeString = "".concat(nodeName).concat(idString).concat(classNameString);
      return {
          tagName: nodeName,
          nodeString: nodeString
      };
  }
  // 处理节点链
  function normalizeNodeChain(path) {
      var invalidTag = ['body', 'html', 'document'];
      var chainList = [];
      for (var i = 0; i < path.length; i++) {
          if (invalidTag.includes(normalizeNode(path[i]).tagName) || i >= 5)
              break;
          chainList.push(normalizeNode(path[i]).nodeString);
      }
      return chainList.reverse().join(' -> ');
  }
  // 获得点击DOM的详情情况
  function handleClick(event) {
      var path;
      try {
          path = event.path;
      }
      catch (err) {
          path = [];
      }
      var targetMessage = normalizeNodeChain(path);
      if (!targetMessage)
          return;
      console.log({
          type: 'dom.click',
          dom: targetMessage
      });
      return {
          type: 'dom.click',
          dom: targetMessage
      };
  }

  // 获取网络情况
  function getNetWork() {
      if (!isNavigatorSupported()) {
          console.warn('不支持 navigator，无法获取网络情况！');
          return;
      }
      var connection = window.navigator.connection;
      console.log('网络情况为：', connection);
  }
  // 获取设备信息
  function getUserAgent() {
      if (!isNavigatorSupported()) {
          console.warn('不支持 navigator，无法获取设备信息！');
          return;
      }
      var userAgent = window.navigator.userAgent;
      console.log('设备信息为：', userAgent);
  }
  /**
   * 使用 requestAnimationFrame 来计算页面的 fps
   * @param count
   * @returns
   */
  function calculateFps(count) {
      return new Promise(function (resolve) {
          var frame = 0;
          var lastFrameTime = +new Date();
          var fpsQueue = [];
          var timerId;
          var calculate = function () {
              var now = +new Date();
              frame = frame + 1;
              if (now > 1000 + lastFrameTime) {
                  var fps = Math.round(frame / ((now - lastFrameTime) / 1000));
                  fpsQueue.push(fps);
                  frame = 0;
                  lastFrameTime = +new Date();
                  if (fpsQueue.length > count + 5) {
                      cancelAnimationFrame(timerId);
                      resolve(roundByFour(fpsQueue.slice(5).reduce(function (sum, fps) {
                          sum = sum + fps;
                          return sum;
                      }, 0) / (fpsQueue.length - 5), 2));
                  }
                  else {
                      timerId = requestAnimationFrame(calculate);
                  }
              }
              else {
                  timerId = requestAnimationFrame(calculate);
              }
          };
          calculate();
      });
  }
  function initClientInfo() {
      getNetWork();
      getUserAgent();
      calculateFps(5).then(function (res) {
          console.log('页面的帧数为：', res);
      });
  }

  function addListenClickEvent() {
      window.addEventListener('click', function (event) {
          handleClick(event);
      });
  }

  var PowerMonitor = /** @class */ (function () {
      function PowerMonitor(options) {
          if (options === void 0) { options = {
              listenClick: false
          }; }
          this.options = options;
          initClientInfo();
          initPerformance();
          initErrorListen();
          options.listenClick && addListenClickEvent();
      }
      PowerMonitor.prototype.init = function () {
      };
      return PowerMonitor;
  }());

  return PowerMonitor;

}));
