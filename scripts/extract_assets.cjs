const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pdfPath = path.join(__dirname, '../asset/DALENZIA_2K26_NUEVA_ERA_Brand_Guideline_Book_v2.pdf');
const buf = fs.readFileSync(pdfPath);
console.log('PDF buffer size:', buf.length);

let pos = 0;
let imgCount = 0;
while (true) {
  const nextPos = buf.indexOf('/Subtype /Image', pos);
  if (nextPos === -1) break;
  imgCount++;
  pos = nextPos + 15;
}
console.log('Total /Subtype /Image found:', imgCount);

// Also search for raw JPEG markers FF D8 FF E0 / FF D8 FF E1 / FF D8 FF DB
let jpgPos = 0;
let jpgCount = 0;
const outDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

while (true) {
  const start = buf.indexOf(Buffer.from([0xff, 0xd8, 0xff]), jpgPos);
  if (start === -1) break;
  const end = buf.indexOf(Buffer.from([0xff, 0xd9]), start + 3);
  if (end === -1) break;
  const len = end + 2 - start;
  if (len > 5000) { // filter out tiny thumbnails
    jpgCount++;
    const imgBuf = buf.subarray(start, end + 2);
    const outName = path.join(outDir, `extracted_img_${jpgCount}_${len}.jpg`);
    fs.writeFileSync(outName, imgBuf);
    console.log(`Saved JPEG ${jpgCount}: size ${len} bytes -> ${outName}`);
  }
  jpgPos = end + 2;
}
console.log('Total JPEGs extracted:', jpgCount);
