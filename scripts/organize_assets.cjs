const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/assets/extracted_all');
const destDir = path.join(__dirname, '../public/assets');

// Check the files
const files = fs.readdirSync(srcDir);
console.log('Total extracted files:', files.length);

// Let's copy key assets:
// 1. botanical vine: img_20_0_R_619x1475.png
fs.copyFileSync(path.join(srcDir, 'img_20_0_R_619x1475.png'), path.join(destDir, 'botanical_vine.png'));
// 2. nueva era logo: img_22_0_R_1868x674.png
fs.copyFileSync(path.join(srcDir, 'img_22_0_R_1868x674.png'), path.join(destDir, 'nueva_era_logo.png'));
// 3. golden hourglass: img_24_0_R_776x1384.png (wait, let's verify what 24, 26, 30, 32, 34, 36, 41 are)
// 4. lamp books: img_26_0_R_866x1269.png
// 5. wave lines: img_28_0_R_2146x140.png
fs.copyFileSync(path.join(srcDir, 'img_28_0_R_2146x140.png'), path.join(destDir, 'wave_lines.png'));
// 6. mandala: img_30_0_R_1150x1175.png
fs.copyFileSync(path.join(srcDir, 'img_30_0_R_1150x1175.png'), path.join(destDir, 'mandala.png'));
// 7. pixel world map: img_32_0_R_2335x478.png
fs.copyFileSync(path.join(srcDir, 'img_32_0_R_2335x478.png'), path.join(destDir, 'pixel_world_map.png'));
// 8. paper plane: img_34_0_R_1330x904.png
fs.copyFileSync(path.join(srcDir, 'img_34_0_R_1330x904.png'), path.join(destDir, 'paper_plane.png'));
// 9. banner: img_36_0_R_725x2170.png
fs.copyFileSync(path.join(srcDir, 'img_36_0_R_725x2170.png'), path.join(destDir, 'festival_banner.png'));
// 10. arch: img_41_0_R_1024x1536.png
fs.copyFileSync(path.join(srcDir, 'img_41_0_R_1024x1536.png'), path.join(destDir, 'arch_portal.png'));

// Also copy poster
const posterSrc = path.join(__dirname, '../public/assets/extracted_img_7_756693.jpg');
if (fs.existsSync(posterSrc)) {
  fs.copyFileSync(posterSrc, path.join(destDir, 'main_poster.jpg'));
}

console.log('Copied primary assets cleanly.');
