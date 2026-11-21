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

async function captureOne({ targetUrl, outFile, width = 1672, height = 960, action = null, waitExtra = 1500, port = 9930 }) {
  console.log(`\nCapturing: ${targetUrl} [${width}x${height}] -> ${outFile}`);
  const profileDir = `${basePath}cdp_res_${port}`;
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

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('DOM.enable');

    await new Promise(r => setTimeout(r, waitExtra));

    if (action) {
      await action(send);
      await new Promise(r => setTimeout(r, 1000));
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullOut = basePath + outFile;
    fs.writeFileSync(fullOut, Buffer.from(data, 'base64'));
    console.log(`✓ Saved: ${outFile} (${fs.statSync(fullOut).size} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  console.log('STARTING CONVENER RESULT MANAGEMENT SCREENSHOT CAPTURE...');

  // 1. Main Convener Results Dashboard (Assignments tab)
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_dashboard.png',
    port: 9931
  });

  // 2. Submission Tracking Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_tracking.png',
    port: 9932,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const trackBtn = buttons.find(b => b.textContent.includes('Submission Tracking'));
          if (trackBtn) trackBtn.click();
        `
      });
    }
  });

  // 3. Judge-wise Evaluations Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_judgewise.png',
    port: 9933,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const jwBtn = buttons.find(b => b.textContent.includes('Judge-wise Evaluations'));
          if (jwBtn) jwBtn.click();
        `
      });
    }
  });

  // 4. Result Review Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_review.png',
    port: 9934,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const revBtn = buttons.find(b => b.textContent.includes('Result Review'));
          if (revBtn) revBtn.click();
        `
      });
    }
  });

  // 5. Final Approval Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_approval.png',
    port: 9935,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const appBtn = buttons.find(b => b.textContent.includes('Final Approval'));
          if (appBtn) appBtn.click();
        `
      });
    }
  });

  // 6. Official Publishing Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_publish.png',
    port: 9936,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const pubBtn = buttons.find(b => b.textContent.includes('Official Publishing'));
          if (pubBtn) pubBtn.click();
        `
      });
    }
  });

  // 7. Published History Tab
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_history.png',
    port: 9937,
    action: async (send) => {
      await send('Runtime.evaluate', {
        expression: `
          const buttons = Array.from(document.querySelectorAll('button'));
          const histBtn = buttons.find(b => b.textContent.includes('Published History'));
          if (histBtn) histBtn.click();
        `
      });
    }
  });

  // 8. Mobile View (390x844)
  await captureOne({
    targetUrl: 'http://localhost:5173/#convener/results',
    outFile: 'convener_results_mobile.png',
    width: 390,
    height: 844,
    port: 9938
  });

  // 9. Admin Results Verification Regression
  await captureOne({
    targetUrl: 'http://localhost:5173/#admin/results',
    outFile: 'convener_admin_results_regression.png',
    port: 9939
  });

  console.log('\n========================================');
  console.log('ALL RESULTS SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
