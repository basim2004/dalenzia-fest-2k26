const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkIdCards() {
  const dir = path.join(__dirname, '../../public/assets/dalenzia2k25/DALENZIA STUDENT ID CARD');
  const files = fs.readdirSync(dir).filter(f => f.match(/^\d+\.png$/)).sort((a,b) => parseInt(a) - parseInt(b));
  
  console.log(`Processing ${files.length} cards...`);

  // Let's create an output dir for name crops
  const cropDir = path.join(__dirname, 'crops');
  if (!fs.existsSync(cropDir)) fs.mkdirSync(cropDir, { recursive: true });

  for (const file of files) {
    const input = path.join(dir, file);
    const meta = await sharp(input).metadata();
    // In 1050x600:
    // Name is around left: 30 to 600, top: 380 to 520
    await sharp(input)
      .extract({
        left: Math.round(meta.width * 0.03),
        top: Math.round(meta.height * 0.60),
        width: Math.round(meta.width * 0.55),
        height: Math.round(meta.height * 0.28)
      })
      .toFile(path.join(cropDir, file));
  }
  console.log('Done cropping name regions to', cropDir);
}

checkIdCards();
