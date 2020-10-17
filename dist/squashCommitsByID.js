"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 通过相同 ID 合并 commit
 * @param content
 */
function squashCommitsByID(content, params = []) {
    var _a, _b;
    const args = require('minimist')(params, { string: true });
    const m = new RegExp(args.m || args.match || '#\\d*');
    let operations = (_b = (_a = content
        .match(/.+$/gm)) === null || _a === void 0 ? void 0 : _a.map(e => e.trim()).filter(e => /^[a-zA-Z]/.test(e))) !== null && _b !== void 0 ? _b : [];
    let linkedList = operations.reduce((pre, val) => {
        pre.next = {
            val,
            next: null
        };
        return pre.next;
    }, { next: null }).next;
    let map = new Map();
    for (let node = linkedList; node; node = node.next) {
        const op = node.val;
        let key = op.match(m);
        if (map.has(key)) {
            let target = map.get(key);
            let tmp = target.next;
            target.next = node;
            node.next = tmp;
        }
        else {
            map.set(key, node);
        }
    }
    let ops = [];
    for (let node = linkedList; node; node = node.next) {
        ops.push(node.val);
    }
    return ops.join('\n');
}
exports.default = squashCommitsByID;
squashCommitsByID(content);
