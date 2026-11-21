const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
        results = results.concat(searchDir(full));
      }
    } else if (entry.isFile() && /\.(jsx?|tsx?|html|json|md)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = searchDir('src');
if (fs.existsSync('index.html')) files.push('index.html');

const dateRegex = /(21[\s\u2013\u2014\-,]+22|21[\s\u2013\u2014\-,]+23|december\s*2026|dec\s*2026|21st\s*dec|21\s*dec|dec\s*21|december\s*21)/i;

const matches = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (dateRegex.test(line)) {
      matches.push({ file: f.replace(/\\/g, '/'), lineNo: idx + 1, text: line.trim() });
    }
  });
});

console.log('Total matches found:', matches.length);
// Group by file
const fileMap = {};
matches.forEach(m => {
  if (!fileMap[m.file]) fileMap[m.file] = [];
  fileMap[m.file].push({ lineNo: m.lineNo, text: m.text });
});

for (const [file, list] of Object.entries(fileMap)) {
  console.log(`\n=== ${file} (${list.length} matches) ===`);
  list.slice(0, 15).forEach(item => {
    console.log(`  L${item.lineNo}: ${item.text.slice(0, 120)}`);
  });
  if (list.length > 15) {
    console.log(`  ... and ${list.length - 15} more`);
  }
}
