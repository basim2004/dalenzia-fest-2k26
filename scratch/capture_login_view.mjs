import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

async function captureLogin() {
  const port = 9946;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${basePath}cdp_logout_test`,
    'http://localhost:5173/#teamleader'
  ]);

  try {
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
    await send('Runtime.evaluate', { 
      expression: `
        (function() {
          const btn = document.querySelector('button[title="Log Out"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign Out'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullOut = basePath + 'teamleader_login_view.png';
    fs.writeFileSync(fullOut, Buffer.from(data, 'base64'));
    console.log(`✓ Saved: teamleader_login_view.png (${fs.statSync(fullOut).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

captureLogin().catch(console.error);
