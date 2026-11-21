const http = require('http');
const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    async function run() {
      const pdf = await pdfjsLib.getDocument('/temp_guideline.pdf').promise;
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        pages.push({
          page: i,
          text: text.items.map(x => x.str).join(' ')
        });
      }
      await fetch('/save_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pages)
      });
    }
    window.onload = run;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/temp_guideline.pdf') {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(path.join(__dirname, '../public/temp_guideline.pdf')).pipe(res);
  } else if (req.method === 'POST' && req.url === '/save_text') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      fs.writeFileSync(path.join(__dirname, '../scratch/guideline_text.json'), body);
      console.log('Saved guideline text!');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      setTimeout(() => process.exit(0), 1000);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3335, () => console.log('Listening on 3335'));
