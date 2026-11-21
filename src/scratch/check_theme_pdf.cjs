const fs = require('fs');

const buf = fs.readFileSync('asset/dalanzia theme logo .pdf');
const str = buf.toString('latin1');
const matches = [...str.matchAll(/\/Subtype\s*\/Image/g)];
console.log('Images in PDF:', matches.length);
