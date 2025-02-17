"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameNote = void 0;
exports.getType = getType;
exports.debug = debug;
exports.randomName = randomName;
// 获取数据类型
function getType(target) {
    if (Array.isArray(target))
        return 'array';
    else if (target && target.buffer)
        return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)
        return 'null';
    return typeof target;
}
// 标签打印
function debug(label = "", message = "") {
    if (label != "" && message == "") {
        console.log(label);
    }
    else {
        console.log(`[${label}] ${message}`);
    }
}
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
// 随机生成名字
function randomName(prefix = "random") {
    const randomHex = generateRandomString(8);
    return `${prefix}_${randomHex}`;
}
class NameNote {
    constructor(prefix = "var") {
        this.prefix = prefix;
        this.count = 0;
    }
    new() {
        this.count++;
        return this.prefix + "_" + this.count;
    }
}
exports.NameNote = NameNote;
