class Hook
{
    hookArray: Array<[Function, Function]>;

    constructor()
    {
        this.hookArray = [];
    }

    // 添加要 hook 的函数
    add(target: Function, func: Function)
    {
        if (!(target instanceof Function && func instanceof Function)) return;

        this.hookArray.push([target, func])
    }

    // 控制是否 hook
    eval()
    {
        for (let item of this.hookArray)
        {
            item[0] = item[1];
        }
    }
}

export { Hook };