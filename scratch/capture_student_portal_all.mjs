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

async function captureOne({ targetUrl, outFile, width = 1440, height = 900, action = null, waitExtra = 1500, port = 9951 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_stu_${port}`;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${profileDir}`,
    targetUrl
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
    if (!pages || !pages[0]) throw new Error('No page found');

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
    await send('DOM.enable');

    await new Promise(r => setTimeout(r, waitExtra));

    if (action) {
      await action(send);
      await new Promise(r => setTimeout(r, 1200));
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullOut = basePath + outFile;
    fs.writeFileSync(fullOut, Buffer.from(data, 'base64'));
    console.log(`✓ Saved: ${outFile} (${fs.statSync(fullOut).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  console.log('STARTING STUDENT PORTAL SCREENSHOT CAPTURES...');

  // 1. Student Dashboard (Logged in as Ahmad Rayan C-101)
  await captureOne({
    targetUrl: 'http://localhost:5173/#student',
    outFile: 'student_dashboard_view.png',
    port: 9951
  });

  // 2. Student Digital ID Card
  await captureOne({
    targetUrl: 'http://localhost:5173/#student/idcard',
    outFile: 'student_idcard_badge.png',
    port: 9952
  });

  // 3. Student Competitions
  await captureOne({
    targetUrl: 'http://localhost:5173/#student/competitions',
    outFile: 'student_competitions_view.png',
    port: 9953
  });

  // 4. Student Results & Laurels
  await captureOne({
    targetUrl: 'http://localhost:5173/#student/results',
    outFile: 'student_results_view.png',
    port: 9954
  });

  // 5. Admin Sidebar Showing all 4 Portals
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin',
    outFile: 'admin_sidebar_with_all_portals.png',
    port: 9955,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          (function() {
            const inputs = document.querySelectorAll('input');
            if (inputs.length >= 2) {
              inputs[0].value = 'admin@dalenziafest.in';
              inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              inputs[1].value = 'admin2k26';
              inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
              const submit = document.querySelector('button[type="submit"]');
              if (submit) submit.click();
            }
          })()
        `
      });
    }
  });

  console.log('ALL STUDENT PORTAL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch(console.error);
