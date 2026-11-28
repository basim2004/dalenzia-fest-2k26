/**
 * DALENZIA FEST 2K26 - Print-Ready PDF & Batch Export Service
 * 
 * Generates:
 * 1. Vector + 300+ DPI A3 Sheet PDF (3x7 = 21 cards per sheet, crop marks, margins, bleed)
 * 2. Individual 2x Master PNGs (2100 x 1200 px) named <ChestNo>_<FullName>.png
 * 3. Batch ZIP export of all 2x PNGs
 */

import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { ID_CARD_CONFIG } from '../config/idCardConfig';
import { renderStudentCardToCanvas } from './idCardCanvasRenderer';

/**
 * Generate Print-Ready PDF for ID Cards
 * @param {Array} students Active student roster
 * @param {object} options Layout configuration options
 * @param {function} onProgress Callback for export progress
 * @returns {Promise<jsPDF>}
 */
export async function generateIdCardsPdf(students, options = {}, onProgress = null) {
  if (!students || students.length === 0) {
    throw new Error('No active students selected for PDF generation.');
  }

  const presetKey = options.preset || 'A3_PORTRAIT';
  const layout = ID_CARD_CONFIG.sheets[presetKey] || ID_CARD_CONFIG.sheets.A3_PORTRAIT;

  const cardWidthMm = ID_CARD_CONFIG.dimensions.widthMm; // 88.9 mm
  const cardHeightMm = ID_CARD_CONFIG.dimensions.heightMm; // 50.8 mm
  const bleedMm = options.includeBleed ? ID_CARD_CONFIG.dimensions.bleedMm : 0; // 3 mm optional
  const gapMm = layout.gapMm; // 3 mm

  const orientation = layout.pageWidthMm > layout.pageHeightMm ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: [layout.pageWidthMm, layout.pageHeightMm],
    compress: true
  });

  const cols = layout.columns;
  const rows = layout.rows;
  const cardsPerPage = cols * rows;
  const totalCards = students.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  // Compute centered margins on sheet
  const totalGridWidthMm = cols * cardWidthMm + (cols - 1) * gapMm;
  const totalGridHeightMm = rows * cardHeightMm + (rows - 1) * gapMm;
  const startX = (layout.pageWidthMm - totalGridWidthMm) / 2;
  const startY = (layout.pageHeightMm - totalGridHeightMm) / 2;

  // Offscreen canvas for 300 DPI card rendering
  const canvas = document.createElement('canvas');

  let currentCardIndex = 0;

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage([layout.pageWidthMm, layout.pageHeightMm], orientation);
    }

    // Page Header / Print Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const headerTitle = `${ID_CARD_CONFIG.festival.title} 2K26 — CANDIDATE ID CARDS • SHEET ${page + 1} OF ${totalPages}`;
    doc.text(headerTitle, startX, startY - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    const printNote = 'Print at 100% scale (no scaling) on A3 300gsm Art Board • Trim along crop marks';
    doc.text(printNote, layout.pageWidthMm - startX, startY - 6, { align: 'right' });

    // Page Footer
    doc.setFontSize(6.5);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Generated from Official Dars Roster • ${ID_CARD_CONFIG.festival.institution} • Dates: ${ID_CARD_CONFIG.festival.dates}`,
      startX,
      layout.pageHeightMm - 8
    );

    // Place Cards on Grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (currentCardIndex >= totalCards) break;

        const student = students[currentCardIndex];
        const cardX = startX + c * (cardWidthMm + gapMm);
        const cardY = startY + r * (cardHeightMm + gapMm);

        if (onProgress) {
          onProgress({
            current: currentCardIndex + 1,
            total: totalCards,
            page: page + 1,
            totalPages,
            studentName: student.fullName
          });
        }

        // Render card to 2x canvas (high-res raster >= 300 DPI)
        await renderStudentCardToCanvas(canvas, student, { scale: 2 });
        const imgData = canvas.toDataURL('image/jpeg', 0.96);

        // Embed high-res card into PDF page
        doc.addImage(imgData, 'JPEG', cardX, cardY, cardWidthMm, cardHeightMm);

        // Draw Vector Crop Marks
        drawVectorCropMarks(doc, cardX, cardY, cardWidthMm, cardHeightMm, 4, 1.2);

        currentCardIndex++;
      }
    }
  }

  return doc;
}

/**
 * Draw Vector Crop Marks around card perimeter
 */
function drawVectorCropMarks(doc, x, y, w, h, len = 4, offset = 1.2) {
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.15); // Fine hairline cut mark

  // Top Left
  doc.line(x - offset - len, y, x - offset, y);
  doc.line(x, y - offset - len, x, y - offset);

  // Top Right
  doc.line(x + w + offset, y, x + w + offset + len, y);
  doc.line(x + w, y - offset - len, x + w, y - offset);

  // Bottom Left
  doc.line(x - offset - len, y + h, x - offset, y + h);
  doc.line(x, y + h + offset, x, y + h + offset + len);

  // Bottom Right
  doc.line(x + w + offset, y + h, x + w + offset + len, y + h);
  doc.line(x + w, y + h + offset, x + w, y + h + offset + len);
}

/**
 * Export all cards as individual 2x PNGs compressed inside a single ZIP file
 * @param {Array} students 
 * @param {function} onProgress 
 */
export async function exportAllCardsAsZip(students, onProgress = null) {
  const zip = new JSZip();
  const folder = zip.folder('Dalenzia_2K26_ID_Cards_PNGs');
  const canvas = document.createElement('canvas');

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) {
      onProgress({ current: i + 1, total: students.length, studentName: student.fullName });
    }

    await renderStudentCardToCanvas(canvas, student, { scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];

    const safeName = (student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\u0D00-\u0D7F]/g, '_');
    const fileName = `${student.chestNo || 'C-000'}_${safeName}.png`;
    folder.file(fileName, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DALENZIA_2K26_Student_ID_Cards_PNGs_${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
