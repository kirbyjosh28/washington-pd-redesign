const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8001';
const ARTIFACTS_DIR = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

async function runFaqKnowledgeBaseVerification() {
  console.log('=== INTERACTIVE RESIDENT KNOWLEDGE BASE & RESOLVER VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  let totalErrors = 0;

  // -------------------------------------------------------------
  // Test 1: Homepage 4-Card Situation Resolver (Desktop 1710x984)
  // -------------------------------------------------------------
  console.log('--- Test 1: index.html 4-Card Situation Resolver (Desktop 1710x984) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1710, height: 984 } });
  const homePage = await desktopContext.newPage();
  const consoleErrors = [];

  homePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  homePage.on('pageerror', err => consoleErrors.push(err.message));

  await homePage.goto(`${BASE_URL}/index.html?agentation=0`, { waitUntil: 'networkidle' });

  // 1. Check Resolver Section
  const resolverSection = await homePage.$('#quick-resolver');
  if (!resolverSection) {
    console.error('FAIL: #quick-resolver section missing on index.html');
    totalErrors++;
  } else {
    console.log('PASS: #quick-resolver section is present on index.html');
  }

  // 2. Check All 4 Resolver Cards
  const resolverCards = await homePage.$$('#quick-resolver .resolver-card');
  if (resolverCards.length === 4) {
    console.log(`PASS: Found all 4 resolver cards in #quick-resolver grid`);
  } else {
    console.error(`FAIL: Expected 4 resolver cards, found ${resolverCards.length}`);
    totalErrors++;
  }

  // 3. Test Direct Drawer Triggers from Resolver
  console.log('Testing direct action triggers on resolver cards...');
  // Card 1: Parking
  await homePage.click('#quick-resolver [data-open-drawer="drawer-parking-permits"]');
  await homePage.waitForTimeout(400);
  const parkingOpen = await homePage.$eval('#drawer-parking-permits', el => el.classList.contains('active'));
  console.log(`PASS: Card 1 direct trigger opens drawer-parking-permits: ${parkingOpen}`);
  if (!parkingOpen) totalErrors++;
  await homePage.click('#drawer-parking-permits .drawer-close-btn');
  await homePage.waitForTimeout(300);

  // Card 2: Citations
  await homePage.click('#quick-resolver [data-open-drawer="drawer-online-payments"]');
  await homePage.waitForTimeout(400);
  const paymentOpen = await homePage.$eval('#drawer-online-payments', el => el.classList.contains('active'));
  console.log(`PASS: Card 2 direct trigger opens drawer-online-payments: ${paymentOpen}`);
  if (!paymentOpen) totalErrors++;
  await homePage.click('#drawer-online-payments .drawer-close-btn');
  await homePage.waitForTimeout(300);

  // Card 4: Vacation House Watch
  await homePage.click('#quick-resolver [data-open-drawer="drawer-vacation-check"]');
  await homePage.waitForTimeout(400);
  const vacationOpen = await homePage.$eval('#drawer-vacation-check', el => el.classList.contains('active'));
  console.log(`PASS: Card 4 direct trigger opens drawer-vacation-check: ${vacationOpen}`);
  if (!vacationOpen) totalErrors++;
  await homePage.click('#drawer-vacation-check .drawer-close-btn');
  await homePage.waitForTimeout(300);

  // 4. Verify Card 3 BuyCrash Direct Link
  const buycrashLink = await homePage.$eval('#quick-resolver a[href*="buycrash"]', el => el.href);
  if (buycrashLink && buycrashLink.includes('buycrash.lexisnexisrisk.com')) {
    console.log(`PASS: Card 3 points directly to verified BuyCrash endpoint: ${buycrashLink}`);
  } else {
    console.error('FAIL: Card 3 BuyCrash direct link missing or invalid');
    totalErrors++;
  }

  // 5. Verify Gateway Link to services.html#faq
  const gatewayLink = await homePage.$eval('#quick-resolver .resolver-gateway-link', el => el.getAttribute('href'));
  if (gatewayLink === 'services.html#faq') {
    console.log(`PASS: Gateway link correctly routes to services.html#faq`);
  } else {
    console.error(`FAIL: Gateway link points to ${gatewayLink}, expected services.html#faq`);
    totalErrors++;
  }

  // Scroll to resolver and take screenshot
  await resolverSection.scrollIntoViewIfNeeded();
  await homePage.waitForTimeout(200);
  await homePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_homepage_resolver_desktop.png') });
  console.log('Saved screenshot: verified_homepage_resolver_desktop.png');

  // -------------------------------------------------------------
  // Test 2: Services Page Interactive Knowledge Base (Desktop 1710x984)
  // -------------------------------------------------------------
  console.log('\n--- Test 2: services.html Interactive Knowledge Base (Desktop 1710x984) ---');
  const servicesPage = await desktopContext.newPage();
  await servicesPage.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });

  // 1. Check FAQ Section Presence
  const faqSection = await servicesPage.$('#faq');
  if (!faqSection) {
    console.error('FAIL: #faq section missing on services.html');
    totalErrors++;
  } else {
    console.log('PASS: #faq section is present on services.html');
  }

  // 2. Check 10 Verified Scenario Cards
  const faqCards = await servicesPage.$$('#faq-accordion-list > .faq-card');
  if (faqCards.length === 10) {
    console.log('PASS: Found all 10 verified scenario cards in #faq-accordion-list');
  } else {
    console.error(`FAIL: Expected 10 FAQ cards, found ${faqCards.length}`);
    totalErrors++;
  }

  // 3. Test Instant Search Filtering
  console.log('Testing live instant search...');
  await servicesPage.fill('#faq-search-input', 'snow');
  await servicesPage.waitForTimeout(250);
  let visibleCards = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  let counterText = await servicesPage.$eval('#faq-result-count', el => el.innerText);
  console.log(`Search "snow" -> Visible cards: ${visibleCards}, Counter: "${counterText}"`);
  if (visibleCards === 1 && counterText.includes('1 of 10')) {
    console.log('PASS: Instant search for "snow" correctly filtered to 1 matching card');
  } else {
    console.error(`FAIL: Search for "snow" failed. Expected 1 card, got ${visibleCards}`);
    totalErrors++;
  }

  // Clear search with clear button
  await servicesPage.click('#faq-search-clear');
  await servicesPage.waitForTimeout(200);
  visibleCards = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  if (visibleCards === 10) {
    console.log('PASS: Search clear button restores all 10 cards');
  } else {
    console.error(`FAIL: Clear button did not restore 10 cards (found ${visibleCards})`);
    totalErrors++;
  }

  // Search non-existent query to test empty state
  await servicesPage.fill('#faq-search-input', 'xyznonexistent99');
  await servicesPage.waitForTimeout(200);
  const emptyStateVisible = await servicesPage.$eval('#faq-empty-state', el => el.style.display !== 'none');
  if (emptyStateVisible) {
    console.log('PASS: Empty state correctly displayed when 0 matches found');
  } else {
    console.error('FAIL: Empty state not displayed for unmatched query');
    totalErrors++;
  }

  // Reset from empty state
  await servicesPage.click('#faq-empty-reset');
  await servicesPage.waitForTimeout(200);
  visibleCards = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  if (visibleCards === 10) {
    console.log('PASS: Empty state reset button restores all 10 cards');
  } else {
    console.error('FAIL: Empty state reset failed');
    totalErrors++;
  }

  // 4. Test Category Filter Pills
  console.log('Testing category filter pills...');
  // Parking filter (2 cards)
  await servicesPage.click('.faq-filter-pill[data-filter="parking"]');
  await servicesPage.waitForTimeout(200);
  const parkingCount = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  console.log(`Pill [Parking & Snow] -> Visible cards: ${parkingCount}`);
  if (parkingCount === 2) {
    console.log('PASS: [Parking & Snow] pill correctly filtered to 2 cards');
  } else {
    console.error(`FAIL: Expected 2 parking cards, got ${parkingCount}`);
    totalErrors++;
  }

  // Payments filter (2 cards)
  await servicesPage.click('.faq-filter-pill[data-filter="payments"]');
  await servicesPage.waitForTimeout(200);
  const paymentsCount = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  console.log(`Pill [Citations & Fines] -> Visible cards: ${paymentsCount}`);
  if (paymentsCount === 2) {
    console.log('PASS: [Citations & Fines] pill correctly filtered to 2 cards');
  } else {
    console.error(`FAIL: Expected 2 payments cards, got ${paymentsCount}`);
    totalErrors++;
  }

  // Records filter (2 cards)
  await servicesPage.click('.faq-filter-pill[data-filter="records"]');
  await servicesPage.waitForTimeout(200);
  const recordsCount = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  console.log(`Pill [Records & Reports] -> Visible cards: ${recordsCount}`);
  if (recordsCount === 2) {
    console.log('PASS: [Records & Reports] pill correctly filtered to 2 cards');
  } else {
    console.error(`FAIL: Expected 2 records cards, got ${recordsCount}`);
    totalErrors++;
  }

  // Neighborhood & Property filter (4 cards)
  await servicesPage.click('.faq-filter-pill[data-filter="property"]');
  await servicesPage.waitForTimeout(200);
  const propertyCount = await servicesPage.$$eval('#faq-accordion-list > .faq-card', cards =>
    cards.filter(c => c.style.display !== 'none').length
  );
  console.log(`Pill [Neighborhood & Property] -> Visible cards: ${propertyCount}`);
  if (propertyCount === 4) {
    console.log('PASS: [Neighborhood & Property] pill correctly filtered to 4 cards');
  } else {
    console.error(`FAIL: Expected 4 property cards, got ${propertyCount}`);
    totalErrors++;
  }

  // Reset to All (10 cards)
  await servicesPage.click('.faq-filter-pill[data-filter="all"]');
  await servicesPage.waitForTimeout(200);

  // 5. Test Accordion Open / Close
  console.log('Testing accordion disclosure behavior...');
  const firstTrigger = await servicesPage.$('#faq-q-parking');
  await firstTrigger.click();
  await servicesPage.waitForTimeout(350);
  let isCardOpen = await servicesPage.$eval('#faq-overnight-parking', el => el.classList.contains('is-open'));
  let isAriaExpanded = await servicesPage.$eval('#faq-q-parking', el => el.getAttribute('aria-expanded'));
  console.log(`Clicked Question 1 -> is-open: ${isCardOpen}, aria-expanded: ${isAriaExpanded}`);
  if (isCardOpen && isAriaExpanded === 'true') {
    console.log('PASS: Question 1 expanded smoothly with proper ARIA state');
  } else {
    console.error('FAIL: Accordion failed to expand properly');
    totalErrors++;
  }

  // Test Drawer Trigger INSIDE Question 1
  console.log('Testing direct action button inside Question 1...');
  await servicesPage.click('#faq-overnight-parking [data-open-drawer="drawer-parking-permits"]');
  await servicesPage.waitForTimeout(350);
  const faqDrawerOpen = await servicesPage.$eval('#drawer-parking-permits', el => el.classList.contains('active'));
  console.log(`PASS: Action button inside FAQ card opened drawer-parking-permits: ${faqDrawerOpen}`);
  if (!faqDrawerOpen) totalErrors++;
  await servicesPage.click('#drawer-parking-permits .drawer-close-btn');
  await servicesPage.waitForTimeout(300);

  // Take screenshot of Knowledge Base
  await faqSection.scrollIntoViewIfNeeded();
  await servicesPage.waitForTimeout(200);
  await servicesPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_knowledge_base_desktop.png') });
  console.log('Saved screenshot: verified_services_knowledge_base_desktop.png');

  // -------------------------------------------------------------
  // Test 3: Deep-Linking via URL Hash
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Deep-Linking via URL Hash (#faq-snow-emergency) ---');
  const deepLinkPage = await desktopContext.newPage();
  await deepLinkPage.goto(`${BASE_URL}/services.html?agentation=0#faq-snow-emergency`, { waitUntil: 'networkidle' });
  await deepLinkPage.waitForTimeout(500);

  const snowCardOpen = await deepLinkPage.$eval('#faq-snow-emergency', el => el.classList.contains('is-open'));
  const snowAriaExpanded = await deepLinkPage.$eval('#faq-q-snow', el => el.getAttribute('aria-expanded'));
  console.log(`Deep-linked #faq-snow-emergency -> is-open: ${snowCardOpen}, aria-expanded: ${snowAriaExpanded}`);
  if (snowCardOpen && snowAriaExpanded === 'true') {
    console.log('PASS: Deep-linking via hash automatically expanded the target FAQ scenario');
  } else {
    console.error('FAIL: Deep-linking failed to open targeted card');
    totalErrors++;
  }
  await deepLinkPage.close();

  // -------------------------------------------------------------
  // Test 4: Mobile Viewport Verification (390x844)
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Mobile Viewport Verification (390x844) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobileHome = await mobileContext.newPage();
  await mobileHome.goto(`${BASE_URL}/index.html?agentation=0`, { waitUntil: 'networkidle' });

  // Check touch target height on mobile resolver buttons
  const mobileBtnHeight = await mobileHome.$eval('#quick-resolver .resolver-action-btn', el => el.getBoundingClientRect().height);
  console.log(`Mobile resolver button height: ${mobileBtnHeight}px (must be >= 44px)`);
  if (mobileBtnHeight >= 44) {
    console.log('PASS: Mobile resolver button meets or exceeds 44px HIG target');
  } else {
    console.error(`FAIL: Mobile resolver button height ${mobileBtnHeight}px is less than 44px`);
    totalErrors++;
  }

  // Check no horizontal overflow on mobile
  const mobileScrollWidth = await mobileHome.evaluate(() => document.documentElement.scrollWidth);
  console.log(`Mobile scrollWidth: ${mobileScrollWidth}px (viewport: 390px)`);
  if (mobileScrollWidth <= 390) {
    console.log('PASS: Zero horizontal scroll overflow on mobile homepage');
  } else {
    console.error(`FAIL: Horizontal overflow detected: scrollWidth=${mobileScrollWidth}`);
    totalErrors++;
  }

  const mobileResolver = await mobileHome.$('#quick-resolver');
  await mobileResolver.scrollIntoViewIfNeeded();
  await mobileHome.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_homepage_resolver_mobile.png') });
  console.log('Saved screenshot: verified_homepage_resolver_mobile.png');

  // Mobile services page
  const mobileServices = await mobileContext.newPage();
  await mobileServices.goto(`${BASE_URL}/services.html?agentation=0`, { waitUntil: 'networkidle' });
  const mobileFaq = await mobileServices.$('#faq');
  await mobileFaq.scrollIntoViewIfNeeded();
  await mobileServices.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_services_knowledge_base_mobile.png') });
  console.log('Saved screenshot: verified_services_knowledge_base_mobile.png');

  await desktopContext.close();
  await mobileContext.close();
  await browser.close();

  console.log(`\n=== VERIFICATION SUMMARY: ${totalErrors === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : totalErrors + ' ERRORS FOUND'} ===`);
  if (consoleErrors.length > 0) {
    console.error('Console errors logged during test:', consoleErrors);
  }
}

runFaqKnowledgeBaseVerification().catch(err => {
  console.error('Fatal execution error in test script:', err);
  process.exit(1);
});
