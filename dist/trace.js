/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nothing"] = factory();
	else
		root["nothing"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./bin/Log.js":
/*!********************!*\
  !*** ./bin/Log.js ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Log = void 0;\nclass Log {\n    constructor(open = true, isRecord = true) {\n        this.open = open;\n        this.isRecord = isRecord;\n        this.console_log = console.log;\n        this.console_error = console.error;\n        this.history = \"\";\n    }\n    print(content, mode) {\n        if (this.open == false)\n            return;\n        if (this.isRecord)\n            this.history += content;\n        // 更清晰\n        if (content.includes('\\n')) {\n            let i = 0;\n            for (; i < content.length; ++i) {\n                if (content[i] == ']')\n                    break;\n            }\n            content = content.substring(0, i + 1) + '\\n' + content.substring(i + 2);\n        }\n        switch (mode) {\n            case 0 /* PRINT_MODE.ERROR */:\n                this.console_error(content);\n                break;\n            default:\n                this.console_log(content);\n                break;\n        }\n    }\n    debug(message) {\n        let content = `[debug] ${message}`;\n        this.print(content, 1 /* PRINT_MODE.DEBUG */);\n    }\n    error(message) {\n        let content = `[error] ${message}`;\n        this.print(content, 0 /* PRINT_MODE.ERROR */);\n    }\n    label(label = \"label\", message = \"\") {\n        let content = `[${label}] ${message}`;\n        this.print(content, 2 /* PRINT_MODE.LABEL */);\n    }\n    getHistory() {\n        return this.history;\n    }\n}\nexports.Log = Log;\n\n\n//# sourceURL=webpack://nothing/./bin/Log.js?");

/***/ }),

/***/ "./bin/TextStorage.js":
/*!****************************!*\
  !*** ./bin/TextStorage.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.TextStorage = void 0;\nclass TextStorage {\n    constructor() {\n        this.stringCache = \"\";\n        this.blobCache = new Blob([''], { type: 'text/plain' });\n    }\n    /**\n     * 添加内容\n     * @param {string} string\n     * @returns {boolean}\n     */\n    add(string = \"\") {\n        if (typeof string != \"string\")\n            throw \"传入的参数有误！\";\n        this.stringCache += string;\n        return true;\n    }\n    /**\n     * 将 string 用 blob 存储\n     */\n    blobStored() {\n        let blob = new Blob([this.stringCache], { type: 'text/plain' });\n        this.stringCache = \"\";\n        this.blobCache = new Blob([this.blobCache, blob], { type: 'text/plain' });\n    }\n    /**\n     * 清理存储\n     */\n    clear() {\n        this.stringCache = \"\";\n        this.blobCache = new Blob([''], { type: 'text/plain' });\n    }\n    /**\n     * 下载存储的文本到本地\n     * @param {string} fileName\n     */\n    download(fileName = '日志.txt') {\n        if (this.stringCache != \"\")\n            this.blobStored();\n        // 在浏览器中运行\n        const link = document.createElement('a');\n        link.href = URL.createObjectURL(this.blobCache);\n        link.download = fileName;\n        link.click();\n        link.remove();\n        URL.revokeObjectURL(link.href);\n        this.clear(); // 下载完就清理\n    }\n}\nexports.TextStorage = TextStorage;\n\n\n//# sourceURL=webpack://nothing/./bin/TextStorage.js?");

/***/ }),

