import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9997;
const artifactDir = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1400,1100',
  '--no-sandbox',
  'http://localhost:5173/#previous'
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

  // Wait for Previous Edition page to stabilize
  await new Promise(r => setTimeout(r, 3000));

  // Scroll into view
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture Desktop View of 2K25 WhatsApp section
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_2k25_whatsapp_section.png`, Buffer.from(ss1.data, 'base64'));
  console.log('Saved verify_2k25_whatsapp_section.png');

  // 2. Capture Mobile View of WhatsApp section
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const ss_mobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_whatsapp_mobile_view.png`, Buffer.from(ss_mobile.data, 'base64'));
  console.log('Saved verify_whatsapp_mobile_view.png');

  ws.close();
  chrome.kill();
  console.log('2K25 Captures complete!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
