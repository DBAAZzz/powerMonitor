export declare const UA: string;
export declare const roundByFour: (num: number, digits?: number) => number;
export declare function normalizeNode(Node: Element): {
    tagName: string;
    nodeString: string;
};
export declare function normalizeNodeChain(path: any): string;
export declare function handleClick(event: any): {
    type: string;
    dom: string;
} | undefined;
/**
 * 将对象转化成字符串
 * { a: 1, b: 2 } => a=1&b=2
 * @param params
 * @returns
 */
export declare function handleParames(params: Object): string;