/***/ "./bin/proxy.js":
/*!**********************!*\
  !*** ./bin/proxy.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.proxy = proxy;\n/* 代理对象嵌套处理\nlet s = new nothing.StackTrace(true)\nlet a = [1, 2, [44, 4, 88, 665]]\na = s.proxy(a, \"a\")\nlet a_ = [22, a]\na_ = s.proxy(a_, \"a_\")\na_.filter(item => item != null && item != undefined)\ns.download()\n*/\nlet in_recursion = false;\n// 创建一个代理对象，用于拦截并处理对象的属性访问。\nfunction proxy(proxyObject, name, callBackFunc) {\n    // 句柄\n    let handler = {\n        getPrototypeOf(target) {\n            /* 捕获\n            Object.getPrototypeOf()\n            Object.prototype.__proto__\n            Object.prototype.isPrototypeOf()\n            instanceof\n            */\n            return _proxyHandleTemplate(name, 'getPrototypeOf', target, undefined, [target], callBackFunc);\n        },\n        setPrototypeOf(target, prototype) {\n            /* 捕获\n            Object.setPrototypeOf()\n            */\n            return _proxyHandleTemplate(name, 'setPrototypeOf', target, undefined, [target, prototype], callBackFunc);\n        },\n        isExtensible(target) {\n            /* 捕获\n            Object.isExtensible()\n            */\n            return _proxyHandleTemplate(name, 'isExtensible', target, undefined, [target], callBackFunc);\n        },\n        preventExtensions(target) {\n            /* 捕获\n            Object.preventExtensions()\n            */\n            return _proxyHandleTemplate(name, 'preventExtensions', target, undefined, [target], callBackFunc);\n        },\n        getOwnPropertyDescriptor(target, property) {\n            /* 捕获\n            Object.getOwnPropertyDescriptor()\n            */\n            return _proxyHandleTemplate(name, 'getOwnPropertyDescriptor', target, property, [target, property], callBackFunc);\n        },\n        defineProperty(target, property, descriptor) {\n            /* 捕获\n            Object.defineProperty()\n            */\n            return _proxyHandleTemplate(name, 'defineProperty', target, property, [target, property, descriptor], callBackFunc);\n        },\n        has(target, property) {\n            /* 捕获\n            属性查询：foo in proxy\n            继承属性查询：foo in Object.create(proxy)\n            with 检查: with(proxy) { (foo); }\n            */\n            return _proxyHandleTemplate(name, 'has', target, property, [target, property], callBackFunc);\n        },\n        get(target, property, receiver) {\n            /* 捕获\n            访问属性：proxy[foo] 和 proxy.bar\n            访问原型链上的属性：Object.create(proxy)[foo]\n            */\n            return _proxyHandleTemplate(name, 'get', target, property, [target, property, receiver], callBackFunc);\n        },\n        set(target, property, value, receiver) {\n            /* 捕获\n            指定属性值：proxy[foo] = bar 和 proxy.foo = bar\n            指定继承者的属性值：Object.create(proxy)[foo] = bar\n            */\n            return _proxyHandleTemplate(name, 'set', target, property, [target, property, value, receiver], callBackFunc);\n        },\n        deleteProperty(target, property) {\n            /* 捕获\n            删除属性：delete proxy[foo] 和 delete proxy.foo\n            */\n            return _proxyHandleTemplate(name, 'deleteProperty', target, property, [target, property], callBackFunc);\n        },\n        ownKeys(target) {\n            /* 捕获\n            Object.getOwnPropertyNames()\n            Object.getOwnPropertySymbols()\n            Object.keys()\n            */\n            return _proxyHandleTemplate(name, 'ownKeys', target, undefined, [target], callBackFunc);\n        },\n        apply(target, thisArg, argumentsList) {\n            /* 捕获\n            proxy(...args)\n            Function.prototype.apply() 和 Function.prototype.call()\n            Object.keys()\n            */\n            return _proxyHandleTemplate(name, 'apply', target, undefined, [target, thisArg, argumentsList], callBackFunc);\n        },\n        construct(target, argumentsList, newTarget) {\n            /* 捕获\n            new proxy(...args)\n            */\n            return _proxyHandleTemplate(name, 'construct', target, undefined, [target, argumentsList, newTarget], callBackFunc);\n        },\n    };\n    return new Proxy(proxyObject, handler);\n}\n// 代理中的模板\nfunction _proxyHandleTemplate(name, mode, target, property, args, callBackFunc) {\n    let result;\n    let value;\n    switch (mode) {\n        case \"getPrototypeOf\":\n            result = Reflect.getPrototypeOf(args[0]);\n            value = result;\n            break;\n        case \"setPrototypeOf\":\n            result = Reflect.setPrototypeOf(args[0], args[1]);\n            value = args[1];\n            break;\n        case \"isExtensible\":\n            result = Reflect.isExtensible(args[0]);\n            value = result;\n            break;\n        case \"preventExtensions\":\n            result = Reflect.preventExtensions(args[0]);\n            value = result;\n            break;\n        case \"getOwnPropertyDescriptor\":\n            result = Reflect.getOwnPropertyDescriptor(args[0], args[2]);\n            value = result;\n            break;\n        case \"defineProperty\":\n            result = Reflect.defineProperty(args[0], args[1], args[2]);\n            value = args[2];\n            break;\n        case \"has\":\n            result = Reflect.has(args[0], args[1]);\n            value = result;\n            break;\n        case \"get\":\n            result = Reflect.get(args[0], args[1]);\n            value = result;\n            break;\n        case \"set\":\n            result = Reflect.set(args[0], args[1], args[2]);\n            value = args[2];\n            break;\n        case \"deleteProperty\":\n            result = Reflect.deleteProperty(args[0], args[1]);\n            value = result;\n            break;\n        case \"ownKeys\":\n            result = Reflect.ownKeys(args[0]);\n            value = result;\n            break;\n        case \"apply\":\n            result = Reflect.apply(args[0], args[1], args[2]);\n            value = result;\n            break;\n        case \"construct\":\n            result = Reflect.construct(args[0], args[1]);\n            value = result;\n            break;\n    }\n    // 判断是否递归调用\n    if (!in_recursion) {\n        in_recursion = true;\n        // 回调函数，扩展代理功能\n        if (callBackFunc instanceof Function) {\n            try {\n                callBackFunc(name, mode, target, property, value);\n                in_recursion = false;\n            }\n            catch (error) {\n                throw error;\n            }\n        }\n    }\n    return result;\n}\n\n\n//# sourceURL=webpack://nothing/./bin/proxy.js?");

