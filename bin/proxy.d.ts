type CallBack = (name: string, mode: string, target: object, property: string, value: any) => void;
declare function proxy(proxyObject: object, name: string, callBackFunc: CallBack): object;
export { proxy };
