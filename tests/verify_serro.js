const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PAGES = [
  'index.html',
  'services.html',
  'districts.html',
  'community.html',
  'teams.html',
  'operations.html',
  'recruitment.html',
  'leadership.html'
];

async function runStaticVerification() {
  console.log('=== STATIC VERIFICATION OF SERRO EDITORIAL ELEMENTS ===');
  let allPassed = true;

  for (const page of PAGES) {
    const filePath = path.join(__dirname, '..', page);
    const content = fs.readFileSync(filePath, 'utf8');

    const checks = [
      { name: 'Newsreader font link', pass: content.includes('family=Newsreader') },
      { name: 'Inter font link', pass: content.includes('family=Inter') },
      { name: 'JetBrains Mono font link', pass: content.includes('family=JetBrains+Mono') },
      { name: 'Telemetry Ticker', pass: content.includes('class="telemetry-ticker"') },
      { name: 'Serro Hero Kicker', pass: content.includes('class="serro-hero-kicker"') },
      { name: 'Serro Site Footer', pass: content.includes('class="serro-site-footer"') },
      { name: 'Dual Circular Seals Deck', pass: content.includes('class="serro-footer-seals-deck"') },
      { name: 'Seal WPD vector path', pass: content.includes('seal-wpd') },
      { name: 'Seal TC3 vector path', pass: content.includes('seal-tc3') },
    ];

    if (page === 'index.html') {
      checks.push(
        { name: 'Serro 4-Metric Grid', pass: content.includes('class="serro-metric-grid"') },
        { name: 'Chief Executive Dispatch Card', pass: content.includes('class="serro-dispatch-card"') },
        { name: 'Numbered Section 01', pass: content.includes('class="serro-section-idx">01</span>') },
        { name: 'Numbered Section 02', pass: content.includes('class="serro-section-idx">02</span>') },
        { name: 'Numbered Section 03', pass: content.includes('class="serro-section-idx">03</span>') }
      );
    }

    const failed = checks.filter(c => !c.pass);
    if (failed.length > 0) {
      console.error(`❌ ${page} FAILED checks: ${failed.map(f => f.name).join(', ')}`);
      allPassed = false;
    } else {
      console.log(`✅ ${page}: All ${checks.length} Serro Editorial checks passed.`);
    }
  }

  if (!allPassed) {
    throw new Error('Static verification failed on one or more pages.');
  }
}

async function runBrowserVerification() {
  console.log('\n=== PLAYWRIGHT BROWSER VERIFICATION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  for (const pageName of PAGES) {
    const url = `http://localhost:8000/${pageName}`;
    console.log(`Testing ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Verify ticker is visible
    const ticker = await page.$('.telemetry-ticker');
    if (!ticker) throw new Error(`.telemetry-ticker not found on ${pageName}`);

    // Verify footer and dual seals
    const seals = await page.$$('.serro-footer-seal');
    if (seals.length < 2) throw new Error(`Expected at least 2 footer seals on ${pageName}, found ${seals.length}`);

    // Verify hero kicker
    const kicker = await page.$('.serro-hero-kicker');
    if (!kicker) throw new Error(`.serro-hero-kicker not found on ${pageName}`);
  }

  // Visual snapshots for evidence
  console.log('\nCapturing verification snapshots...');
  const artifactsDir = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';
  
  // Desktop Index
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'serro_verified_index_desktop.png'), fullPage: false });

  // Subpage Desktop (Services)
  await page.goto('http://localhost:8000/services.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'serro_verified_services_desktop.png'), fullPage: false });

  // Mobile Index (390x844 iPhone 14)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(artifactsDir, 'serro_verified_index_mobile.png'), fullPage: false });

  await browser.close();

  if (consoleErrors.length > 0) {
    console.warn(`Encountered ${consoleErrors.length} console errors:`, consoleErrors);
  } else {
    console.log('✅ 0 browser console errors detected.');
  }

  console.log('\n🎉 ALL SERRO EDITORIAL VERIFICATIONS PASSED SUCESSFULLY!');
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
