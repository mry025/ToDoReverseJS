"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = stringify;
const utiles_1 = require("./utiles");
// 字符串打印优化
function stringifyString(str, lengthLimit) {
    if (str.length <= lengthLimit)
        return str;
    const halfLimit = Math.floor(lengthLimit / 2);
    const start = str.substring(0, halfLimit);
    const end = str.substring(str.length - halfLimit);
    return `${start}···${end}|length ${str.length}|`;
}
// 判断一个数组是否全是数字
function isNumberArray(array) {
    for (let i of array) {
        if (typeof i != "number")
            return false;
    }
    return true;
}
// 全数字数组打印优化
function shortedNumberArray(array, lengthLimit) {
    array = Array.from(array); // 针对字节数组
    if (array.length <= lengthLimit)
        return array.join(',');
    else {
        const halfLimit = Math.floor(lengthLimit / 2);
        const start = array.slice(0, halfLimit);
        const end = array.slice(-halfLimit);
        const middle = '···';
        return [...start, middle, ...end].join(',');
    }
}
// 将数组字符串化，并做一些打印优化
function stringifyArray(array, lengthLimit, seen) {
    if (isNumberArray(array)) {
        const res = shortedNumberArray(array, lengthLimit);
        if (array.length <= lengthLimit)
            return `[${res}]`;
        else
            return `[${res}]|length ${array.length}, tpye array|`;
    }
    else {
        let res = "[";
        for (let i of array) {
            let temp = stringify(i, lengthLimit, seen);
            if (temp != "undefined")
                res += temp;
            res += ",";
        }
        res = res.slice(0, -1) + ']';
        return res;
    }
}
// 将字节数组字符串化，并做一些打印优化
function stringifyArrayBuffer(arraybuffer, lengthLimit) {
    const res = shortedNumberArray(arraybuffer, lengthLimit);
    if (arraybuffer.length <= lengthLimit)
        return `[${res}]`;
    else
        return `[${res}]|length ${arraybuffer.length}, tpye arraybuffer|`;
}
// 将对象字符串化，并做一些打印优化
function stringifyObject(object, lengthLimit, seen) {
    if (seen.has(object))
        return "|seen|";
    seen.add(object);
    let res = "{";
    let keys = Object.keys(object);
    for (let key of keys) {
        res += key;
        res += ":";
        res += stringify(object[key], lengthLimit, seen);
        res += ",";
    }
    res = res.slice(0, -1) + '}';
    return res;
}
// 检查是否是浏览器对象 window、document、navigator...
function isBrowserObject(variable) {
    let ret;
    if (variable && variable[Symbol.toStringTag]) {
        if (typeof variable != "symbol" && (0, utiles_1.getType)(variable) != 'arraybuffer') {
            ret = variable[Symbol.toStringTag].toLowerCase();
        }
    }
    return ret;
}
// 字符串化
function stringify(variable, lengthLimit = 50, seen = new WeakSet()) {
    let check = isBrowserObject(variable);
    if (check)
        return check;
    let type = (0, utiles_1.getType)(variable);
    switch (type) {
        case "string":
            return stringifyString(variable, lengthLimit);
        case "array":
            return stringifyArray(variable, lengthLimit, seen);
        case "arraybuffer":
            return stringifyArrayBuffer(variable, lengthLimit);
        case "object":
            return stringifyObject(variable, lengthLimit, seen);
        case "symbol":
            return variable.toString();
        case "function":
            return variable.name ? `function ${variable.name}` : `function anonymous`;
        default: // 'undefined', 'null', 'boolean', 'number'
            return "" + variable;
    }
}
