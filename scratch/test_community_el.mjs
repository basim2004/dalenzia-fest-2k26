import { spawn } from 'child_process';
import http from 'http';

const port = 9994;

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-sandbox',
  'http://localhost:5173/#previous'
]);

function getJson(u) {
  return new Promise((res, rej) => {
    http.get(u, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

setTimeout(async () => {
  const list = await getJson(`http://127.0.0.1:${port}/json/list`);
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: 'JSON.stringify({ exists: !!document.getElementById("community"), text: document.getElementById("community")?.innerText?.substring(0, 150) })',
        returnByValue: true
      }
    }));
  };
  ws.onmessage = (e) => {
    console.log('Result:', JSON.parse(e.data).result.result.value);
    ws.close();
    chrome.kill();
  };
}, 3500);
