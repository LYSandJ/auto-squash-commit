interface ListNode {
    val: string,
    next?: ListNode
}

/**
 * @description 通过相同 ID 合并 commit
 * @param content 
 */
export default function squashCommitsByID(content: string, params: string[] = []) {
    const args = require('minimist')(params, { string: true })
    const m = new RegExp(args.m || args.match || '#\\d*')

    let operations = content
                        .match(/.+$/gm)
                        ?.map(e => e.trim())
                        .filter(e => /^[a-zA-Z]/.test(e)) ?? []
    
    let linkedList = operations.reduce((pre: ListNode, val) => {
        pre.next = {
            val,
            next: null
        }
        
        return pre.next
    }, { next: null }).next

    let map = new Map()
    for (let node = linkedList; node; node = node.next) {
        const op = node.val;
        let key = op.match(m)
        if (map.has(key)) {
            let target = map.get(key)
            let tmp = target.next
            target.next = node
            node.next = tmp
        } else {
            map.set(key, node)
        }
    }

    let ops = []
    for (let node = linkedList; node; node = node.next) {
        ops.push(node.val)
    }

    return ops.join('\n')
}

squashCommitsByID(content)