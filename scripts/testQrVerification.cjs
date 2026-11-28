const QRCode = require('qrcode');
const jsQR = require('jsqr');

async function testQrDecoder() {
  const tests = [
    'DLZ26|C-101|STU-1001',
    'DLZ26|C-147|STU-1047',
    'DLZ26|C-149|STU-1049'
  ];

  for (const payload of tests) {
    const qrData = QRCode.create(payload, {
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
    if (!decoded || decoded.data !== payload) {
      throw new Error(`Failed to decode ${payload}, got: ${decoded ? decoded.data : 'null'}`);
    }
    console.log(`Verified ${payload} -> Decoded: "${decoded.data}" (MATCH)`);
  }
}

testQrDecoder().catch(err => {
  console.error(err);
  process.exit(1);
});
