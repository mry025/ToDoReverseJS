declare class Log {
    open: boolean;
    isRecord: boolean;
    console_log: Function;
    console_error: Function;
    private history;
    constructor(open?: boolean, isRecord?: boolean);
    private print;
    debug(message: string): void;
    error(message: string): void;
    label(label?: string, message?: string): void;
    getHistory(): string;
}
export { Log };
