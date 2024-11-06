let StackTrace = (function() {
	class Log {
		open;
		constructor(open = true) {
			this.open = open;
		}

		/**
		 * 控制打印
		 * @param {string} content 
		 * @param {string} mode 
		 * @returns 
		 */
		#print(content, mode) {
			if (this.open == false) return;
			switch (mode) {
				case "error":
					console.error(content);
					break;
				default:
					console.log(content);
					break;
			}
		}

		/**
		 * @param {*} message 
		 */
		debug(message) {
			let content = `[debug] ${message}`;
			this.#print(content, "debug");
		}

		/**
		 * @param {*} message 
		 */
		error(message) {
			let content = `[error] ${message}`;
			this.#print(content, error);
		}

		/**
		 * 自定义标签
		 * @param {string} label 
		 * @param {*} message 
		 */
		log(label = "debug", message = "") {
			let content = `[${label}] ${message}`;
			this.#print(content, "log");
		}
	}

	class TextStorage {
		strLengthLimit;
		stringCache;
		blobCache;
		constructor(strLengthLimit = 1024 * 256) {
			this.strLengthLimit = strLengthLimit;
			this.stringCache = "";
			this.blobCache = new Blob([''], {
				type: 'text/plain'
			});
		}

		/**
		 * 添加内容
		 * @param {string} string 
		 * @returns {boolean}
		 */
		add(string = "") {
			if (typeof string != "string") throw "传入的参数有误！";
			this.stringCache += string;
			if (this.stringCache.length > this.strLengthLimit) blobStored();
			return true;
		}

		/**
		 * 将 string 用 blob 存储
		 */
		blobStored() {
			let blob = new Blob([this.stringCache], {
				type: 'text/plain'
			});
			this.stringCache = "";
			this.blobCache = new Blob([this.blobCache, blob], {
				type: 'text/plain'
			});
		}

		/**
		 * 清理存储
		 */
		clear() {
			this.stringCache = "";
			this.blobCache = new Blob([''], {
				type: 'text/plain'
			});
		}

		/**
		 * 下载存储的文本到本地
		 * @param {string} fileName 
		 */
		download(fileName = '日志.txt') {
			if (this.stringCache != "") blobStored();

			// 在浏览器中运行
			const link = document.createElement('a');
			link.href = URL.createObjectURL(window.nothing._blob);
			link.download = fileName;
			link.click();
			link.remove();
			URL.revokeObjectURL(link.href);
			clear(); // 下载完就清理
		}
	}

	/**
	 * 获取目标类型
	 * @param {*} target 
	 * @returns 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
	 */
	function getType(target) {
		if (Array.isArray(target)) return 'array';
		else if (target && (target.buffer || target instanceof ArrayBuffer)) return 'arraybuffer';
		else if (target == null) return 'null';
		return typeof target;
	}

	/**
	 * 判断对象循环引用
	 * @param {object} object 
	 * @param {WeakSet} seen 
	 * @returns {boolean}
	 */
	function isCycle(object, seen = new WeakSet()) {
		if (object && typeof object === 'object') {
			if (seen.has(object)) return true;
			seen.add(object);
			for (let key of Object.keys(object)) {
				if (isCycle(object[key], seen)) return true;
			}
		}
		return false;
	}

	/**
	 * 获取目标类型
	 * @param {*} target 
	 * @returns 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
	 */
	function getType(target) {
		if (Array.isArray(target)) return 'array';
		else if (target && (target.buffer || target instanceof ArrayBuffer)) return 'arraybuffer';
		else if (target == null) return 'null';
		return typeof target;
	}

	/**
	 * 判断对象循环引用
	 * @param {object} object 
	 * @param {WeakSet} seen 
	 * @returns {boolean}
	 */
	function isCycle(object, seen = new WeakSet()) {
		if (object && typeof object === 'object') {
			if (seen.has(object)) return true;
			seen.add(object);
			for (let key of Object.keys(object)) {
				if (isCycle(object[key], seen)) return true;
			}
		}
		return false;
	}

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
	function isNumberArray(array) {
		for (let i of array) {
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
	function shortedNumberArray(array, lengthLimit) {
		if (array.length <= lengthLimit) return array.join(',');
		else {
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
	function stringifyArray(array, lengthLimit, seen) {
		if (isNumberArray(array)) {
			const res = shortedNumberArray(array, lengthLimit);
			if (array.length <= lengthLimit) return `[${res}]`;
			else return `[${res}]|length ${array.length}, tpye array|`;
		} else {
			let res = "[";
			for (let i of array) {
				let temp = stringify(i, lengthLimit, seen);
				if (temp != "undefined") res += temp;
				res += ",";
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
	function stringifyArrayBuffer(arraybuffer, lengthLimit) {
		const res = shortedNumberArray(arraybuffer, lengthLimit);
		if (arraybuffer.length <= lengthLimit) return `[${res}]`;
		else return `[${res}]|length ${arraybuffer.length}, tpye arraybuffer|`;
	}

	/**
	 * 将对象字符串化，并做一些打印优化
	 * @param {object} object 
	 * @param {WeakSet} seen 存储递归中已遍历的对象
	 */
	function stringifyObject(object, lengthLimit, seen) {
		if (seen.has(object)) return "|seen|";
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

	/**
	 * 检查是否是浏览器对象 window、document、navigator...
	 * @param {object} variable 
	 * @returns {undefined | string}
	 */
	function isBrowserObject(variable) {
		let ret;
		if (variable && variable[Symbol.toStringTag]) {
			if (typeof variable != "symbol") {
				ret = variable[Symbol.toStringTag].toLowerCase();
			}
		}
		return ret;
	}

	/**
	 * 字符串化
	 * @param {object} variable 
	 * @param {number} lengthLimit 单个成员长度限制
	 * @param {WeakSet} seen 用来解决对象循环引用，使用时不用理会
	 */
	function stringify(variable, lengthLimit = 50, seen = new WeakSet()) {
		let check = isBrowserObject(variable);
		if (check) return check;
		let type = getType(variable);
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
			default:
				// 'undefined', 'null', 'boolean', 'number'
				return "" + variable;
		}
	}

	/**
	 * 创建一个代理对象，用于拦截并处理对象的属性访问。
	 * @param {object} proxyObject 要被代理的目标对象。
	 * @param {string} name 日志中的命名。
	 * @param {Function | *} callBackFunc 被调用时的回调函数，该函数接收以下参数：
	 *   - {string} name - 日志中的命名。
	 *   - {string} mode - 代理的操作模式，例如 'get' 或 'set'。
	 *   - {object} target - 代理的目标对象。
	 *   - {string?} property - 被访问的属性。
	 *   - {*} value - 用到的值。
	 * @returns {Proxy} 返回创建的代理对象。
	 */
	function proxy(proxyObject, name, callBackFunc) {
		// 句柄
		let handler = {
			getPrototypeOf(target) {
				/* 捕获 
				Object.getPrototypeOf()
				Object.prototype.__proto__
				Object.prototype.isPrototypeOf()
				instanceof
				*/
				return _proxyHandleTemplate(name, 'getPrototypeOf', target, undefined, [target], callBackFunc);
			},
			setPrototypeOf(target, prototype) {
				/* 捕获 
				Object.setPrototypeOf()
				*/
				return _proxyHandleTemplate(name, 'setPrototypeOf', target, undefined, [target, prototype], callBackFunc);
			},
			isExtensible(target) {
				/* 捕获 
				Object.isExtensible()
				*/
				return _proxyHandleTemplate(name, 'isExtensible', target, undefined, [target], callBackFunc);
			},
			preventExtensions(target) {
				/* 捕获 
				Object.preventExtensions()
				*/
				return _proxyHandleTemplate(name, 'preventExtensions', target, undefined, [target], callBackFunc);
			},
			getOwnPropertyDescriptor(target, property) {
				/* 捕获 
				Object.getOwnPropertyDescriptor()
				*/
				return _proxyHandleTemplate(name, 'getOwnPropertyDescriptor', target, property, [target, property], callBackFunc);
			},
			defineProperty(target, property, descriptor) {
				/* 捕获 
				Object.defineProperty()
				*/
				return _proxyHandleTemplate(name, 'defineProperty', target, property, [target, property, descriptor], callBackFunc);
			},
			has(target, property) {
				/* 捕获 
				属性查询：foo in proxy
				继承属性查询：foo in Object.create(proxy)
				with 检查: with(proxy) { (foo); }
				*/
				return _proxyHandleTemplate(name, 'has', target, property, [target, property], callBackFunc);
			},
			get(target, property, receiver) {
				/* 捕获 
				访问属性：proxy[foo] 和 proxy.bar
				访问原型链上的属性：Object.create(proxy)[foo]
				*/
				return _proxyHandleTemplate(name, 'get', target, property, [target, property, receiver], callBackFunc);
			},
			set(target, property, value, receiver) {
				/* 捕获 
				指定属性值：proxy[foo] = bar 和 proxy.foo = bar
				指定继承者的属性值：Object.create(proxy)[foo] = bar
				*/
				return _proxyHandleTemplate(name, 'set', target, property, [target, property, value, receiver], callBackFunc);
			},
			deleteProperty(target, property) {
				/* 捕获 
				删除属性：delete proxy[foo] 和 delete proxy.foo
				*/
				return _proxyHandleTemplate(name, 'deleteProperty', target, property, [target, property], callBackFunc);
			},
			ownKeys(target) {
				/* 捕获 
				Object.getOwnPropertyNames()
				Object.getOwnPropertySymbols()
				Object.keys()
				*/
				return _proxyHandleTemplate(name, 'ownKeys', target, undefined, [target], callBackFunc);
			},
			apply(target, thisArg, argumentsList) {
				/* 捕获 
				proxy(...args)
				Function.prototype.apply() 和 Function.prototype.call()
				Object.keys()
				*/
				return _proxyHandleTemplate(name, 'apply', target, undefined, [target, thisArg, argumentsList], callBackFunc);
			},
			construct(target, argumentsList, newTarget) {
				/* 捕获 
				new proxy(...args)
				*/
				return _proxyHandleTemplate(name, 'construct', target, undefined, [target, argumentsList, newTarget], callBackFunc);
			}
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
	function _proxyHandleTemplate(name, mode, target, property, args, callBackFunc) {
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
		if (callBackFunc instanceof Function) {
			try {
				callBackFunc(name, mode, target, property, value);
			} catch (error) {
				throw "传入的回调函数报错\n" + error;
			}
		}
		return result;
	}

	class StackTrace {
		open; // 开关
		details; // 详细代理日志
		line; // 日志行数

		log; // 调试打印
		textStorage; // 日志的存储

		getType;
		stringify;
		constructor(open = false, details = false, lengthLimit = 50, toBlobLimit = 1024 * 256) {
			this.open = open;
			this.details = details;
			this.lengthLimit = lengthLimit;
			this.log = new Log();
			this.textStorage = new TextStorage(toBlobLimit);
			this.getType = getType;
			this.stringify = function(variable) {
				return stringify(variable, lengthLimit);
			};
		}
		proxy(proxyObject, name, debug = undefined) {
			return proxy(proxyObject, name, (name, mode, target, property, value) => {
				if (!this.open) return;
				let content;
				let text;
				if (this.details) content = this.stringify(target);
				else content = this.stringify(value);
				text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
				this.textStorage.add(text);
				this.line += 1;

				// 断点
				if (debug instanceof Function) {
					debug(this.line, name, mode, property.toString(), content);
				}
			});
		}
		download(fileName = '日志.txt') {
			this.textStorage.download(fileName);
		}
		clear() {
			this.textStorage.clear();
		}
	}

	return StackTrace
}());

let stackTrace = new StackTrace()
stackTrace.stringify([{}, null, undefined])