const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ascii85 decoder
function decodeAscii85(str) {
  let clean = str.replace(/\s+/g, '');
  if (clean.startsWith('<~')) clean = clean.slice(2);
  if (clean.endsWith('~>')) clean = clean.slice(0, -2);

  const out = [];
  for (let i = 0; i < clean.length; ) {
    if (clean[i] === 'z') {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    const chunk = clean.slice(i, i + 5);
    i += chunk.length;
    let val = 0;
    const pad = 5 - chunk.length;
    const padded = chunk + 'u'.repeat(pad);
    for (let j = 0; j < 5; j++) {
      val = val * 85 + (padded.charCodeAt(j) - 33);
    }
    const b0 = (val >>> 24) & 0xff;
    const b1 = (val >>> 16) & 0xff;
    const b2 = (val >>> 8) & 0xff;
    const b3 = val & 0xff;
    const bytes = [b0, b1, b2, b3].slice(0, 4 - pad);
    out.push(...bytes);
  }
  return Buffer.from(out);
}

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: 6 = RGBA, 2 = RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image scanlines with filter byte 0
  const scanlineLen = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLen * height);
  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLen;
    rawData[rawOffset] = 0; // Filter: None
    rgbaBuffer.copy(rawData, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatCompressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatCompressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Load PDF
const pdfPath = path.join(__dirname, '../asset/DALENZIA_2K26_NUEVA_ERA_Brand_Guideline_Book_v2.pdf');
const buf = fs.readFileSync(pdfPath);
const str = buf.toString('latin1');

// Map objects: parse all objects into a dictionary
console.log('Parsing PDF objects...');
const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
const objects = new Map();
let m;
while ((m = objRegex.exec(str)) !== null) {
  const id = `${m[1]} ${m[2]} R`;
  const content = m[3];
  objects.set(id, { num: m[1], gen: m[2], raw: content });
}
console.log(`Parsed ${objects.size} PDF objects.`);

function decodeStream(rawObj) {
  const streamIdx = rawObj.indexOf('stream');
  if (streamIdx === -1) return null;
  const header = rawObj.slice(0, streamIdx);
  // find start of binary data after stream\r?\n
  let dataStart = streamIdx + 6;
  if (rawObj[dataStart] === '\r') dataStart++;
  if (rawObj[dataStart] === '\n') dataStart++;

  const endIdx = rawObj.lastIndexOf('endstream');
  if (endIdx === -1) return null;

  let streamBuf = Buffer.from(rawObj.slice(dataStart, endIdx), 'latin1');

  // Check filters
  const hasA85 = header.includes('/ASCII85Decode');
  const hasFlate = header.includes('/FlateDecode');

  if (hasA85) {
    streamBuf = decodeAscii85(streamBuf.toString('latin1'));
  }
  if (hasFlate) {
    try {
      streamBuf = zlib.inflateSync(streamBuf);
    } catch (e) {
      console.warn('Inflate error:', e.message);
      return null;
    }
  }
  return { header, data: streamBuf };
}

// Process and extract target images
const targets = [
  { name: 'botanical_vine', objId: '20 0 R', smaskId: '21 0 R', w: 619, h: 1475 },
  { name: 'nueva_era_logo_full', objId: '22 0 R', smaskId: '23 0 R', w: 1868, h: 674 },
  { name: 'golden_hourglass', objId: '24 0 R', smaskId: '25 0 R', w: 776, h: 1384 },
  { name: 'lamp_books', objId: '26 0 R', smaskId: '27 0 R', w: 866, h: 1269 },
  { name: 'wave_lines', objId: '28 0 R', smaskId: '29 0 R', w: 2146, h: 140 },
  { name: 'mandala', objId: '30 0 R', smaskId: '31 0 R', w: 1150, h: 1175 },
  { name: 'pixel_world_map', objId: '32 0 R', smaskId: '33 0 R', w: 2335, h: 478 },
  { name: 'paper_plane', objId: '34 0 R', smaskId: '35 0 R', w: 1330, h: 904 },
  { name: 'arch_portal', objId: '42 0 R', smaskId: '43 0 R', w: 1024, h: 1536 },
  { name: 'arch_portal_alt', objId: '44 0 R', smaskId: '45 0 R', w: 1024, h: 1536 },
  { name: 'festival_title_banner', objId: '54 0 R', smaskId: null, w: 725, h: 2170 },
  { name: 'blank_banner_panel', objId: '55 0 R', smaskId: null, w: 725, h: 2170 },
];

const outDir = path.join(__dirname, '../public/assets');

for (const t of targets) {
  const obj = objects.get(t.objId);
  if (!obj) {
    console.warn(`Object ${t.objId} not found!`);
    continue;
  }
  const decodedColor = decodeStream(obj.raw);
  if (!decodedColor) {
    console.warn(`Failed to decode color for ${t.name}`);
    continue;
  }

  let alphaData = null;
  if (t.smaskId) {
    const smaskObj = objects.get(t.smaskId);
    if (smaskObj) {
      const decodedMask = decodeStream(smaskObj.raw);
      if (decodedMask) {
        alphaData = decodedMask.data;
      }
    }
  }

  const numPixels = t.w * t.h;
  const rgba = Buffer.alloc(numPixels * 4);
  const colorBytes = decodedColor.data;

  console.log(`Processing ${t.name} (${t.w}x${t.h}): colorLen=${colorBytes.length}, alphaLen=${alphaData ? alphaData.length : 0}`);

  // check if color is RGB (3 bytes per pixel) or CMYK (4 bytes per pixel) or Grayscale (1 byte)
  const isCmyk = colorBytes.length === numPixels * 4;
  const isRgb = colorBytes.length === numPixels * 3;
  const isGray = colorBytes.length === numPixels;

  for (let i = 0; i < numPixels; i++) {
    let r, g, b;
    if (isRgb) {
      r = colorBytes[i * 3];
      g = colorBytes[i * 3 + 1];
      b = colorBytes[i * 3 + 2];
    } else if (isCmyk) {
      const c = colorBytes[i * 4] / 255;
      const m = colorBytes[i * 4 + 1] / 255;
      const y = colorBytes[i * 4 + 2] / 255;
      const k = colorBytes[i * 4 + 3] / 255;
      r = Math.round(255 * (1 - c) * (1 - k));
      g = Math.round(255 * (1 - m) * (1 - k));
      b = Math.round(255 * (1 - y) * (1 - k));
    } else if (isGray) {
      r = g = b = colorBytes[i];
    } else {
      r = colorBytes[i * 3] || 0;
      g = colorBytes[i * 3 + 1] || 0;
      b = colorBytes[i * 3 + 2] || 0;
    }

    const a = alphaData ? alphaData[i] : 255;

    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = a;
  }

  const pngBuf = makePng(t.w, t.h, rgba);
  const outPath = path.join(outDir, `${t.name}.png`);
  fs.writeFileSync(outPath, pngBuf);
  console.log(`Successfully wrote ${t.name}.png (${pngBuf.length} bytes)`);
}
