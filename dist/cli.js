#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const squashCommitsByID_1 = __importDefault(require("./squashCommitsByID"));
const log_1 = require("./log");
const process_1 = require("process");
const fs_1 = __importDefault(require("fs"));
const args = require('minimist')(process.argv.slice(2), { '--': true });
const head = args['_'] && args['_'][0];
if (!head) {
    log_1.error('👻 Missing head!');
    process_1.exit(0);
}
const fn = String(args.f || args.fn || '');
let func = squashCommitsByID_1.default;
if (fn) {
    if (!fs_1.default.existsSync(fn)) {
        log_1.error('fn must be a file path');
        process_1.exit(0);
    }
    else {
        func = require(fn);
    }
}
const fnParams = args['--'] || [];
index_1.default(head, func, fnParams);
