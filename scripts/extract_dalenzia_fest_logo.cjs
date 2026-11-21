const sharp = require('sharp');
const path = require('path');

async function extractLogos() {
  const modelPath = path.join(__dirname, '../public/assets/models/Dalenzia Fest_ A New Era of Ideas.png');
  
  await sharp(modelPath)
    .extract({ left: 63, top: 16, width: 255, height: 86 })
    .png()
    .toFile(path.join(__dirname, '../public/assets/dalenzia_fest_logo.png'));

  console.log('Successfully cropped dalenzia_fest_logo.png with full height');
}

extractLogos().catch(console.error);
