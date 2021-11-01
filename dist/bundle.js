(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
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
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    console.log(error instanceof ErrorEvent); // console.log(error instanceof ReferenceError )
    // console.log(error instanceof SyntaxError)
    // console.log(error instanceof RangeError )
    // console.log(error instanceof TypeError )
  }

  function getPerformance() {
    var navTimes = performance.getEntriesByType('navigation');
    console.log('navTimes', navTimes);

    var _navTimes = _slicedToArray(navTimes, 1),
        domComplete = _navTimes[0].domComplete; //  DOM数解析完成，且资源也准备就绪的时间


    console.log('DOM数解析完成，且资源也准备就绪的时间', "\u4E00\u5171\u7528\u4E86".concat(domComplete.toFixed(2), "ms"));
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
      console.log('资源加载超时的有：', timeoutList);
    }
  }

  navigator.userAgent.toLowerCase();


  function getUserAgent() {
    return navigator.userAgent;
  } // 获取用户系统版本

  function addEvent(element, type, callback) {
    if (element.addEventListener) {
      element.addEventListener(type, callback);
    } else {
      element.attachEvent('on' + type, callback);
    }
  } // 监听点击事件


  function addListenClick() {
    addEvent(window, 'click', function (event) {
      handleClick(event);
    });
  } // 语法错误和资源加载错误

  function addListenNormalError() {
    addEvent(window, 'error', function (error) {
      console.log(getUserAgent());
      var message = error.message,
          filename = error.filename,
          lineno = error.lineno,
          colno = error.colno;
      console.log({
        type: 'error'
      });
      handlerError(error); // uploadReport({
      //     type: 'error',
      //     message, filename, lineno, colno
      // })

      console.table({
        message: message,
        filename: filename,
        lineno: lineno,
        colno: colno
      });
    });
  } // 监听promise引发的错误

  function addListenPromise() {
    addEvent(window, 'unhandledrejection', function (error) {
      console.log('promise error', error);
      var reason = error.reason;
      console.log('promise error', reason.stack || reason.message);
    });
  }

  var PowerMonitor = /*#__PURE__*/function () {
    function PowerMonitor(options) {
      _classCallCheck(this, PowerMonitor);

      this.init(options);
    }

    _createClass(PowerMonitor, [{
      key: "init",
      value: function init() {
        var _this = this;

        window.onload = function () {
          getPerformance();
          getSourceInfo();

          _this.addListenEvent();

          _this.addListenError();
        };
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
        // 监听Promise抛出的异常
        addListenPromise(); // 监听比较普通的异常

        addListenNormalError();
      }
    }]);

    return PowerMonitor;
  }();
  var powerMonitor = new PowerMonitor();
  powerMonitor.init();

  return PowerMonitor;

}));
