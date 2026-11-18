const sharp = require('sharp');
const path = require('path');

async function processImages() {
  const heroPath = path.join(__dirname, '../public/assets/models/Dalenzia Fest Nueva Era Hero Banner.png');
  const meta = await sharp(heroPath).metadata();

  // Crop hero right 3D stage cleanly
  const heroLeft = 720;
  const heroTop = 115;
  const heroW = meta.width - heroLeft;
  const heroH = meta.height - heroTop - 150;

  await sharp(heroPath)
    .extract({ left: heroLeft, top: heroTop, width: heroW, height: heroH })
    .png()
    .toFile(path.join(__dirname, '../public/assets/hero_3d_stage.png'));

  console.log(`Updated hero_3d_stage.png: ${heroW}x${heroH}`);

  // Crop about right composition cleanly
  const aboutPath = path.join(__dirname, '../public/assets/models/Dalenzia Fest_ A New Era of Ideas.png');
  const aboutMeta = await sharp(aboutPath).metadata();

  const aboutLeft = 715;
  const aboutTop = 90;
  const aboutW = aboutMeta.width - aboutLeft;
  const aboutH = aboutMeta.height - aboutTop - 340;

  await sharp(aboutPath)
    .extract({ left: aboutLeft, top: aboutTop, width: aboutW, height: aboutH })
    .png()
    .toFile(path.join(__dirname, '../public/assets/about_3d_composition.png'));

  console.log(`Updated about_3d_composition.png: ${aboutW}x${aboutH}`);
}

processImages().catch(console.error);
