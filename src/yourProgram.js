// 一个案例
const { Log } = require("./Log.js");
const { TextStorage } = require("./TextStorage.js");
const { getType } = require("./utiles.js");
const { stringify } = require("./stringify.js");
const { proxy } = require("./proxy.js");

class StackTrace
{
    open;           // 开关
    details;        // 详细代理日志
    line;           // 日志行数

    log;            // 调试打印
    textStorage     // 日志的存储

    getType;        
    stringify;

    constructor(open=false, details=false, lengthLimit=50, toBlobLimit=1024*256)
    {
        this.open = open;
        this.details = details;
        this.lengthLimit = lengthLimit;

        this.log = new Log();
        this.textStorage = new TextStorage(toBlobLimit);

        this.getType = getType;
        this.stringify = function(variable)
        {
            return stringify(variable, lengthLimit);
        }
    }

    proxy(proxyObject, name, debug=undefined)
    {
        return proxy(proxyObject, name, (name, mode, target, property, value) => {
            if (!this.open) return;
            
            let content;
            let text;

            if (this.details) content = this.stringify(target);
            else content = this.stringify(value);
            text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
            this.textStorage.add(text);
            this.line += 1;

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

window.nothing = { StackTrace };
