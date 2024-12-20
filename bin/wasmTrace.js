"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wabt_1 = __importDefault(require("wabt"));
(0, wabt_1.default)().then(wabt => {
    var wasm = new Uint8Array();
    wabt.parseWat("test.wasm", wasm);
    var myModule = wabt.readWasm(wasm, { readDebugNames: true });
    myModule.applyNames();
    var wast = myModule.toText({ foldExprs: false, inlineExport: false });
    console.log(wast);
});
