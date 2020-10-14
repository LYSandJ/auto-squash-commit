#! /usr/bin/env node

const execa = require('execa')

function gitRebaseInteractive(head, fn, args) {
    execa.sync('git', ['rebase', '-i', 'master'], {
      env: {
        GIT_SEQUENCE_EDITOR: ''
      }
    })
  }


  gitRebaseInteractive()