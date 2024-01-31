export const UA = navigator.userAgent.toLowerCase()

export function objectKeyToString(obj: object): string {
  const str = Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return str
}

export function roundByFour(num: number, digits = 4) {
  try {
    return parseFloat(num.toFixed(digits))
  } catch (err) {
    return num
  }
}

// 处理单个节点
export function normalizeNode(Node: Element) {
  let nodeName = Node.nodeName.toLowerCase()
  let classNameString = Node.className ? `.${Node.className}` : ''
  let idString = Node.id ? `#${Node.id}` : ''
  let nodeString = `${nodeName}${idString}${classNameString}`
  return {
    tagName: nodeName,
    nodeString: nodeString
  }
}

// 处理节点链
export function normalizeNodeChain(path: any) {
  let invalidTag = ['body', 'html', 'document']
  let chainList: any[] = []
  for (let i = 0; i < path.length; i++) {
    if (invalidTag.includes(normalizeNode(path[i]).tagName) || i >= 5) break
    chainList.push(normalizeNode(path[i]).nodeString)
  }
  return chainList.reverse().join(' -> ')
}

// 获得点击DOM的详情情况
export function handleClick(event: any) {
  let path
  try {
    path = event.path || []
  } catch (err) {
    path = []
  }
  let targetMessage = normalizeNodeChain(path)
  if (!targetMessage) return
  console.log({
    type: 'dom.click',
    dom: targetMessage
  })
  return {
    type: 'dom.click',
    dom: targetMessage
  }
}

/**
 * 将对象转化成字符串
 * { a: 1, b: 2 } => a=1&b=2
 * @param params
 * @returns
 */
export function handleParames(params: Object) {
  let result = ''
  Object.keys(params).forEach((key: any, i: number) => {
    result = result + `${key}=${params[key]}` + (i < Object.keys(params).length - 1 ? '&' : '')
  })
  return result
}
