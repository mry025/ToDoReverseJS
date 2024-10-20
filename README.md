## 前言

在使用过程中更新了一下脚本，然后本文会对重新描述一下这个脚本干了什么，会从 jsvmp 运行的角度简单说一说，并对主要代码进行讲解，全部脚本代码放在文章最后。

## 一、漫谈

vmp 核心思想是对代码进行指令集保护，其中的 vm 说的其实是编译器编译器（解释器）的后端，想一想像 js、c\c++、py 这样的高级语言被编译成汇编，把封装的函数、抽象出来的数据结构、直观的运算符...转化成相应的 mov、add、jmp...，vmp 做的其实是同一件事，相当于用 js 写了一个编译器（解释器）的后端，其中指令及其对应的“编号”都是自定义的.而 vm（虚拟机）又分为寄存器虚拟机和栈式虚拟机，用人话解释是，指令执行过程中一定要有两个部分不可或缺——临时运算存储和上下文存储。这样就有两种设计方式：“一锅端”和“分区”，“一锅端”故名思意，临时运算存储和上下文存储我都用一大块内存做了，这块内存既放临时运算存储的数据也放上下文存储的数据，省事；“分区”意味着把临时运算存储和上下文存储分开放。而 vmp trace 的思路就是监控 vm 的上下文存储，上下文存储更能体现 vm 执行的过程，因为临时运算存储实在是太“临时”了，看出上下文的联系并不容易。当然这个思路在二进制中也可以用，不过可能会不如 js 这么“得天独厚”，因为二进制的栈里不同类型的地址无法区分开，数据和地址也同样分不开（当然也可以处理，在此不进行展开）；而 js 作为一种动态类型的高级语言就没有这样的苦恼了，栈里的数据一清二楚。每次有人要获取栈里的值或者向栈里写入值，我们就记录下来，这样这个 vmp 就在我们的掌控之中了。

## 二、代码讲解

```js
// 代理插桩
window.nothing.proxy = function (proxyObject, name) {
  // 句柄
  let handle = {
    get(target, property, receiver) {
      return window.nothing._proxyHandleTemplate('get', target, property, '', receiver, name);
    },
    set(target, property, value, receiver) {
      return window.nothing._proxyHandleTemplate('set', target, property, value, receiver, name);
    },
  };
  return new Proxy(proxyObject, handle);
};
```

首先登场的是我们的代理函数: window.nothing.proxy，这里用的是 Proxy 监控的栈，当然也可以魔改浏览器的 Proxy ，做一个自己的跟踪对象，因为 get 与 set 句柄的内容差不多，就封装了一个函数： window.nothing.\_proxyHandleTemplate 。

