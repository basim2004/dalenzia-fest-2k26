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

const views = [
  { url: 'http://localhost:5173/#admin/schedule/daily', out: 'step08_schedule_daily.png', width: 1672, height: 960 },
  { url: 'http://localhost:5173/#admin/schedule/weekly', out: 'step08_schedule_matrix.png', width: 1672, height: 960 },
  { url: 'http://localhost:5173/#admin/schedule/timeline', out: 'step08_schedule_timelines.png', width: 1672, height: 960 },
  { url: 'http://localhost:5173/#admin/schedule/calendar', out: 'step08_schedule_calendar.png', width: 1672, height: 960 },
  { url: 'http://localhost:5173/#admin/schedule/directory', out: 'step08_schedule_directory.png', width: 1672, height: 960 },
  { url: 'http://localhost:5173/#admin/schedule', out: 'step08_schedule_mobile.png', width: 390, height: 1600 }
];

const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

async function captureOne(targetUrl, outFile, width, height, port) {
  console.log(`\nCapturing: ${targetUrl} (${width}x${height}) -> ${outFile}`);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${basePath}chrome_profile_${port}`,
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
  for (let i = 0; i < views.length; i++) {
    const v = views[i];
    await captureOne(v.url, v.out, v.width, v.height, 9500 + i);
  }
  console.log('\nAll schedule views successfully captured!');
}

runAll().catch(console.error);
