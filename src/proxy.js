/**
 * 一个简单的对象代理
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
    let content;

    if ('get' == mode)
    {
        result = Reflect.get(target, property, receiver);
        value = result;
    }
    else if ('set' == mode) result = Reflect.set(target, property, value, receiver);
    else throw "传入的参数有误！";

    // 回调函数，扩展代理功能
    if (callBackFunc instanceof Function)
    {
        try 
        {
            callBackFunc(mode, target, property, value, receiver, name, content);
        } catch (error) {
            throw "传入的回调函数报错\n" + error;
        }
        
    }

    return result;
}
