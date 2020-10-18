import execa from "execa"
import tmp from "tmp"
import fs from "fs"

function gitEdit(fn: Function, args?: string[]) {
    const scriptFile = tmp.fileSync()

    const body = fn.toString()
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')

    fs.writeFileSync(scriptFile.name, `
        const fs = require('fs')
        const file = process.argv[process.argv.length - 1]
        let content = fs.readFileSync(file).toString()
        content = new Function(\`return (${body}).apply(this, arguments)\`)(content, ${args?.join(',')})
        fs.writeFileSync(file, content)
        fs.unlinkSync('${scriptFile.name}')
    `)

  return `node ${scriptFile.name}`
}

export default function gitRebaseInteractive(head: string, fn: Function, params?: string[]) {
    execa.sync('git', ['rebase', '-i', head], {
        env: {
            GIT_SEQUENCE_EDITOR: gitEdit(fn, params)
        }
    })
}