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
          loadEventEnd = _getNavTimes.loadEventEnd; // ?????? loadEventEnd ????????? 0 ??????????????????


      if (loadEventEnd <= 0) {
        timer = setTimeout(function () {
          getTimes();
        }, 500);
        return;
      }

      clearTimeout(timer);
      var times = {
        dnsTime: domainLookupEnd - domainLookupStart,
        // dns????????????
        tcpTime: connectEnd - connectStart,
        // TCP ????????????
        analysicsTime: domComplete - domInteractive,
        // ??????DOM??????
        blankTime: domInteractive - fetchStart,
        // ????????????
        firstTime: loadEventEnd - fetchStart // ????????????

      };
      var table = [{
        '??????': 'dns????????????',
        'ms': times.dnsTime
      }, {
        '??????': 'TCP ????????????',
        'ms': times.tcpTime
      }, {
        '??????': '??????DOM??????',
        'ms': times.analysicsTime
      }, {
        '??????': '????????????',
        'ms': times.blankTime
      }, {
        '??????': '????????????',
        'ms': times.firstTime
      }];
      console.table(table);
    };

    getTimes();
  }
  function getSourceInfo() {
    var resourceTimes = performance.getEntriesByType('resource'); // ?????????????????????????????????10s

    var TIMEOUT = 1000 * 10;

    var getLoadTime = function getLoadTime(startTime, endTime) {
      return (endTime - startTime).toFixed(2);
    }; // ????????????


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
      console.log('????????????????????????');
    } else {
      console.warn('????????????????????????');
      console.table(timeoutList);
    }
  }

  // ??????????????????
  function normalizeNode(Node) {
    var nodeName = Node.nodeName.toLowerCase();
    var classNameString = Node.className ? ".".concat(Node.className) : '';
    var idString = Node.id ? "#".concat(Node.id) : '';
    var nodeString = "".concat(nodeName).concat(idString).concat(classNameString);
    return {
      tagName: nodeName,
      nodeString: nodeString
    };
  } // ???????????????

  function normalizeNodeChain(path) {
    var invalidTag = ['body', 'html', 'document'];
    var chainList = [];

    for (var i = 0; i < path.length; i++) {
      if (invalidTag.includes(normalizeNode(path[i]).tagName) || i >= 5) break;
      chainList.push(normalizeNode(path[i]).nodeString);
    }

    return chainList.reverse().join(' > ');
  } // ????????????DOM???????????????

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
      console.log('JS??????');
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
      console.log('??????????????????');
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
  } // ??????new Image??????get??????


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
  } // ???????????????????????????????????????

  function addListenNormalError() {
    window.addEventListener('error', function (error) {
      handlerError(error);
    }, true);
  } // ?????? promise ???????????????

  function addListenPromise() {
    window.addEventListener('unhandledrejection', function (error) {
      var reason = error.reason;
      console.log('promise error', reason.stack || reason.message);
    });
  } // ?????? Vue ??????

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
    _Vue = Vue; // ??????Vue?????????Error

    addListenVueError(Vue);
    addListenVuePage();
    window.addEventListener('load', function () {
      getPerformance();
    });
  } // ?????? vue ????????????

  function addListenVuePage() {
    history.pushState = coverFN('pushState'); // ?????? history ????????? pushState ???????????????dispatchEvent????????????????????????  

    history.replaceState = coverFN('replaceState'); // ?????? history ????????? replaceState ??????

    window.addEventListener('pushState', function () {
      console.log('?????????observeDOM');
      observeDOM(); // getPerformance()
    });
    window.addEventListener('replaceState', function () {// getPerformance()
    });
  } // ?????????????????????


  function coverFN(type) {
    var original = history[type];
    return function () {
      var rv = original.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  } // ?????? MutationObserver ?????? DOM ?????????


  function observeDOM() {
    // ?????? body ????????? DOM ??????
    var targetNode = document.getElementsByTagName('body')[0];
    var observer = new MutationObserver(function (mutationsList, observer) {
      console.log('mutationsList', mutationsList); // ????????????????????????

      observer.disconnect();
    });
    observer.observe(targetNode, {
      attributes: true,
      // ?????? true ?????????????????????????????????????????????
      childList: true,
      // ?????? ture ???????????????????????????????????????????????????
      subtree: true // ?????? true ????????????????????????????????????????????????????????????????????????

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
          getPerformance(); // ????????????????????????

          getSourceInfo();
        });
        this.addListenEvent();
        this.addListenError();
      } // ????????????????????????

    }, {
      key: "addListenEvent",
      value: function addListenEvent() {
        // ???????????????????????????
        addListenClick();
      } // ????????????????????????

    }, {
      key: "addListenError",
      value: function addListenError() {
        // ??????JS?????????????????????
        addListenNormalError(); // ??????Promise???????????????

        addListenPromise();
      }
    }]);

    return PowerMonitor;
  }();
  PowerMonitor.install = install;

  return PowerMonitor;

}));