/***/ }),

/***/ "./bin/stringify.js":
/*!**************************!*\
  !*** ./bin/stringify.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**说明\n * 函数和变量均使用小驼峰命名法\n * 数组中的 null、undefined 被剔除了\n * 对象中的 undefined 项 被剔除了\n * 循环引用的重复部分会以 |seen| 替代\n * 字符串、数组省略部分会标注长度\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.stringify = stringify;\nconst utiles_1 = __webpack_require__(/*! ./utiles */ \"./bin/utiles.js\");\n// 处理字符串中特殊字符\nfunction escapeSpecialCharacters(str) {\n    return str\n        .replace(/\\n/g, \"\\\\n\") // 转义换行符\n        .replace(/\\r/g, \"\\\\r\") // 转义回车符\n        .replace(/\\t/g, \"\\\\t\") // 转义制表符\n        .replace(/\\v/g, \"\\\\v\") // 转义垂直制表符\n        .replace(/\\f/g, \"\\\\f\") // 转义换页符\n        .replace(/\\u0008/g, \"\\\\b\"); // 转义退格符（使用 Unicode 表示）\n}\n// 字符串打印优化\nfunction stringifyString(str, lengthLimit) {\n    str = escapeSpecialCharacters(str);\n    if (str.length <= lengthLimit)\n        return `\"${str}\"`;\n    const lengthSplit = Math.floor(lengthLimit * 0.75);\n    const start = str.substring(0, lengthSplit);\n    const end = str.substring(str.length - lengthLimit + lengthSplit);\n    return `\"${start}···${end}\"|length ${str.length}|`;\n}\n// 判断一个数组是否全是数字\nfunction isNumberArray(array) {\n    return array.every(item => typeof item == 'number');\n}\n// 全数字数组打印优化\nfunction shortedNumberArray(array, lengthLimit) {\n    array = Array.from(array); // 针对字节数组\n    if (array.length <= lengthLimit)\n        return array.join(',');\n    else {\n        const lengthSplit = Math.floor(lengthLimit * 0.75);\n        const start = array.slice(0, lengthSplit);\n        const end = array.slice(lengthSplit - lengthLimit);\n        const middle = '···';\n        return [...start, middle, ...end].join(',');\n    }\n}\nfunction cleanArray(array) {\n    return array.filter(item => item != null && item != undefined);\n}\n// 将数组字符串化，并做一些打印优化\nfunction stringifyArray(array, lengthLimit, isRemoveEmpty, seen) {\n    // 使用 filter 方法去除空值\n    if (isRemoveEmpty) {\n        array = cleanArray(array);\n    }\n    if (isNumberArray(array)) {\n        const res = shortedNumberArray(array, lengthLimit);\n        if (array.length <= lengthLimit)\n            return `[${res}]`;\n        else\n            return `[${res}]|length ${array.length}, type array|`;\n    }\n    else {\n        let res = \"[\";\n        for (let i of array) {\n            let temp = stringify(i, lengthLimit, isRemoveEmpty, seen);\n            res += temp;\n            res += \",\";\n        }\n        res = res.slice(0, -1) + ']';\n        return res;\n    }\n}\n// 将字节数组字符串化，并做一些打印优化\nfunction stringifyArrayBuffer(arraybuffer, lengthLimit) {\n    const res = shortedNumberArray(arraybuffer, lengthLimit);\n    if (arraybuffer.length <= lengthLimit)\n        return `[${res}]`;\n    else\n        return `[${res}]|length ${arraybuffer.length}, type arraybuffer|`;\n}\nfunction cleanObject(object) {\n    let keys = Object.keys(object);\n    let newObject = {};\n    for (const key of keys) {\n        if (object[key] == undefined || object[key] == null)\n            continue;\n        newObject[key] = object[key];\n    }\n    return newObject;\n}\n// 将对象字符串化，并做一些打印优化\nfunction stringifyObject(object, lengthLimit, isRemoveEmpty, seen) {\n    if (seen.has(object))\n        return \"|seen|\";\n    seen.add(object);\n    if (isRemoveEmpty) {\n        object = cleanObject(object);\n    }\n    let keys = Object.keys(object);\n    if (keys.length == 0)\n        return \"{}\";\n    let res = \"{\";\n    for (let key of keys) {\n        res += key;\n        res += \":\";\n        res += `${stringify(object[key], lengthLimit, isRemoveEmpty, seen)}`;\n        res += \",\";\n    }\n    res = res.slice(0, -1) + '}';\n    return res;\n}\n// 检查是否是浏览器对象 window、document、navigator...\nfunction isBrowserObject(variable) {\n    let ret;\n    if (variable && variable[Symbol.toStringTag]) {\n        if (typeof variable != \"symbol\" && (0, utiles_1.getType)(variable) != 'arraybuffer') {\n            // 处理set\n            ret = variable[Symbol.toStringTag].toLowerCase();\n        }\n    }\n    return ret;\n}\n// 字符串化\nfunction stringify(variable, lengthLimit = 50, isRemoveEmpty = true, seen = new WeakSet()) {\n    let check = isBrowserObject(variable);\n    if (check)\n        return check;\n    let type = (0, utiles_1.getType)(variable);\n    switch (type) {\n        case \"string\":\n            return stringifyString(variable, lengthLimit);\n        case \"array\":\n            return stringifyArray(variable, lengthLimit, isRemoveEmpty, seen);\n        case \"arraybuffer\":\n            return stringifyArrayBuffer(variable, lengthLimit);\n        case \"object\":\n            return stringifyObject(variable, lengthLimit, isRemoveEmpty, seen);\n        case \"symbol\":\n            return variable.toString();\n        case \"function\":\n            return variable.name ? `function ${variable.name}` : `function anonymous`;\n        default: // 'undefined', 'null', 'boolean', 'number'\n            return \"\" + variable;\n    }\n}\n\n\n//# sourceURL=webpack://nothing/./bin/stringify.js?");

