const sharp = require('sharp');
const path = require('path');

async function inspect() {
  const meta = await sharp('public/assets/nueva_era_logo_full.png').metadata();
  console.log('nueva_era_logo_full:', meta.width, 'x', meta.height, 'channels:', meta.channels, 'hasAlpha:', meta.hasAlpha);
}

inspect();
