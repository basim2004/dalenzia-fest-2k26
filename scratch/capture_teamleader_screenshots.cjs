const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to Team Leader Login...');
  await page.goto('http://localhost:5173/#teamleader', { waitUntil: 'networkidle2' });
  await page.waitForTimeout ? page.waitForTimeout(1500) : new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(__dirname, 'teamleader_login.png'), fullPage: false });
  console.log('Saved teamleader_login.png');

  // Click on Team A quick select or fill in credentials
  const fillSuccess = await page.evaluate(() => {
    const quickBtn = document.querySelector('button[title*="Team A"], button:has-text("Team A")') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Team A'));
    if (quickBtn) {
      quickBtn.click();
      return true;
    }
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      inputs[0].value = 'leader1@dalenziafest.in';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].value = 'leader2k26';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  });

  // Submit login
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Enter Team Portal') || b.textContent.includes('Sign In'));
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'teamleader_dashboard.png'), fullPage: false });
  console.log('Saved teamleader_dashboard.png');

  // Navigate to My Team
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('My Team'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'teamleader_myteam.png'), fullPage: false });
  console.log('Saved teamleader_myteam.png');

  // Navigate to Students
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Students'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'teamleader_students.png'), fullPage: false });
  console.log('Saved teamleader_students.png');

  // Navigate to Competitions
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Competitions'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'teamleader_competitions.png'), fullPage: false });
  console.log('Saved teamleader_competitions.png');

  // Also check Admin Sidebar to show Convener Portal and Team Leader Portal
  console.log('Navigating to Admin Panel to capture sidebar...');
  await page.goto('http://localhost:5173/#admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // If on admin login, fill admin credentials:
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      inputs[0].value = 'admin@dalenziafest.in';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].value = 'admin2k26';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'admin_sidebar_with_portals.png'), fullPage: false });
  console.log('Saved admin_sidebar_with_portals.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
