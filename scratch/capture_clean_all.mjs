import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const port = 9955;
const basePath = 'C:/Users/hp/.gemini/antigravity/brain/113c6a96-d94f-47cb-95b8-9cb4b6523d4d/';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${basePath}cdp_clean_${port}`,
  'http://localhost:5173/#home'
]);

function getJson(u) {
  return new Promise((res, rej) => {
    http.get(u, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

async function run() {
  let pages = null;
  for (let i = 0; i < 30; i++) {
    try {
      pages = await getJson(`http://127.0.0.1:${port}/json/list`);
      if (pages && pages.length > 0) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!pages || !pages[0]) {
    console.error('No chrome pages found');
    chrome.kill();
    return;
  }

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
  await send('Runtime.enable');

  const targets = [
    { name: '01_public_home', url: 'http://localhost:5173/#home' },
    { name: '02_public_events', url: 'http://localhost:5173/#events' },
    { name: '03_public_guests', url: 'http://localhost:5173/#guests' },
    { name: '04_public_results', url: 'http://localhost:5173/#results' },
    { name: '05_admin_portal', url: 'http://localhost:5173/#admin' },
    { name: '06_convener_portal', url: 'http://localhost:5173/#convener' },
    { name: '07_judge_portal', url: 'http://localhost:5173/#judge' },
    { name: '08_teamleader_portal', url: 'http://localhost:5173/#teamleader' },
    { name: '09_student_portal', url: 'http://localhost:5173/#student' },
    { name: '10_stage_portal', url: 'http://localhost:5173/#stage' }
  ];

  for (const t of targets) {
    console.log(`Checking ${t.name}: ${t.url}...`);
    await send('Page.navigate', { url: t.url });
    // Wait longer for home to finish splash
    const waitTime = t.name.includes('home') ? 3000 : 1800;
    await new Promise(r => setTimeout(r, waitTime));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const imgPath = `scratch/clean_${t.name}.png`;
    fs.writeFileSync(imgPath, Buffer.from(shot.data, 'base64'));

    // Evaluate summary text from page
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText.replace(/\\s+/g, ' ').slice(0, 250);
        return { text };
      })()`,
      returnByValue: true
    });

    console.log(`  -> Rendered (${shot.data.length} bytes): ${evalRes.result?.value?.text?.slice(0, 100)}...`);
  }

  // Now test logging into Admin Portal and Convener Portal
  console.log('\n--- TESTING ADMIN PORTAL LOGIN & CLEAN DASHBOARD ---');
  await send('Page.navigate', { url: 'http://localhost:5173/#admin' });
  await new Promise(r => setTimeout(r, 1000));

  // Perform login with official admin credentials: admin@dalenziafest.in / admin2k26
  await send('Runtime.evaluate', {
    expression: `(() => {
      const emailInput = document.querySelector('input[type="text"], input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('button[type="submit"]');
      if (emailInput && passInput && submitBtn) {
        emailInput.value = 'admin@dalenziafest.in';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.value = 'admin2k26';
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        submitBtn.click();
        return 'SUBMITTED';
      }
      return 'INPUTS_NOT_FOUND';
    })()`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 1500));

  const adminShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/clean_11_admin_logged_in.png', Buffer.from(adminShot.data, 'base64'));

  const adminStats = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText.replace(/\\s+/g, ' ');
      return { text: text.slice(0, 350) };
    })()`,
    returnByValue: true
  });
  console.log('  Admin Dashboard Rendered:', adminStats.result?.value?.text?.slice(0, 150));

  ws.close();
  chrome.kill();
  console.log('\nAll checks completed successfully!');
}

run().catch(console.error);
