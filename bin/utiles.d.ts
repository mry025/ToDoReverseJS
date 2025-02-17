declare function getType(target: any): string;
declare function debug(label?: string, message?: string): void;
declare function randomName(prefix?: string): string;
declare class NameNote {
    private prefix;
    private count;
    constructor(prefix?: string);
    new(): string;
}
export { getType, debug, randomName, NameNote, };
