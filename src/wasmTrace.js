import wabt from "wabt";


wabt().then(wabt => {

    var wasm = new Uint8Array();
    wabt.parseWat("test.wasm", wasm)
  
    var myModule = wabt.readWasm(wasm, { readDebugNames: true });
    myModule.applyNames();
  
    var wast = myModule.toText({ foldExprs: false, inlineExport: false });
  
    console.log(wast);
  });
