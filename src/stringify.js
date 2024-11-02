const { getType } = require("./utiles")

/**
 * 字符串打印优化
 * @param {string} str 
 * @param {number} lengthLimit 
 * @returns {string}
 */
function stringifyString(str, lengthLimit) {
    if (str.length <= lengthLimit) return str;

    const halfLimit = Math.floor(lengthLimit / 2);
    const start = str.substring(0, halfLimit);
    const end = str.substring(str.length - halfLimit);
    return `${start}···${end}|length ${str.length}|`;
}

/**
 * 判断一个数组是否全是数字
 * @param {Array} array 
 * @returns {boolean}
 */
function isNumberArray(array)
{
    for (let i of array)
    {
        if (typeof i != "number") return false;
    }

    return true;
}

/**
 * 全数字数组打印优化
 * @param {object} array 
 * @param {number} lengthLimit 
 * @returns {string}
 */
function shortedNumberArray(array, lengthLimit)
{
    if (array.length <= lengthLimit) return array.join(',');
    else
    {
        const halfLimit = Math.floor(lengthLimit / 2);
        const start = array.slice(0, halfLimit);
        const end = array.slice(-halfLimit);
        const middle = '···';
        return start.concat(middle, end).join(',');
    }
}

/**
 * 将数组字符串化，并做一些打印优化
 * @param {Array} array 
 * @param {number} lengthLimit 
 */
function stringifyArray(array, lengthLimit)
{
    if (isNumberArray(array))
    {
        const res = shortedNumberArray(array, lengthLimit);
        if (array.length <= lengthLimit) return `[${res}]`;
        else return `[${res}]|length ${array.length}, tpye array|`;
    }
    else
    {
        let res = "[";
        for (let i of array)
        {
            let temp = stringify(i, lengthLimit);
            if (temp != "undefined") res += temp;
            res += ","
        }
        res = res.slice(0, -1) + ']';
        return res;
    }
}

/**
 * 将字节数组字符串化，并做一些打印优化
 * @param {object} arraybuffer 
 * @param {number} lengthLimit 
 * @returns 
 */
function stringifyArrayBuffer(arraybuffer, lengthLimit)
{
    const res = shortedNumberArray(arraybuffer, lengthLimit);
    if (arraybuffer.length <= lengthLimit) return `[${res}]`;
    else return `[${res}]|length ${arraybuffer.length}, tpye arraybuffer|`;
}   

/**
 * 将对象字符串化，并做一些打印优化
 * @param {object} object 
 */
function stringifyObject(object)
{
    let res = "{";

    let keys = Object.keys(object);
    for (let key of keys)
    {
        res += key;
        res += ":";
        res += stringify(object[key]);
        res += ",";
    }
    res = res.slice(0, -1) + '}';

    return res;
}

/**
 * 字符串化
 * @param {object} variable 
 * @param {number} [lengthLimit] 单个成员长度限制
 */
function stringify(variable, lengthLimit=50)
{
    // window、document、navigator...
    if (variable && variable[Symbol.toStringTag]) return value[Symbol.toStringTag].toLowerCase();

    let type = getType(variable);
    switch (type) {
        case "string":
            return stringifyString(variable, lengthLimit);
        case "array":
            return stringifyArray(variable, lengthLimit);
        case "arraybuffer":
            return stringifyArrayBuffer(variable, lengthLimit);
        case "object":
            return stringifyObject(variable);
        case "symbol":
            return variable.toString();
        case "function":
            return variable.name ? `function ${variable.name}` : `function anonymous`;
        default:    // 'undefined', 'null', 'boolean', 'number'
            return "" + variable;
    }
}

module.exports = {
    stringify,
};

// ------------------------- 测试 -------------------------
let a = ["a", 123564, 5465]
let b = [11,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
let c = {
    "aaa": a,
    "fafaf": 645456,
    "sgsg": b,
    "13354": [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,54654,,,,,,,,,,],
    45456:"sadddddddddddddddddddddddddddddddddddddddddddddddddda"
}
let array = [1, "asdasdadsadddddddddddddddddddddddddddddddddddddddddddddddddda", a, b, c]
let object = {
    array,
    "asd":45,
}
console.log(stringify(object))

