import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import sharp from 'sharp';
import jsQR from 'jsqr';

const port = 9999;
const artifactDir = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d';

// Verify both QR images with jsQR
async function verifyQRFiles() {
  const qr1 = await sharp('public/assets/instagram/qr_dalenzia_official.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const res1 = jsQR(new Uint8ClampedArray(qr1.data), qr1.info.width, qr1.info.height);
  console.log('QR 1 (Dalenzia Official):', res1 ? res1.data : 'FAILED');

  const qr2 = await sharp('public/assets/instagram/qr_dalailusunna_ayr.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const res2 = jsQR(new Uint8ClampedArray(qr2.data), qr2.info.width, qr2.info.height);
  console.log('QR 2 (Dalailusunna Ayr):', res2 ? res2.data : 'FAILED');

  if (!res1 || res1.data !== 'https://www.instagram.com/_.dalenzia_?jplx=MTc4bnBxMnRnYWtrcg==') {
    throw new Error('QR 1 validation failed');
  }
  if (!res2 || res2.data !== 'https://www.instagram.com/_dalailusunna_ayr?hvrq=dzgwcTB2ZWE1NjB2') {
    throw new Error('QR 2 validation failed');
  }
  console.log('Both distinct QR codes validated successfully!');
}

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1400,1100',
  '--no-sandbox',
  `--user-data-dir=${artifactDir}/cdp_insta_${port}`,
  'http://localhost:5173/#instagram'
]);

function getJson(u) {
  return new Promise((res, rej) => {
    http.get(u, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

async function run() {
  await verifyQRFiles();

  let pages = null;
  for (let i = 0; i < 30; i++) {
    try {
      pages = await getJson(`http://127.0.0.1:${port}/json/list`);
      if (pages && pages.length > 0) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Wait for PageLoader to dismiss
  await new Promise(r => setTimeout(r, 3500));

  // Scroll to #instagram
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('instagram');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Desktop View of Instagram Showcase (both accounts side by side)
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_instagram_desktop_showcase.png`, Buffer.from(ss1.data, 'base64'));
  console.log('Saved verify_instagram_desktop_showcase.png');

  // 2. Click to enlarge QR modal on Dalenzia Official
  await send('Runtime.evaluate', {
    expression: `
      const previewBtns = Array.from(document.querySelectorAll('button'));
      const btn = previewBtns.find(b => b.textContent.includes('Preview'));
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const ss_modal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_instagram_qr_modal.png`, Buffer.from(ss_modal.data, 'base64'));
  console.log('Saved verify_instagram_qr_modal.png');

  // Close modal
  await send('Runtime.evaluate', {
    expression: `
      const closeBtn = document.querySelector('.fixed button');
      if (closeBtn) closeBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Test Mobile Viewport (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('instagram');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const ss_mobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_instagram_mobile_view.png`, Buffer.from(ss_mobile.data, 'base64'));
  console.log('Saved verify_instagram_mobile_view.png');

  ws.close();
  chrome.kill();
  console.log('Instagram Showcase verification complete!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
