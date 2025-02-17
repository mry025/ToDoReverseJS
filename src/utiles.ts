// 获取数据类型
function getType(target: any): string
{
    if (Array.isArray(target)) return 'array';
    else if (target && target.buffer) return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
    else if (target == null)  return 'null';

    return typeof target;
}

// 标签打印
function debug(label="", message=""): void
{
    if (label != "" && message == "")
    {
        console.log(label);
    }
    else
    {
        console.log(`[${label}] ${message}`);
    }
}

function generateRandomString(length: number) 
{
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) 
    {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

// 随机生成名字
function randomName(prefix="random"): string
{
    const randomHex = generateRandomString(8);
    return `${prefix}_${randomHex}`;
}

class NameNote
{
    private prefix: string;
    private count: number;

    constructor(prefix="var")
    {
        this.prefix = prefix;
        this.count = 0;
    }

    new()
    {
        this.count++;
        return this.prefix + "_" +this.count;
    }
}


export {
	getType,
    debug,
    randomName,
    NameNote,
};
