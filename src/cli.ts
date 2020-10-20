#! /usr/bin/env node

import gitRebaseInteractive from './index';
import squashCommitsByID from './squashCommitsByID';
import { error } from './log';
import { exit } from 'process';
import fs from 'fs';
const minimist = require("minimist"); 

const args = minimist(process.argv.slice(2), { '--': true }) as Args;

const head = args['_'] && args['_'][0];
if (!head) {
  error('👻 Missing head!');
  exit(0);
}

const fn = String(args.f || args.fn || '');
let func = squashCommitsByID;
if (fn) {
  if (!fs.existsSync(fn)) {
    error('fn must be a file path');
    exit(0);
  } else {
    func = require(fn);
  }
}

gitRebaseInteractive(head, func, args['--']);
