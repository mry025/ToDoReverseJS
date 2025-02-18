```js
import { Log } from "./Log"
import { TextStorage } from "./TextStorage";
import { stringify } from "./stringify";
import { proxy } from "./proxy";

class StackTrace
{
    public open: boolean;           // 开关
    public details: boolean;        // 详细代理日志
    public line: number;            // 日志行数
    public lengthLimit: number      // 单行长度限制

    public log: Log;                // 调试打印
    public textStorage: TextStorage // 日志的存储

    constructor(open=false, details=false, lengthLimit=20)
    {
        this.open = open;
        this.details = details;
        this.line = 0;
        this.lengthLimit = lengthLimit;

        this.log = new Log();
        this.textStorage = new TextStorage();
    }

    getType(target: any): string
    {
        if (Array.isArray(target)) return 'array';
        else if (target && target.buffer) return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
        else if (target == null)  return 'null';
    
        return typeof target;
    }

    stringify(variable: any): string
    {
        return stringify(variable, this.lengthLimit);
    }

    proxy(proxyObject: object, name: string, debug: undefined | Function = undefined)
    {
        return proxy(proxyObject, name, (name, mode, target, property, value) => {
            if (!this.open) return;

            if (mode != "set" && mode != "get") return;
            
            let content;
            let text;

            if (this.details) content = this.stringify(target);
            else content = this.stringify(value);
            text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
            this.textStorage.add(text);
            this.line += 1;

            if (this.line % 100000 == 0) 
            {
                this.log.debug(this.line + "");
                this.textStorage.blobStored();
            }

            // 断点
            if (debug instanceof Function)
            {
                debug(this.line, name, mode, property.toString(), content);
            }
        })
    }

    download(fileName = '日志.txt')
    {
        this.textStorage.download(fileName)
    }

    clear()
    {
        this.textStorage.clear()
    }
}

export { StackTrace };
```