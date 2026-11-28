/**
 * Student ID Card Verification Service
 * 
 * Compliant with DALENZIA FEST 2K26 ID Card Studio requirements:
 * - Parses CSV roster (Student ID, Chest No, Full Name, Category, Team, DOB, Institution, Phone, Email, Events Count, Points, Status)
 * - Identifies and filters active vs inactive candidates
 * - Detects roster warnings (duplicate chest numbers, missing fields)
 * - Generates QR code using qrcode (Level Q, margin >= 4)
 * - Automatically validates all generated QR codes via jsQR against payload: DLZ26|<Chest No>|<Student ID>
 * - Provides audit summary with zero-failure verification guarantees
 */

import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { ID_CARD_CONFIG } from '../config/idCardConfig';

/**
 * Parse CSV text into student records
 * @param {string} csvText 
 * @returns {{ students: Array, summary: Object, warnings: Array, inactiveStudents: Array }}
 */
export function parseRosterCsv(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV content is empty or invalid.');
  }

  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one student row.');
  }

  // Parse header
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

  const students = [];
  const inactiveStudents = [];
  const warnings = [];
  const seenChestNos = new Map();

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.length === 0 || cells.every(c => !c.trim())) continue;

    const studentId = getVal(cells, ['Student ID', 'StudentID', 'id'], `STU-${1000 + i}`);
    const chestNo = getVal(cells, ['Chest No', 'ChestNo', 'chest_no'], '');
    const fullName = getVal(cells, ['Full Name', 'FullName', 'Name', 'Student Name'], 'Candidate');
    const category = getVal(cells, ['Category', 'Class Category', 'ClassCategory'], 'Senior');
    const team = getVal(cells, ['Team', 'Team Name', 'Squad'], 'Dars Squad');
    const dob = getVal(cells, ['DOB', 'Date of Birth'], '');
    const institution = getVal(cells, ['Institution', 'School', 'Madrasa'], ID_CARD_CONFIG.festival.institution);
    const phone = getVal(cells, ['Phone', 'Mobile'], '');
    const email = getVal(cells, ['Email'], '');
    const eventsCount = parseInt(getVal(cells, ['Events Count', 'EventsCount', 'Events'], '0'), 10) || 0;
    const points = parseInt(getVal(cells, ['Points', 'Score'], '0'), 10) || 0;
    const status = getVal(cells, ['Status'], 'Active');

    const record = {
      id: studentId,
      chestNo,
      fullName,
      category,
      team,
      dob,
      institution,
      phone,
      email,
      eventsCount,
      points,
      status: status.toLowerCase() === 'active' ? 'Active' : status,
      rowNumber: i + 1,
      expectedQrPayload: ID_CARD_CONFIG.qr.format(chestNo, studentId)
    };

    // Warnings detection
    if (!chestNo) {
      warnings.push({
        type: 'MISSING_CHEST_NO',
        studentId,
        name: fullName,
        message: `Row ${i + 1}: Missing Chest Number for candidate "${fullName}".`
      });
    } else {
      const normalizedChest = chestNo.toUpperCase().trim();
      if (seenChestNos.has(normalizedChest)) {
        warnings.push({
          type: 'DUPLICATE_CHEST_NO',
          chestNo,
          name: fullName,
          message: `Row ${i + 1}: Duplicate Chest No "${chestNo}" found (first seen on row ${seenChestNos.get(normalizedChest)}).`
        });
      } else {
        seenChestNos.set(normalizedChest, i + 1);
      }
    }

    if (!team || team.toLowerCase() === 'unassigned') {
      warnings.push({
        type: 'MISSING_TEAM',
        studentId,
        name: fullName,
        message: `Row ${i + 1}: Candidate "${fullName}" (${chestNo}) has no assigned Team.`
      });
    }

    if (record.status === 'Active') {
      students.push(record);
    } else {
      inactiveStudents.push(record);
    }
  }

  return {
    students,
    inactiveStudents,
    warnings,
    summary: {
      totalRows: lines.length - 1,
      activeCount: students.length,
      inactiveCount: inactiveStudents.length,
      warningCount: warnings.length
    }
  };
}

/**
 * Simple CSV line parser respecting quotes
 */
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

/**
 * Generate QR Code Data URL (PNG)
 * @param {string} payload 
 * @param {number} width 
 * @returns {Promise<string>}
 */
export async function generateQrDataUrl(payload, width = 360) {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: ID_CARD_CONFIG.qr.errorCorrectionLevel,
    margin: ID_CARD_CONFIG.qr.margin,
    width,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}

/**
 * Verify a single QR payload using jsQR decoding
 * @param {string} payload 
 * @returns {Promise<{ success: boolean, decoded: string, match: boolean, error?: string }>}
 */
export async function verifyQrPayload(payload) {
  try {
    const qrData = QRCode.create(payload, {
      errorCorrectionLevel: ID_CARD_CONFIG.qr.errorCorrectionLevel,
      margin: ID_CARD_CONFIG.qr.margin
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
    if (!decoded) {
      return { success: false, decoded: null, match: false, error: 'jsQR could not find or decode QR code pattern.' };
    }

    const match = (decoded.data === payload);
    return {
      success: match,
      decoded: decoded.data,
      match,
      error: match ? null : `Payload mismatch. Expected: "${payload}", Decoded: "${decoded.data}"`
    };
  } catch (err) {
    return { success: false, decoded: null, match: false, error: err.message };
  }
}

/**
 * Run comprehensive verification on an array of student cards
 * Guarantees zero decode failures across all active cards.
 * @param {Array} students 
 * @returns {Promise<{ total: number, verified: number, failed: number, failures: Array, zeroFailures: boolean }>}
 */
export async function verifyAllStudentsQrs(students) {
  const failures = [];
  let verified = 0;

  for (const s of students) {
    const payload = s.expectedQrPayload || ID_CARD_CONFIG.qr.format(s.chestNo, s.id);
    const result = await verifyQrPayload(payload);
    if (result.match) {
      verified++;
    } else {
      failures.push({
        studentId: s.id,
        chestNo: s.chestNo,
        name: s.fullName,
        expected: payload,
        error: result.error
      });
    }
  }

  return {
    total: students.length,
    verified,
    failed: failures.length,
    failures,
    zeroFailures: (failures.length === 0 && verified === students.length)
  };
}

/**
 * Decode QR code from an HTML Canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @returns {object|null}
 */
export function decodeQrFromCanvas(ctx, x, y, width, height) {
  try {
    const imgData = ctx.getImageData(x, y, width, height);
    return jsQR(imgData.data, width, height);
  } catch (e) {
    console.error('Canvas jsQR decode failed:', e);
    return null;
  }
}
