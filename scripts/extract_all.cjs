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
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const scanlineLen = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLen * height);
  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLen;
    rawData[rawOffset] = 0;
    rgbaBuffer.copy(rawData, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatCompressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatCompressed);
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

const pdfPath = path.join(__dirname, '../asset/DALENZIA_2K26_NUEVA_ERA_Brand_Guideline_Book_v2.pdf');
const buf = fs.readFileSync(pdfPath);
const str = buf.toString('latin1');

const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
const objects = new Map();
let m;
while ((m = objRegex.exec(str)) !== null) {
  const id = `${m[1]} ${m[2]} R`;
  objects.set(id, m[3]);
}

function decodeStream(rawObj) {
  const streamIdx = rawObj.indexOf('stream');
  if (streamIdx === -1) return null;
  const header = rawObj.slice(0, streamIdx);
  let dataStart = streamIdx + 6;
  if (rawObj[dataStart] === '\r') dataStart++;
  if (rawObj[dataStart] === '\n') dataStart++;

  const endIdx = rawObj.lastIndexOf('endstream');
  if (endIdx === -1) return null;

  let streamBuf = Buffer.from(rawObj.slice(dataStart, endIdx), 'latin1');

  const hasA85 = header.includes('/ASCII85Decode');
  const hasFlate = header.includes('/FlateDecode');

  if (hasA85) {
    streamBuf = decodeAscii85(streamBuf.toString('latin1'));
  }
  if (hasFlate) {
    try {
      streamBuf = zlib.inflateSync(streamBuf);
    } catch (e) {
      return null;
    }
  }
  return { header, data: streamBuf };
}

const outDir = path.join(__dirname, '../public/assets/extracted_all');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const [id, raw] of objects.entries()) {
  if (!raw.includes('/Subtype /Image')) continue;
  const wMatch = raw.match(/\/Width\s+(\d+)/);
  const hMatch = raw.match(/\/Height\s+(\d+)/);
  if (!wMatch || !hMatch) continue;
  const w = parseInt(wMatch[1]);
  const h = parseInt(hMatch[1]);
  const smaskMatch = raw.match(/\/SMask\s+(\d+\s+\d+\s+R)/);

  // If this object is itself a mask for something else, we don't need to dump it standalone if it's 1-byte grayscale
  const decoded = decodeStream(raw);
  if (!decoded) continue;

  let alphaData = null;
  if (smaskMatch) {
    const smaskObj = objects.get(smaskMatch[1]);
    if (smaskObj) {
      const decodedMask = decodeStream(smaskObj);
      if (decodedMask) alphaData = decodedMask.data;
    }
  }

  const numPixels = w * h;
  const colorBytes = decoded.data;
  if (colorBytes.length !== numPixels * 3 && colorBytes.length !== numPixels * 4 && colorBytes.length !== numPixels) {
    continue;
  }

  const rgba = Buffer.alloc(numPixels * 4);
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
    } else {
      r = g = b = colorBytes[i];
    }
    const a = alphaData ? alphaData[i] : 255;
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = a;
  }

  const png = makePng(w, h, rgba);
  const cleanId = id.replace(/\s+/g, '_');
  const filename = path.join(outDir, `img_${cleanId}_${w}x${h}.png`);
  fs.writeFileSync(filename, png);
  console.log(`Saved ${filename} (${png.length} bytes)`);
}
