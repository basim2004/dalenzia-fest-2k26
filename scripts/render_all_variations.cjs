const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/assets/brand/tested_variations');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  <div id="status">Starting...</div>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    async function renderPages(pdfName, pdfUrl, bgColors) {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2.0 });

        for (const [bgName, bgColor] of Object.entries(bgColors)) {
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          
          if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');
          await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: pdfName + '_p' + p + '_' + bgName + '.png', data: dataUrl })
          });
        }
      }
    }

    async function run() {
      const bgs = {
        'crimson': '#A91F35',
        'cream': '#F7F3E9',
        'transparent': null
      };
      await renderPages('dalenzia', '/temp_dalenzia_logo.pdf', bgs);
      await renderPages('nueva_era', '/temp_theme_logo.pdf', bgs);
      document.getElementById('status').innerText = 'DONE!';
      fetch('/done');
    }
    window.onload = run;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/temp_theme_logo.pdf') {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(path.join(__dirname, '../public/temp_theme_logo.pdf')).pipe(res);
  } else if (req.url === '/temp_dalenzia_logo.pdf') {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(path.join(__dirname, '../public/temp_dalenzia_logo.pdf')).pipe(res);
  } else if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { filename, data } = JSON.parse(body);
      const b64 = data.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(outDir, filename), Buffer.from(b64, 'base64'));
      console.log('Saved:', filename);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
  } else if (req.url === '/done') {
    console.log('ALL TESTS COMPLETED!');
    res.writeHead(200);
    res.end('ok');
    setTimeout(() => process.exit(0), 1000);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3336, () => console.log('Listening on 3336'));
