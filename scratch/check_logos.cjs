const fs = require('fs');

console.log('--- LOGO FILE SIZES ---');
const files = [
  'public/assets/dalenzia_fest_logo.png',
  'public/assets/nueva_era_logo.png',
  'public/assets/nueva_era_logo_full.png',
  'public/assets/admin/admin_sidebar_logo.png',
  'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_6a4c026f.png',
  'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_462c6763.png',
  'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963623_cc5af035.png',
  'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963624_dbd53909.png',
  'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/.user_uploaded/media_1795096963625_2f0b7bf2.png'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    console.log(f, '->', fs.statSync(f).size, 'bytes');
  } else {
    console.log(f, '-> NOT FOUND');
  }
}
