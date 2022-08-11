(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PowerMonitor = factory());
})(this, (function () { 'use strict';

  function getNavTimes() {
      var navTimes;
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
  function getPerformance() {
      var timer;
      var getTimes = function () {
          var _a = getNavTimes(), fetchStart = _a.fetchStart, domainLookupStart = _a.domainLookupStart, domainLookupEnd = _a.domainLookupEnd, connectStart = _a.connectStart, connectEnd = _a.connectEnd, domInteractive = _a.domInteractive, domComplete = _a.domComplete, loadEventEnd = _a.loadEventEnd;
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
              blankTime: domInteractive - fetchStart,
              firstTime: loadEventEnd - fetchStart
          };
          var table = [
              { '属性': 'dns查询耗时', 'ms': times.dnsTime },
              { '属性': 'TCP 连接耗时', 'ms': times.tcpTime },
              { '属性': '解析DOM耗时', 'ms': times.analysicsTime },
              { '属性': '白屏时间', 'ms': times.blankTime },
              { '属性': '首屏时间', 'ms': times.firstTime }
          ];
          console.table(table);
      };
      getTimes();
  }

  var PowerMonitor = /** @class */ (function () {
      function PowerMonitor() {
          this.init();
      }
      PowerMonitor.prototype.init = function () {
          window.addEventListener('load', function () {
              console.log('触发了');
              getPerformance();
          });
      };
      return PowerMonitor;
  }());

  return PowerMonitor;

}));
