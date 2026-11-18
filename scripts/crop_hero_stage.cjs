const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// PNG Decoder & Cropper
function parsePng(buffer) {
  let offset = 8; // skip signature
  let width, height, dataChunks = [];

  while (offset < buffer.length) {
    const len = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + len);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      dataChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }

  const uncompressed = zlib.inflateSync(Buffer.concat(dataChunks));
  return { width, height, raw: uncompressed };
}

// CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
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
function encodePng(width, height, rgbaBuffer) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const scanlineLen = width * 4 + 1;
  const raw = Buffer.alloc(scanlineLen * height);
  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLen;
    raw[rawOffset] = 0;
    rgbaBuffer.copy(raw, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(raw));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

try {
  const srcPath = path.join(__dirname, '../public/assets/models/Dalenzia Fest Nueva Era Hero Banner.png');
  const buf = fs.readFileSync(srcPath);
  const png = parsePng(buf);
  console.log(`Original Hero Banner size: ${png.width}x${png.height}`);

  // De-filter raw scanlines (assuming filter 0 or let's handle RGBA 8-bit)
  // For uncompressed, each scanline has 1 byte filter + width*4 bytes
  const srcScanline = png.width * 4 + 1;
  
  // Crop the right portion: from x = 650 to width, from y = 120 to height - 120
  const cropX = Math.floor(png.width * 0.44);
  const cropY = Math.floor(png.height * 0.12);
  const cropW = png.width - cropX;
  const cropH = png.height - cropY - Math.floor(png.height * 0.14);

  console.log(`Cropping to ${cropW}x${cropH} from (${cropX}, ${cropY})`);

  // To de-filter properly:
  const reconstructed = Buffer.alloc(png.width * png.height * 4);
  for (let y = 0; y < png.height; y++) {
    const filter = png.raw[y * srcScanline];
    const srcRow = png.raw.subarray(y * srcScanline + 1, (y + 1) * srcScanline);
    const destRowOffset = y * png.width * 4;

    for (let x = 0; x < png.width * 4; x++) {
      let val = srcRow[x];
      const a = x >= 4 ? reconstructed[destRowOffset + x - 4] : 0;
      const b = y > 0 ? reconstructed[(y - 1) * png.width * 4 + x] : 0;
      const c = (x >= 4 && y > 0) ? reconstructed[(y - 1) * png.width * 4 + x - 4] : 0;

      if (filter === 1) { // Sub
        val = (val + a) & 0xff;
      } else if (filter === 2) { // Up
        val = (val + b) & 0xff;
      } else if (filter === 3) { // Average
        val = (val + Math.floor((a + b) / 2)) & 0xff;
      } else if (filter === 4) { // Paeth
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        val = (val + pr) & 0xff;
      }
      reconstructed[destRowOffset + x] = val;
    }
  }

  // Now extract crop
  const croppedRgba = Buffer.alloc(cropW * cropH * 4);
  for (let cy = 0; cy < cropH; cy++) {
    const sy = cropY + cy;
    const srcOffset = sy * png.width * 4 + cropX * 4;
    const destOffset = cy * cropW * 4;
    reconstructed.copy(croppedRgba, destOffset, srcOffset, srcOffset + cropW * 4);
  }

  const outBuf = encodePng(cropW, cropH, croppedRgba);
  fs.writeFileSync(path.join(__dirname, '../public/assets/hero_3d_stage.png'), outBuf);
  console.log(`Saved hero_3d_stage.png (${outBuf.length} bytes)`);

} catch (err) {
  console.error('Crop error:', err);
}
