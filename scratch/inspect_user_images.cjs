const fs = require('fs');
const sharp = require('sharp');

async function inspectUserImages() {
  const u1 = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_6a4c026f.png';
  const u2 = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_462c6763.png';
  const u3 = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_cc5af035.png';
  const u4 = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963624_dbd53909.png';
  const u5 = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963625_2f0b7bf2.png';

  console.log('u1 (Official DALENZIA FEST):', await sharp(u1).metadata());
  console.log('u2 (Official NUEVA ERA):', await sharp(u2).metadata());
  console.log('u3 (Temp on Cream):', await sharp(u3).metadata());
  console.log('u4 (Temp Text):', await sharp(u4).metadata());
  console.log('u5 (Temp on Crimson):', await sharp(u5).metadata());

  // Also check public/assets/nueva_era_logo.png
  console.log('nueva_era_logo.png:', await sharp('public/assets/nueva_era_logo.png').metadata());
  console.log('img_209:', await sharp('public/assets/extracted_all/img_209_0_R_471x178.png').metadata());
  console.log('img_211:', await sharp('public/assets/extracted_all/img_211_0_R_530x234.png').metadata());
}

inspectUserImages().catch(console.error);
