const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testPortals() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const urls = [
    { name: 'public_home', url: 'http://localhost:5173/#home' },
    { name: 'public_events', url: 'http://localhost:5173/#events' },
    { name: 'public_guests', url: 'http://localhost:5173/#guests' },
    { name: 'public_results', url: 'http://localhost:5173/#results' },
    { name: 'portal_admin_login', url: 'http://localhost:5173/#admin' },
    { name: 'portal_convener_login', url: 'http://localhost:5173/#convener' },
    { name: 'portal_judge_login', url: 'http://localhost:5173/#judge' },
    { name: 'portal_teamleader_login', url: 'http://localhost:5173/#teamleader' },
    { name: 'portal_student_login', url: 'http://localhost:5173/#student' },
    { name: 'portal_stage_login', url: 'http://localhost:5173/#stage' },
  ];

  const results = [];

  for (const item of urls) {
    try {
      console.log(`Navigating to ${item.name} (${item.url})...`);
      const consoleErrors = [];
      const onConsole = msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      page.on('console', onConsole);

      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1200));

      const screenshotPath = `scratch/shot_${item.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const pageTitle = await page.title();
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300).replace(/\n+/g, ' '));

      results.push({
        name: item.name,
        status: 'OK',
        screenshot: screenshotPath,
        errors: consoleErrors,
        snippet: bodyText
      });

      page.off('console', onConsole);
    } catch (err) {
      results.push({
        name: item.name,
        status: 'ERROR',
        error: err.message
      });
    }
  }

  console.log('--- TEST RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

testPortals().catch(console.error);
