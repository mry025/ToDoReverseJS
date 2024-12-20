declare class TextStorage {
    strLengthLimit: number;
    private stringCache;
    private blobCache;
    constructor(strLengthLimit?: number);
    /**
     * 添加内容
     * @param {string} string
     * @returns {boolean}
     */
    add(string?: string): boolean;
    /**
     * 将 string 用 blob 存储
     */
    blobStored(): void;
    /**
     * 清理存储
     */
    clear(): void;
    /**
     * 下载存储的文本到本地
     * @param {string} fileName
     */
    download(fileName?: string): void;
}
export { TextStorage };
