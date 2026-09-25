const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ARTIFACTS_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

async function captureWalkin() {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const desktop = await browser.newContext({ viewport: { width: 1710, height: 984 } });
  const dPage = await desktop.newPage();
  await dPage.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });
  
  // Click walkin filter pill
  await dPage.click('.services-filter-pill[data-filter="walkin"]');
  await dPage.waitForTimeout(400);
  await dPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_walkin_desktop.png') });

  // Mobile
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mPage = await mobile.newPage();
  await mPage.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });
  await mPage.click('.services-filter-pill[data-filter="walkin"]');
  await mPage.waitForTimeout(400);
  await mPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_walkin_mobile.png') });

  await browser.close();
  console.log('Walk-in screenshots captured successfully.');
}

captureWalkin().catch(err => {
  console.error(err);
  process.exit(1);
});
