export function getPerformance() {
    const navTimes = performance.getEntriesByType('navigation')
    console.log('navTimes', navTimes)
    const [{ domComplete }] = navTimes;
    //  DOM数解析完成，且资源也准备就绪的时间
    console.log('DOM数解析完成，且资源也准备就绪的时间', `一共用了${domComplete.toFixed(2)}ms`)
}

export function getSourceInfo() {
    const resourceTimes = performance.getEntriesByType('resource');
    // 设置资源加载的超时时间10s
    const TIMEOUT = 1000 * 10;
    const getLoadTime = (startTime, endTime) => {
        return (endTime - startTime).toFixed(2);
    }
    // 超时列表
    let timeoutList = [];
    for (let i = 0; i < resourceTimes.length; i++) {
        if (getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
            let { name, nextHopProtocol, startTime, responseEnd, initiatorType } = resourceTimes[i];
            timeoutList.push({
                name, nextHopProtocol, initiatorType,
                loadTime: getLoadTime(startTime, responseEnd)
            });
        }
    }
    if (timeoutList.length == 0) {
        console.log('没有资源加载超时')
    } else {
        console.log('资源加载超时的有：', timeoutList)
    }
}