/***/ }),

/***/ "./bin/tmp.js":
/*!********************!*\
  !*** ./bin/tmp.js ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.StackTrace = void 0;\nconst Log_1 = __webpack_require__(/*! ./Log */ \"./bin/Log.js\");\nconst TextStorage_1 = __webpack_require__(/*! ./TextStorage */ \"./bin/TextStorage.js\");\nconst stringify_1 = __webpack_require__(/*! ./stringify */ \"./bin/stringify.js\");\nconst proxy_1 = __webpack_require__(/*! ./proxy */ \"./bin/proxy.js\");\nclass StackTrace {\n    constructor(open = false, details = false, lengthLimit = 50) {\n        this.open = open;\n        this.details = details;\n        this.line = 0;\n        this.lengthLimit = lengthLimit;\n        this.log = new Log_1.Log();\n        this.textStorage = new TextStorage_1.TextStorage();\n        this.proxy_map = new Map();\n    }\n    getType(target) {\n        if (Array.isArray(target))\n            return 'array';\n        else if (target && target.buffer)\n            return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内\n        else if (target == null)\n            return 'null';\n        return typeof target;\n    }\n    stringify(...variables) {\n        let result = \"\";\n        for (let variable of variables) {\n            result += (0, stringify_1.stringify)(variable, this.lengthLimit);\n        }\n        return result;\n    }\n    addContent(text, maxLine = 10000) {\n        this.textStorage.add(text + '\\r\\n');\n        this.line += 1;\n        if (this.line % maxLine == 0) {\n            this.log.debug(this.line + \"\");\n            this.textStorage.blobStored();\n        }\n    }\n    proxy(proxyObject, name, condition = () => { return false; }) {\n        let is_has = this.proxy_map.has(proxyObject);\n        if (is_has)\n            return proxyObject;\n        else {\n            let tmp = (0, proxy_1.proxy)(proxyObject, name, (name, mode, target, property, value) => {\n                if (!this.open)\n                    return;\n                if (mode != \"set\" && mode != \"get\")\n                    return;\n                let content;\n                let select;\n                let text;\n                if (this.details)\n                    select = target;\n                else\n                    select = value;\n                content = this.stringify(select);\n                text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}`;\n                this.addContent(text, 10000);\n                if (condition(this.line, name, mode, property.toString(), select, content))\n                    debugger;\n            });\n            this.proxy_map.set(tmp, name);\n            return tmp;\n        }\n    }\n    download(fileName = '日志.txt') {\n        this.textStorage.download(fileName);\n        this.clear();\n    }\n    clear() {\n        this.textStorage.clear();\n        this.line = 0;\n        this.open = false;\n    }\n}\nexports.StackTrace = StackTrace;\n\n\n//# sourceURL=webpack://nothing/./bin/tmp.js?");

