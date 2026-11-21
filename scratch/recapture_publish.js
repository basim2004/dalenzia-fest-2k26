import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9951;
const targetUrl = 'http://localhost:5173/#convener/results';
const outFile = 'convener_results_publish.png';
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1672,960',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_pub_${port}`,
  targetUrl
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
    } catch (e) {
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
  await new Promise(r => setTimeout(r, 2000));

  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const pubBtn = buttons.find(b => b.textContent.includes('Official Publishing'));
      if (pubBtn) pubBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const fullOut = basePath + outFile;
  fs.writeFileSync(fullOut, Buffer.from(data, 'base64'));
  console.log('Recaptured:', outFile, fs.statSync(fullOut).size, 'bytes');

  ws.close();
  chrome.kill();
}

run().catch(err => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
