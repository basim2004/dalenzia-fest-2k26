const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pdfPath = path.join(__dirname, '../asset/DALENZIA_2K26_NUEVA_ERA_Brand_Guideline_Book_v2.pdf');
const buf = fs.readFileSync(pdfPath);
const outDir = path.join(__dirname, '../public/assets');

// Let's search for obj ... /Type /XObject /Subtype /Image ... stream ... endstream
const str = buf.toString('latin1');
const re = /(\d+ \d+ obj[\s\S]*?\/Subtype\s*\/Image[\s\S]*?stream\r?\n)/g;
let match;
let count = 0;

while ((match = re.exec(str)) !== null) {
  count++;
  const header = match[1];
  const streamStart = match.index + header.length;
  const streamEnd = str.indexOf('endstream', streamStart);
  if (streamEnd === -1) continue;

  const streamBuf = buf.subarray(streamStart, streamEnd);
  
  // parse width, height, filter
  const widthMatch = header.match(/\/Width\s+(\d+)/);
  const heightMatch = header.match(/\/Height\s+(\d+)/);
  const filterMatch = header.match(/\/Filter\s*(\/[A-Za-z0-9]+|\[[\s\S]*?\])/);
  const colorSpaceMatch = header.match(/\/ColorSpace\s*(\/[A-Za-z0-9]+|\[[\s\S]*?\])/);
  const smaskMatch = header.match(/\/SMask\s+(\d+\s+\d+\s+R)/);

  const w = widthMatch ? parseInt(widthMatch[1]) : 0;
  const h = heightMatch ? parseInt(heightMatch[1]) : 0;
  const filter = filterMatch ? filterMatch[1] : 'None';

  console.log(`Image ${count}: ${w}x${h}, filter: ${filter}, smask: ${smaskMatch ? smaskMatch[1] : 'no'}, stream length: ${streamBuf.length}`);
}
