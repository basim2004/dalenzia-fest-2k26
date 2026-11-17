const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '../asset/DALENZIA_2K26_NUEVA_ERA_Brand_Guideline_Book_v2.pdf');
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
    const smask = (body.match(/\/SMask\s+(\d+\s+\d+\s+R)/) || [])[1];
    const filter = (body.match(/\/Filter\s*(\/[A-Za-z0-9]+|\[[\s\S]*?\])/) || [])[1];
    console.log(`Obj ${num} 0 R: ${w}x${h}, filter: ${filter}, smask: ${smask}`);
  }
}
