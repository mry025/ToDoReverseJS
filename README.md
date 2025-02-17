# ToDoReverseJS
这个项目是js逆向中能用到一些脚本的集合，每一个功能封装成一个组件，放在一个文件夹里，可以直接方法你的项目中跑，或者基于本项目构建好后打包。

# 基础知识
## src
存放的 ts 源码
## bin
编译成的 js 代码
## script
存放写好的一些脚本
## tsconfig.json
ts 编译配置
## ts 编译成 js
```shell
tsc
```
## webpack.config.js
webpack 配置
## webpack 打包
```shell
npx webpack
```

# 使用指南
## 开发脚本
在 src 专门留了一个 tmp.ts 文件用来写你自己的代码，编译成 js 后在 bin 目录中，再 webpack 打包后在 script 目录中，你需要在 webpack.config.js 文件中修改一下导出的全局变量名，我已经做好了注释，祝你顺利。

### 各个功能模块简介
#### CodeEval.ts
可以在执行过程中开辟一个完全新的环境执行代码
#### fileControl.ts
对文件操作做了一些封装
#### Hook.ts
可以创建一个 hook 集合，统一控制
#### Log.ts
日志模块，方便查询、保存历史日志
#### proxy.ts
实现了全部的代理函数，快速制定你想要的代理函数
#### stringify.ts
打印万物
#### TextStorage.ts
用二进制的 blob 可以在浏览器存储更多数据
#### utiles.ts
一些常用的工具函数
#### 

## 使用脚本
在 script 目录下，选择你需要的脚本，拿去吧，脚本小子。