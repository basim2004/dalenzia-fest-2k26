import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9982;
const artifactDir = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1200',
  '--no-sandbox',
  `--user-data-dir=${artifactDir}/cdp_stages_${port}`,
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
  console.log('Connected to Chrome CDP WebSocket');

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Wait for React to render PreviousEditionPage
  for (let i = 0; i < 40; i++) {
    const res = await send('Runtime.evaluate', {
      expression: `!!document.getElementById('stagedesign')`
    });
    if (res && res.result && res.result.value) break;
    await new Promise(r => setTimeout(r, 250));
  }

  // Scroll to #stagedesign header and tabs
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('stagedesign');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture Header & Stage 01 Marrakech 3D
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_stage_01_marrakech_3d.png`, Buffer.from(ss1.data, 'base64'));
  console.log('Saved verify_stage_01_marrakech_3d.png');

  // Scroll slightly down to focus on viewer and bottom control dock
  await send('Runtime.evaluate', {
    expression: `
      window.scrollBy({ top: 380, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Camera Preset "ELEVATED"
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const elevatedBtn = buttons.find(b => b.textContent.trim() === 'ELEVATED');
      if (elevatedBtn) elevatedBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const ss1_angle = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_stage_01_marrakech_angle.png`, Buffer.from(ss1_angle.data, 'base64'));
  console.log('Saved verify_stage_01_marrakech_angle.png');

  // Switch to Stage 02 Meknes Tab
  await send('Runtime.evaluate', {
    expression: `
      const meknesBtn = document.querySelector('button[data-stage-id="stage-02"]');
      if (meknesBtn) meknesBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 2500));

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_stage_02_meknes_3d.png`, Buffer.from(ss2.data, 'base64'));
  console.log('Saved verify_stage_02_meknes_3d.png');

  // Click Camera Preset "RIGHT"
  await send('Runtime.evaluate', {
    expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const rightBtn = buttons.find(b => b.textContent.trim() === 'RIGHT');
      if (rightBtn) rightBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const ss2_angle = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_stage_02_meknes_angle.png`, Buffer.from(ss2_angle.data, 'base64'));
  console.log('Saved verify_stage_02_meknes_angle.png');

  // Toggle to "Original Photo" mode
  await send('Runtime.evaluate', {
    expression: `
      const photoBtn = document.querySelector('button[data-view-mode="photo"]');
      if (photoBtn) photoBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const ss_photo = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verify_stage_photo_compare.png`, Buffer.from(ss_photo.data, 'base64'));
  console.log('Saved verify_stage_photo_compare.png');

  ws.close();
  chrome.kill();
  console.log('Stage 3D Verification complete!');
}

run().catch(err => {
  console.error('Verification error:', err);
  chrome.kill();
});
