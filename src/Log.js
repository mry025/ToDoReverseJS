class Log
{
    histry;

    constructor(open=true)
    {
        if (open) this.histry = "";
    }

    #record(content)
    {
        if (this.histry != undefined)
        {
            this.histry += content;
            this.histry += '\n';
        }
    }

    /**
     * @param {*} message 
     */
    debug(message)
    {
        let content = `[debug] ${message}`;
        this.#record(content);
        console.log(content);
    }

    /**
     * @param {*} message 
     */
    error(message)
    {
        let content = `[error] ${message}`;
        this.#record(content);
        console.error(content);
    }
    
    
    /**
     * 自定义标签
     * @param {string} label 
     * @param {*} message 
     */
    log(label="debug", message="")
    {
        let content = `[${label}] ${message}`;
        this.#record(content);
        console.log(content);
    }
}

module.exports = {
    Log,
};