const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function renderA3SheetPreview() {
  const cardPngBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/sample_id_card_preview.png')).toString('base64');

  // A3 sheet dimensions: 297 x 420 mm
  // In pixel preview at 1/3 scale: 2970 x 4200 -> let's make a crisp 1188 x 1680 px image (4 px per mm)
  const pxPerMm = 4;
  const sheetW = 297 * pxPerMm; // 1188
  const sheetH = 420 * pxPerMm; // 1680

  const cardW = 88.9 * pxPerMm; // 355.6
  const cardH = 50.8 * pxPerMm; // 203.2
  const gap = 3 * pxPerMm; // 12
  const cols = 3;
  const rows = 7;

  const totalGridW = cols * cardW + (cols - 1) * gap;
  const totalGridH = rows * cardH + (rows - 1) * gap;
  const startX = (sheetW - totalGridW) / 2;
  const startY = (sheetH - totalGridH) / 2;

  let cardsSvg = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (cardW + gap);
      const y = startY + r * (cardH + gap);

      // Card image
      cardsSvg += `<image href="data:image/png;base64,${cardPngBase64}" x="${x}" y="${y}" width="${cardW}" height="${cardH}" />\n`;

      // Crop marks
      const len = 4 * pxPerMm;
      const off = 1.2 * pxPerMm;
      const stroke = `stroke="#999999" stroke-width="1"`;

      // TL
      cardsSvg += `<line x1="${x - off - len}" y1="${y}" x2="${x - off}" y2="${y}" ${stroke} />`;
      cardsSvg += `<line x1="${x}" y1="${y - off - len}" x2="${x}" y2="${y - off}" ${stroke} />`;
      // TR
      cardsSvg += `<line x1="${x + cardW + off}" y1="${y}" x2="${x + cardW + off + len}" y2="${y}" ${stroke} />`;
      cardsSvg += `<line x1="${x + cardW}" y1="${y - off - len}" x2="${x + cardW}" y2="${y - off}" ${stroke} />`;
      // BL
      cardsSvg += `<line x1="${x - off - len}" y1="${y + cardH}" x2="${x - off}" y2="${y + cardH}" ${stroke} />`;
      cardsSvg += `<line x1="${x}" y1="${y + cardH + off}" x2="${x}" y2="${y + cardH + off + len}" ${stroke} />`;
      // BR
      cardsSvg += `<line x1="${x + cardW + off}" y1="${y + cardH}" x2="${x + cardW + off + len}" y2="${y + cardH}" ${stroke} />`;
      cardsSvg += `<line x1="${x + cardW}" y1="${y + cardH + off}" x2="${x + cardW}" y2="${y + cardH + off + len}" ${stroke} />`;
    }
  }

  const sheetSvg = `
<svg width="${sheetW}" height="${sheetH}" viewBox="0 0 ${sheetW} ${sheetH}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- A3 Sheet Paper Background -->
  <rect width="${sheetW}" height="${sheetH}" fill="#FAFAF9" stroke="#E7E5E4" stroke-width="2" />

  <!-- Sheet Header Info -->
  <text x="${startX}" y="${startY - 24}" fill="#44403C" font-family="sans-serif" font-weight="700" font-size="14" letter-spacing="1">DALENZIA FEST 2K26 — CANDIDATE ID CARDS • SHEET 1 OF 3 (21 CARDS)</text>
  <text x="${sheetW - startX}" y="${startY - 24}" fill="#78716C" font-family="sans-serif" font-weight="500" font-size="11" text-anchor="end">Print at 100% scale (no scaling) on A3 300gsm Art Board • Trim along crop marks</text>

  <!-- Sheet Border Guide -->
  <rect x="${startX - 6}" y="${startY - 6}" width="${totalGridW + 12}" height="${totalGridH + 12}" fill="none" stroke="#E6A916" stroke-width="0.75" stroke-dasharray="4,4" opacity="0.6" />

  ${cardsSvg}

  <!-- Sheet Footer -->
  <text x="${startX}" y="${sheetH - 30}" fill="#A8A29E" font-family="sans-serif" font-size="10">DALAILUSSUNNA DARS • PERUMPADAPPU - AYIROOR - MALAPPURAM 679580 • 2026 DEC 21, 22, 23</text>
  <text x="${sheetW - startX}" y="${sheetH - 30}" fill="#A8A29E" font-family="sans-serif" font-size="10" text-anchor="end">Format: A3 Portrait (297 × 420 mm) • Imposition: 3 Cols × 7 Rows</text>
</svg>
`;

  const outputPath = path.join(__dirname, '../public/assets/sample_a3_sheet_preview.png');
  await sharp(Buffer.from(sheetSvg)).png().toFile(outputPath);
  console.log(`Saved A3 Sheet Preview to: ${outputPath}`);
}

renderA3SheetPreview().catch(err => console.error(err));
