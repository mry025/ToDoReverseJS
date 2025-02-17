"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackTrace = void 0;
const Log_1 = require("./Log");
const TextStorage_1 = require("./TextStorage");
const stringify_1 = require("./stringify");
const proxy_1 = require("./proxy");
class StackTrace {
    constructor(open = false, details = false, lengthLimit = 50, toBlobLimit = 1024 * 256) {
        this.open = open;
        this.details = details;
        this.line = 0;
        this.lengthLimit = lengthLimit;
        this.log = new Log_1.Log();
        this.textStorage = new TextStorage_1.TextStorage(toBlobLimit);
    }
    getType(target) {
        if (Array.isArray(target))
            return 'array';
        else if (target && target.buffer)
            return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
        else if (target == null)
            return 'null';
        return typeof target;
    }
    stringify(variable) {
        return (0, stringify_1.stringify)(variable, this.lengthLimit);
    }
    proxy(proxyObject, name, debug = undefined) {
        return (0, proxy_1.proxy)(proxyObject, name, (name, mode, target, property, value) => {
            if (!this.open)
                return;
            let content;
            let text;
            if (this.details)
                content = this.stringify(target);
            else
                content = this.stringify(value);
            text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
            this.textStorage.add(text);
            this.line += 1;
            // 断点
            if (debug instanceof Function) {
                debug(this.line, name, mode, property.toString(), content);
            }
        });
    }
    download(fileName = '日志.txt') {
        this.textStorage.download(fileName);
    }
    clear() {
        this.textStorage.clear();
    }
}
exports.StackTrace = StackTrace;