```js
// 代理中 get 与 set 的模板
window.nothing._proxyHandleTemplate = function (mode, target, property, value, receiver, name) {
  let result;
  let content;
  switch (mode) {
    case 'get':
      result = Reflect.get(target, property, receiver);
      value = result;
      break;
    case 'set':
      result = Reflect.set(target, property, value, receiver);
      break;
    default:
      // mode 有误
      debugger;
  }
  try {
    // 0 条件断点位置   例：mode == 'set' && property == '0' && nothing.print(target).includes() nothing.get_type()
    // blob 转存、行数记录
    window.nothing._blobStoredText();
    if (window.nothing.open == 2) {
      if (window.nothing.details) {
        // 详细日志
        content = window.nothing.print(target);
      } else {
        // 简单日志
        content = window.nothing.print(value);
      }
      // window.nothing.console_log(`${name}|${mode}| 下标: ${property.toString()} 内容: ${content}`)
      window.nothing._text += `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
    }
  } catch (e) {
    window.nothing.console_log(`window.nothing.proxy 中 ${mode} 有问题`);
    debugger;
  }
  return result;
};
```

为了方便定位脚本的错误，整个脚本我都做了很多 try-catch （哎，都是泪啊），首先是 window.nothing.\_blobStoredText ，这个函数用来将文本转换成二进制存在 blob 中，这样子做日志几乎没有上限（我记得最多的一次存了 1G 的文本日志到本地），当然这个函数还有行数断点的功能，等下在讲，在这个函数的上边可以依据日志信息写一些条件断点，往下看的话，是做了一个日志的存储，日志有两种存储格式，可以配置，“详细日志”就是会记录整个栈，“简单日志”就是只记录对栈操作内容（当前设置（获取）了哪个值，不管整个栈）。

```js
// blob 转存
window.nothing._blobStoredText = function () {
  if (window.nothing.open == 0) return;

  window.nothing.count += 1;
  // 0 行数断点
  if (window.nothing.open == 2) {
    let count = window.nothing.count % window.nothing.countLimit;
    if (count == window.nothing.countLimit - 1) {
      if (window.nothing._text == '') {
        // window.nothing._text 为空
        debugger;
      } else {
        window.nothing.console_log(`blob 转存, count limit : ${window.nothing.countLimit}`);
        let blob = new Blob([window.nothing._text], {
          type: 'text/plain',
        });
        window.nothing._text = '';
        window.nothing._blob = new Blob([window.nothing._blob, blob], {
          type: 'text/plain',
        });
      }
    }
  }
};
```

在这个函数中可以依据日志下行数断点 window.nothing.countLimit 是一个全局的配置，多少行日志后将 window.nothing.\_text 中的文本转存成 window.nothing.\_blob 中的二进制数据，注意 window.nothing.\_text 中的文本越多，浏览器会越卡，string 对 js 的负担很大，而存在 Blob 对象中就不会有这个烦恼。

```js
// 对 JSON.stringify 封装
window.nothing.stringify = function (obj) {
  // 声明cache变量，便于匹配是否有循环引用的情况
  let cache = [];
  let handle = function (k, v) {
    try {
      //获取变量类型
      type = window.nothing.get_type(v);
      // 剔除循环引用
      if (type === 'object') {
        if (cache.indexOf(v) !== -1) {
          return `loop ${k}`;
        }
        cache.push(v);
      }
      // 剔除 字节数组\字符串 过长
      if (type == 'string' || type == 'arraybuffer') {
        if (v.length > window.nothing.lengthLimit) {
          return `${v.slice(0, window.nothing.lengthLimit)}...len ${v.length}|tpye ${type}`;
        } else {
          return v;
        }
      }
      // 数组 里面可能会存储各种类型，需要单独处理
      if (type == 'array') {
        let isNumberArray = v.some((element) => typeof element !== 'number');
        if (!isNumberArray && v.length > window.nothing.lengthLimit) {
          return `${v.slice(0, window.nothing.lengthLimit)}...len ${v.length}|tpye ${type}`;
        } else {
          return v;
        }
      }
      // 处理浏览器原生对象
      if (type == 'object') {
        if (v[Symbol.toStringTag]) {
          return v[Symbol.toStringTag].toLowerCase();
        }
        if (v instanceof RegExp) {
          return v.source;
        }
      }
      // 处理函数
      if (type == 'function') {
        return v.name ? `function ${v.name}` : `function anonymous`;
      }
      return v;
    } catch (e) {
      // window.nothing.stringify 的 handle 内部有问题
      debugger;
    }
  };
  try {
    let res = window.nothing.JSON_stringify(obj, handle);
    cache = null;
    return res;
  } catch (e) {
    // window.nothing.stringify 的 JSON.stringify 有问题，一般这里不用管，是浏览器做的限制
    debugger;
  }
};
// 对 window.nothing.stringify 封装
window.nothing.print = function (value) {
  try {
    let type = window.nothing.get_type(value);
    if (['undefined', 'null', 'boolean', 'number'].includes(type)) {
      return value;
    } else if (type == 'string') {
      if (value.length > window.nothing.lengthLimit) {
        return `${value.slice(0, window.nothing.lengthLimit)}...len ${value.length}|tpye ${type}`;
      } else {
        return value;
      }
    } else if (type == 'array' || type == 'object' || type == 'arraybuffer') {
      return window.nothing.stringify(value);
    } else if (type == 'symbol') {
      return value.toString();
    } else if (value[Symbol.toStringTag]) {
      return value[Symbol.toStringTag].toLowerCase();
    } else if (type == 'function') {
      return value.name ? `function ${value.name}` : `function anonymous`;
    } else {
      // 未预料到的情况
      debugger;
    }
  } catch (e) {
    // window.nothing.print 有问题
    debugger;
  }
};
```

两个对栈中文本处理的函数，一方面优化日志，使其不要太多，比如 window.nothing.lengthLimit 是对单个字符串、字节数组长度的限制（超过 100 个字符，我根本不会看，(￢︿̫̿￢☆)），可以配置；另一方面对 Symbol、RegExp、function、Window 等浏览器原生对象的打印做出相应处理。读到这里你大概已经了解了这个脚本的核心部分，剩下还有些辅助功能方便你使用这个脚本。

```js
// 普通插桩
window.nothing.ordinary = function (dict) {
  if (window.nothing.open == 0) return;

  try {
    for (let key in dict) {
      window.nothing._blobStoredText();
      if (window.nothing.open == 2) {
        let value = window.nothing.print(dict[key]);
        // window.nothing.console_log(`${key}| 内容: ${value}`)
        window.nothing._text += `${key}| 内容: ${value}\r\n`;
      }
    }
  } catch {
    // window.nothing.ordinary 出错
    debugger;
  }
};
```

这个函数是对普通插桩的兼容（你是否还在每次都重复写打印的脚本，我已经为你封装好了 23333）,你要是在想在控制台输出的话，可以用 window.nothing.console_log 即注释掉的那行代码。

```js
// 获取数据类型
window.nothing.get_type = function (value) {
  // 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value && (value.buffer || value instanceof ArrayBuffer)) {
    return 'arraybuffer';
  }
  if (value == null) {
    return 'null';
  }
  return typeof value;
};
```

将 js 的 typeof 封装了下（typeof 竟然做的这么草率，我真的要吐槽下 js 了）。

```js
// 清空缓存
window.nothing.clear_log_cache = function () {
  // 清除 blob
  window.nothing._blob = new Blob([''], {
    type: 'text/plain',
  });
  // 清除 text
  window.nothing._text = '';
};
```

有的时候你可能需要清空所有日志内容（包括文本和二进制即 window.nothing.\_blob 与 window.nothing.\_text）。

```js
// 下载日志 下载完 清空缓存、关闭代理
window.nothing.download_log = function (fileName = '日志.txt') {
  // 处理 _text
  if (window.nothing._text != '') {
    let blob = new Blob([window.nothing._text], {
      type: 'text/plain',
    });
    window.nothing._blob = new Blob([window.nothing._blob, blob], {
      type: 'text/plain',
    });
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(window.nothing._blob);
  link.download = fileName;
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  // 清空缓存
  window.nothing.clear_log_cache();
  // 关闭代理
  window.nothing.open = 0;
};
```

哦，最重要的事竟然忘说了，但愿你能看到这，将 window.nothing.\_text 与 window.nothing.\_blob 以文本的形式下载到本地，并做一些后续的处理。

```js
// native 化函数
!(function () {
  const $toString = Function.toString;
  const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
  const myToString = function () {
    return (typeof this === 'function' && this[myFunction_toString_symbol]) || $toString.call(this);
  };
  function set_native(func, key, value) {
    Object.defineProperty(func, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value,
    });
  }
  delete Function.prototype.toString;
  set_native(Function.prototype, 'toString', myToString);
  // 套个娃，保护toString
  set_native(Function.prototype.toString, myFunction_toString_symbol, 'function toString() { [native code] }');
  // 导出
  window.nothing.native = function (func, funcname) {
    set_native(func, myFunction_toString_symbol, `function ${funcname || func.name || ''}() { [native code] }`);
  };
})();
// hook 变动值
window.nothing.hook_random = function (fixedNumber, fixedData, fixedCrypto, nowNum = 1000, isDebugger = false) {
  /**
   * fixedNumber      []                    用作映射 Math.random()
   * fixedData        [[], []]              用作映射 Date() Date.now()
   * fixedCrypto      [[], []]              用作映射 crypto.randomUUID() crypto.getRandomValues(typedArray)
   * nowNum           number                用作映射 performance.now()
   * isDebugger       boolen
   */

  // Math.random()
  Math.random = function random() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedNumber[window.nothing._hookNumber[0]++ % fixedNumber.length];
  };
  window.nothing.native(Math.random, 'random');
  // Date()
  Date = (function (_Date) {
    var bind = Function.bind;
    var unbind = bind.bind(bind);
    function instantiate(constructor, args) {
      return new (unbind(constructor, null).apply(null, args))();
    }
    var names = Object.getOwnPropertyNames(_Date);
    for (var i = 0; i < names.length; i++) {
      if (names[i] in Date) continue;
      var desc = Object.getOwnPropertyDescriptor(_Date, names[i]);
      Object.defineProperty(Date, names[i], desc);
    }
    function Date() {
      if (isDebugger == true) {
        debugger;
      }
      var date = instantiate(_Date, [fixedData[0][window.nothing._hookNumber[1]++ % fixedData[0].length]]);
      // 固定返回某一个时间点
      return date;
    }
    Date.prototype = _Date.prototype;
    window.nothing.native(Date, 'Date');
    return Date;
  })(Date);
  // Date.now()
  Date.now = function now() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedData[1][window.nothing._hookNumber[2]++ % fixedData[1].length];
  };
  window.nothing.native(Date.now, 'now');
  // crypto.randomUUID()
  crypto.randomUUID = function randomUUID() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedCrypto[0][window.nothing._hookNumber[3]++ % fixedNumber.length];
  };
  window.nothing.native(crypto.randomUUID, 'randomUUID');
  // crypto.getRandomValues(typedArray)
  crypto.getRandomValues = function getRandomValues(typedArray) {
    if (isDebugger == true) {
      debugger;
    }
    if (window.nothing.get_type(typedArray) != 'arraybuffer') {
      // typedArray 传入类型有误
      debugger;
      return;
    }
    let arr = [];
    for (let i = 0; i < typedArray.length; i++) {
      arr.push(fixedCrypto[1][window.nothing._hookNumber[4]++ % fixedNumber.length]);
    }
    return new typedArray.__proto__.constructor(arr);
  };
  window.nothing.native(crypto.getRandomValues, 'getRandomValues');
  // performance.now()
  Performance.prototype.now = function now() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedNumber[window.nothing._hookNumber[5]++ % fixedNumber.length] * nowNum;
  };
  window.nothing.native(Performance.prototype.now, 'now');
};
```

最后这部分是对随机的处理，将随机变成伪随机，做这一步是为了让每次获取的日志内容不变，这样就可以依据行数下断点，省去写条件断点的麻烦。处理了 Math.random()、Date()、Date.now()、crypto.randomUUID()、crypto.getRandomValues(typedArray)、performance.now()。生成伪随机需要传入相应的数组，这样每次随机就会依照你传的数组对应算出。因为有时间，所以我没写死。

```js
// hook 的辅助生成数组
window.nothing.hook_support = function (len, mul = 100, add = 500) {
  let res = [];
  let arr;
  // Math_random
  arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(window.nothing.Math_random());
  }
  res.push(arr);
  // Date_now
  arr = [[], []];
  for (let i = 0; i < len; i++) {
    arr[0].push(window.nothing.Date_now() + i * mul);
  }
  for (let i = 0; i < len; i++) {
    arr[1].push(window.nothing.Date_now() + i * mul + add);
  }
  res.push(arr);
  // crypto
  arr = [[]];
  for (let i = 0; i < len; i++) {
    arr[0].push(window.crypto.randomUUID());
  }
  arr.push(window.crypto.getRandomValues(new Uint32Array(len)));
  res.push(arr);
  return res;
};
```

辅助生成伪随机的函数，没错，偷懒大王已经写好了，自动生成伪随机数组。

```js
// 初始化配置
window.nothing = {
  open: 0, //  0, 1, 2 -> 0：关闭； 1：记录行数； 2：记录日志
  details: true, // 详细代理日志
  count: 0, // 日志行数
  lengthLimit: 100, // 单个成员长度限制
  countLimit: 100000, // 日志转存限制
  _text: '',
  _blob: new Blob([''], {
    type: 'text/plain',
  }),
  _hookNumber: [0, 0, 0, 0, 0, 0], // hook 轮询值 不必理会
  JSON_stringify: JSON.stringify, // 保留函数，自己用，防检测
  console_log: console.log,
  Math_random: Math.random,
  Date: Date,
  Date_now: Date.now,
  // 下面几个放在对象中调用报错
  // crypto_randomUUID: crypto.randomUUID,
  // crypto_getRandomValues: crypto.getRandomValues,
  // performance_now: performance.now,
};
```

最后你可以看看这个配置部分，它像是一个地图指引你前往这个脚本的每个角落。

## 三、源码

```js
// 初始化配置
window.nothing = {
  open: 0, //  0, 1, 2 -> 0：关闭； 1：记录行数； 2：记录日志
  details: true, // 详细代理日志
  count: 0, // 日志行数
  lengthLimit: 100, // 单个成员长度限制
  countLimit: 100000, // 日志转存限制
  _text: '',
  _blob: new Blob([''], {
    type: 'text/plain',
  }),
  _hookNumber: [0, 0, 0, 0, 0, 0], // hook 轮询值 不必理会
  JSON_stringify: JSON.stringify, // 保留函数，自己用，防检测
  console_log: console.log,
  Math_random: Math.random,
  Date: Date,
  Date_now: Date.now,
  // 下面几个放在对象中调用报错
  // crypto_randomUUID: crypto.randomUUID,
  // crypto_getRandomValues: crypto.getRandomValues,
  // performance_now: performance.now,
};

