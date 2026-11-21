const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  async function getWebSocketDebuggerUrl() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/version`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const json = JSON.parse(data);
          resolve(json.webSocketDebuggerUrl);
        });
      }).on('error', reject);
    });
  }

  const wsUrl = await getWebSocketDebuggerUrl();
  console.log('WS URL:', wsUrl);

  async function takeScreenshot(width, height, outFile) {
    const ws = new WebSocket(wsUrl);
    let id = 1;

    function send(method, params = {}) {
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

    await new Promise(r => ws.addEventListener('open', r, { once: true }));

    // Create target
    const { targetId } = await send('Target.createTarget', { url: 'http://localhost:5173' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    // Set viewport
    ws.send(JSON.stringify({
      id: id++,
      method: 'Target.sendMessageToTarget',
      params: {
        sessionId,
        message: JSON.stringify({
          id: id++,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width, height, deviceScaleFactor: 1, mobile: width < 600 }
        })
      }
    }));

    // Wait 3.5 seconds for Loader to complete & animations to settle
    console.log(`Waiting for page to render (${width}x${height})...`);
    await new Promise(r => setTimeout(r, 3500));

    // Capture screenshot
    const shotResult = await new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const parsed = JSON.parse(evt.data);
        if (parsed.method === 'Target.receivedMessageFromTarget' && parsed.params.sessionId === sessionId) {
          const inner = JSON.parse(parsed.params.message);
          if (inner.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(inner.result);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id: id++,
        method: 'Target.sendMessageToTarget',
        params: {
          sessionId,
          message: JSON.stringify({ id: msgId, method: 'Page.captureScreenshot', params: { format: 'png' } })
        }
      }));
    });

    if (shotResult && shotResult.data) {
      fs.writeFileSync(outFile, Buffer.from(shotResult.data, 'base64'));
      console.log('Saved screenshot:', outFile);
    }

    ws.close();
  }

  try {
    await takeScreenshot(1280, 820, 'c:\\basim\\dalanzia\\src\\scratch\\desktop_hero.png');
    await takeScreenshot(390, 844, 'c:\\basim\\dalanzia\\src\\scratch\\mobile_hero.png');
  } catch (e) {
    console.error('Error during screenshot:', e);
  } finally {
    chromeProc.kill();
  }
}

capture();
