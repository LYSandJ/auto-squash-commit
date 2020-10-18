"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require('minimist');
/**
 * @description 通过相同 ID 合并 commit
 * @param content
 */
function squashCommitsByID(content, params = []) {
    var _a, _b;
    console.log(minimist);
    const args = minimist(params);
    const m = new RegExp(args.m || args.match || '#\\d*');
    let operations = (_b = (_a = content
        .match(/.+$/gm)) === null || _a === void 0 ? void 0 : _a.map(e => e.trim()).filter(e => /^[a-zA-Z]/.test(e))) !== null && _b !== void 0 ? _b : [];
    let nodes = operations.map(op => ({ val: op, next: null, pre: null }));
    let linkedList = { next: null, val: '', pre: null };
    nodes.reduce((pre, node, i) => {
        pre.next = node;
        node.pre = pre;
        return node;
    }, linkedList);
    linkedList = linkedList.next;
    let map = new Map();
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const op = node.val;
        let res = op.match(m);
        let key;
        if (!res) {
            continue;
        }
        else {
            key = res[0];
        }
        if (map.has(key)) {
            node.val = node.val.replace(/^\w*\b/, 's');
            let target = map.get(key);
            if (node.pre === target) {
                map.set(key, node);
                continue;
            }
            let tmp = node.next;
            if (node.pre) {
                node.pre.next = tmp;
            }
            tmp = target.next;
            target.next = node;
            node.pre = target;
            node.next = tmp;
            if (tmp && tmp.pre) {
                tmp.pre = node;
            }
            map.set(key, node);
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
// console.log(squashCommitsByID(`
// pick 46be9e1 test
// pick 2f6d6b9 test
// pick 542373e test
// pick 719c88f test
// pick 90338bb 1
// pick cd3b267 2
// `, ['-m', 'test']))
//# sourceMappingURL=squashCommitsByID.js.map