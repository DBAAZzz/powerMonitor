# 用户端监控sdk的思考

## 日志上报

日志缓存在哪里？storage？indexDB？

需要考虑日志安全吗？使用AES加密？RSA？

日志上报时机该什么时候触发？如何实现日志的上传和日志续传？web Works？

日志通过什么样的形式上传？伪造Image标签？使用sendBeacon？

记录用户的10次行为，记录页面内存，记录页面加载的方式

## 服务端日志存储

存储在自建的es上？还是阿里云的日志存储产品？

## 功能梳理

点击热力图？页面加载瀑布图

## 上传日志字段定义

- client 监控平台，如 web、android、ios等
- level 日志等级，info、warning、error 等
- network 网络情况
- userAgent 设备信息
- message 日志信息
- createTime 日志产生时的时间
- extra 冗余字段

