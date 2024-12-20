declare class Hook {
    hookArray: Array<[Function, Function]>;
    constructor();
    add(target: Function, func: Function): void;
    eval(): void;
}
export { Hook };
