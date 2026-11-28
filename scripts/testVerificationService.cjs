const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const jsQR = require('jsqr');

// We simulate idCardVerificationService in Node
const csvContent = fs.readFileSync(path.join(__dirname, '../public/data/dalenzia_students_roster_2026-11-28.csv'), 'utf8');

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

function normalizeHeader(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
const headerCells = parseCsvLine(lines[0]);
const colMap = {};
headerCells.forEach((h, idx) => {
  colMap[normalizeHeader(h)] = idx;
});

const getVal = (cells, keyNames, fallback = '') => {
  for (const k of keyNames) {
    const idx = colMap[normalizeHeader(k)];
    if (idx !== undefined && cells[idx] !== undefined) {
      return cells[idx].trim();
    }
  }
  return fallback;
};

const activeStudents = [];
const inactiveStudents = [];

for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  const status = getVal(cells, ['Status'], 'Active');
  const record = {
    id: getVal(cells, ['Student ID']),
    chestNo: getVal(cells, ['Chest No']),
    fullName: getVal(cells, ['Full Name']),
    status: status
  };
  record.expectedPayload = `DLZ26|${record.chestNo}|${record.id}`;
  if (status.toLowerCase() === 'active') {
    activeStudents.push(record);
  } else {
    inactiveStudents.push(record);
  }
}

console.log(`Parsed total rows: ${lines.length - 1}`);
console.log(`Active students to print: ${activeStudents.length}`);
console.log(`Inactive students skipped: ${inactiveStudents.length}`);

async function runAudit() {
  let verified = 0;
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
      verified++;
    } else {
      failures.push({ student: s, decoded: decoded ? decoded.data : null });
    }
  }

  console.log(`Verification Complete: Verified: ${verified}/${activeStudents.length}, Failures: ${failures.length}`);
  if (failures.length > 0) {
    console.error('FAILURES:', failures);
    process.exit(1);
  } else {
    console.log('>>> ZERO DECODE FAILURES CONFIRMED! 100% VERIFICATION SUCCESS! <<<');
  }
}

runAudit();
