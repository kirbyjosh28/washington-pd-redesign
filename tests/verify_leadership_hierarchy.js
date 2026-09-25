const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting Leadership Hierarchy Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1710, height: 984 }
  });
  const page = await context.newPage();

  const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
  const artifactDir = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850';

  // 1. Desktop Test (1710x984)
  console.log('Testing Desktop 1710x984...');
  await page.goto(`${BASE_URL}/leadership.html?agentation=0`, { waitUntil: 'networkidle' });

  // Verify Chief Jeff Stevens card exists
  const chiefName = await page.textContent('.wpd-leader-name');
  console.log('Chief Name found:', chiefName.trim());
  if (!chiefName.includes('Jeff Stevens')) throw new Error('Chief Jeff Stevens card not found');

  // Verify Deputy Chiefs Section
  const deputyCards = await page.$$('.wpd-deputy-card');
  console.log(`Found ${deputyCards.length} Deputy Chief cards (expected 2)`);
  if (deputyCards.length !== 2) throw new Error(`Expected 2 Deputy Chief cards, found ${deputyCards.length}`);

  const deputyNames = await page.$$eval('.wpd-deputy-name', els => els.map(e => e.textContent.trim()));
  console.log('Deputy Chief names:', deputyNames);
  if (!deputyNames[0].includes('Steve Smith') || !deputyNames[1].includes('Brian Simpson')) {
    throw new Error('Deputy Chief names do not match Steve Smith & Brian Simpson');
  }

  // Verify Sergeants Cadre Section
  const sergeantCards = await page.$$('.wpd-sergeant-card');
  console.log(`Found ${sergeantCards.length} Sergeant cards (expected 3)`);
  if (sergeantCards.length !== 3) throw new Error(`Expected 3 Sergeant cards, found ${sergeantCards.length}`);

  const sergeantTitles = await page.$$eval('.wpd-sergeant-card .civic-service-card-title', els => els.map(e => e.textContent.trim()));
  console.log('Sergeant card titles:', sergeantTitles);

  // Verify Statutory Accountability Strip
  const accountabilityTitle = await page.textContent('.wpd-accountability-title');
  console.log('Accountability strip title:', accountabilityTitle.trim());
  if (!accountabilityTitle.includes('Mandatory 24-Hour Supervisory Review')) {
    throw new Error('Accountability strip title missing or incorrect');
  }

  // Check Commendation Drawer Trigger from Deputy Chief Card
  console.log('Testing Commendation drawer trigger...');
  const commendBtn = await page.$('.wpd-deputy-footer button[data-open-drawer="drawer-commendation"]');
  if (commendBtn) {
    await commendBtn.click();
    await page.waitForTimeout(400);
    const isDrawerOpen = await page.$eval('#drawer-commendation', el => el.classList.contains('active') || el.classList.contains('drawer-open') || getComputedStyle(el).display !== 'none');
    console.log('Commendation drawer opened successfully:', isDrawerOpen);
    // Close drawer
    await page.click('#drawer-commendation [data-close-drawer]');
    await page.waitForTimeout(300);
  }

  // Check desktop overflow
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Desktop horizontal overflow:', desktopOverflow);
  if (desktopOverflow) throw new Error('Desktop layout has horizontal overflow!');

  // Capture Desktop Screenshot
  await page.screenshot({
    path: path.join(artifactDir, 'verified_leadership_hierarchy_desktop.png'),
    fullPage: false
  });
  console.log('Saved verified_leadership_hierarchy_desktop.png');

  // Scroll into view of the command hierarchy and capture specific shots
  await page.locator('#deputy-chiefs').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(artifactDir, 'verified_leadership_deputies_desktop.png')
  });
  console.log('Saved verified_leadership_deputies_desktop.png');

  await page.locator('#supervisory-sergeants').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(artifactDir, 'verified_leadership_sergeants_desktop.png')
  });
  console.log('Saved verified_leadership_sergeants_desktop.png');

  // 2. Mobile Viewport Test (390x844 iPhone 14 / modern device)
  console.log('Testing Mobile 390x844...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/leadership.html?agentation=0`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow:', mobileOverflow);
  if (mobileOverflow) throw new Error('Mobile layout has horizontal overflow on 390px viewport!');

  // Scroll to Deputy section and verify mobile stacking
  await page.locator('#deputy-chiefs').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Check if deputy cards are full width (single column)
  const deputyCardBox = await page.locator('.wpd-deputy-card').first().boundingBox();
  console.log('Mobile deputy card bounding box:', deputyCardBox);
  if (deputyCardBox.width > 390) throw new Error('Deputy card exceeds mobile viewport width');

  await page.screenshot({
    path: path.join(artifactDir, 'verified_leadership_hierarchy_mobile.png')
  });
  console.log('Saved verified_leadership_hierarchy_mobile.png');

  await browser.close();
  console.log('✅ ALL LEADERSHIP HIERARCHY VERIFICATIONS PASSED SUCCESSFULLY!');
})();
