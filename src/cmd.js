#! /usr/bin/env node

const execa = require('execa')

function gitRebaseInteractive(head, fn, args) {
    execa.sync('git', ['rebase', '-i', head], {
        env: {
            GIT_SEQUENCE_EDITOR: 'node test.js'
        }
    })
}

gitRebaseInteractive('46be9e1fc7a1676d9a52ca0311d4850d2273af86')