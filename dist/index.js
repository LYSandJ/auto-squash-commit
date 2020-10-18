"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const tmp_1 = __importDefault(require("tmp"));
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
function gitEdit(fn, args) {
    let resolveArgs = args && args.map(arg => `'${arg}'`).join(', ');
    const scriptFile = tmp_1.default.fileSync();
    const body = fn.toString()
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`');
    fs_1.default.writeFileSync(scriptFile.name, `
        const fs = require('fs')
        const file = process.argv[process.argv.length - 1]
        let content = fs.readFileSync(file).toString()
        content = new Function(\`return (${body}).apply(this, arguments)\`)(content, [${resolveArgs}])
        fs.writeFileSync(file, content)
        fs.unlinkSync('${scriptFile.name}')
    `);
    return `node ${scriptFile.name}`;
}
function gitRebaseInteractive(head, fn, params) {
    try {
        execa_1.default.sync('git', ['rebase', '-i', head], {
            env: {
                GIT_SEQUENCE_EDITOR: gitEdit(fn, params)
            },
            stdout: process.stdout
        });
    }
    catch ({ stderr }) {
        log_1.error(stderr);
    }
}
exports.default = gitRebaseInteractive;
//# sourceMappingURL=index.js.map