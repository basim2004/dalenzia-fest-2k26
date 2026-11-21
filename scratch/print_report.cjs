const fs = require('fs');
const report = JSON.parse(fs.readFileSync('scratch/date_report.json', 'utf8'));
report.forEach((r, idx) => {
  console.log(`[${idx + 1}] ${r.file}:${r.lineNo}`);
  console.log(`    ${r.text}`);
});
