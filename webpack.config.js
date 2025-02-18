const path = require('path');

module.exports = {
    mode: 'development', // 或其他模式
    entry: './bin/tmp.js', // 入口文件路径
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出目录
        filename: 'trace.js', // 输出文件名
        library: {
            name: 'nothing', // 暴露为全局变量的名称
            type: 'umd', // 使用 UMD 格式
        },
    },
};