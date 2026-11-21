import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9915;
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_adm_${port}`,
  'http://localhost:5173/#admin'
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

  await send('Runtime.evaluate', { expression: `window.location.hash = '#admin'` });
  await new Promise(r => setTimeout(r, 2500));

  // Perform login on Admin portal
  const loginRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) {
        btn.click();
        return 'BUTTON_CLICKED';
      }
      return 'BUTTON_NOT_FOUND';
    })()`,
    returnByValue: true
  });
  console.log('Login attempt result:', loginRes.result?.value);

  await new Promise(r => setTimeout(r, 2000));

  const textRes = await send('Runtime.evaluate', {
    expression: `document.body.innerText.replace(/\\s+/g, ' ').slice(0, 500)`,
    returnByValue: true
  });
  console.log('ADMIN DASHBOARD TEXT:\n', textRes.result?.value);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/view_admin_dashboard_clean.png', Buffer.from(shot.data, 'base64'));
  console.log('Captured scratch/view_admin_dashboard_clean.png');

  ws.close();
  chrome.kill();
}

run().catch(console.error);
