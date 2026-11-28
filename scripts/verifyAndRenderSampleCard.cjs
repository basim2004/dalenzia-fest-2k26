const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
const jsQR = require('jsqr');
const sharp = require('sharp');

// 1. Load CSV
const csvPath = path.join(__dirname, '../public/data/dalenzia_students_roster_2026-11-28.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
const headers = parseCsvLine(lines[0]);
console.log('CSV Headers:', headers);

const activeStudents = [];
const inactiveStudents = [];

for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  const s = {
    id: cells[0],
    chestNo: cells[1],
    fullName: cells[2],
    category: cells[3],
    team: cells[4],
    dob: cells[5],
    institution: cells[6],
    phone: cells[7],
    email: cells[8],
    eventsCount: cells[9],
    points: cells[10],
    status: cells[11]
  };
  s.expectedPayload = `DLZ26|${s.chestNo}|${s.id}`;
  if (s.status.toLowerCase() === 'active') {
    activeStudents.push(s);
  } else {
    inactiveStudents.push(s);
  }
}

console.log(`\n=== ROSTER AUDIT ===`);
console.log(`Total roster records: ${lines.length - 1}`);
console.log(`Active students: ${activeStudents.length}`);
console.log(`Inactive students skipped: ${inactiveStudents.length}`);

// 2. jsQR Validation of every single card
let passCount = 0;
const failures = [];

for (const s of activeStudents) {
  const qrData = QRCode.create(s.expectedPayload, {
    errorCorrectionLevel: 'Q',
    margin: 4
  });

  const size = qrData.modules.size;
  const scale = 8;
  const width = size * scale;
  const height = size * scale;
  const rgba = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    const my = Math.floor(y / scale);
    for (let x = 0; x < width; x++) {
      const mx = Math.floor(x / scale);
      const isDark = qrData.modules.get(mx, my);
      const idx = (y * width + x) * 4;
      const color = isDark ? 0 : 255;
      rgba[idx] = color;
      rgba[idx + 1] = color;
      rgba[idx + 2] = color;
      rgba[idx + 3] = 255;
    }
  }

  const decoded = jsQR(rgba, width, height);
  if (decoded && decoded.data === s.expectedPayload) {
    passCount++;
  } else {
    failures.push({ student: s, decoded: decoded ? decoded.data : null });
  }
}

console.log(`\n=== JSQR DECODE AUDIT ===`);
console.log(`Audited: ${activeStudents.length} cards`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failures.length}`);

if (failures.length > 0) {
  console.error('FAILED QR AUDIT!', failures);
  process.exit(1);
} else {
  console.log('>>> 100% QR VALIDATION SUCCESS! ZERO DECODE FAILURES! <<<\n');
}

// 3. Generate high quality SVG sample card for Hafiz Hassan (C-102) and render to PNG with Sharp
async function renderSampleCardImage() {
  const sample = activeStudents.find(s => s.chestNo === 'C-102') || activeStudents[0];
  const qrDataUri = await QRCode.toDataURL(sample.expectedPayload, {
    errorCorrectionLevel: 'Q',
    margin: 4,
    width: 240
  });

  // Base64 encode brand assets for self-contained SVG
  const nuevaEraBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/brand/official_nueva_era_reverse_white.png')).toString('base64');
  const darsLogoBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/brand/dars_logo.png')).toString('base64');
  const mandalaBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/mandala.png')).toString('base64');
  const waveLinesBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/wave_lines.png')).toString('base64');
  const pixelSquaresBase64 = fs.readFileSync(path.join(__dirname, '../public/assets/pixel_squares.png')).toString('base64');

  const svg = `
