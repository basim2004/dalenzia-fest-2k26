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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9800 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_step12_${port}`;
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
  console.log('STARTING STEP 12 REPORTS & ANALYTICS VISUAL CAPTURE & REGRESSION SUITE...');

  // 1. Overview Dashboard
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_analytics_overview.png',
    port: 9801
  });

  // 2. Team Performance Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_team_performance.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const teamBtn = btns.find(b => b.textContent.includes('Team Performance'));
      if (teamBtn) teamBtn.click();
    `,
    port: 9802
  });

  // 3. Student Performance Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_student_performance.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const stuBtn = btns.find(b => b.textContent.includes('Student Performance'));
      if (stuBtn) stuBtn.click();
    `,
    port: 9803
  });

  // 4. Competition Reports Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_competition_reports.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const compBtn = btns.find(b => b.textContent.includes('Competition Reports'));
      if (compBtn) compBtn.click();
    `,
    port: 9804
  });

  // 5. Judge Activity Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_judge_activity.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const jdgBtn = btns.find(b => b.textContent.includes('Judge Activity'));
      if (jdgBtn) jdgBtn.click();
    `,
    port: 9805
  });

  // 6. Printable PDF Modal
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_printable_pdf_modal.png',
    action: `
      const btns = Array.from(document.querySelectorAll('button'));
      const printBtn = btns.find(b => b.textContent.includes('Print PDF Report'));
      if (printBtn) printBtn.click();
    `,
    port: 9806
  });

  // 7. Mobile View of Reports & Analytics
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/reports',
    outFile: 'step12_reports_mobile.png',
    width: 390,
    height: 844,
    port: 9807
  });

  // 8. Full Module Regressions Across All Modules
  const regressions = [
    { targetUrl: 'http://localhost:5173/#admin', outFile: 'step12_dashboard_regression.png', port: 9810 },
    { targetUrl: 'http://localhost:5173/#admin/teams', outFile: 'step12_teams_regression.png', port: 9811 },
    { targetUrl: 'http://localhost:5173/#admin/students', outFile: 'step12_students_regression.png', port: 9812 },
    { targetUrl: 'http://localhost:5173/#admin/competitions', outFile: 'step12_competitions_regression.png', port: 9813 },
    { targetUrl: 'http://localhost:5173/#admin/results', outFile: 'step12_results_regression.png', port: 9814 },
    { targetUrl: 'http://localhost:5173/#admin/programme', outFile: 'step12_programmes_regression.png', port: 9815 },
    { targetUrl: 'http://localhost:5173/#admin/programme_guests', outFile: 'step12_guests_regression.png', port: 9816 },
    { targetUrl: 'http://localhost:5173/#admin/schedule', outFile: 'step12_schedule_regression.png', port: 9817 },
    { targetUrl: 'http://localhost:5173/#admin/posters', outFile: 'step12_posters_regression.png', port: 9818 },
    { targetUrl: 'http://localhost:5173/#admin/gallery', outFile: 'step12_gallery_regression.png', port: 9819 },
    { targetUrl: 'http://localhost:5173/#admin/announcements', outFile: 'step12_announcements_regression.png', port: 9820 },
    { targetUrl: 'http://localhost:5173/#admin/judges', outFile: 'step12_judges_regression.png', port: 9821 },
    { targetUrl: 'http://localhost:5173/#judge', outFile: 'step12_judge_portal_regression.png', port: 9822 }
  ];

  for (const reg of regressions) {
    await captureOne(reg);
  }

  console.log('\n========================================');
  console.log('ALL STEP 12 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
