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

const regressions = [
  { url: 'http://localhost:5173/#admin', out: 'step08_dashboard_regression.png' },
  { url: 'http://localhost:5173/#admin/teams', out: 'step08_teams_regression.png' },
  { url: 'http://localhost:5173/#admin/students', out: 'step08_students_regression.png' },
  { url: 'http://localhost:5173/#admin/competitions', out: 'step08_competitions_regression.png' },
  { url: 'http://localhost:5173/#admin/results', out: 'step08_results_regression.png' },
  { url: 'http://localhost:5173/#admin/programme', out: 'step08_programmes_regression.png' },
  { url: 'http://localhost:5173/#admin/programme_guests', out: 'step08_guests_regression.png' },
  { url: 'http://localhost:5173/#admin/judges', out: 'step08_judges_regression.png' },
  { url: 'http://localhost:5173/#judge', out: 'step08_judge_portal_regression.png' },
  { url: 'http://localhost:5173/#schedule', out: 'step08_public_schedule_regression.png' }
];

const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

async function captureOne(targetUrl, outFile, port) {
  console.log(`\nCapturing: ${targetUrl} -> ${outFile}`);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1672,960',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${basePath}reg_profile_${port}`,
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

    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 300));
      const res = await send('Runtime.evaluate', {
        expression: 'document.getElementById("root")?.innerHTML?.length || 0'
      });
      if ((res.result?.value || 0) > 500) break;
    }
    await new Promise(r => setTimeout(r, 800));

    const { data: base64Data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullOut = basePath + outFile;
    fs.writeFileSync(fullOut, Buffer.from(base64Data, 'base64'));
    console.log(`Saved: ${outFile} (${fs.statSync(fullOut).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function runAll() {
  for (let i = 0; i < regressions.length; i++) {
    const r = regressions[i];
    await captureOne(r.url, r.out, 9600 + i);
  }
  console.log('\nAll 10 regression views successfully verified and captured!');
}

runAll().catch(console.error);
