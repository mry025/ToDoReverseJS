import { Log } from "./Log";
import { TextStorage } from "./TextStorage";
declare class StackTrace {
    open: boolean;
    details: boolean;
    line: number;
    lengthLimit: number;
    log: Log;
    textStorage: TextStorage;
    proxy_map: Map<object, string>;
    constructor(open?: boolean, details?: boolean, lengthLimit?: number);
    getType(target: any): string;
    stringify(variable: any): string;
    proxy(proxyObject: object, name: string): object;
    download(fileName?: string): void;
    clear(): void;
}
export { StackTrace };
