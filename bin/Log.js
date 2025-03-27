"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    constructor(open = true, isRecord = true) {
        this.open = open;
        this.isRecord = isRecord;
        this.console_log = console.log;
        this.console_error = console.error;
        this.history = "";
    }
    print(content, mode) {
        if (this.open == false)
            return;
        if (this.isRecord)
            this.history += content;
        // 更清晰
        if (content.includes('\n')) {
            let i = 0;
            for (; i < content.length; ++i) {
                if (content[i] == ']')
                    break;
            }
            content = content.substring(0, i + 1) + '\n' + content.substring(i + 2);
        }
        switch (mode) {
            case 0 /* PRINT_MODE.ERROR */:
                this.console_error(content);
                break;
            default:
                this.console_log(content);
                break;
        }
    }
    debug(message) {
        let content = `[debug] ${message}`;
        this.print(content, 1 /* PRINT_MODE.DEBUG */);
    }
    error(message) {
        let content = `[error] ${message}`;
        this.print(content, 0 /* PRINT_MODE.ERROR */);
    }
    label(label = "label", message = "") {
        let content = `[${label}] ${message}`;
        this.print(content, 2 /* PRINT_MODE.LABEL */);
    }
    getHistory() {
        return this.history;
    }
}
exports.Log = Log;
