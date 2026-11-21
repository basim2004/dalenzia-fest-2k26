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

async function main() {
  const port = 9445;
  const targetUrl = process.argv[2] || 'http://localhost:5173/#admin/schedule';
  const outPath = process.argv[3] || 'scratch/debug_test.png';

  console.log(`Starting Chrome for URL: ${targetUrl}`);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1672,960',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=C:\\Users\\hp\\.gemini\\antigravity\\brain\\113c6a96-d94f-47cb-95b8-9cb4b6523d4d\\chrome_cdp_profile_2',
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
    const wsUrl = pages[0].webSocketDebuggerUrl;
    console.log(`Connecting to page ws: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled') {
        const text = (data.params.args || []).map(a => a.value !== undefined ? a.value : a.description).join(' ');
        console.log(`[BROWSER CONSOLE] ${data.params.type.toUpperCase()}: ${text}`);
      } else if (data.method === 'Runtime.exceptionThrown') {
        console.error(`[BROWSER ERROR] ${data.params.exceptionDetails?.exception?.description || data.params.exceptionDetails?.text}`);
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

    console.log('Waiting for #root to render content...');
    let rendered = false;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 500));
      const res = await send('Runtime.evaluate', {
        expression: 'document.getElementById("root")?.innerHTML?.length || 0'
      });
      const len = res.result.value || 0;
      if (len > 200) {
        console.log(`Rendered! Root innerHTML length = ${len}`);
        rendered = true;
        break;
      }
    }

    // Give an extra 3.5s for PageLoader exit animation if public page
    await new Promise(r => setTimeout(r, 3500));

    // Evaluate location.href and document title
    const evalRes = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({ href: window.location.href, title: document.title, rootLen: document.getElementById("root")?.innerHTML?.length })'
    });
    console.log('Page State:', evalRes.result.value);

    // Capture screenshot
    const { data: base64Data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log(`Screenshot saved to ${outPath} (${fs.statSync(outPath).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
