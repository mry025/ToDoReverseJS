# ToDoReverseJS
这个项目是js逆向中能用到一些脚本的集合，每一个功能封装成一个组件，放在一个文件夹里，可以直接方法你的项目中跑，或者基于本项目构建好后打包。


## yourProgram.js 
写下你的代码，这个文件的代码会全部执行（在自执行函数的eval中），可以用window导出唯一的入口
```js
// ...你的代码

window.nothing = { StackTrace };    // 假设要导出StackTrace
```

## pack.js 
一个简易的webpack，可以将多个相互依赖js打包成一个js文件，为了让脚本对外只暴露一个变量和方便注入到浏览器，生成的代码在dist/result.js中，可以配置。