// 代理插桩
window.nothing.proxy = function (proxyObject, name) {
  // 句柄
  let handle = {
    get(target, property, receiver) {
      return window.nothing._proxyHandleTemplate('get', target, property, '', receiver, name);
    },
    set(target, property, value, receiver) {
      return window.nothing._proxyHandleTemplate('set', target, property, value, receiver, name);
    },
  };
  return new Proxy(proxyObject, handle);
};
// 普通插桩
window.nothing.ordinary = function (dict) {
  if (window.nothing.open == 0) return;

  try {
    for (let key in dict) {
      window.nothing._blobStoredText();
      if (window.nothing.open == 2) {
        let value = window.nothing.print(dict[key]);
        // window.nothing.console_log(`${key}| 内容: ${value}`)
        window.nothing._text += `${key}| 内容: ${value}\r\n`;
      }
    }
  } catch {
    // window.nothing.ordinary 出错
    debugger;
  }
};
// 获取数据类型
window.nothing.get_type = function (value) {
  // 'undefined', 'null', 'boolean', 'string', 'number', 'symbol', 'array', 'object', 'function', 'arraybuffer'
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value && (value.buffer || value instanceof ArrayBuffer)) {
    return 'arraybuffer';
  }
  if (value == null) {
    return 'null';
  }
  return typeof value;
};
// 对 JSON.stringify 封装
window.nothing.stringify = function (obj) {
  // 声明cache变量，便于匹配是否有循环引用的情况
  let cache = [];
  let handle = function (k, v) {
    try {
      //获取变量类型
      type = window.nothing.get_type(v);
      // 剔除循环引用
      if (type === 'object') {
        if (cache.indexOf(v) !== -1) {
          return `loop ${k}`;
        }
        cache.push(v);
      }
      // 剔除 字节数组\字符串 过长
      if (type == 'string' || type == 'arraybuffer') {
        if (v.length > window.nothing.lengthLimit) {
          return `${v.slice(0, window.nothing.lengthLimit)}...len ${v.length}|tpye ${type}`;
        } else {
          return v;
        }
      }
      // 数组 里面可能会存储各种类型，需要单独处理
      if (type == 'array') {
        let isNumberArray = v.some((element) => typeof element !== 'number');
        if (!isNumberArray && v.length > window.nothing.lengthLimit) {
          return `${v.slice(0, window.nothing.lengthLimit)}...len ${v.length}|tpye ${type}`;
        } else {
          return v;
        }
      }
      // 处理浏览器原生对象
      if (type == 'object') {
        if (v[Symbol.toStringTag]) {
          return v[Symbol.toStringTag].toLowerCase();
        }
        if (v instanceof RegExp) {
          return v.source;
        }
      }
      // 处理函数
      if (type == 'function') {
        return v.name ? `function ${v.name}` : `function anonymous`;
      }
      return v;
    } catch (e) {
      // window.nothing.stringify 的 handle 内部有问题
      debugger;
    }
  };
  try {
    let res = window.nothing.JSON_stringify(obj, handle);
    cache = null;
    return res;
  } catch (e) {
    // window.nothing.stringify 的 JSON.stringify 有问题，一般这里不用管，是浏览器做的限制
    debugger;
  }
};
// 对 window.nothing.stringify 封装
window.nothing.print = function (value) {
  try {
    let type = window.nothing.get_type(value);
    if (['undefined', 'null', 'boolean', 'number'].includes(type)) {
      return value;
    } else if (type == 'string') {
      if (value.length > window.nothing.lengthLimit) {
        return `${value.slice(0, window.nothing.lengthLimit)}...len ${value.length}|tpye ${type}`;
      } else {
        return value;
      }
    } else if (type == 'array' || type == 'object' || type == 'arraybuffer') {
      return window.nothing.stringify(value);
    } else if (type == 'symbol') {
      return value.toString();
    } else if (value[Symbol.toStringTag]) {
      return value[Symbol.toStringTag].toLowerCase();
    } else if (type == 'function') {
      return value.name ? `function ${value.name}` : `function anonymous`;
    } else {
      // 未预料到的情况
      debugger;
    }
  } catch (e) {
    // window.nothing.print 有问题
    debugger;
  }
};
// blob 转存
window.nothing._blobStoredText = function () {
  if (window.nothing.open == 0) return;

  window.nothing.count += 1;
  // 0 行数断点
  if (window.nothing.open == 2) {
    let count = window.nothing.count % window.nothing.countLimit;
    if (count == window.nothing.countLimit - 1) {
      if (window.nothing._text == '') {
        // window.nothing._text 为空
        debugger;
      } else {
        window.nothing.console_log(`blob 转存, count limit : ${window.nothing.countLimit}`);
        let blob = new Blob([window.nothing._text], {
          type: 'text/plain',
        });
        window.nothing._text = '';
        window.nothing._blob = new Blob([window.nothing._blob, blob], {
          type: 'text/plain',
        });
      }
    }
  }
};
// 清空缓存
window.nothing.clear_log_cache = function () {
  // 清除 blob
  window.nothing._blob = new Blob([''], {
    type: 'text/plain',
  });
  // 清除 text
  window.nothing._text = '';
};
// 下载日志 下载完 清空缓存、关闭代理
window.nothing.download_log = function (fileName = '日志.txt') {
  // 处理 _text
  if (window.nothing._text != '') {
    let blob = new Blob([window.nothing._text], {
      type: 'text/plain',
    });
    window.nothing._blob = new Blob([window.nothing._blob, blob], {
      type: 'text/plain',
    });
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(window.nothing._blob);
  link.download = fileName;
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  // 清空缓存
  window.nothing.clear_log_cache();
  // 关闭代理
  window.nothing.open = 0;
};
// 代理中 get 与 set 的模板
window.nothing._proxyHandleTemplate = function (mode, target, property, value, receiver, name) {
  let result;
  let content;
  switch (mode) {
    case 'get':
      result = Reflect.get(target, property, receiver);
      value = result;
      break;
    case 'set':
      result = Reflect.set(target, property, value, receiver);
      break;
    default:
      // mode 有误
      debugger;
  }
  try {
    // 0 条件断点位置   例：mode == 'set' && property == '0' && nothing.print(target).includes() nothing.get_type()
    // blob 转存、行数记录
    window.nothing._blobStoredText();
    if (window.nothing.open == 2) {
      if (window.nothing.details) {
        // 详细日志
        content = window.nothing.print(target);
      } else {
        // 简单日志
        content = window.nothing.print(value);
      }
      // window.nothing.console_log(`${name}|${mode}| 下标: ${property.toString()} 内容: ${content}`)
      window.nothing._text += `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}\r\n`;
    }
  } catch (e) {
    window.nothing.console_log(`window.nothing.proxy 中 ${mode} 有问题`);
    debugger;
  }
  return result;
};

// native 化函数
!(function () {
  const $toString = Function.toString;
  const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
  const myToString = function () {
    return (typeof this === 'function' && this[myFunction_toString_symbol]) || $toString.call(this);
  };
  function set_native(func, key, value) {
    Object.defineProperty(func, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value,
    });
  }
  delete Function.prototype.toString;
  set_native(Function.prototype, 'toString', myToString);
  // 套个娃，保护toString
  set_native(Function.prototype.toString, myFunction_toString_symbol, 'function toString() { [native code] }');
  // 导出
  window.nothing.native = function (func, funcname) {
    set_native(func, myFunction_toString_symbol, `function ${funcname || func.name || ''}() { [native code] }`);
  };
})();
// hook 变动值
window.nothing.hook_random = function (fixedNumber, fixedData, fixedCrypto, nowNum = 1000, isDebugger = false) {
  /**
   * fixedNumber      []                    用作映射 Math.random()
   * fixedData        [[], []]              用作映射 Date() Date.now()
   * fixedCrypto      [[], []]              用作映射 crypto.randomUUID() crypto.getRandomValues(typedArray)
   * nowNum           number                用作映射 performance.now()
   * isDebugger       boolen
   */

  // Math.random()
  Math.random = function random() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedNumber[window.nothing._hookNumber[0]++ % fixedNumber.length];
  };
  window.nothing.native(Math.random, 'random');
  // Date()
  Date = (function (_Date) {
    var bind = Function.bind;
    var unbind = bind.bind(bind);
    function instantiate(constructor, args) {
      return new (unbind(constructor, null).apply(null, args))();
    }
    var names = Object.getOwnPropertyNames(_Date);
    for (var i = 0; i < names.length; i++) {
      if (names[i] in Date) continue;
      var desc = Object.getOwnPropertyDescriptor(_Date, names[i]);
      Object.defineProperty(Date, names[i], desc);
    }
    function Date() {
      if (isDebugger == true) {
        debugger;
      }
      var date = instantiate(_Date, [fixedData[0][window.nothing._hookNumber[1]++ % fixedData[0].length]]);
      // 固定返回某一个时间点
      return date;
    }
    Date.prototype = _Date.prototype;
    window.nothing.native(Date, 'Date');
    return Date;
  })(Date);
  // Date.now()
  Date.now = function now() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedData[1][window.nothing._hookNumber[2]++ % fixedData[1].length];
  };
  window.nothing.native(Date.now, 'now');
  // crypto.randomUUID()
  crypto.randomUUID = function randomUUID() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedCrypto[0][window.nothing._hookNumber[3]++ % fixedNumber.length];
  };
  window.nothing.native(crypto.randomUUID, 'randomUUID');
  // crypto.getRandomValues(typedArray)
  crypto.getRandomValues = function getRandomValues(typedArray) {
    if (isDebugger == true) {
      debugger;
    }
    if (window.nothing.get_type(typedArray) != 'arraybuffer') {
      // typedArray 传入类型有误
      debugger;
      return;
    }
    let arr = [];
    for (let i = 0; i < typedArray.length; i++) {
      arr.push(fixedCrypto[1][window.nothing._hookNumber[4]++ % fixedNumber.length]);
    }
    return new typedArray.__proto__.constructor(arr);
  };
  window.nothing.native(crypto.getRandomValues, 'getRandomValues');
  // performance.now()
  Performance.prototype.now = function now() {
    if (isDebugger == true) {
      debugger;
    }
    return fixedNumber[window.nothing._hookNumber[5]++ % fixedNumber.length] * nowNum;
  };
  window.nothing.native(Performance.prototype.now, 'now');
};
// hook 的辅助生成数组
window.nothing.hook_support = function (len, mul = 100, add = 500) {
  let res = [];
  let arr;
  // Math_random
  arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(window.nothing.Math_random());
  }
  res.push(arr);
  // Date_now
  arr = [[], []];
  for (let i = 0; i < len; i++) {
    arr[0].push(window.nothing.Date_now() + i * mul);
  }
  for (let i = 0; i < len; i++) {
    arr[1].push(window.nothing.Date_now() + i * mul + add);
  }
  res.push(arr);
  // crypto
  arr = [[]];
  for (let i = 0; i < len; i++) {
    arr[0].push(window.crypto.randomUUID());
  }
  arr.push(window.crypto.getRandomValues(new Uint32Array(len)));
  res.push(arr);
  return res;
};

// copy(window.nothing.hook_support(107)) // 最好每个网站生成一组
// window.nothing.hook_random(...)
// window.nothing.proxy(proxyObject, name)
```
