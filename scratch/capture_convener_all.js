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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9900 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_convener_${port}`;
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
  console.log('STARTING CONVENER PORTAL VISUAL CAPTURE & REGRESSION SUITE...');

  // 1. Convener Dashboard
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener',
    outFile: 'convener_dashboard.png',
    port: 9901
  });

  // 2. Student Registry Management
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/students',
    outFile: 'convener_students.png',
    port: 9902
  });

  // 3. Student Event Assignments
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/assignments',
    outFile: 'convener_assignments.png',
    port: 9903
  });

  // 4. Team Management
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/teams',
    outFile: 'convener_teams.png',
    port: 9904
  });

  // 5. Programme Operations
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/programmes',
    outFile: 'convener_programmes.png',
    port: 9905
  });

  // 6. Competitions & Events
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/events',
    outFile: 'convener_events.png',
    port: 9906
  });

  // 7. Master Stage Schedule
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/schedule',
    outFile: 'convener_schedule.png',
    port: 9907
  });

  // 8. Guests Management
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/guests',
    outFile: 'convener_guests.png',
    port: 9908
  });

  // 9. Judge Management
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/judges',
    outFile: 'convener_judges.png',
    port: 9909
  });

  // 10. Venues & Stages
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/venues',
    outFile: 'convener_venues.png',
    port: 9910
  });

  // 11. Operational Activities (Paripadi)
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/activities',
    outFile: 'convener_activities.png',
    port: 9911
  });

  // 12. Operational Reports
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/reports',
    outFile: 'convener_reports.png',
    port: 9912
  });

  // 13. Audit Trail
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/audit',
    outFile: 'convener_audit.png',
    port: 9913
  });

  // 14. Mobile Responsive View
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener',
    outFile: 'convener_mobile.png',
    width: 390,
    height: 844,
    port: 9914
  });

  // 15. Cross-System Regressions
  const regressions = [
    { targetUrl: 'http://localhost:5173/#admin', outFile: 'convener_admin_dashboard_regression.png', port: 9920 },
    { targetUrl: 'http://localhost:5173/#judge', outFile: 'convener_judge_portal_regression.png', port: 9921 },
    { targetUrl: 'http://localhost:5173/#home', outFile: 'convener_public_home_regression.png', waitExtra: 3500, port: 9922 }
  ];

  for (const reg of regressions) {
    await captureOne(reg);
  }

  console.log('\n========================================');
  console.log('ALL CONVENER SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
