"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var tmp_1 = __importDefault(require("tmp"));
var fs_1 = __importDefault(require("fs"));
var log_1 = require("./log");
var minimist = require("minimist");
function gitEdit(fn, args) {
    if (args === void 0) { args = []; }
    var resolveArgs = JSON.stringify(minimist(args));
    var scriptFile = tmp_1.default.fileSync();
    var body = fn.toString().replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    fs_1.default.writeFileSync(scriptFile.name, "\n        const fs = require('fs')\n        const file = process.argv[process.argv.length - 1]\n        let content = fs.readFileSync(file).toString()\n        content = new Function(`return (" + body + ").apply(this, arguments)`)(content, [" + resolveArgs + "])\n        fs.writeFileSync(file, content)\n        fs.unlinkSync('" + scriptFile.name + "')\n    ");
    return "node " + scriptFile.name;
}
function gitRebaseInteractive(head, fn, params) {
    try {
        execa_1.default.sync('git', ['rebase', '-i', head], {
            env: {
                GIT_SEQUENCE_EDITOR: gitEdit(fn, params),
            },
            stdout: process.stdout,
        });
    }
    catch (err) {
        var stderr = err.stderr;
        if (stderr) {
            log_1.error(stderr);
        }
        else {
            console.log(err);
        }
    }
}
exports.default = gitRebaseInteractive;
//# sourceMappingURL=index.js.map