class Hook
{
    hookArray;

    constructor()
    {
        this.hookArray = [];
    }

    /**
     * 添加要 hook 的函数
     * @param {Function} target 
     * @param {Function} func 
     * @returns 
     */
    add(target, func)
    {
        if (!(target instanceof Function && func instanceof Function)) return;

        hookArray.push([target, func])
    }

    /**
     * 控制是否 hook
     */
    eval()
    {
        for (let item of this.hookArray)
        {
            item[0] = item[1];
        }
    }
}

module.exports = {
    Hook,
};