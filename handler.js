// 处理单个节点
export function normalizeNode(Node) {
    let nodeName = Node.nodeName.toLowerCase();
    let classNameString = Node.className ? `.${Node.className}` : '';
    let idString = Node.id ? `#${Node.id}` : '';
    let nodeString = `${nodeName}${idString}${classNameString}`
    return {
        tagName: nodeName,
        nodeString: nodeString
    }
}

// 处理节点链
export function normalizeNodeChain(path) {
    let invalidTag = ['body', 'html', 'document']
    let chainList = [];
    for (let i = 0; i < path.length; i++) {
        if (invalidTag.includes(normalizeNode(path[i]).tagName) || i >= 5) break;
        chainList.push(normalizeNode(path[i]).nodeString)
    }
    return chainList.reverse().join(' > ')
}

// 获得点击DOM的详情情况
export function handleClick(event) {
    let path;
    try {
        path = event.path;
    } catch (err) {
        path = [];
    }
    let targetMessage = normalizeNodeChain(path)
    if (!targetMessage) return;
    console.log({
        type: 'dom.click',
        dom: targetMessage
    })
    return {
        type: 'dom.click',
        dom: targetMessage
    }
}

export function handlerError(error) {
    if (error instanceof ErrorEvent) {
        console.log('JS错误')
        let { message, filename, lineno, colno } = error;
        console.table({ message, filename, lineno, colno })
    } else if (error instanceof Event) {
        console.log('资源加载错误')
    }
}