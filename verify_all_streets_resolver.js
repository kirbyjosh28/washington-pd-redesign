/**
 * Comprehensive Verification of Municipal Jurisdiction Street Resolver
 * Tests full coverage across District 1, 2, and 3 streets in Washington, IL
 */
const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = 'http://localhost:8001/districts.html?agentation=0';
const ARTIFACT_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

async function run() {
  console.log('--- Starting Comprehensive Washington Street Resolver Verification ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  assert.strictEqual(consoleErrors.length, 0, `0 console errors on districts.html (found: ${consoleErrors.join(', ')})`);
  console.log('  [PASS] districts.html loaded with 0 console errors');

  const input = await page.$('#addressResolverInput');
  const clearBtn = await page.$('#addressResolverClear');
  const resultCard = await page.$('#addressResolverResult');
  const suggestionsBox = await page.$('#addressResolverSuggestions');

  assert(input !== null, 'Address search input exists');
  assert(clearBtn !== null, 'Address clear button exists');
  assert(resultCard !== null, 'Address result card exists');
  assert(suggestionsBox !== null, 'Suggestions box exists');

  // Verify total streets count in window
  const totalStreets = await page.evaluate(() => {
    return (typeof WPD_DATA !== 'undefined' && Array.isArray(WPD_DATA.streets)) ? WPD_DATA.streets.length : 0;
  });
  console.log(`  [INFO] Total municipal streets indexed in WPD_DATA: ${totalStreets}`);
  assert(totalStreets >= 400, `Expected 400+ indexed municipal streets, got ${totalStreets}`);
  console.log('  [PASS] 400+ Washington municipal streets indexed in database');

  // Test set: 24 distinct streets covering all corners and districts of Washington, IL
  const testCases = [
    // District 1 (Historic Core & East)
    { query: '115 W Jefferson St', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'West Jefferson St' },
    { query: 'Devonshire Rd', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Devonshire Rd' },
    { query: 'Washington Square', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Washington Square' },
    { query: 'Walnut St', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Walnut St' },
    { query: '308 Bondurant St', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Bondurant St' },
    { query: 'Kingsbury Rd', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Kingsbury Rd' },
    { query: 'Yorkshire Dr', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Yorkshire Dr' },
    { query: 'Zinser Pl', expectedDist: 1, expectedCar: 'Sector Car 101', name: 'Zinser Pl' },

    // District 2 (West Sector)
    { query: 'Centennial Dr', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Centennial Dr' },
    { query: 'Freedom Pkwy', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Freedom Pkwy' },
    { query: 'South Cummings Ln', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'South Cummings Ln' },
    { query: '525 Ernest St', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Ernest St' },
    { query: 'School St', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'School St' },
    { query: 'Hillcrest Dr', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Hillcrest Dr' },
    { query: 'Brentwood Dr', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Brentwood Dr' },
    { query: 'Sunnyland Plaza', expectedDist: 2, expectedCar: 'Sector Car 102', name: 'Sunnyland Plaza' },

    // District 3 (North Sector / Bypass)
    { query: 'North Wilmor Rd', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'North Wilmor Rd' },
    { query: '1400 Newcastle Rd', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Newcastle Rd' },
    { query: '1301 Eagle Ave', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Eagle Ave' },
    { query: 'West Cruger Rd', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'West Cruger Rd' },
    { query: 'Nofsinger Rd', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Nofsinger Rd' },
    { query: 'Dallas Rd', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Dallas Rd' },
    { query: 'Constitution Ave', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Constitution Ave' },
    { query: 'Rolling Meadows Dr', expectedDist: 3, expectedCar: 'Sector Car 103', name: 'Rolling Meadows Dr' }
  ];

  let passedTests = 0;

  for (const tc of testCases) {
    // Clear previous input
    await clearBtn.click();
    await page.waitForTimeout(100);

    // Type query
    await input.fill(tc.query);
    await page.waitForTimeout(200);

    // Click first suggestion
    const firstSuggestion = await page.$('.address-suggestion-item');
    assert(firstSuggestion !== null, `Suggestion appeared for "${tc.query}"`);
    await firstSuggestion.click();
    await page.waitForTimeout(150);

    // Verify resolved card content
    const cardText = await page.$eval('#addressResolverResult', el => el.textContent);
    assert(cardText.includes(`DISTRICT ${tc.expectedDist} SECTOR`), `Query "${tc.query}" resolved to District ${tc.expectedDist}`);
    assert(cardText.includes(tc.expectedCar), `Query "${tc.query}" displays ${tc.expectedCar}`);
    passedTests++;
    console.log(`  [PASS] "${tc.query}" -> District ${tc.expectedDist} (${tc.expectedCar})`);
  }

  console.log(`  [SUMMARY] All ${passedTests} sample street queries resolved with 100% accuracy!`);

  // Test Keyboard Navigation: type street, press Enter to resolve
  console.log('\n--- Testing Keyboard Accessibility (Enter Key Resolve) ---');
  await clearBtn.click();
  await page.waitForTimeout(100);
  await input.fill('Autumn Ridge');
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);

  const kbCardText = await page.$eval('#addressResolverResult', el => el.textContent);
  assert(kbCardText.includes('DISTRICT 3 SECTOR'), 'Enter key resolved Autumn Ridge to DISTRICT 3 SECTOR');
  console.log('  [PASS] Enter key automatically resolved top matched street to District 3');

  // Test Tactical Map Focus Button
  console.log('\n--- Testing Focus Sector on Tactical Map Action ---');
  const jumpBtn = await page.$('#btn-resolver-jump-map');
  assert(jumpBtn !== null, 'Focus Sector on Tactical Map button exists');
  await jumpBtn.click();
  await page.waitForTimeout(600);

  const d3Active = await page.evaluate(() => {
    const step = document.querySelector('.scrolly-step[data-district="3"]');
    const cad = document.getElementById('cad-hud-district');
    return (step && step.classList.contains('active')) || (cad && cad.textContent.includes('District 3'));
  });
  assert(d3Active === true, 'Tactical map focused on District 3 after button click');
  console.log('  [PASS] Tactical Map jumped and focused on District 3 sector');

  // Capture verification screenshots
  const screenshotPath = path.join(ARTIFACT_DIR, 'verified_all_streets_resolver.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`  [PASS] Screenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log('\n======================================================');
  console.log('ALL MUNICIPAL STREET RESOLVER TESTS PASSED (100% SUCCESS)');
  console.log('======================================================');
}

run().catch(err => {
  console.error('\n[FATAL ERROR]:', err);
  process.exit(1);
});
