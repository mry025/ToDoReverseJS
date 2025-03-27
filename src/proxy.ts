type CallBack = (name: string, mode: string, target: object, property: string, value: any) => void;


/* 代理对象嵌套处理
let s = new nothing.StackTrace(true)
let a = [1, 2, [44, 4, 88, 665]]
a = s.proxy(a, "a")
let a_ = [22, a]
a_ = s.proxy(a_, "a_")
a_.filter(item => item != null && item != undefined)
s.download()
*/
let in_recursion = false;

// 创建一个代理对象，用于拦截并处理对象的属性访问。
function proxy(proxyObject: object, name: string, callBackFunc: CallBack)
{
  

    // 句柄
    let handler = {
        getPrototypeOf(target: object) 
        {
            /* 捕获 
            Object.getPrototypeOf()
            Object.prototype.__proto__
            Object.prototype.isPrototypeOf()
            instanceof
            */
            return _proxyHandleTemplate(name, 'getPrototypeOf', target, undefined,
                [target], callBackFunc);
        },
        setPrototypeOf(target: object, prototype: object | null) 
        {
            /* 捕获 
            Object.setPrototypeOf()
            */
            return _proxyHandleTemplate(name, 'setPrototypeOf', target, undefined,
                [target, prototype], callBackFunc);
        },
        isExtensible(target: object) 
        {
            /* 捕获 
            Object.isExtensible()
            */
            return _proxyHandleTemplate(name, 'isExtensible', target, undefined,
                [target], callBackFunc);
        },
        preventExtensions(target: object) 
        {
            /* 捕获 
            Object.preventExtensions()
            */
            return _proxyHandleTemplate(name, 'preventExtensions', target, undefined,
                [target], callBackFunc);
        },
        getOwnPropertyDescriptor(target: object, property: string) 
        {
            /* 捕获 
            Object.getOwnPropertyDescriptor()
            */
            return _proxyHandleTemplate(name, 'getOwnPropertyDescriptor', target, property,
                [target, property], callBackFunc);
        },
        defineProperty(target: object, property: string, descriptor: any) 
        {
            /* 捕获 
            Object.defineProperty()
            */
            return _proxyHandleTemplate(name, 'defineProperty', target, property,
                [target, property, descriptor], callBackFunc);
        },
        has(target: object, property: string)
        {
            /* 捕获 
            属性查询：foo in proxy
            继承属性查询：foo in Object.create(proxy)
            with 检查: with(proxy) { (foo); }
            */
            return _proxyHandleTemplate(name, 'has', target, property,
                [target, property], callBackFunc);
        },
        get(target: object, property: string, receiver: object) 
        {
            /* 捕获 
            访问属性：proxy[foo] 和 proxy.bar
            访问原型链上的属性：Object.create(proxy)[foo]
            */
            return _proxyHandleTemplate(name, 'get', target, property,
                [target, property, receiver], callBackFunc);
        },
        set(target: object, property: string, value: any, receiver: object) 
        {
            /* 捕获 
            指定属性值：proxy[foo] = bar 和 proxy.foo = bar
            指定继承者的属性值：Object.create(proxy)[foo] = bar
            */
            return _proxyHandleTemplate(name, 'set', target, property,
                [target, property, value, receiver], callBackFunc);
        },
        deleteProperty(target: object, property: string)
        {
            /* 捕获 
            删除属性：delete proxy[foo] 和 delete proxy.foo
            */
            return _proxyHandleTemplate(name, 'deleteProperty', target, property,
                [target, property], callBackFunc);
        },
        ownKeys(target: object) 
        {
            /* 捕获 
            Object.getOwnPropertyNames()
            Object.getOwnPropertySymbols()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'ownKeys', target, undefined,
                [target], callBackFunc);
        },
        apply(target: object, thisArg: object, argumentsList: Array<any>) 
        {
            /* 捕获 
            proxy(...args)
            Function.prototype.apply() 和 Function.prototype.call()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'apply', target, undefined,
                [target, thisArg, argumentsList], callBackFunc);
        },
        construct(target: object, argumentsList: Array<any>, newTarget: object) 
        {
            /* 捕获 
            new proxy(...args)
            */
            return _proxyHandleTemplate(name, 'construct', target, undefined,
                [target, argumentsList, newTarget], callBackFunc);
        },
    };

    return new Proxy(proxyObject, handler);
}

// 代理中的模板
function _proxyHandleTemplate(name: string, mode: string, target: object, property: string | undefined, args: Array<any>, callBackFunc: CallBack)
{
    let result;
    let value;

    switch (mode) {
        case "getPrototypeOf":
            result = Reflect.getPrototypeOf(args[0]);
            value = result;
            break;
        case "setPrototypeOf":
            result = Reflect.setPrototypeOf(args[0], args[1]);
            value = args[1];
            break;
        case "isExtensible":
            result = Reflect.isExtensible(args[0]);
            value = result;
            break;
        case "preventExtensions":
            result = Reflect.preventExtensions(args[0]);
            value = result;
            break;
        case "getOwnPropertyDescriptor":
            result = Reflect.getOwnPropertyDescriptor(args[0], args[2]);
            value = result;
            break;
        case "defineProperty":
            result = Reflect.defineProperty(args[0], args[1], args[2]);
            value = args[2];
            break;
        case "has":
            result = Reflect.has(args[0], args[1]);
            value = result;
            break;
        case "get":
            result = Reflect.get(args[0], args[1]);
            value = result;
            break;
        case "set":
            result = Reflect.set(args[0], args[1], args[2]);
            value = args[2];
            break;
        case "deleteProperty":
            result = Reflect.deleteProperty(args[0], args[1]);
            value = result;
            break;
        case "ownKeys":
            result = Reflect.ownKeys(args[0]);
            value = result;
            break;
        case "apply":
            result = Reflect.apply(args[0], args[1], args[2]);
            value = result;
            break;
        case "construct":
            result = Reflect.construct(args[0], args[1]);
            value = result;
            break;
    }

    // 判断是否递归调用
    if (!in_recursion)
    {
        in_recursion = true;

        // 回调函数，扩展代理功能
        if (callBackFunc instanceof Function)
        {
            try 
            {
                callBackFunc(name, mode, target, property!, value);
                in_recursion = false;
            } catch (error) {
                throw error;
            }
        }
    }

    return result;
}

export {
    proxy
}

