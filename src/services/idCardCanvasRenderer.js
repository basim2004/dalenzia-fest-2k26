/**
 * DALENZIA FEST 2K26 - High Fidelity ID Card Canvas Renderer
 * 
 * Renders print-ready ID cards (1050x600 px preview, 2100x1200 px 2x master)
 * Strictly adheres to Brand Guidelines:
 * - Crimson #A91F35, Gold #E6A916, Cream #F7F3E9, White #FFFFFF
 * - NUEVA ERA reverse logo with full clear space
 * - Large readable participant block with Chest No badge
 * - White rounded QR container with "Scan for verification"
 * - White footer strip with Dars logo, address, phone & venue
 * - No DOB, phone, email, or points on card front
 */

import QRCode from 'qrcode';
import { ID_CARD_CONFIG } from '../config/idCardConfig';

// Pre-load image cache to optimize batch rendering
const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      // Return null rather than failing completely so rendering continues with fallback
      console.warn(`Could not load image asset: ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

function hasMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

/**
 * Render single ID card to an HTML5 Canvas
 * @param {HTMLCanvasElement} canvas 
 * @param {object} student 
 * @param {object} options 
 */
export async function renderStudentCardToCanvas(canvas, student, options = {}) {
  const scale = options.scale || 1; // 1 for 1050x600, 2 for 2100x1200
  const width = ID_CARD_CONFIG.dimensions.previewWidthPx * scale;
  const height = ID_CARD_CONFIG.dimensions.previewHeightPx * scale;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(scale, scale);

  // 1. Background: Deep Crimson gradient with rich luxury texture
  const bgGrad = ctx.createLinearGradient(0, 0, 1050, 600);
  bgGrad.addColorStop(0, '#8E1729');
  bgGrad.addColorStop(0.5, '#A91F35');
  bgGrad.addColorStop(1, '#6F101E');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1050, 600);

  // Subtle decorative borders (0.5mm equivalent: ~2px)
  ctx.strokeStyle = '#E6A916';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(14, 14, 1050 - 28, 600 - 28);

  ctx.strokeStyle = 'rgba(230, 169, 22, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, 1050 - 36, 600 - 36);

  // 2. Load decorative brand assets
  const [nuevaEraImg, darsLogoImg, mandalaImg, waveLinesImg, pixelSquaresImg] = await Promise.all([
    loadImage(ID_CARD_CONFIG.assets.nuevaEraReverse),
    loadImage(ID_CARD_CONFIG.assets.darsLogo),
    loadImage(ID_CARD_CONFIG.assets.mandala),
    loadImage(ID_CARD_CONFIG.assets.waveLines),
    loadImage(ID_CARD_CONFIG.assets.pixelSquares)
  ]);

  // Mandala in top-right background (subtle watermark opacity 0.08)
  if (mandalaImg) {
    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.drawImage(mandalaImg, 580, -120, 520, 520);
    ctx.restore();
  }

  // Wave lines subtle decorative strip near bottom
  if (waveLinesImg) {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.drawImage(waveLinesImg, 30, 440, 990, 40);
    ctx.restore();
  }

  // Pixel squares cluster in top right corner
  if (pixelSquaresImg) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(pixelSquaresImg, 960, 26, 48, 44);
    ctx.restore();
  }

  // 3. Header Area:
  // Top-left: NUEVA ERA Reverse Logo with full clear space (x = hourglass width)
  if (nuevaEraImg) {
    // Official aspect ratio: 1110 x 414 -> ratio ~ 2.68
    const logoW = 200;
    const logoH = logoW / (1110 / 414);
    ctx.drawImage(nuevaEraImg, 40, 36, logoW, logoH);
  } else {
    // Fallback vector typographic representation
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px "Poppins", sans-serif';
    ctx.fillText('NUEVA ERA', 40, 68);
  }

  // Title block beside logo
  ctx.save();
  ctx.fillStyle = '#E6A916';
  ctx.font = '700 13px "Poppins", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('DALENZIA FEST 2K26', 265, 52);

  ctx.fillStyle = '#F7F3E9';
  ctx.font = '500 11px "Poppins", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(`${ID_CARD_CONFIG.festival.edition.toUpperCase()} • ${ID_CARD_CONFIG.festival.dates}`, 265, 72);

  // Gold dividing hairline
  ctx.strokeStyle = '#E6A916';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(265, 84);
  ctx.lineTo(680, 84);
  ctx.stroke();
  ctx.restore();

  // 4. Participant Block (Hero area on the left)
  const isMal = hasMalayalam(student.fullName);
  const nameFont = isMal 
    ? '"Noto Sans Malayalam", "Poppins", sans-serif'
    : '"Poppins", sans-serif';

  // Dynamic font sizing for long names
  let nameFontSize = 38;
  const nameLen = (student.fullName || '').length;
  if (nameLen > 30) nameFontSize = 26;
  else if (nameLen > 22) nameFontSize = 30;
  else if (nameLen > 16) nameFontSize = 34;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${nameFontSize}px ${nameFont}`;
  
  // Text wrapping for long names
  const maxNameWidth = 620;
  const words = (student.fullName || 'Candidate').split(' ');
  let line = '';
  let lineY = 160;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxNameWidth && n > 0 && lineCount === 0) {
      ctx.fillText(line.trim(), 42, lineY);
      line = words[n] + ' ';
      lineY += (nameFontSize + 6);
      lineCount++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 42, lineY);
  ctx.restore();

  // Participant Metadata (Team, Category, Chest No)
  const metaY = Math.max(lineY + 45, 235);

  // Chest No Badge (Gold bordered rounded badge, high contrast)
  ctx.save();
  const chestText = student.chestNo || 'C-000';
  ctx.font = '900 24px "Poppins", "DM Serif Display", sans-serif';
  const chestWidth = ctx.measureText(chestText).width + 36;
  const badgeH = 46;

  // Badge background & border
  drawRoundedRect(ctx, 42, metaY - 30, chestWidth, badgeH, 12);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#E6A916';
  ctx.stroke();

  // Badge label & value
  ctx.fillStyle = '#E6A916';
  ctx.font = '700 9px "Poppins", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('CHEST NO', 52, metaY - 14);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 22px "Poppins", "DM Serif Display", sans-serif';
  ctx.fillText(chestText, 52, metaY + 9);
  ctx.restore();

  // Team & Category Details beside Chest Badge
  ctx.save();
  const detailX = 42 + chestWidth + 24;

  // Team pill
  ctx.fillStyle = '#F7F3E9';
  ctx.font = '600 13px "Poppins", sans-serif';
  ctx.fillText('TEAM', detailX, metaY - 12);

  ctx.fillStyle = '#E6A916';
  ctx.font = '800 20px "Poppins", sans-serif';
  ctx.fillText((student.team || 'Dazzlers').toUpperCase(), detailX, metaY + 9);

  // Category
  const catX = detailX + 175;
  ctx.fillStyle = '#F7F3E9';
  ctx.font = '600 13px "Poppins", sans-serif';
  ctx.fillText('CATEGORY', catX, metaY - 12);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 18px "Poppins", sans-serif';
  ctx.fillText(student.category || 'Senior', catX, metaY + 8);

  ctx.restore();

  // Candidate ID caption
  ctx.save();
  ctx.fillStyle = 'rgba(247, 243, 233, 0.7)';
  ctx.font = '500 11px "Poppins", monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText(`OFFICIAL STAGE ENTRY PASS • ID: ${student.id}`, 42, metaY + 54);
  ctx.restore();

  // 5. Right side: QR Code Container (Pure White Rounded Panel)
  const qrPanelX = 730;
  const qrPanelY = 56;
  const qrPanelW = 275;
  const qrPanelH = 370;

  // White panel shadow & background
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, qrPanelX, qrPanelY, qrPanelW, qrPanelH, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Gold accent border around panel
  ctx.save();
  drawRoundedRect(ctx, qrPanelX, qrPanelY, qrPanelW, qrPanelH, 20);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#E6A916';
  ctx.stroke();
  ctx.restore();

  // Generate QR Matrix & Draw to canvas
  const qrPayload = student.expectedQrPayload || ID_CARD_CONFIG.qr.format(student.chestNo, student.id);
  const qrData = QRCode.create(qrPayload, {
    errorCorrectionLevel: ID_CARD_CONFIG.qr.errorCorrectionLevel,
    margin: ID_CARD_CONFIG.qr.margin
  });

  const qrBoxSize = 225; // 225x225 inside 275x370 panel
  const qrX = qrPanelX + (qrPanelW - qrBoxSize) / 2;
  const qrY = qrPanelY + 24;

  const modulesCount = qrData.modules.size;
  const modPixel = qrBoxSize / modulesCount;

  ctx.fillStyle = '#000000';
  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      if (qrData.modules.get(c, r)) {
        ctx.fillRect(qrX + c * modPixel, qrY + r * modPixel, modPixel + 0.3, modPixel + 0.3);
      }
    }
  }

  // QR Caption: "Scan for verification"
  ctx.save();
  ctx.fillStyle = '#1C1917';
  ctx.font = '700 13px "Poppins", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ID_CARD_CONFIG.qr.caption, qrPanelX + qrPanelW / 2, qrY + qrBoxSize + 34);

  // Security Verification Tag
  ctx.fillStyle = '#A91F35';
  ctx.font = '600 10px "Poppins", monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText(student.chestNo ? `VERIFIED • ${student.chestNo}` : 'STAGE PASS', qrPanelX + qrPanelW / 2, qrY + qrBoxSize + 56);
  ctx.restore();

  // 6. Footer Strip (Pure White Rounded Container at Bottom)
  const footX = 30;
  const footY = 475;
  const footW = 990;
  const footH = 92;

  // White footer container with soft shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;
  drawRoundedRect(ctx, footX, footY, footW, footH, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Footer top hairline
  ctx.save();
  drawRoundedRect(ctx, footX, footY, footW, footH, 16);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#E6A916';
  ctx.stroke();
  ctx.restore();

  // Dars Circular Logo in Footer
  const logoBoxX = footX + 16;
  const logoBoxY = footY + (footH - 64) / 2;
  if (darsLogoImg) {
    ctx.drawImage(darsLogoImg, logoBoxX, logoBoxY, 64, 64);
  } else {
    // Elegant fallback emblem
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoBoxX + 32, logoBoxY + 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#A91F35';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DD', logoBoxX + 32, logoBoxY + 38);
    ctx.restore();
  }

  // Footer Institution & Address Text
  ctx.save();
  ctx.fillStyle = '#A91F35';
  ctx.font = '800 15px "Poppins", sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText(ID_CARD_CONFIG.festival.institution, logoBoxX + 80, footY + 32);

  ctx.fillStyle = '#44403C';
  ctx.font = '600 10.5px "Poppins", sans-serif';
  ctx.fillText(ID_CARD_CONFIG.festival.subText, logoBoxX + 80, footY + 52);

  // Venue line at bottom
  ctx.fillStyle = '#78716C';
  ctx.font = '500 9.5px "Poppins", sans-serif';
  ctx.fillText(`Venue: ${ID_CARD_CONFIG.festival.venue}`, logoBoxX + 80, footY + 70);
  ctx.restore();

  ctx.restore(); // Restore initial save
}

/**
 * Helper to draw rounded rectangle
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
