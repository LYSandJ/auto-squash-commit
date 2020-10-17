"use strict";
const fs = require('fs');
const file = process.argv[process.argv.length - 1];
let content = fs.readFileSync(file).toString();
console.log(content);
fs.writeFileSync(file, '');
