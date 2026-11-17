const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '../asset/DALENZIA logo .pdf');
const buf = fs.readFileSync(pdfPath);
const str = buf.toString('latin1');

const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
let m;
while ((m = objRegex.exec(str)) !== null) {
  const num = m[1];
  const body = m[3];
  if (body.includes('/Subtype /Image')) {
    const w = (body.match(/\/Width\s+(\d+)/) || [])[1];
    const h = (body.match(/\/Height\s+(\d+)/) || [])[1];
    console.log(`DALENZIA logo PDF Obj ${num} 0 R: ${w}x${h}`);
  }
}
