import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9998;
const artifactDir = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=430,932',
  '--no-sandbox',
  'http://localhost:5173/'
]);

function getJson(u) {
  return new Promise((res, rej) => {
    http.get(u, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

setTimeout(async () => {
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
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

  // Wait for page loader
  await new Promise(r => setTimeout(r, 3500));

  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_whatsapp_mobile_view.png`, Buffer.from(ss.data, 'base64'));
  console.log('Saved verify_whatsapp_mobile_view.png on mobile!');

  ws.close();
  chrome.kill();
}, 1000);
