/**
 * 获取目标类型
 * @param {*} target 
 * @returns 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
 */
function getType(target)
{
    if (Array.isArray(target)) return 'array';
    else if (target && (target.buffer || target instanceof ArrayBuffer)) return 'arraybuffer';
    else if (target == null)  return 'null';

    return typeof target;
}

module.exports = {
    getType,
};

