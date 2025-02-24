;(function(obj: any, name: string)
{
    let toString = Function.toString;
    delete (Function.prototype as any)['toString'];

    const symbol = Symbol((Math.round(Math.random() * 10 ** (Math.random() * 10 + 1))).toString(36));
    console.log(symbol);
    
    function newToString(this: Function)
    {
        if (typeof this == 'function' && (this as any)[symbol]) return (this as any)[symbol];
        else return toString.call(this);
    }

    function setProperty(func: Function, key: string | symbol, value: any)
    {
        Object.defineProperty(func, key, 
        {
           "enumerable": false,
           "configurable": true,
           "writable": true,
           "value": value 
        });
    }

    setProperty(Function.prototype, "toString", newToString);
    obj[name] = (func: Function, funcName: string) => {
        setProperty(func, symbol, `function ${funcName}() { [native code] }`);
    }

    obj[name](Function.prototype.toString, "toString");
})(globalThis, "toStringNative");

