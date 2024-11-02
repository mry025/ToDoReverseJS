class StackTrace
{
    open;           // 开关
    details;        // 详细代理日志
    lengthLimit;    // 单个成员长度限制
    toBlobLimit;    // 日志转存行数限制
    line;           // 日志行数
    _text;          // 字符串日志暂存
    _blob;          // blob 存储

    constructor()
    {
        this.open = false;
        this.details = false;
        this.line = 0;
        this.lengthLimit = 50;
        this.toBlobLimit = 10000;
        this._text = "";
        this._blob = new Blob([''], { type: 'text/plain' });      
    }

    
}

