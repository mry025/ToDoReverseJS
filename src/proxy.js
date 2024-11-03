/**
 * 简单代理
 * @param {object} proxyObject 
 * @param {string} name 
 * @param {Function | *} callBackFunc 
 */
function proxy(proxyObject, name, callBackFunc)
{
    // 句柄
    let handler = {
        getPrototypeOf(target) 
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
        setPrototypeOf(target, prototype) 
        {
            /* 捕获 
            Object.setPrototypeOf()
            */
            return _proxyHandleTemplate(name, 'setPrototypeOf', target, undefined,
                [target, prototype], callBackFunc);
        },
        isExtensible(target) 
        {
            /* 捕获 
            Object.isExtensible()
            */
            return _proxyHandleTemplate(name, 'isExtensible', target, undefined,
                [target], callBackFunc);
        },
        preventExtensions(target) 
        {
            /* 捕获 
            Object.preventExtensions()
            */
            return _proxyHandleTemplate(name, 'preventExtensions', target, undefined,
                [target], callBackFunc);
        },
        getOwnPropertyDescriptor(target, property) 
        {
            /* 捕获 
            Object.getOwnPropertyDescriptor()
            */
            return _proxyHandleTemplate(name, 'getOwnPropertyDescriptor', target, property,
                [target, property], callBackFunc);
        },
        defineProperty(target, property, descriptor) 
        {
            /* 捕获 
            Object.defineProperty()
            */
            return _proxyHandleTemplate(name, 'defineProperty', target, property,
                [target, property, descriptor], callBackFunc);
        },
        has(target, property)
        {
            /* 捕获 
            属性查询：foo in proxy
            继承属性查询：foo in Object.create(proxy)
            with 检查: with(proxy) { (foo); }
            */
            return _proxyHandleTemplate(name, 'has', target, property,
                [target, property], callBackFunc);
        },
        get(target, property, receiver) 
        {
            /* 捕获 
            访问属性：proxy[foo] 和 proxy.bar
            访问原型链上的属性：Object.create(proxy)[foo]
            */
            return _proxyHandleTemplate(name, 'get', target, property,
                [target, property, receiver], callBackFunc);
        },
        set(target, property, value, receiver) 
        {
            /* 捕获 
            指定属性值：proxy[foo] = bar 和 proxy.foo = bar
            指定继承者的属性值：Object.create(proxy)[foo] = bar
            */
            return _proxyHandleTemplate(name, 'set', target, property,
                [target, property, value, receiver], callBackFunc);
        },
        deleteProperty(target, property)
        {
            /* 捕获 
            删除属性：delete proxy[foo] 和 delete proxy.foo
            */
            return _proxyHandleTemplate(name, 'deleteProperty', target, property,
                [target, property], callBackFunc);
        },
        ownKeys(target) 
        {
            /* 捕获 
            Object.getOwnPropertyNames()
            Object.getOwnPropertySymbols()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'ownKeys', target, undefined,
                [target], callBackFunc);
        },
        apply(target, thisArg, argumentsList) 
        {
            /* 捕获 
            proxy(...args)
            Function.prototype.apply() 和 Function.prototype.call()
            Object.keys()
            */
            return _proxyHandleTemplate(name, 'apply', target, undefined,
                [target, thisArg, argumentsList], callBackFunc);
        },
        construct(target, argumentsList, newTarget) 
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
function _proxyHandleTemplate(name, mode, target, property, args, callBackFunc)
{
    let result;
    let value;

    switch (mode) {
        case "getPrototypeOf":
            result = Reflect.getPrototypeOf(...args);
            value = result;
            break;
        case "setPrototypeOf":
            result = Reflect.setPrototypeOf(...args);
            value = args[1];
            break;
        case "isExtensible":
            result = Reflect.isExtensible(...args);
            value = result;
            break;
        case "preventExtensions":
            result = Reflect.preventExtensions(...args);
            value = result;
            break;
        case "getOwnPropertyDescriptor":
            result = Reflect.getOwnPropertyDescriptor(...args);
            value = result;
            break;
        case "defineProperty":
            result = Reflect.defineProperty(...args);
            value = args[2];
            break;
        case "has":
            result = Reflect.has(...args);
            value = result;
            break;
        case "get":
            result = Reflect.get(...args);
            value = result;
            break;
        case "set":
            result = Reflect.set(...args);
            value = args[2];
            break;
        case "deleteProperty":
            result = Reflect.deleteProperty(...args);
            value = result;
            break;
        case "ownKeys":
            result = Reflect.ownKeys(...args);
            value = result;
            break;
        case "apply":
            result = Reflect.apply(...args);
            value = result;
            break;
        case "construct":
            result = Reflect.construct(...args);
            value = result;
            break;
    }

    // 回调函数，扩展代理功能
    if (callBackFunc instanceof Function)
    {
        try 
        {
            callBackFunc(name, mode, target, property, value);
        } catch (error) {
            throw "传入的回调函数报错\n" + error;
        }
    }

    return result;
}

// ------------------------- 测试 -------------------------

let a = [111, 222, 333, 444]
let n = a.length
a = proxy(a, "a", (...args) => { console.log(...args); })

for (let i = 0; i < n; ++i) console.log(a[i])

// for (let i of a)
// {}

a = {
    "aaa": 1,
    "bbb": 2,
    "asdasd": ["asdasd", 222],
}
a = proxy(a, "a", (...args) => { console.log(...args); })

// Object.values(a)

Object.defineProperty(a, 'property1', {
    value: 42,
    writable: false,
});

Object.getPrototypeOf(a)

console.log("aaa" in a)

console.log(a)