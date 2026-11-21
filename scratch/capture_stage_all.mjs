import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9965;
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_stage_${port}`,
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

  // Screenshot 1: Stage Controller Login Screen
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_controller_login.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_controller_login.png');

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

  // Screenshot 2: Stage Controller Dashboard
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_controller_dashboard.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_controller_dashboard.png');

  // Navigate to Live Random Draw Ceremony tab
  await send('Runtime.evaluate', {
    expression: `
      const navButtons = Array.from(document.querySelectorAll('button, a'));
      const drawTab = navButtons.find(b => b.textContent.includes('Live Random Draw') || b.textContent.includes('Draw Ceremony'));
      if (drawTab) drawTab.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 3: Live Random Draw Ceremony Arena
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_controller_draw.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_controller_draw.png');

  // Navigate to Participant Calling tab
  await send('Runtime.evaluate', {
    expression: `
      const navButtons = Array.from(document.querySelectorAll('button, a'));
      const callTab = navButtons.find(b => b.textContent.includes('Participant Calling') || b.textContent.includes('Calling Queue'));
      if (callTab) callTab.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 4: Participant Calling Queue
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_controller_calling.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_controller_calling.png');

  // Navigate to Live Stage Display screen (#stagedisplay)
  await send('Page.navigate', { url: 'http://localhost:5173/#stagedisplay' });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot 5: Live Stage Display LED Screen
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}stage_live_display.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved stage_live_display.png');

  // Navigate to Admin Panel to capture updated sidebar with all portals
  await send('Page.navigate', { url: 'http://localhost:5173/#admin' });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot 6: Admin Panel Sidebar with All Portals
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${basePath}admin_sidebar_all_portals.png`, Buffer.from(shot.data, 'base64'));
  console.log('Saved admin_sidebar_all_portals.png');

  ws.close();
  chrome.kill();
  console.log('🎉 ALL SCREENSHOTS SUCCESSFULLY CAPTURED!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
