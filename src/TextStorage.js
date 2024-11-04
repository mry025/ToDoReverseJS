class TextStorage
{   
    strLengthLimit;
    stringCache;
    blobCache;

    constructor(strLengthLimit = 1024 * 256)
    {
        this.strLengthLimit = strLengthLimit;
        this.stringCache = "";
        this.blobCache = new Blob([''], { type: 'text/plain' });
    }

    /**
     * 添加内容
     * @param {string} string 
     * @returns {boolean}
     */
    add(string="")
    {
        if (typeof string != "string") throw "传入的参数有误！"

        this.stringCache += string;
        if (this.stringCache.length > this.strLengthLimit) blobStored()
        return true;
    }

    /**
     * 将 string 用 blob 存储
     */
    blobStored()
    {
        let blob = new Blob([this.stringCache], { type: 'text/plain' });
        this.stringCache = "";
        this.blobCache = new Blob([this.blobCache, blob], { type: 'text/plain' });
    }

    /**
     * 清理存储
     */
    clear()
    {
        this.stringCache = "";
        this.blobCache = new Blob([''], { type: 'text/plain' });
    }

    /**
     * 下载存储的文本到本地
     * @param {string} fileName 
     */
    download(fileName = '日志.txt')
    {
        if (this.stringCache != "") blobStored()

        // 在浏览器中运行
        const link = document.createElement('a');
        link.href = URL.createObjectURL(window.nothing._blob);
        link.download = fileName;
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);

        clear();    // 下载完就清理
    }
}