const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ARTIFACTS_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

const PAGES = [
  { name: 'Executive Home Portal', url: `${BASE_URL}/index.html?agentation=0`, file: 'index.html' },
  { name: 'Resident Services', url: `${BASE_URL}/services.html?agentation=0`, file: 'services.html' },
  { name: 'Patrol Districts & GIS', url: `${BASE_URL}/districts.html?agentation=0`, file: 'districts.html' },
  { name: 'Community Outreach', url: `${BASE_URL}/community.html?agentation=0`, file: 'community.html' },
  { name: 'Specialized Divisions', url: `${BASE_URL}/teams.html?agentation=0`, file: 'teams.html' },
  { name: 'Patrol Operations', url: `${BASE_URL}/operations.html?agentation=0`, file: 'operations.html' },
  { name: 'Careers & Recruitment', url: `${BASE_URL}/recruitment.html?agentation=0`, file: 'recruitment.html' },
  { name: 'Leadership & Governance', url: `${BASE_URL}/leadership.html?agentation=0`, file: 'leadership.html' }
];

async function runVerification() {
  console.log('=== MULTI-PAGE MUNICIPAL ARCHITECTURE VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  let totalErrors = 0;
  const results = [];

  for (const p of PAGES) {
    console.log(`Testing: ${p.name} (${p.file})`);
    const pageErrors = [];
    const context = await browser.newContext({ viewport: { width: 1710, height: 984 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(`[Page Error] ${err.message}`);
    });

    const response = await page.goto(p.url, { waitUntil: 'networkidle' });
    const status = response.status();
    if (status !== 200) {
      pageErrors.push(`HTTP status: ${status} (expected 200)`);
    }

    const title = await page.title();
    const hasFloatingBar = (await page.$('.civic-floating-bar')) !== null;
    const hasFooter = (await page.$('.civic-footer')) !== null;
    const hasCanvas = (await page.$('.civic-navy-bg-canvas')) !== null;

    if (!hasFloatingBar || !hasFooter || !hasCanvas) {
      pageErrors.push('Missing structural components');
    }

    // Scroll performance benchmark
    const frameStats = await page.evaluate(async () => {
      return new Promise(resolve => {
        let frames = 0;
        let lastTime = performance.now();
        const frameDeltas = [];

        function measure() {
          const now = performance.now();
          frameDeltas.push(now - lastTime);
          lastTime = now;
          frames++;
          if (frames < 30) {
            window.scrollBy(0, 60);
            requestAnimationFrame(measure);
          } else {
            const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
            const maxDelta = Math.max(...frameDeltas);
            const fps = Math.round(1000 / avgDelta);
            resolve({ fps, avgDelta: avgDelta.toFixed(2), maxDelta: maxDelta.toFixed(2) });
          }
        }
        requestAnimationFrame(measure);
      });
    });

    // Scroll back to top for pristine hero/header screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Capture desktop screenshot
    const slug = p.file.replace('.html', '');
    const desktopScreenshotPath = path.join(ARTIFACTS_DIR, `verified_multipage_${slug}_desktop.png`);
    await page.screenshot({ path: desktopScreenshotPath, fullPage: false });

    // On desktop, capture opened bento dropdown for index
    if (slug === 'index') {
      const desktopMenuBtn = page.locator('#global-menu-toggle');
      await desktopMenuBtn.click();
      await page.waitForTimeout(350);
      const bentoDesktopPath = path.join(ARTIFACTS_DIR, 'verified_bento_dropdown_desktop.png');
      await page.screenshot({ path: bentoDesktopPath, fullPage: false });
      await desktopMenuBtn.click();
      await page.waitForTimeout(200);
    }

    // Switch to mobile viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    const mobileScreenshotPath = path.join(ARTIFACTS_DIR, `verified_multipage_${slug}_mobile.png`);
    await page.screenshot({ path: mobileScreenshotPath, fullPage: false });

    // Test Skiper46 Gooey Menu opening on mobile
    const menuBtn = page.locator('#global-menu-toggle');
    await menuBtn.click();
    await page.waitForTimeout(350);

    const gooeyNav = page.locator('#skiperGooeyNav');
    const isGooeyOpen = await gooeyNav.evaluate(el => el.classList.contains('is-open'));
    if (!isGooeyOpen) {
      pageErrors.push('Skiper46 Gooey Menu failed to open');
    }

    if (slug === 'index') {
      const bentoMobilePath = path.join(ARTIFACTS_DIR, 'verified_bento_dropdown_mobile.png');
      await page.screenshot({ path: bentoMobilePath, fullPage: false });
    }

    // Verify all 8 portals and 6 resident service action cards exist in the bento dropdown
    const portalLinksCount = await page.locator('#skiperGooeyPanel .skiper-item').count();
    const serviceCardsCount = await page.locator('#skiperGooeyPanel .skiper-action-card').count();
    if (portalLinksCount !== 8) {
      pageErrors.push(`Expected 8 portal links in gooey menu, found ${portalLinksCount}`);
    }
    if (serviceCardsCount !== 6) {
      pageErrors.push(`Expected 6 resident action cards in gooey menu, found ${serviceCardsCount}`);
    }

    // Test resident service drawer opening if the drawer exists on this page
    const hasVacationDrawer = (await page.locator('#drawer-vacation-check').count()) > 0;
    let isDrawerActive = false;
    if (hasVacationDrawer) {
      const vacationCard = page.locator('#skiperGooeyPanel [data-open-drawer="drawer-vacation-check"]');
      await vacationCard.click();
      await page.waitForTimeout(300);
      isDrawerActive = await page.locator('#drawer-vacation-check').evaluate(el => el.classList.contains('active'));
      if (!isDrawerActive) {
        pageErrors.push('Vacation check drawer failed to open from resident service action card');
      }
      const closeDrawerBtn = page.locator('#drawer-vacation-check .drawer-close-btn');
      await closeDrawerBtn.click();
      await page.waitForTimeout(200);
    } else {
      isDrawerActive = true; // Not applicable on this subpage
      // Close gooey menu if open
      const stillOpen = await gooeyNav.evaluate(el => el.classList.contains('is-open'));
      if (stillOpen) {
        await menuBtn.click();
        await page.waitForTimeout(200);
      }
    }

    console.log(`  ✓ HTTP ${status} | ${frameStats.fps} FPS | Title: "${title.slice(0, 45)}..."`);
    console.log(`  ✓ Desktop & Mobile screenshots saved | Bento items: ${portalLinksCount} portals, ${serviceCardsCount} services | Drawer check: ${isDrawerActive ? 'PASS' : 'FAIL'}`);

    results.push({
      name: p.name,
      file: p.file,
      status,
      fps: frameStats.fps,
      avgDelta: frameStats.avgDelta,
      errors: pageErrors
    });

    totalErrors += pageErrors.length;
    await context.close();
  }

  // Bidirectional Navigation Flow Verification
  console.log('\nTesting Cross-Page Inter-Navigation:');
  const navContext = await browser.newContext({ viewport: { width: 1710, height: 984 } });
  await navContext.route('**/js/agentation*', route => route.abort());
  const navPage = await navContext.newPage();

  // Test 1: Home -> Services -> Home
  await navPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
  const servicesCard = navPage.locator('.dept-card a[href="services.html"]').first();
  await Promise.all([
    navPage.waitForURL('**/services.html*'),
    servicesCard.click()
  ]);
  console.log(`  ✓ Home -> Services: ${navPage.url()}`);

  const brandHome1 = navPage.locator('.civic-float-brand').first();
  await Promise.all([
    navPage.waitForURL('**/index.html*'),
    brandHome1.click()
  ]);
  console.log(`  ✓ Services -> Home: ${navPage.url()}`);

  // Test 2: Home -> Districts -> Home
  const districtsCard = navPage.locator('.dept-card a[href="districts.html"]').first();
  await Promise.all([
    navPage.waitForURL('**/districts.html*'),
    districtsCard.click()
  ]);
  console.log(`  ✓ Home -> Districts: ${navPage.url()}`);

  const brandHome2 = navPage.locator('.civic-float-brand').first();
  await Promise.all([
    navPage.waitForURL('**/index.html*'),
    brandHome2.click()
  ]);
  console.log(`  ✓ Districts -> Home: ${navPage.url()}`);

  // Test 3: Home -> Recruitment -> Home
  const recruitmentCard = navPage.locator('.dept-card a[href="recruitment.html"]').first();
  await Promise.all([
    navPage.waitForURL('**/recruitment.html*'),
    recruitmentCard.click()
  ]);
  console.log(`  ✓ Home -> Careers & Recruitment: ${navPage.url()}`);

  const brandHome3 = navPage.locator('.civic-float-brand').first();
  await Promise.all([
    navPage.waitForURL('**/index.html*'),
    brandHome3.click()
  ]);
  console.log(`  ✓ Careers -> Home: ${navPage.url()}`);

  await navContext.close();
  await browser.close();

  console.log('\n========================================');
  console.log(`FINAL RESULT: ${totalErrors === 0 ? 'ALL GATES PASSED (0 ERRORS)' : `${totalErrors} ERRORS FOUND`}`);
  console.log('========================================');
  for (const r of results) {
    console.log(`  - ${r.name.padEnd(26)}: HTTP ${r.status} | ${r.fps} FPS (${r.avgDelta}ms) | ${r.errors.length === 0 ? 'CLEAN' : r.errors.join(', ')}`);
  }
}

runVerification().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
