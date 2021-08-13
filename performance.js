export function getPerformance() {
    const navTimes = performance.getEntriesByType('navigation')
    console.log('navTimes', navTimes)
    const [{domComplete}] = navTimes;
    console.log('domComplete', `一共用了${domComplete.toFixed(2)}ms`)
}

export function getSourceInfo() {
    const resourceTimes = performance.getEntriesByType('resource');
    const TIMEOUT = 1000 * 10; // 资源加载的超时时间10s
    const getLoadTime = (startTime, endTime) => {
        return (endTime - startTime).toFixed(2);
    }
    let timeoutList = []; // 超时列表
    for (let i = 0; i < resourceTimes.length; i++) {
        if(getLoadTime(resourceTimes[i].startTime, resourceTimes[i].responseEnd) > TIMEOUT) {
            let { name, nextHopProtocol, startTime, responseEnd, initiatorType } = resourceTimes[i];
            timeoutList.push({
                name, nextHopProtocol, initiatorType,
                loadTime: getLoadTime(startTime, responseEnd)
            });
        }
    }
    console.log('timeoutList', timeoutList)

}
