"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var minimist = require('minimist');
/**
 * @description
 * @param content
 */
function squashCommitsByID(content, args) {
    var _a, _b;
    if (args === void 0) { args = {}; }
    var m = new RegExp(args.m || args.match || '#\\d*');
    var operations = (_b = (_a = content
        .match(/.+$/gm)) === null || _a === void 0 ? void 0 : _a.map(function (e) { return e.trim(); }).filter(function (e) { return /^[a-zA-Z]/.test(e); })) !== null && _b !== void 0 ? _b : [];
    var nodes = operations.map(function (op) { return ({ val: op, next: null, pre: null }); });
    var linkedList = { next: null, val: '', pre: null };
    nodes.reduce(function (pre, node, i) {
        pre.next = node;
        node.pre = pre;
        return node;
    }, linkedList);
    linkedList = linkedList.next;
    var map = new Map();
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var op = node.val;
        var res = op.match(m);
        var key = void 0;
        if (!res) {
            continue;
        }
        else {
            key = res[0];
        }
        if (map.has(key)) {
            node.val = node.val.replace(/^\w*\b/, 's');
            var target = map.get(key);
            if (node.pre === target) {
                map.set(key, node);
                continue;
            }
            var tmp = node.next;
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
    var ops = [];
    for (var node = linkedList; node; node = node.next) {
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