<svg width="1050" height="600" viewBox="0 0 1050 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8E1729" />
      <stop offset="50%" stop-color="#A91F35" />
      <stop offset="100%" stop-color="#6F101E" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1050" height="600" fill="url(#bgGrad)" />

  <!-- Gold Hairline Borders -->
  <rect x="14" y="14" width="1022" height="572" fill="none" stroke="#E6A916" stroke-width="1.5" />
  <rect x="18" y="18" width="1014" height="564" fill="none" stroke="#E6A916" stroke-width="1" stroke-opacity="0.35" />

  <!-- Watermark Mandala -->
  <image href="data:image/png;base64,${mandalaBase64}" x="580" y="-120" width="520" height="520" opacity="0.09" />

  <!-- Wave lines near bottom -->
  <image href="data:image/png;base64,${waveLinesBase64}" x="30" y="440" width="990" height="40" opacity="0.15" />

  <!-- Pixel squares cluster -->
  <image href="data:image/png;base64,${pixelSquaresBase64}" x="960" y="26" width="48" height="44" opacity="0.35" />

  <!-- NUEVA ERA reverse logo -->
  <image href="data:image/png;base64,${nuevaEraBase64}" x="40" y="36" width="200" height="74.5" />

  <!-- Festival Header Details -->
  <text x="265" y="52" fill="#E6A916" font-family="sans-serif" font-weight="700" font-size="13" letter-spacing="2">DALENZIA FEST 2K26</text>
  <text x="265" y="72" fill="#F7F3E9" font-family="sans-serif" font-weight="500" font-size="11" letter-spacing="1">SECOND EDITION • 2026 DEC 21, 22, 23</text>
  <line x1="265" y1="84" x2="680" y2="84" stroke="#E6A916" stroke-width="1" />

  <!-- Participant Hero Name -->
  <text x="42" y="165" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="38">${sample.fullName}</text>

  <!-- Chest No Badge -->
  <rect x="42" y="205" width="170" height="46" rx="12" fill="#000000" fill-opacity="0.45" stroke="#E6A916" stroke-width="2" />
  <text x="54" y="222" fill="#E6A916" font-family="sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">CHEST NO</text>
  <text x="54" y="244" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="22">${sample.chestNo}</text>

  <!-- Team & Category -->
  <text x="236" y="222" fill="#F7F3E9" font-family="sans-serif" font-weight="600" font-size="13">TEAM</text>
  <text x="236" y="244" fill="#E6A916" font-family="sans-serif" font-weight="800" font-size="20">${sample.team.toUpperCase()}</text>

  <text x="420" y="222" fill="#F7F3E9" font-family="sans-serif" font-weight="600" font-size="13">CATEGORY</text>
  <text x="420" y="244" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="18">${sample.category}</text>

  <!-- Official Entry Tag -->
  <text x="42" y="295" fill="#F7F3E9" fill-opacity="0.75" font-family="monospace" font-weight="500" font-size="11" letter-spacing="1">OFFICIAL STAGE ENTRY PASS • ID: ${sample.id}</text>

  <!-- QR Container Panel (Pure White Rounded) -->
  <rect x="730" y="56" width="275" height="370" rx="20" fill="#FFFFFF" stroke="#E6A916" stroke-width="2.5" filter="url(#shadow)" />
  <image href="${qrDataUri}" x="748" y="78" width="238" height="238" />
  <text x="867" y="348" fill="#1C1917" font-family="sans-serif" font-weight="700" font-size="13" text-anchor="middle">Scan for verification</text>
  <text x="867" y="372" fill="#A91F35" font-family="monospace" font-weight="700" font-size="10" text-anchor="middle">VERIFIED • ${sample.chestNo}</text>

  <!-- Footer Strip (White Rounded) -->
  <rect x="30" y="475" width="990" height="92" rx="16" fill="#FFFFFF" stroke="#E6A916" stroke-width="1.5" filter="url(#shadow)" />
  <image href="data:image/png;base64,${darsLogoBase64}" x="46" y="489" width="64" height="64" />
  
  <text x="126" y="507" fill="#A91F35" font-family="sans-serif" font-weight="800" font-size="15" letter-spacing="0.5">DALAILUSSUNNA DARS</text>
  <text x="126" y="527" fill="#44403C" font-family="sans-serif" font-weight="600" font-size="10.5">PERUMPADAPPU - AYIROOR - MALAPPURAM 679580  Ph +91 8589951951</text>
  <text x="126" y="545" fill="#78716C" font-family="sans-serif" font-weight="500" font-size="9.5">Venue: Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor</text>
</svg>
`;

  const sampleCardPngPath = path.join(__dirname, '../public/assets/sample_id_card_preview.png');
  await sharp(Buffer.from(svg)).png().toFile(sampleCardPngPath);
  console.log(`Saved Sample Card Preview PNG to: ${sampleCardPngPath}`);

  // Also save a 2x high-res version
  const sampleCardPng2xPath = path.join(__dirname, '../public/assets/sample_id_card_preview_2x.png');
  await sharp(Buffer.from(svg), { density: 144 }).resize(2100, 1200).png().toFile(sampleCardPng2xPath);
  console.log(`Saved 2x High-Res PNG to: ${sampleCardPng2xPath}`);

  return { sampleCardPngPath, sampleCardPng2xPath, sampleCardSvg: svg };
}

// 4. Generate Test A3 PDF (297 x 420 mm)
async function generateTestA3Pdf(sampleCardPngPath) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [297, 420],
    compress: true
  });

  const cols = 3;
  const rows = 7;
  const cardW = 88.9;
  const cardH = 50.8;
  const gap = 3;
  const totalGridW = cols * cardW + (cols - 1) * gap; // 272.7 mm
  const totalGridH = rows * cardH + (rows - 1) * gap; // 373.6 mm
  const startX = (297 - totalGridW) / 2; // 12.15 mm
  const startY = (420 - totalGridH) / 2; // 23.2 mm

  const imgBuffer = fs.readFileSync(sampleCardPngPath);
  const imgBase64 = imgBuffer.toString('base64');

  const totalPages = Math.ceil(activeStudents.length / 21);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage([297, 420], 'portrait');

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`DALENZIA FEST 2K26 — CANDIDATE ID CARDS • SHEET ${p + 1} OF ${totalPages}`, startX, startY - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text('Print at 100% scale (no scaling) on A3 300gsm Art Board • Trim along crop marks', 297 - startX, startY - 6, { align: 'right' });

    // Grid of cards
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cardIdx = p * 21 + (r * cols + c);
        if (cardIdx >= activeStudents.length) break;

        const x = startX + c * (cardW + gap);
        const y = startY + r * (cardH + gap);

        doc.addImage(`data:image/png;base64,${imgBase64}`, 'PNG', x, y, cardW, cardH);

        // Vector Crop Marks
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.15);
        const len = 4;
        const off = 1.2;

        // TL
        doc.line(x - off - len, y, x - off, y);
        doc.line(x, y - off - len, x, y - off);
        // TR
        doc.line(x + cardW + off, y, x + cardW + off + len, y);
        doc.line(x + cardW, y - off - len, x + cardW, y - off);
        // BL
        doc.line(x - off - len, y + cardH, x - off, y + cardH);
        doc.line(x, y + cardH + off, x, y + cardH + off + len);
        // BR
        doc.line(x + cardW + off, y + cardH, x + cardW + off + len, y + cardH);
        doc.line(x + cardW, y + cardH + off, x + cardW, y + cardH + off + len);
      }
    }
  }

  const pdfPath = path.join(__dirname, '../public/assets/DALENZIA_2K26_Student_ID_Cards_Test_A3.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`Saved Test A3 PDF (${totalPages} pages, ${activeStudents.length} cards) to: ${pdfPath}`);
}

async function main() {
  const { sampleCardPngPath } = await renderSampleCardImage();
  await generateTestA3Pdf(sampleCardPngPath);
  console.log('\n=== ALL VERIFICATION TASKS COMPLETED SUCCESSFULLY! ===');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
