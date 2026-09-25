/**
 * Washington Police Department — Socratic UX Option A Automated Verification Suite
 * Playwright E2E Test covering:
 * 1. Multi-page HTTP 200 & zero console errors across all 8 pages
 * 2. Strict City Direct-Linking Audit (City forms open externally, zero duplicate drawers)
 * 3. Universal Civic Command Palette (⌘K, searching, external city link vs smart drawer trigger)
 * 4. 5 Gap Smart Drawers (Opening, Phone formatting, CAD receipt generation)
 * 5. Instant Address-to-Patrol Beat GIS Resolver (Street search, sector lookup, map focus)
 * 6. Ambient Station Telemetry in Skiper menu
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ARTIFACT_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

const PAGES = [
  'index.html',
  'services.html',
  'districts.html',
  'community.html',
  'operations.html',
  'teams.html',
  'leadership.html',
  'recruitment.html'
];

const RETIRED_DRAWERS = [
  'drawer-vacation-check',
  'drawer-drug-disposal',
  'drawer-police-records',
  'drawer-online-payments',
  'drawer-business-watch'
];

const AUTHORIZED_GAP_DRAWERS = [
  'drawer-parking-permits',
  'drawer-bicycle-registration',
  'drawer-anonymous-tip',
  'drawer-child-seat',
  'drawer-commendation'
];

async function runVerification() {
  console.log('=== STARTING WPD SOCRATIC UX (OPTION A) VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] ${message}`);
    } else {
      failedTests++;
      console.error(`  [FAIL] ${message}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Multi-Page Health & Console Error Audit
  // -------------------------------------------------------------
  console.log('--- TEST 1: Multi-Page Health & Zero Console Error Audit ---');
  for (const p of PAGES) {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (!msg.text().includes('favicon') && !msg.text().includes('font')) {
          consoleErrors.push(msg.text());
        }
      }
    });

    const res = await page.goto(`${BASE_URL}/${p}?agentation=0`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    assert(res.status() === 200, `${p} returns HTTP 200`);
    assert(consoleErrors.length === 0, `${p} has 0 console errors (found: ${consoleErrors.join('; ')})`);

    // Check command palette trigger in header
    const searchTrigger = await page.$('#wpdCommandTrigger');
    assert(searchTrigger !== null, `${p} has #wpdCommandTrigger trigger in header`);

    // Check ambient telemetry in skiper panel
    const telemetry = await page.$('.skiper-telemetry-strip');
    assert(telemetry !== null, `${p} has .skiper-telemetry-strip in skiper menu`);

    // Check absence of retired drawers
    for (const retired of RETIRED_DRAWERS) {
      const el = await page.$(`#${retired}`);
      assert(el === null, `${p} does NOT contain retired drawer #${retired}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 2: Strict City Direct-Linking Policy Audit on services.html & community.html
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Strict City Direct-Linking Policy Audit ---');
  await page.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });

  // Vacation Watch link on services.html
  const vacationLink = await page.$('a[href*="id=15"]');
  assert(vacationLink !== null, 'services.html has direct link to City Form #15');
  if (vacationLink) {
    const target = await vacationLink.getAttribute('target');
    const href = await vacationLink.getAttribute('href');
    assert(target === '_blank', 'City Form #15 link opens in target="_blank"');
    assert(href.includes('ci.washington.il.us'), `City Form #15 points to official city portal: ${href}`);
  }

  // Payment links on services.html
  const parkingTicketLink = await page.$('a[href*="id=21"]');
  assert(parkingTicketLink !== null, 'services.html has direct link to Parking Ticket Payment #21');
  const violationLink = await page.$('a[href*="id=22"]');
  assert(violationLink !== null, 'services.html has direct link to Notice of Violation Payment #22');
  const towLink = await page.$('a[href*="id=23"]');
  assert(towLink !== null, 'services.html has direct link to Tow Bond Release #23');

  // FOIA Records link
  const foiaLink = await page.$('a[href*="id=179"]');
  assert(foiaLink !== null, 'services.html has direct link to Police Records FOIA #179');

  // Check community.html Vacation Watch button
  await page.goto(`${BASE_URL}/community.html?agentation=0`, { waitUntil: 'networkidle' });
  const commVacationLink = await page.$('a[href*="id=15"]');
  assert(commVacationLink !== null, 'community.html story banner links to City Form #15');

  // -------------------------------------------------------------
  // TEST 3: Universal Civic Command Palette (⌘K)
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Universal Civic Command Palette (⌘K) ---');
  await page.goto(`${BASE_URL}/index.html?agentation=0`, { waitUntil: 'networkidle' });

  // Open via clicking search button in header
  await page.click('#wpdCommandTrigger');
  await page.waitForTimeout(300);
  const isDialogOpen = await page.evaluate(() => {
    const d = document.getElementById('wpdCommandDialog');
    return d && d.open;
  });
  assert(isDialogOpen === true, 'Command Palette opens on clicking header search button');

  // Type "vacation" to test City Portal item
  const commandInput = await page.$('#wpdCommandInput');
  assert(commandInput !== null, '#wpdCommandInput is rendered inside command dialog');
  await commandInput.fill('vacation');
  await page.waitForTimeout(300);

  const vacationItem = await page.$('.wpd-command-item');
  assert(vacationItem !== null, 'Command palette lists results for "vacation"');
  if (vacationItem) {
    const titleText = await vacationItem.$eval('.wpd-command-item-title', el => el.textContent.trim());
    const badgeText = await vacationItem.$eval('.wpd-command-badge', el => el.textContent.trim());
    assert(titleText.includes('Vacation House Watch'), `Vacation item title is: "${titleText}"`);
    assert(badgeText.includes('Official City Form'), `Vacation item has badge: "${badgeText}"`);
  }

  // Capture screenshot of command palette with vacation query
  const cmdPalettePath = path.join(ARTIFACT_DIR, 'verified_socratic_command_palette.png');
  await page.screenshot({ path: cmdPalettePath });
  assert(fs.existsSync(cmdPalettePath), 'Screenshot verified_socratic_command_palette.png saved');

  // Type "parking" to test Smart Drawer trigger
  await commandInput.fill('parking');
  await page.waitForTimeout(300);

  const allItems = await page.$$('.wpd-command-item');
  let permitItem = null;
  for (const item of allItems) {
    const title = await item.$eval('.wpd-command-item-title', el => el.textContent);
    if (title.includes('Overnight & Street Parking Permit')) {
      permitItem = item;
      break;
    }
  }
  assert(permitItem !== null, 'Command palette lists Overnight & Street Parking Permit');
  if (permitItem) {
    const badgeText = await permitItem.$eval('.wpd-command-badge', el => el.textContent.trim());
    assert(badgeText.includes('Direct WPD Workflow'), `Parking permit item has badge "${badgeText}"`);

    // Click it to open the smart drawer
    await permitItem.click();
    await page.waitForTimeout(500);

    const isPermitDrawerOpen = await page.evaluate(() => {
      const d = document.getElementById('drawer-parking-permits');
      return d && (d.classList.contains('active') || d.classList.contains('is-open'));
    });
    assert(isPermitDrawerOpen === true, 'Clicking parking item in Command Palette opened drawer-parking-permits');
  }

  // -------------------------------------------------------------
  // TEST 4: Smart Drawer Ergonomics & CAD Receipt Generation
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Smart Form Drawer Ergonomics & CAD Receipt ---');
  const permitDrawer = await page.$('#drawer-parking-permits');
  assert(permitDrawer !== null, 'drawer-parking-permits is present');

  // Test phone input auto-formatting
  const phoneInput = await permitDrawer.$('#prk-phone');
  assert(phoneInput !== null, 'Phone input found in parking permits drawer');
  if (phoneInput) {
    await phoneInput.fill('3095550123');
    await page.waitForTimeout(200);
    const phoneVal = await phoneInput.inputValue();
    assert(phoneVal === '(309) 555-0123', `Phone auto-formatted to (309) 555-0123 (got: "${phoneVal}")`);
  }

  // Test date input has minimum today
  const dateInput = await permitDrawer.$('#prk-start');
  assert(dateInput !== null, 'Date input found in parking permits drawer');
  if (dateInput) {
    const minAttr = await dateInput.getAttribute('min');
    const today = new Date().toISOString().split('T')[0];
    assert(minAttr === today, `Date picker min is set to today (${today})`);
  }

  // Fill out the rest of the form to submit
  await permitDrawer.$eval('#prk-reason', el => el.value = 'overnight-guest');
  await permitDrawer.$eval('#prk-address', el => el.value = '115 E Jefferson St');
  await permitDrawer.$eval('#prk-plate', el => el.value = 'IL99201');
  await permitDrawer.$eval('#prk-state', el => el.value = 'IL');
  await permitDrawer.$eval('#prk-vehicle', el => el.value = 'Ford F-150');
  await permitDrawer.$eval('#prk-color', el => el.value = 'Silver');
  await permitDrawer.$eval('#prk-start', (el, today) => el.value = today, new Date().toISOString().split('T')[0]);

  // Submit form
  const submitBtn = await permitDrawer.$('button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(800);

  // Check for CAD receipt
  const receiptCard = await permitDrawer.$('.civic-receipt-card');
  assert(receiptCard !== null, 'Submission generated .civic-receipt-card');

  if (receiptCard) {
    const cadText = await receiptCard.$eval('#receipt-code-display', el => el.textContent.trim());
    const cadMatch = /^WPD-2026-\d{4}-\d{4}$/.test(cadText);
    assert(cadMatch === true, `Generated verifiable CAD receipt matching format: ${cadText}`);

    // Check copy action
    const copyBtn = await receiptCard.$('#btn-copy-receipt-code');
    assert(copyBtn !== null, 'Receipt contains Copy Reference Code button');

    // Check print button
    const printBtn = await receiptCard.$('#btn-print-receipt-summary');
    assert(printBtn !== null, 'Receipt contains Print / Save Receipt button');

    // Take screenshot of the CAD receipt in the drawer
    const receiptPath = path.join(ARTIFACT_DIR, 'verified_socratic_gap_receipt.png');
    await page.screenshot({ path: receiptPath });
    assert(fs.existsSync(receiptPath), 'Screenshot verified_socratic_gap_receipt.png saved');
  }

  // Close the drawer
  const closeBtn = await permitDrawer.$('.drawer-close-btn, [data-close-drawer]');
  await closeBtn.click();
  await page.waitForTimeout(400);

  const isClosed = await page.evaluate(() => {
    const d = document.getElementById('drawer-parking-permits');
    return !d.classList.contains('active') && !d.classList.contains('is-open');
  });
  assert(isClosed === true, 'Drawer closed successfully');

  // Verify all 5 gap drawers can be opened on services.html
  await page.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });
  for (const gapDrawerId of AUTHORIZED_GAP_DRAWERS) {
    const trigger = await page.$(`[data-open-drawer="${gapDrawerId}"]`);
    assert(trigger !== null, `services.html has trigger for ${gapDrawerId}`);
    if (trigger) {
      await page.evaluate((id) => {
        const t = document.querySelector(`[data-open-drawer="${id}"]`);
        if (t) t.click();
      }, gapDrawerId);
      await page.waitForTimeout(300);
      const openStatus = await page.evaluate((id) => {
        const d = document.getElementById(id);
        return d && (d.classList.contains('active') || d.classList.contains('is-open'));
      }, gapDrawerId);
      assert(openStatus === true, `Drawer ${gapDrawerId} opens when clicked`);

      // Close it
      await page.evaluate((id) => {
        const close = document.querySelector(`#${id} [data-close-drawer]`);
        if (close) close.click();
      }, gapDrawerId);
      await page.waitForTimeout(200);
    }
  }

  // -------------------------------------------------------------
  // TEST 5: Instant Address-to-Patrol Beat GIS Resolver (districts.html)
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Instant Address-to-Patrol Beat GIS Resolver ---');
  await page.goto(`${BASE_URL}/districts.html?agentation=0`, { waitUntil: 'networkidle' });

  const resolverCard = await page.$('#address-resolver');
  assert(resolverCard !== null, 'districts.html contains #address-resolver component');

  const addrInput = await page.$('#addressResolverInput');
  assert(addrInput !== null, 'Address resolver search input found');

  // Test 1: Devonshire Dr -> District 1 (Cruiser 101, Sgt. A. Lehman)
  await addrInput.fill('Devonshire');
  await page.waitForTimeout(300);

  const suggestionItem = await page.$('.address-suggestion-item');
  assert(suggestionItem !== null, 'Address search shows suggestion for Devonshire');
  if (suggestionItem) {
    await suggestionItem.click();
    await page.waitForTimeout(300);

    const resultCard = await page.$('#addressResolverResult');
    const resultText = await resultCard.textContent();
    assert(resultText.includes('DISTRICT 1 SECTOR'), 'Devonshire resolves to DISTRICT 1 SECTOR');
    assert(resultText.includes('Sector Car 101'), 'Devonshire displays Sector Car 101');
    assert(resultText.includes('Sector Sergeant'), 'Devonshire displays sector supervisor');

    // Test tactical map jump button
    const mapBtn = await resultCard.$('#btn-resolver-jump-map');
    assert(mapBtn !== null, 'Result card has "Focus Sector on Tactical Map" button');
    await mapBtn.click();
    await page.waitForTimeout(600);

    // Verify district 1 scrolly step or CAD HUD is active
    const d1Active = await page.evaluate(() => {
      const step = document.querySelector('.scrolly-step[data-district="1"]');
      const cad = document.getElementById('cad-hud-district');
      return (step && step.classList.contains('active')) || (cad && cad.textContent.includes('District 1'));
    });
    assert(d1Active === true, 'Tactical map focused and highlighted District 1');
  }

  // Screenshot of resolved address card on districts.html
  const addrScreenshotPath = path.join(ARTIFACT_DIR, 'verified_socratic_address_resolver.png');
  await page.screenshot({ path: addrScreenshotPath });
  assert(fs.existsSync(addrScreenshotPath), 'Screenshot verified_socratic_address_resolver.png saved');

  // Test 2: Quick chip click for Centennial Dr -> District 2
  const chipCentennial = await page.$('.address-quick-chip[data-street="Centennial Dr"]');
  if (chipCentennial) {
    await chipCentennial.click();
    await page.waitForTimeout(300);
    const resultText = await page.$eval('#addressResolverResult', el => el.textContent);
    assert(resultText.includes('DISTRICT 2 SECTOR'), 'Centennial Dr quick chip resolves to DISTRICT 2 SECTOR');
    assert(resultText.includes('Sector Car 102'), 'Centennial Dr displays Sector Car 102');
  }

  // Test 3: Quick chip click for North Wilmor Rd -> District 3
  const chipWilmor = await page.$('.address-quick-chip[data-street="North Wilmor Rd"]');
  if (chipWilmor) {
    await chipWilmor.click();
    await page.waitForTimeout(300);
    const resultText = await page.$eval('#addressResolverResult', el => el.textContent);
    assert(resultText.includes('DISTRICT 3 SECTOR'), 'North Wilmor Rd quick chip resolves to DISTRICT 3 SECTOR');
    assert(resultText.includes('Sector Car 103'), 'North Wilmor Rd displays Sector Car 103');
  }

  // -------------------------------------------------------------
  // TEST 6: Skiper Menu Telemetry & Clean Navbar Audit
  // -------------------------------------------------------------
  console.log('\n--- TEST 6: Skiper Menu Telemetry & Clean Navbar Audit ---');
  await page.goto(`${BASE_URL}/index.html?agentation=0`, { waitUntil: 'networkidle' });

  // Open Skiper menu
  const skiperBtn = await page.$('.skiper-goo-btn');
  assert(skiperBtn !== null, 'Skiper gooey menu toggle button exists');
  await skiperBtn.click();
  await page.waitForTimeout(400);

  const isMenuOpen = await page.evaluate(() => {
    const m = document.querySelector('.skiper-gooey-menu-wrapper');
    return m && m.classList.contains('is-open');
  });
  assert(isMenuOpen === true, 'Skiper gooey menu opens when toggled');

  // Verify telemetry inside menu
  const telemetryItems = await page.$$eval('.skiper-telemetry-item', all => all.map(el => el.textContent.trim()));
  assert(telemetryItems.length >= 2, `Skiper menu contains ${telemetryItems.length} telemetry items`);
  const hasHours = telemetryItems.some(t => t.includes('Records Lobby') || t.includes('Central Time'));
  assert(hasHours === true, 'Lobby hours telemetry present in skiper menu');
  const hasSnow = telemetryItems.some(t => t.includes('Winter Parking') || t.includes('10-1-19') || t.includes('Snow'));
  assert(hasSnow === true, 'Winter snow emergency status telemetry present in skiper menu');

  // Screenshot of skiper menu with telemetry
  const skiperScreenshotPath = path.join(ARTIFACT_DIR, 'verified_socratic_skiper_telemetry.png');
  await page.screenshot({ path: skiperScreenshotPath });
  assert(fs.existsSync(skiperScreenshotPath), 'Screenshot verified_socratic_skiper_telemetry.png saved');

  // Close skiper menu
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`TOTAL CHECKS: ${totalTests}`);
  console.log(`PASSED:       ${passedTests}`);
  console.log(`FAILED:       ${failedTests}`);
  console.log('======================================================\n');

  await browser.close();

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('ALL VERIFICATIONS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
