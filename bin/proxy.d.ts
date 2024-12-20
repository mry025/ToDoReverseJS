type CallBack = (name: string, mode: string, target: object, property: string, value: any) => void;
declare function proxy(proxyObject: object, name: string, callBackFunc: CallBack): object;
/**
 * 代理中的模板
 * @param {string} name
 * @param {string} mode
 * @param {object} target
 * @param {string} property
 * @param {Array} args
 * @param {Function | *} callBackFunc
 * @returns
 */
declare function _proxyHandleTemplate(name: string, mode: string, target: object, property: string | undefined, args: Array<any>, callBackFunc: CallBack): any;
