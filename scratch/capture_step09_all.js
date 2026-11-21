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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9600 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_posters_${port}`;
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
  // 1. Posters Dashboard
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/posters',
    outFile: 'step09_posters_dashboard.png',
    port: 9601
  });

  // 2. All Posters Gallery Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/posters',
    outFile: 'step09_posters_gallery.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const postersBtn = btns.find(b => b.textContent.includes('All Posters'));
      if (postersBtn) postersBtn.click();
    `,
    port: 9602
  });

  // 3. Design Templates Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/posters',
    outFile: 'step09_posters_templates.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const tmplBtn = btns.find(b => b.textContent.includes('Design Templates'));
      if (tmplBtn) tmplBtn.click();
    `,
    port: 9603
  });

  // 4. Mobile View of Posters
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/posters',
    outFile: 'step09_posters_mobile.png',
    width: 390,
    height: 844,
    port: 9604
  });

  // 5. Public Downloads Page
  await captureOne({
    targetUrl: 'http://localhost:5173/#downloads',
    outFile: 'step09_public_downloads.png',
    waitExtra: 3500, // wait for PageLoader exit animation
    port: 9605
  });

  // 6. Regression Suite Across Modules
  const regressions = [
    { targetUrl: 'http://localhost:5173/#admin', outFile: 'step09_dashboard_regression.png', port: 9610 },
    { targetUrl: 'http://localhost:5173/#admin/teams', outFile: 'step09_teams_regression.png', port: 9611 },
    { targetUrl: 'http://localhost:5173/#admin/students', outFile: 'step09_students_regression.png', port: 9612 },
    { targetUrl: 'http://localhost:5173/#admin/competitions', outFile: 'step09_competitions_regression.png', port: 9613 },
    { targetUrl: 'http://localhost:5173/#admin/results', outFile: 'step09_results_regression.png', port: 9614 },
    { targetUrl: 'http://localhost:5173/#admin/programme', outFile: 'step09_programmes_regression.png', port: 9615 },
    { targetUrl: 'http://localhost:5173/#admin/programme_guests', outFile: 'step09_guests_regression.png', port: 9616 },
    { targetUrl: 'http://localhost:5173/#admin/schedule', outFile: 'step09_schedule_regression.png', port: 9617 },
    { targetUrl: 'http://localhost:5173/#admin/gallery', outFile: 'step09_gallery_regression.png', port: 9618 },
    { targetUrl: 'http://localhost:5173/#admin/judges', outFile: 'step09_judges_regression.png', port: 9619 },
    { targetUrl: 'http://localhost:5173/#judge', outFile: 'step09_judge_portal_regression.png', port: 9620 }
  ];

  for (const reg of regressions) {
    await captureOne(reg);
  }

  console.log('\n========================================');
  console.log('ALL STEP 09 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
