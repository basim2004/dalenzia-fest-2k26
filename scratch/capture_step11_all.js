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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9700 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_step11_${port}`;
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
      console.log(`Executing action: ${action.trim().slice(0, 60)}...`);
      await send('Runtime.evaluate', { expression: action });
      await new Promise(r => setTimeout(r, 1200));
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
  console.log('STARTING STEP 11 VISUAL CAPTURE & REGRESSION SUITE...');

  // 1. Announcements Dashboard Overview
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/announcements',
    outFile: 'step11_announcements_dashboard.png',
    port: 9701
  });

  // 2. All Announcements Tab (Cards Grid)
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/announcements',
    outFile: 'step11_announcements_list.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const listBtn = btns.find(b => b.textContent.includes('All Announcements'));
      if (listBtn) listBtn.click();
    `,
    port: 9702
  });

  // 3. Urgent Flash Alerts Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/announcements',
    outFile: 'step11_announcements_urgent.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const urgentBtn = btns.find(b => b.textContent.includes('Urgent Flash Alerts'));
      if (urgentBtn) urgentBtn.click();
    `,
    port: 9703
  });

  // 4. Compose Announcement Modal
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/announcements',
    outFile: 'step11_announcements_compose_modal.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const composeBtn = btns.find(b => b.textContent.includes('Compose Circular') || b.textContent.includes('New Circular'));
      if (composeBtn) composeBtn.click();
    `,
    port: 9704
  });

  // 5. Mobile View of Announcements
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/announcements',
    outFile: 'step11_announcements_mobile.png',
    width: 390,
    height: 844,
    port: 9705
  });

  // 6. Regression Suite Across Modules
  const regressions = [
    { targetUrl: 'http://localhost:5173/#admin', outFile: 'step11_dashboard_regression.png', port: 9710 },
    { targetUrl: 'http://localhost:5173/#admin/teams', outFile: 'step11_teams_regression.png', port: 9711 },
    { targetUrl: 'http://localhost:5173/#admin/students', outFile: 'step11_students_regression.png', port: 9712 },
    { targetUrl: 'http://localhost:5173/#admin/competitions', outFile: 'step11_competitions_regression.png', port: 9713 },
    { targetUrl: 'http://localhost:5173/#admin/results', outFile: 'step11_results_regression.png', port: 9714 },
    { targetUrl: 'http://localhost:5173/#admin/programme', outFile: 'step11_programmes_regression.png', port: 9715 },
    { targetUrl: 'http://localhost:5173/#admin/programme_guests', outFile: 'step11_guests_regression.png', port: 9716 },
    { targetUrl: 'http://localhost:5173/#admin/schedule', outFile: 'step11_schedule_regression.png', port: 9717 },
    { targetUrl: 'http://localhost:5173/#admin/posters', outFile: 'step11_posters_regression.png', port: 9718 },
    { targetUrl: 'http://localhost:5173/#admin/gallery', outFile: 'step11_gallery_regression.png', port: 9719 },
    { targetUrl: 'http://localhost:5173/#admin/judges', outFile: 'step11_judges_regression.png', port: 9720 },
    { targetUrl: 'http://localhost:5173/#judge', outFile: 'step11_judge_portal_regression.png', port: 9721 }
  ];

  for (const reg of regressions) {
    await captureOne(reg);
  }

  console.log('\n========================================');
  console.log('ALL STEP 11 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
