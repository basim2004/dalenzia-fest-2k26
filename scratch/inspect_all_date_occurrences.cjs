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
    } else if (entry.isFile() && /\.(jsx?|html|json)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = searchDir('src');
if (fs.existsSync('index.html')) files.push('index.html');

// We are looking for any occurrences of 21–22, 21-22, 21, 22, 21 – 22, Dec 21, 22, December 21, 22, 21st, etc.
// Note: We MUST ignore 2K25 references (like 27, 28 Dec 2025 or December 27-28, 2025).
const pattern = /(21[\s\u2013\u2014\-–—,]+22|21[\s\u2013\u2014\-–—,]+23|december\s*21|dec\s*21[,\s]+22|dec\s*21[–\-—\s]+22|2026\s*dec\s*21|21st[\s\-–—a-z]+december)/i;

const report = [];

files.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  // Skip demo backup json file if not active code, but let's check
  if (norm.includes('demo_data_backup')) return;
  
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (pattern.test(line)) {
      // Check if it's 2025 or 2K25 historical
      const isHistorical2025 = line.includes('2025') && !line.includes('2026') && !line.includes('Dec 21') && !line.includes('December 21');
      if (!isHistorical2025) {
        report.push({ file: norm, lineNo: idx + 1, text: line.trim() });
      }
    }
  });
});

console.log('Total 2K26 date occurrences:', report.length);
const filesSeen = new Set(report.map(r => r.file));
console.log('Unique files:', filesSeen.size);

fs.writeFileSync('scratch/date_report.json', JSON.stringify(report, null, 2), 'utf8');

report.forEach(r => {
  console.log(`${r.file}:${r.lineNo} -> ${r.text}`);
});
