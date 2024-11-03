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
        get(target, property, receiver) 
        {
            return _proxyHandleTemplate('get', target, property, '', receiver, name, callBackFunc);
        },
        set(target, property, value, receiver) 
        {
            return _proxyHandleTemplate('set', target, property, value, receiver, name, callBackFunc);
        },
    };

    return new Proxy(proxyObject, handler);
}
/**
 * 代理中 get 与 set 的模板
 * @param {string} mode 
 * @param {object} target 
 * @param {string | number} property 
 * @param {object} value 
 * @param {object} receiver 
 * @param {string} name 
 * @param {Function | *} callBackFunc 
 * @returns 
 */
function _proxyHandleTemplate(mode, target, property, value, receiver, name, callBackFunc)
{
    let result;

    if ('get' == mode)
    {
        result = Reflect.get(target, property, receiver);
        value = result;
    }
    else if ('set' == mode) result = Reflect.set(target, property, value, receiver);
    else throw "传入的 mode 有误，简单代理只支持 get 或 set";

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

/**
 * 复杂代理
 * @param {object} proxyObject 
 * @param {string} name 
 * @param {Function | *} callBackFunc 
 */
function complexProxy(proxyObject, name, callBackFunc)
{
    let handler = {
        getPrototypeOf(target) 
        {
            /* 捕获 
            Object.getPrototypeOf()
            Object.prototype.__proto__
            Object.prototype.isPrototypeOf()
            instanceof
            */
           let result = Reflect.getPrototypeOf(target);
            
            // 回调函数，扩展代理功能
            if (callBackFunc instanceof Function)
            {
                try 
                {
                    callBackFunc(name, "getPrototypeOf", target, undefined, value);
                } catch (error) {
                    throw "传入的回调函数报错\n" + error;
                }
            }

            return result;
        }
    }
}

// ------------------------- 测试 -------------------------

let a = [111, 222, 333, 444]
let n = a.length
a = proxy(a, "a", (...args) => { console.log(...args); })

// for (let i = 0; i < n; ++i) console.log(a[i])

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