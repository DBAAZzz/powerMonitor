import config from '../config/index.js'

const UA = navigator.userAgent.toLowerCase();
const test_UA = regexp => regexp.test(UA);
const getVersion = regexp =>
    (UA.match(regexp) + "").replace(/[^0-9|_.]/gi, "").replace(/_/gi, ".");

// 获取用户操作信息
export function getUserAgent() {
    return navigator.userAgent;
}

// 获取用户系统版本
export function getUserSystem() {
    let system = "unknown", system_v = "unknown";
    if (test_UA(/windows|win32|win64|wow32|wow64/gi)) {
        system = "windows"; // window系统
    } else if (test_UA(/macintosh|macintel/gi)) {
        system = "osx"; // osx系统
    } else if (test_UA(/x11/gi)) {
        system = "linux"; // linux系统
    } else if (test_UA(/android|adr/gi)) {
        system = "android"; // android系统
    } else if (test_UA(/ios|iphone|ipad|ipod|iwatch/gi)) {
        system = "ios"; // ios系统
    }
    if (system === "windows") {
        if (test_UA(/windows nt 5.0|windows 2000/gi)) {
            system_v = "2000";
        } else if (test_UA(/windows nt 5.1|windows xp/gi)) {
            system_v = "xp";
        } else if (test_UA(/windows nt 5.2|windows 2003/gi)) {
            system_v = "2003";
        } else if (test_UA(/windows nt 6.0|windows vista/gi)) {
            system_v = "vista";
        } else if (test_UA(/windows nt 6.1|windows 7/gi)) {
            system_v = "7";
        } else if (test_UA(/windows nt 6.2|windows 8/gi)) {
            system_v = "8";
        } else if (test_UA(/windows nt 6.3|windows 8.1/gi)) {
            system_v = "8.1";
        } else if (test_UA(/windows nt 10.0|windows 10/gi)) {
            system_v = "10";
        }
    } else if (system === "osx") {
        system_v = getVersion(/os x [\d._]+/gi);
    } else if (system === "android") {
        system_v = getVersion(/android [\d._]+/gi);
    } else if (system === "ios") {
        system_v = getVersion(/os [\d._]+/gi);
    }
    return `${system}${system_v}`;
}

// 获取用户浏览器
export function getUserBrowser() {
    let shell = "unknow";
    if (test_UA(/micromessenger/gi)) {
        shell = "wechat浏览器";
    } else if (test_UA(/qqbrowser/gi)) {
        shell = "QQ浏览器"
    } else if (test_UA(/ubrowser/gi)) {
        shell = "UC浏览器";
    } else if (test_UA(/2345explorer/gi)) {
        shell = "2345浏览器";
    } else if (test_UA(/metasr/gi)) {
        shell = "搜狗浏览器";
    } else if (test_UA(/lbbrowser/gi)) {
        shell = "猎豹浏览器";
    } else if (test_UA(/maxthon/gi)) {
        shell = "遨游浏览器";
    } else if (test_UA(/bidubrowser/gi)) {
        shell = "百度浏览器";
    }
    return shell;
}

function handleParames(params) {
    let result = '';
    Object.keys(params).forEach((key, i) => {
        result = result + `${key}=${params[key]}` + (i < Object.keys(params).length - 1 ? '&' : '')
    })
    return result;
}

function getApiUrl(params) {
    return `${config.host}:${config.port}${config.api.error}?${handleParames(params)}`;
}

// 使用new Image实现get请求
export function uploadReport(parames) {
    console.log('params', handleParames(parames))
    let url = getApiUrl(parames);
    let img = new Image();
    img.src = `${url}`
}
