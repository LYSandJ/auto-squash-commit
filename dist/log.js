"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warning = exports.error = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.error = (msg) => { console.log(chalk_1.default.bold.red(msg)); };
exports.warning = (msg) => { console.log(chalk_1.default.keyword('orange')); };
//# sourceMappingURL=log.js.map