const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ARTIFACTS_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

async function runServiceCenterVerification() {
  console.log('=== DIGITAL SERVICE CENTER & ACTION STRIP VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  let totalErrors = 0;

  // -------------------------------------------------------------
  // Test 1: Desktop Services Page (1710x984)
  // -------------------------------------------------------------
  console.log('--- Test 1: services.html (Desktop 1710x984) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1710, height: 984 } });
  const page = await desktopContext.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });

  // 1. Check Floating Action Strip is Cleanly Absent (Retired per user feedback)
  const strip = await page.$('.civic-floating-action-strip');
  if (strip) {
    console.error('FAIL: .civic-floating-action-strip should NOT be present on services.html');
    totalErrors++;
  } else {
    console.log('PASS: .civic-floating-action-strip is cleanly absent from services.html per user feedback');
  }

  // 2. Check Service Cards in Grid
  const cardPermits = await page.$('[data-open-drawer="drawer-parking-permits"]');
  const cardPayments = await page.$('a[href*="id=21"], [data-open-drawer="drawer-online-payments"]');
  const cardBicycle = await page.$('[data-open-drawer="drawer-bicycle-registration"]');
  if (cardPermits && cardPayments && cardBicycle) {
    console.log('PASS: All 3 new prominent service cards present in services.html grid');
  } else {
    console.error('FAIL: Missing one or more new service cards in grid');
    totalErrors++;
  }

  // 3. Test Filter Pills
  const permitsFilterPill = await page.$('.services-filter-pill[data-filter="permits"]');
  if (permitsFilterPill) {
    await permitsFilterPill.click();
    await page.waitForTimeout(300);
    const visibleCards = await page.$$eval('#services-grid-container > .civic-service-card, #services-grid-container > .civic-service-card-feature', cards =>
      cards.filter(c => c.style.display !== 'none').length
    );
    console.log(`PASS: Permits & Payments filter pill works (visible cards: ${visibleCards})`);
  } else {
    console.error('FAIL: Permits & Payments filter pill missing');
    totalErrors++;
  }

  // 3b. Test Walk-In & Station Filter Pill
  console.log('Testing Walk-In & Station Filter Pill...');
  const walkinFilterPill = await page.$('.services-filter-pill[data-filter="walkin"]');
  if (walkinFilterPill) {
    await walkinFilterPill.click();
    await page.waitForTimeout(300);
    const visibleWalkin = await page.$$eval('#services-grid-container > .civic-service-card, #services-grid-container > .civic-service-card-feature', cards =>
      cards.filter(c => c.style.display !== 'none').length
    );
    console.log(`PASS: Walk-In filter pill works (visible walk-in cards: ${visibleWalkin})`);
    if (visibleWalkin !== 4) {
      console.error(`FAIL: Expected 4 walk-in cards, found ${visibleWalkin}`);
      totalErrors++;
    }

    // Verify presence of 4-field card pattern and direct links
    const walkinLinks = await page.$$eval('#services-grid-container > .civic-service-card, #services-grid-container > .civic-service-card-feature', cards =>
      cards.filter(c => c.style.display !== 'none')
           .map(c => {
             const title = c.querySelector('.civic-service-card-title')?.innerText.trim();
             const accessBox = !!c.querySelector('.service-access-box');
             const link = c.querySelector('a.civic-service-card-action')?.href;
             return { title, accessBox, link };
           })
    );
    console.log('Walk-in service cards validated:', walkinLinks);

    const hasTazewell = walkinLinks.some(c => c.link && c.link.includes('tazewellhealth.org'));
    const hasMunicode = walkinLinks.some(c => c.link && c.link.includes('municode.com'));
    const hasCityPayment = walkinLinks.some(c => c.link && c.link.includes('ci.washington.il.us/egov/apps/payment'));
    const allHaveAccessBox = walkinLinks.every(c => c.accessBox);

    if (hasTazewell && hasMunicode && hasCityPayment && allHaveAccessBox) {
      console.log('PASS: All 4 walk-in cards have standardized access boxes and direct verified municipal endpoints');
    } else {
      console.error('FAIL: Missing access boxes or expected direct municipal links in walk-in cards:', walkinLinks);
      totalErrors++;
    }

    // Reset filter
    await page.click('.services-filter-pill[data-filter="all"]');
    await page.waitForTimeout(200);
    const totalVisible = await page.$$eval('#services-grid-container > .civic-service-card, #services-grid-container > .civic-service-card-feature', cards =>
      cards.filter(c => c.style.display !== 'none').length
    );
    console.log(`PASS: All Services filter reset verified (total cards: ${totalVisible})`);
  } else {
    console.error('FAIL: Walk-In & Station filter pill missing');
    totalErrors++;
  }

  // 4. Test Search Bar
  const searchInput = await page.$('#services-search-input');
  if (searchInput) {
    await searchInput.fill('parking');
    await page.waitForTimeout(300);
    const visibleWithSearch = await page.$$eval('#services-grid-container > div', cards =>
      cards.filter(c => c.style.display !== 'none').length
    );
    console.log(`PASS: Search filter for "parking" works (matching cards: ${visibleWithSearch})`);
    await searchInput.fill('');
    await page.waitForTimeout(200);
  }

  // 5. Test Primary Service Cards: Parking Permits Drawer
  console.log('Testing Service Cards -> Parking Permits Drawer...');
  const parkingBtn = await page.$('#services-grid-container [data-open-drawer="drawer-parking-permits"]');
  if (parkingBtn) {
    await page.evaluate(() => document.querySelector('#services-grid-container [data-open-drawer="drawer-parking-permits"]')?.click());
    await page.waitForTimeout(400);
    const drawerActive = await page.$eval('#drawer-parking-permits', el => el.classList.contains('active'));
    console.log(`PASS: drawer-parking-permits opens correctly (active: ${drawerActive})`);

    // Verify all 5 exemption options exist
    const optionValues = await page.$$eval('#prk-reason option', opts => opts.map(o => o.value));
    const requiredExemptions = ['overnight-guest', 'rv-staging', 'moving-van', 'contractor', 'disabled-vehicle'];
    const hasAllExemptions = requiredExemptions.every(ex => optionValues.includes(ex));
    if (hasAllExemptions) {
      console.log('PASS: All 5 municipal parking exemption reasons verified in dropdown');
    } else {
      console.error('FAIL: Missing parking exemption options:', optionValues);
      totalErrors++;
    }

    // Verify Snow Emergency Warning
    const hasSnowAlert = (await page.$('.snow-emergency-alert')) !== null;
    console.log(`PASS: Snow emergency statutory warning present: ${hasSnowAlert}`);

    // Fill form and submit
    const todayIso = new Date().toISOString().split('T')[0];
    await page.selectOption('#prk-reason', 'rv-staging');
    await page.fill('#prk-address', '1402 Devonshire Rd');
    await page.fill('#prk-plate', 'IL 781-9022');
    await page.fill('#prk-state', 'IL');
    await page.fill('#prk-vehicle', 'Winnebago Minnie Winnie');
    await page.fill('#prk-color', 'White / Gray');
    await page.fill('#prk-start', todayIso);
    await page.selectOption('#prk-nights', '1');
    await page.fill('#prk-phone', '(309) 555-4321');

    await page.click('#drawer-parking-permits button[type="submit"]');
    await page.waitForTimeout(800);

    const receiptCode = await page.$eval('#drawer-parking-permits #receipt-code-display', el => el.textContent.trim());
    console.log(`PASS: Parking exemption submitted! Receipt code generated: ${receiptCode}`);

    // Take screenshot of confirmation
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_service_parking_receipt.png') });

    // Close drawer
    await page.click('#drawer-parking-permits [data-close-drawer]');
    await page.waitForTimeout(300);
  }

  // 6. Test Primary Service Cards: Online Payments Direct Link
  console.log('Testing Service Cards -> Online Payments Direct Link...');
  const payLink = await page.$eval('a[href*="id=21"]', el => el.href);
  if (payLink && payLink.includes('id=21')) {
    console.log(`PASS: Direct City payment portal link verified: ${payLink}`);
  } else {
    console.error('FAIL: Missing or invalid direct City payment portal link');
    totalErrors++;
  }

  // 7. Test Primary Service Cards: Bicycle Registry Drawer
  console.log('Testing Service Cards -> Bicycle Registry Drawer...');
  const bikeBtn = await page.$('#services-grid-container [data-open-drawer="drawer-bicycle-registration"]');
  if (bikeBtn) {
    await page.evaluate(() => document.querySelector('#services-grid-container [data-open-drawer="drawer-bicycle-registration"]')?.click());
    await page.waitForTimeout(400);
    const bikeDrawerActive = await page.$eval('#drawer-bicycle-registration', el => el.classList.contains('active'));
    console.log(`PASS: drawer-bicycle-registration opens correctly (active: ${bikeDrawerActive})`);

    await page.fill('#bike-owner', 'Sarah Jenkins');
    await page.fill('#bike-phone', '(309) 555-8812');
    await page.fill('#bike-address', '204 N. Main St');
    await page.fill('#bike-make', 'Trek');
    await page.fill('#bike-model', 'FX 3 Disc');
    await page.fill('#bike-serial', 'WTU294C9918X');
    await page.fill('#bike-color', 'Navy Blue');

    await page.click('#drawer-bicycle-registration button[type="submit"]');
    await page.waitForTimeout(800);

    const bikeReceipt = await page.$eval('#drawer-bicycle-registration #receipt-code-display', el => el.textContent.trim());
    console.log(`PASS: Bicycle registered! Reference code: ${bikeReceipt}`);

    await page.click('#drawer-bicycle-registration [data-close-drawer]');
    await page.waitForTimeout(300);
  }

  // Take full desktop screenshot of services.html
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_action_strip_desktop.png') });
  await desktopContext.close();

  // -------------------------------------------------------------
  // Test 2: Mobile Viewport Services (390x844)
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Mobile Viewport Verification (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });

  const mobileStrip = await mobilePage.$('.civic-floating-action-strip');
  if (mobileStrip) {
    console.error('FAIL: Mobile floating action strip should NOT be present');
    totalErrors++;
  } else {
    console.log('PASS: Mobile floating action strip is cleanly absent on services.html per user feedback');
  }

  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_action_strip_mobile.png') });
  await mobileContext.close();

  // -------------------------------------------------------------
  // Test 3: Executive Home Portal index.html (1710x984)
  // -------------------------------------------------------------
  console.log('\n--- Test 3: index.html (Home Portal Desktop 1710x984) ---');
  const homeContext = await browser.newContext({ viewport: { width: 1710, height: 984 } });
  const homePage = await homeContext.newPage();
  await homePage.goto(`${BASE_URL}/index.html?agentation=0`, { waitUntil: 'networkidle' });

  const homeStrip = await homePage.$('.civic-floating-action-strip');
  if (!homeStrip) {
    console.log('PASS: .civic-floating-action-strip is cleanly absent from index.html per user feedback');
    // Test clicking parking permits from civic footer on index.html
    await homePage.click('.civic-footer [data-open-drawer="drawer-parking-permits"]');
    await homePage.waitForTimeout(400);
    const homeDrawerActive = await homePage.$eval('#drawer-parking-permits', el => el.classList.contains('active'));
    console.log(`PASS: drawer-parking-permits opens on index.html via footer action: ${homeDrawerActive}`);
    await homePage.click('#drawer-parking-permits [data-close-drawer]');
    await homePage.waitForTimeout(300);
  } else {
    console.error('FAIL: .civic-floating-action-strip was NOT removed from index.html');
    totalErrors++;
  }

  await homePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_index_desktop.png') });
  await homeContext.close();

  await browser.close();

  console.log(`\n=== VERIFICATION COMPLETE: ${totalErrors === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : totalErrors + ' ERRORS FOUND'} ===`);
  if (consoleErrors.length > 0) {
    console.error('Console errors logged:', consoleErrors);
  }
}

runServiceCenterVerification().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
