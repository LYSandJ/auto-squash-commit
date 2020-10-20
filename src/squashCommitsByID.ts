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
        // get commit message
        const msg = op.match(/(?<=\b)\w*$/)?.[0]??''
        // match result
        let res = msg.match(m)
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

            // delete
            let tmp = node.next
            if (node.pre) {
                node.pre.next = tmp
                if (tmp?.pre) {
                    tmp.pre = node.pre
                }
            }

            // move
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