import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9975;
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_fix_${port}`,
  'http://localhost:5173/#stage'
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

  if (!pages || !pages[0]) {
    console.error('No chrome pages found');
    chrome.kill();
    return;
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

  // Perform login as Stage 01 Controller (controller1 / stage2k26)
  await send('Runtime.evaluate', {
    expression: `
      const inputs = Array.from(document.querySelectorAll('input'));
      if (inputs[0]) {
        inputs[0].value = 'controller1';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = 'stage2k26';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    `
  });

  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Stage Dashboard (with Dashboard tab highlighted in golden yellow!)
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_dashboard_fixed.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_dashboard_fixed.png');

  // Click on "Stage Competitions" tab
  await send('Runtime.evaluate', {
    expression: `
      const navButtons = Array.from(document.querySelectorAll('button'));
      const compBtn = navButtons.find(b => b.textContent.includes('Stage Competitions'));
      if (compBtn) compBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 2: Stage Competitions Tab
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_competitions_fixed.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_competitions_fixed.png');

  // Click on "Live Random Code Draw" tab
  await send('Runtime.evaluate', {
    expression: `
      const navButtons = Array.from(document.querySelectorAll('button'));
      const drawBtn = navButtons.find(b => b.textContent.includes('Live Random Code Draw'));
      if (drawBtn) drawBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 3: Live Random Code Draw Tab
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_draw_fixed.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_draw_fixed.png');

  ws.close();
  chrome.kill();
  console.log('🎉 VERIFICATION SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
