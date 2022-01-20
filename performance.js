export function getNavTimes() {
    let navTimes

    if (typeof window.PerformanceNavigationTiming === 'function') {
        try {
            var nt2Timing = performance.getEntriesByType('navigation')[0]
            if (nt2Timing) {
                navTimes = nt2Timing
            }
        } catch (err) {
        }
    } else {
        navTimes = window.performance.timing
    }

    return navTimes
}

export function getPerformance() {

    let timer = null

    let getTimes = () => {
        const {
            fetchStart,
            domainLookupStart,
            domainLookupEnd,
            connectStart,
            connectEnd,
            domInteractive,
            domComplete,
            loadEventEnd
        } = getNavTimes();
        // 如果 loadEventEnd 的值为 0 ，那么就定时
        if (loadEventEnd <= 0) {
            timer = setTimeout(() => {
                getTimes()
            }, 500);
            return
        }

        
        clearTimeout(timer)

        let times = {
            dnsTime: domainLookupEnd - domainLookupStart, // dns查询耗时
            tcpTime: connectEnd - connectStart, // TCP 连接耗时
            analysicsTime: domComplete - domInteractive, // 解析DOM耗时
            blankTime: domInteractive - fetchStart, // 白屏时间
            firstTime: loadEventEnd - fetchStart, // 首屏时间
        }

        let table = [
            { '属性': 'dns查询耗时', 'ms': times.dnsTime },
            { '属性': 'TCP 连接耗时', 'ms': times.tcpTime },
            { '属性': '解析DOM耗时', 'ms': times.analysicsTime },
            { '属性': '白屏时间', 'ms': times.blankTime },
            { '属性': '首屏时间', 'ms': times.firstTime }
        ]
        console.table(table)
    }

    getTimes()
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
        console.warn('有资源加载超时了')
        console.table(timeoutList)
    }
}