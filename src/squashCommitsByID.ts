const minimist = require('minimist')

interface ListNode {
    val: string,
    next: ListNode | null
    pre: ListNode | null
}

/**
 * @description
 * @param content 
 */
export default function squashCommitsByID(content: string, args: squashCommitsByIDArgs = {}) {
    const m = new RegExp(args.m || args.match || '#\\d*')

    let operations = content
                        .match(/.+$/gm)
                        ?.map(e => e.trim())
                        .filter(e => /^[a-zA-Z]/.test(e)) ?? []
                        
    let nodes: ListNode[] = operations.map(op => ({ val: op, next: null, pre: null }))
    
    let linkedList: ListNode = { next: null, val: '', pre: null }
    nodes.reduce((pre: ListNode, node, i) => {
        pre.next = node
        node.pre = pre

        return node
    }, linkedList)
    linkedList = (linkedList.next as ListNode)  

    let map = new Map()
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        const op = node.val;
        let res = op.match(m)
        let key;
        if (!res) {
            continue
        } else {
            key = res[0]
        }

        if (map.has(key)) {
            node.val = node.val.replace(/^\w*\b/, 's')

            let target = map.get(key)
            if (node.pre === target) {
                map.set(key, node)
                continue
            }

            let tmp = node.next
            if (node.pre) {
                node.pre.next = tmp   
            }

            tmp = target.next
            target.next = node
            node.pre = target
            node.next = tmp
            if (tmp && tmp.pre) {
                tmp.pre = node   
            }

            map.set(key, node)
        } else {
            map.set(key, node)
        }
    }

    let ops = []
    for (let node: ListNode | null = linkedList; node; node = node.next) {
        ops.push(node.val)
    }

    return ops.join('\n')
}

// console.log(squashCommitsByID(`
// pick 46be9e1 test
// pick 2f6d6b9 test
// pick 542373e test
// pick 719c88f test
// pick 90338bb 1
// pick cd3b267 2
// `, ['-m', 'test']))