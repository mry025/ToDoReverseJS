/**
 * 获取目标类型
 * @param {*} target 
 * @returns 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
 */
function getType(target)
{
    if (Array.isArray(target)) return 'array';
    else if (target && target.buffer) return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)  return 'null';

    return typeof target;
}

/**
 * 判断对象循环引用
 * @param {object} object 
 * @param {WeakSet} seen 
 * @returns {boolean}
 */
function isCycle(object, seen = new WeakSet()) {
    if (object && typeof object === 'object') 
    {
        if (seen.has(object)) return true;
        seen.add(object);
        for (let key of Object.keys(object)) 
        {
            if (isCycle(object[key], seen)) return true;
        }
    }

    return false;
}

export { getType, isCycle };