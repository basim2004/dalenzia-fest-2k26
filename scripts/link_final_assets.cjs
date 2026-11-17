const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/assets/extracted_all');
const destDir = path.join(__dirname, '../public/assets');

const fileMap = {
  'golden_hourglass.png': 'img_26_0_R_866x1269.png',
  'lamp_books.png': 'img_46_0_R_1199x1312.png',
  'paper_plane.png': 'img_48_0_R_1536x1024.png',
  'arch_portal.png': 'img_187_0_R_1024x1536.png',
  'mandala.png': 'img_183_0_R_1199x1312.png',
  'botanical_vine.png': 'img_20_0_R_619x1475.png',
  'wave_lines.png': 'img_28_0_R_2146x140.png',
  'pixel_world_map.png': 'img_32_0_R_2335x478.png',
  'nueva_era_logo.png': 'img_22_0_R_1868x674.png',
  'nueva_era_logo_3d.png': 'img_211_0_R_530x234.png',
  'flat_hourglass.png': 'img_144_0_R_360x590.png',
  'pixel_squares.png': 'img_152_0_R_248x226.png',
  'play_button.png': 'img_148_0_R_245x290.png',
  'banner_blank.png': 'img_192_0_R_725x2170.png',
  'banner_full.png': 'img_193_0_R_725x2170.png',
};

for (const [dest, src] of Object.entries(fileMap)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Missing ${src}`);
  }
}

// Copy poster
const posterSrc = path.join(__dirname, '../public/assets/extracted_img_7_756693.jpg');
if (fs.existsSync(posterSrc)) {
  fs.copyFileSync(posterSrc, path.join(destDir, 'main_poster.jpg'));
  console.log('Copied main_poster.jpg');
}

console.log('All festival assets linked into public/assets successfully!');
