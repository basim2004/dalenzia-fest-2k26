const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/assets/brand/extracted_pages');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html>
<head>
  <title>PDF Page Extractor</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body style="font-family:sans-serif; padding:20px;">
  <h2>Extracting PDF Pages...</h2>
  <div id="status">Starting...</div>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    async function processPdf(name, url) {
      document.getElementById('status').innerText = 'Loading ' + name + '...';
      const pdf = await pdfjsLib.getDocument(url).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        document.getElementById('status').innerText = 'Rendering ' + name + ' page ' + i + ' of ' + pdf.numPages;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png');
        await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: name + '_page_' + i + '.png', data: dataUrl })
        });
      }
    }

    async function run() {
      try {
        await processPdf('theme_logo', '/temp_theme_logo.pdf');
        await processPdf('dalenzia_logo', '/temp_dalenzia_logo.pdf');
        document.getElementById('status').innerText = 'COMPLETE! All pages extracted.';
        fetch('/done');
      } catch (e) {
        document.getElementById('status').innerText = 'Error: ' + e.message;
        console.error(e);
      }
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
    console.log('ALL EXTRACTION FINISHED!');
    res.writeHead(200);
    res.end('ok');
    setTimeout(() => process.exit(0), 1000);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3333, () => {
  console.log('Extraction server listening on port 3333');
});
