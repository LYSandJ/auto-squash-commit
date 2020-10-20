"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * @param content
 */
function squashCommitsByID(content, args) {
    var _a, _b, _c, _d;
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
        // get commit message
        var msg = (_d = (_c = op.match(/(?<=\b)\w*$/)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '';
        // match result
        var res = msg.match(m);
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
            // delete
            var tmp = node.next;
            if (node.pre) {
                node.pre.next = tmp;
                if (tmp === null || tmp === void 0 ? void 0 : tmp.pre) {
                    tmp.pre = node.pre;
                }
            }
            // move
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
// pick 035c08e 4
// pick b413541 test
// pick 522dfc4 4
// pick a0bca63 4
// pick 4688868 4
// pick 8900e1f 4
// pick 6b26387 4
// pick bc73e01 4
// pick 2a25533 fix
// pick 3a062ae fix
// `, { m: '4|fix' }))
//# sourceMappingURL=squashCommitsByID.js.map