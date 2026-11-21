const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function shot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9333;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,850',
    'http://localhost:5173'
  ]);

  // Wait 4 seconds for page to load, PageLoader to finish, and React to render
  console.log('Waiting 4s for page and loader to finish...');
  await new Promise(r => setTimeout(r, 4000));

  async function getTargets() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const targets = await getTargets();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('localhost'));
  console.log('Page target found:', pageTarget?.title, pageTarget?.webSocketDebuggerUrl);

  if (!pageTarget) {
    chromeProc.kill();
    return;
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  let id = 1;
  function call(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const res = JSON.parse(evt.data);
        if (res.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(res.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Desktop screenshot
  console.log('Capturing desktop...');
  const deskResult = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('src/scratch/desktop_hero.png', Buffer.from(deskResult.data, 'base64'));
  console.log('Desktop captured: src/scratch/desktop_hero.png');

  // Mobile screenshot
  console.log('Setting mobile viewport 390x844...');
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 600));

  const mobileResult = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('src/scratch/mobile_hero.png', Buffer.from(mobileResult.data, 'base64'));
  console.log('Mobile captured: src/scratch/mobile_hero.png');

  ws.close();
  chromeProc.kill();
}

shot();
