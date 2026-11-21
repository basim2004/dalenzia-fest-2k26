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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9550 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_gallery_${port}`;
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
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise(res => ws.onopen = res);
    await send('Runtime.enable');
    await send('Page.enable');

    // Wait until root has content
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 300));
      const res = await send('Runtime.evaluate', {
        expression: 'document.getElementById("root")?.innerHTML?.length || 0'
      });
      if ((res.result?.value || 0) > 1000) break;
    }

    if (action) {
      console.log(`Executing action: ${action}`);
      await send('Runtime.evaluate', { expression: action });
      await new Promise(r => setTimeout(r, 1000));
    }

    await new Promise(r => setTimeout(r, waitExtra));

    const { data: base64Data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullOut = basePath + outFile;
    fs.writeFileSync(fullOut, Buffer.from(base64Data, 'base64'));
    console.log(`✓ Saved: ${outFile} (${fs.statSync(fullOut).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  // 1. Gallery Module Views
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/gallery',
    outFile: 'step10_gallery_desktop.png',
    port: 9551
  });

  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/gallery',
    outFile: 'step10_gallery_albums.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const albumsBtn = btns.find(b => b.textContent.includes('Albums Showcase'));
      if (albumsBtn) albumsBtn.click();
    `,
    port: 9552
  });

  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/gallery',
    outFile: 'step10_gallery_media.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const mediaBtn = btns.find(b => b.textContent.includes('All Media Vault'));
      if (mediaBtn) mediaBtn.click();
    `,
    port: 9553
  });

  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/gallery',
    outFile: 'step10_gallery_upload.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const uploadBtn = btns.find(b => b.textContent.includes('Media Upload Desk'));
      if (uploadBtn) uploadBtn.click();
    `,
    port: 9554
  });

  // Mobile Gallery View
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/gallery',
    outFile: 'step10_gallery_mobile.png',
    width: 390,
    height: 844,
    port: 9555
  });

  // Public Gallery View
  await captureOne({
    targetUrl: 'http://localhost:5173/#gallery',
    outFile: 'step10_public_gallery.png',
    waitExtra: 3500, // wait for page loader to dismiss
    port: 9556
  });

  // Regression Suite
  const regressions = [
    { targetUrl: 'http://localhost:5173/#admin', outFile: 'step10_dashboard_regression.png', port: 9560 },
    { targetUrl: 'http://localhost:5173/#admin/teams', outFile: 'step10_teams_regression.png', port: 9561 },
    { targetUrl: 'http://localhost:5173/#admin/students', outFile: 'step10_students_regression.png', port: 9562 },
    { targetUrl: 'http://localhost:5173/#admin/competitions', outFile: 'step10_competitions_regression.png', port: 9563 },
    { targetUrl: 'http://localhost:5173/#admin/results', outFile: 'step10_results_regression.png', port: 9564 },
    { targetUrl: 'http://localhost:5173/#admin/programme', outFile: 'step10_programmes_regression.png', port: 9565 },
    { targetUrl: 'http://localhost:5173/#admin/programme_guests', outFile: 'step10_guests_regression.png', port: 9566 },
    { targetUrl: 'http://localhost:5173/#admin/schedule', outFile: 'step10_schedule_regression.png', port: 9567 },
    { targetUrl: 'http://localhost:5173/#admin/judges', outFile: 'step10_judges_regression.png', port: 9568 },
    { targetUrl: 'http://localhost:5173/#judge', outFile: 'step10_judge_portal_regression.png', port: 9569 }
  ];

  for (const reg of regressions) {
    await captureOne(reg);
  }

  console.log('\n========================================');
  console.log('ALL STEP 10 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
