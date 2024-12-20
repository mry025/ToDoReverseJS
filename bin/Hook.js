"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
class Hook {
    constructor() {
        this.hookArray = [];
    }
    // 添加要 hook 的函数
    add(target, func) {
        if (!(target instanceof Function && func instanceof Function))
            return;
        this.hookArray.push([target, func]);
    }
    // 控制是否 hook
    eval() {
        for (let item of this.hookArray) {
            item[0] = item[1];
        }
    }
}
exports.Hook = Hook;
