import { parse } from "@babel/parser";
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import fs from "fs"
import path from "path";

// 全局变量
const sourceDir = "src";
const entryDir = "yourProgram.js";
let outPath = "index.js";
let outName = "StackTrace";
let outObject = "StackTrace";
let code = `let ${outName} = (function(){\r\n`;

function codeCollector(fileName)
{
    const filePath = path.join(sourceDir, fileName)
    const data = fs.readFileSync(filePath, "utf-8");
    let neadFile = new Set();
    
    const ast = parse(data, { sourceType: "module" });
    
    traverse.default(ast, {
        ImportDeclaration(path) 
        {
            let node = path.node;
            let filePath = node["source"]["value"];
            neadFile.add(filePath.split("/")[1]);
            path.remove();
        },
        ExportNamedDeclaration(path)
        {
            path.remove();
        }
    });
    let generatorCode = generator.default(ast).code;

    for (let file of neadFile) {
        codeCollector(file)
    }

    code += generatorCode;
    code += "\r\n\r\n";
}


codeCollector(entryDir);
code += `   return ${outObject} }());\r\n`

fs.writeFile(outPath, code, (err) => {
    if (err) throw err;
    console.log('写入成功');
});