/***/ }),

/***/ "./bin/utiles.js":
/*!***********************!*\
  !*** ./bin/utiles.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.NameNote = void 0;\nexports.getType = getType;\nexports.debug = debug;\nexports.randomName = randomName;\n// 获取数据类型\nfunction getType(target) {\n    if (Array.isArray(target))\n        return 'array';\n    else if (target && target.buffer)\n        return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内\n    else if (target == null)\n        return 'null';\n    return typeof target;\n}\n// 标签打印\nfunction debug(label = \"\", message = \"\") {\n    if (label != \"\" && message == \"\") {\n        console.log(label);\n    }\n    else {\n        console.log(`[${label}] ${message}`);\n    }\n}\nfunction generateRandomString(length) {\n    const characters = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\";\n    let result = \"\";\n    for (let i = 0; i < length; i++) {\n        result += characters.charAt(Math.floor(Math.random() * characters.length));\n    }\n    return result;\n}\n// 随机生成名字\nfunction randomName(prefix = \"random\") {\n    const randomHex = generateRandomString(8);\n    return `${prefix}_${randomHex}`;\n}\nclass NameNote {\n    constructor(prefix = \"var\") {\n        this.prefix = prefix;\n        this.count = 0;\n    }\n    new() {\n        this.count++;\n        return this.prefix + \"_\" + this.count;\n    }\n}\nexports.NameNote = NameNote;\n\n\n//# sourceURL=webpack://nothing/./bin/utiles.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./bin/tmp.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});