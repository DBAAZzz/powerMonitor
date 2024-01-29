# 用户端监控sdk的思考

## 日志上报

日志缓存在哪里？storage？indexDB？

需要考虑日志安全吗？使用AES加密？RSA？

日志上报时机该什么时候触发？如何实现日志的上传和日志续传？web Works？

日志通过什么样的形式上传？伪造Image标签？使用sendBeacon？