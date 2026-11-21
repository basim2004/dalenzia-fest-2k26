import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9945;
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_nav_${port}`,
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

  // Wait 3 seconds for initial load
  await new Promise(r => setTimeout(r, 3000));

  const routes = [
    { hash: '#events', label: 'Events Page' },
    { hash: '#guests', label: 'Guests Page' },
    { hash: '#results', label: 'Results Page' },
    { hash: '#schedule', label: 'Schedule Page' },
    { hash: '#gallery', label: 'Gallery Page' },
    { hash: '#posters', label: 'Posters Page' },
    { hash: '#admin', label: 'Admin Portal Login' },
    { hash: '#convener', label: 'Convener Portal Login' },
    { hash: '#judge', label: 'Judge Portal Login' },
    { hash: '#teamleader', label: 'Team Leader Portal Login' },
    { hash: '#student', label: 'Student Portal Login' },
    { hash: '#stage', label: 'Stage Controller Portal Login' }
  ];

  for (const r of routes) {
    // Navigate via hash change
    await send('Runtime.evaluate', {
      expression: `window.location.hash = '${r.hash}'`
    });
    await new Promise(res => setTimeout(res, 1200));

    // Capture text
    const textRes = await send('Runtime.evaluate', {
      expression: `document.body.innerText.replace(/\\s+/g, ' ').slice(0, 300)`,
      returnByValue: true
    });

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = `scratch/view_${r.hash.replace('#', '')}.png`;
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    console.log(`[${r.label}] (${shot.data.length} bytes):`);
    console.log(`  -> ${textRes.result?.value?.slice(0, 140)}...\n`);
  }

  ws.close();
  chrome.kill();
}

run().catch(console.error);
