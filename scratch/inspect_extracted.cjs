const fs = require('fs');
const sharp = require('sharp');

async function check() {
  const list = fs.readdirSync('public/assets/extracted_all');
  for (const f of list) {
    if (f.endsWith('.png') || f.endsWith('.jpg')) {
      const p = 'public/assets/extracted_all/' + f;
      const meta = await sharp(p).metadata();
      if (meta.width < 1200 && meta.height < 600) {
        console.log(f, `${meta.width}x${meta.height}`, meta.format);
      }
    }
  }
}

check().catch(console.error);
