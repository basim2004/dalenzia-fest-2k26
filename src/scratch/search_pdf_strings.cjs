const fs = require('fs');
const path = require('path');

function searchStrings(file) {
  const buf = fs.readFileSync(file);
  const str = buf.toString('latin1');
  const regex = /Team:\s*([^\r\n\(\)\<\>]+)/g;
  let m;
  const matches = [];
  while ((m = regex.exec(str)) !== null) {
    matches.push(m[0]);
  }
  console.log(`Found in ${path.basename(file)}:`, matches.length, matches.slice(0, 10));
}

searchStrings(path.join(__dirname, '../../asset/dalanezia 2k25/DALENZIA STUDENT ID CARD/DALANEZIA STUDENT ID a31.pdf'));
searchStrings(path.join(__dirname, '../../asset/dalanezia 2k25/DALENZIA STUDENT ID CARD/DALANEZIA STUDENT ID MULTIPLE 1.pdf'));
searchStrings(path.join(__dirname, '../../asset/dalanezia 2k25/DALENZIA STUDENT ID CARD/DALENZIA ID CARD.pdf'));
