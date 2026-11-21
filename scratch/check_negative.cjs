const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'scratch'].includes(entry.name)) {
        results = results.concat(searchDir(full));
      }
    } else if (entry.isFile() && /\.(jsx?|html)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = searchDir('src');
if (fs.existsSync('index.html')) files.push('index.html');

const badPattern = /(21[\s\u2013\u2014\-–—]+22|21[\s\u2013\u2014\-–—]+23)/i;
const badMatches = [];

files.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  content.split('\n').forEach((l, i) => {
    if (badPattern.test(l)) {
      badMatches.push({ file: norm, line: i + 1, text: l.trim() });
    }
  });
});

console.log('Total bad date range matches (21-22 or 21-23):', badMatches.length);
badMatches.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.text}`));
