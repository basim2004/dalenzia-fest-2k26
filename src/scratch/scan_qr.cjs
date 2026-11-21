const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const jsQR = require('jsqr');

async function scanIdCards() {
  const dir = path.join(__dirname, '../../public/assets/dalenzia2k25/DALENZIA STUDENT ID CARD');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

  console.log(`Found ${files.length} PNG files`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const { data, info } = await sharp(filePath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
      results.push({
        file,
        qr: code ? code.data : null
      });
    } catch (e) {
      results.push({ file, error: e.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

scanIdCards();
