/**说明
 * 函数和变量均使用小驼峰命名法
 * 数组中的 null、undefined 被剔除了
 * 对象中的 undefined 项 被剔除了
 * 循环引用的重复部分会以 |seen| 替代
 * 字符串、数组省略部分会标注长度
 */
declare function stringify(variable: any, lengthLimit?: number, isRemoveEmpty?: boolean, seen?: WeakSet<object>): any;
export { stringify };
