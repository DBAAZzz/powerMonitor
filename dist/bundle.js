(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PowerMonitor = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function getNavTimes() {
    var navTimes;

    if (typeof window.PerformanceNavigationTiming === 'function') {
      try {
        var nt2Timing = performance.getEntriesByType('navigation')[0];

        if (nt2Timing) {
          navTimes = nt2Timing;
        }
      } catch (err) {}
    } else {
      navTimes = window.performance.timing;
    }

    return navTimes;
  }
  function getPerformance() {
    var timer = null;

    var getTimes = function getTimes() {
      var _getNavTimes = getNavTimes(),
          fetchStart = _getNavTimes.fetchStart,
          domainLookupStart = _getNavTimes.domainLookupStart,
          domainLookupEnd = _getNavTimes.domainLookupEnd,
          connectStart = _getNavTimes.connectStart,
          connectEnd = _getNavTimes.connectEnd,
          domInteractive = _getNavTimes.domInteractive,
          domComplete = _getNavTimes.domComplete,
          loadEventEnd = _getNavTimes.loadEventEnd; // 如果 loadEventEnd 的值为 0 ，那么就定时


      if (loadEventEnd <= 0) {
        timer = setTimeout(function () {
          getTimes();
        }, 500);
        return;
      }

      clearTimeout(timer);
      var times = {
        dnsTime: domainLookupEnd - domainLookupStart,
        // dns查询耗时
        tcpTime: connectEnd - connectStart,
        // TCP 连接耗时
        analysicsTime: domComplete - domInteractive,
        // 解析DOM耗时
        blankTime: domInteractive - fetchStart,
        // 白屏时间
        firstTime: loadEventEnd - fetchStart // 首屏时间

      };
      var table = [{
        '属性': 'dns查询耗时',
        'ms': times.dnsTime
      }, {
        '属性': 'TCP 连接耗时',
        'ms': times.tcpTime
      }, {
        '属性': '解析DOM耗时',
        'ms': times.analysicsTime
      }, {
        '属性': '白屏时间',
        'ms': times.blankTime
      }, {
        '属性': '首屏时间',
        'ms': times.firstTime
      }];
      console.table(table);
    };

    getTimes();
  }
  function getSourceInfo() {
    var resourceTimes = performance.getEntriesByType('resource'); // 设置资源加载的超时时间10s

    var TIMEOUT = 1000 * 10;

    var getLoadTime = function getLoadTime(startTime, endTime) {
      return (endTime - startTime).toFixed(2);
    }; // 超时列表


    var timeoutList = [];

    for (var i = 0; i < resourceTimes.length; i++) {
      if (getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
        var _resourceTimes$i = resourceTimes[i],
            name = _resourceTimes$i.name,
            nextHopProtocol = _resourceTimes$i.nextHopProtocol,
            startTime = _resourceTimes$i.startTime,
            responseEnd = _resourceTimes$i.responseEnd,
            initiatorType = _resourceTimes$i.initiatorType;
        timeoutList.push({
          name: name,
          nextHopProtocol: nextHopProtocol,
          initiatorType: initiatorType,
          loadTime: getLoadTime(startTime, responseEnd)
        });
      }
    }

    if (timeoutList.length == 0) {
      console.log('没有资源加载超时');
    } else {
      console.warn('有资源加载超时了');
      console.table(timeoutList);
    }
  }

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
  } // 处理节点链

  function normalizeNodeChain(path) {
    var invalidTag = ['body', 'html', 'document'];
    var chainList = [];

    for (var i = 0; i < path.length; i++) {
      if (invalidTag.includes(normalizeNode(path[i]).tagName) || i >= 5) break;
      chainList.push(normalizeNode(path[i]).nodeString);
    }

    return chainList.reverse().join(' > ');
  } // 获得点击DOM的详情情况

  function handleClick(event) {
    var path;

    try {
      path = event.path;
    } catch (err) {
      path = [];
    }

    var targetMessage = normalizeNodeChain(path);
    if (!targetMessage) return;
    console.log({
      type: 'dom.click',
      dom: targetMessage
    });
    return {
      type: 'dom.click',
      dom: targetMessage
    };
  }
  function handlerError(error) {
    if (error instanceof ErrorEvent) {
      console.log('JS错误');
      var message = error.message,
          filename = error.filename,
          lineno = error.lineno,
          colno = error.colno;
      console.table({
        message: message,
        filename: filename,
        lineno: lineno,
        colno: colno
      });
    } else if (error instanceof Event) {
      console.log('资源加载错误');
    }
  }

  var config = {
    host: 'http://127.0.0.1',
    port: '3000',
    api: {
      error: '/report/getErrorReport'
    }
  };

  navigator.userAgent.toLowerCase();

  function handleParames(params) {
    var result = '';
    Object.keys(params).forEach(function (key, i) {
      result = result + "".concat(key, "=").concat(params[key]) + (i < Object.keys(params).length - 1 ? '&' : '');
    });
    return result;
  }

  function getApiUrl(params) {
    return "".concat(config.host, ":").concat(config.port).concat(config.api.error, "?").concat(handleParames(params));
  } // 使用new Image实现get请求


  function uploadReport(parames) {
    console.log('params', handleParames(parames));
    var url = getApiUrl(parames);
    var img = new Image();
    img.src = "".concat(url);
  }

  function addListenClick() {
    window.addEventListener('click', function (event) {
      handleClick(event);
    });
  } // 监听语法错误和资源加载错误

  function addListenNormalError() {
    window.addEventListener('error', function (error) {
      handlerError(error);
    }, true);
  } // 监听 promise 引发的错误

  function addListenPromise() {
    window.addEventListener('unhandledrejection', function (error) {
      var reason = error.reason;
      console.log('promise error', reason.stack || reason.message);
    });
  } // 监听 Vue 错误

  function addListenVueError(Vue) {
    Vue.config.errorHandler = function (err, vm, info) {
      console.log('err', err);
      console.log('err', err.stack.toString());
      console.log('xxxxx', err.stack.toString().split('\n'));
      var errorArr = err.stack.toString().split('\n');
      console.log(errorArr[1].match(/\((.+?)\)/g));
      uploadReport({
        err: err.stack.toString()
      });
      throw err;
    };
  }

  var _Vue;
  function install(Vue) {
    if (install.installed && _Vue === Vue) return;
    install.installed = true;
    _Vue = Vue; // 监听Vue抛出的Error

    addListenVueError(Vue);
    addListenVuePage();
    window.addEventListener('load', function () {
      getPerformance();
    });
  } // 监听 vue 路由变化

  function addListenVuePage() {
    history.pushState = coverFN('pushState'); // 覆盖 history 原生的 pushState 方法，通过dispatchEvent手动触发一个事件  

    history.replaceState = coverFN('replaceState'); // 覆盖 history 原生的 replaceState 方法

    window.addEventListener('pushState', function () {
      console.log('触发了observeDOM');
      observeDOM(); // getPerformance()
    });
    window.addEventListener('replaceState', function () {// getPerformance()
    });
  } // 覆盖原生的方法


  function coverFN(type) {
    var original = history[type];
    return function () {
      var rv = original.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  } // 通过 MutationObserver 监听 DOM 的变化


  function observeDOM() {
    // 监听 body 标签的 DOM 变化
    var targetNode = document.getElementsByTagName('body')[0];
    var observer = new MutationObserver(function (mutationsList, observer) {
      console.log('mutationsList', mutationsList); // 之后，可停止观察

      observer.disconnect();
    });
    observer.observe(targetNode, {
      attributes: true,
      // 设为 true 以观察受监视元素的属性值变更。
      childList: true,
      // 设为 ture 以目标节点添加删除或删除新的子节点
      subtree: true // 设为 true 以将监视范围扩展至目标节点整个节点树中的所有节点

    });
  }

  var PowerMonitor = /*#__PURE__*/function () {
    function PowerMonitor() {
      _classCallCheck(this, PowerMonitor);

      this.options = {};
      this.init();
    }

    _createClass(PowerMonitor, [{
      key: "init",
      value: function init(options) {
        this.options = options;
        window.addEventListener('load', function () {
          getPerformance(); // 监听资源加载情况

          getSourceInfo();
        });
        this.addListenEvent();
        this.addListenError();
      } // 监听用户交互事件

    }, {
      key: "addListenEvent",
      value: function addListenEvent() {
        // 监听用户的点击事件
        addListenClick();
      } // 监听程序异常报错

    }, {
      key: "addListenError",
      value: function addListenError() {
        // 监听JS和资源加载异常
        addListenNormalError(); // 监听Promise抛出的异常

        addListenPromise();
      }
    }]);

    return PowerMonitor;
  }();
  PowerMonitor.install = install;

  return PowerMonitor;

}));
