#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var squashCommitsByID_1 = __importDefault(require("./squashCommitsByID"));
var log_1 = require("./log");
var process_1 = require("process");
var fs_1 = __importDefault(require("fs"));
var minimist = require("minimist");
var args = minimist(process.argv.slice(2), { '--': true });
var head = args['_'] && args['_'][0];
if (!head) {
    log_1.error('👻 Missing head!');
    process_1.exit(0);
}
var fn = String(args.f || args.fn || '');
var func = squashCommitsByID_1.default;
if (fn) {
    if (!fs_1.default.existsSync(fn)) {
        log_1.error('fn must be a file path');
        process_1.exit(0);
    }
    else {
        func = require(fn);
    }
}
var fnParams = minimist(args['--'] || []);
index_1.default(head, func, fnParams);
//# sourceMappingURL=cli.js.map