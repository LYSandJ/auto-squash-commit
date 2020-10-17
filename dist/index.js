"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const tmp_1 = __importDefault(require("tmp"));
const fs_1 = __importDefault(require("fs"));
function gitEdit(fn, args) {
    const scriptFile = tmp_1.default.fileSync();
    const body = fn.toString()
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`');
    fs_1.default.writeFileSync(scriptFile.name, `
        const fs = require('fs')
        const file = process.argv[process.argv.length - 1]
        let content = fs.readFileSync(file).toString()
        content = new Function(\`return (${body}).apply(this, arguments)\`)(content, ${args === null || args === void 0 ? void 0 : args.join(',')})
        fs.writeFileSync(file, content)
        fs.unlinkSync('${scriptFile.name}')
    `);
    return `node ${scriptFile.name}`;
}
function gitRebaseInteractive(head, fn, params) {
    execa_1.default.sync('git', ['rebase', '-i', head], {
        env: {
            GIT_SEQUENCE_EDITOR: gitEdit(fn, params)
        }
    });
}
exports.default = gitRebaseInteractive;
