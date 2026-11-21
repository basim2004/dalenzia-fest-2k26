const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function makeGrid() {
  const cropDir = path.join(__dirname, 'crops');
  const files = fs.readdirSync(cropDir).filter(f => f.endsWith('.png')).sort((a,b) => parseInt(a) - parseInt(b));

  const cols = 4;
  const rows = Math.ceil(files.length / cols);
  const cellW = 350;
  const cellH = 120;

  const composites = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const c = i % cols;
    const r = Math.floor(i / cols);

    const resized = await sharp(path.join(cropDir, file))
      .resize(cellW - 10, cellH - 30, { fit: 'contain', background: '#000000' })
      .toBuffer();

    const labelSvg = Buffer.from(`
      <svg width="${cellW}" height="${cellH}">
        <rect width="${cellW}" height="${cellH}" fill="#111827" stroke="#374151" stroke-width="2"/>
        <text x="10" y="22" font-family="sans-serif" font-size="16" font-weight="bold" fill="#F59E0B">Chest ${file.replace('.png','')}</text>
      </svg>
    `);

    composites.push({
      input: labelSvg,
      left: c * cellW,
      top: r * cellH
    });

    composites.push({
      input: resized,
      left: c * cellW + 5,
      top: r * cellH + 25
    });
  }

  const gridW = cols * cellW;
  const gridH = rows * cellH;

  const bg = await sharp({
    create: {
      width: gridW,
      height: gridH,
      channels: 4,
      background: { r: 17, g: 24, b: 39, alpha: 1 }
    }
  })
  .composite(composites)
  .png()
  .toFile(path.join(__dirname, 'id_cards_grid.png'));

  console.log('Created grid of all cards:', gridW, gridH);
}

makeGrid();
