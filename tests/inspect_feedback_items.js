const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1710, height: 984 }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });

  const heroAccent = await page.locator('.hero-editorial-content .text-accent-editorial em');
  const heroStyle = await heroAccent.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      color: cs.color,
      fontFamily: cs.fontFamily,
      fontStyle: cs.fontStyle,
      parentColor: window.getComputedStyle(el.parentElement).color
    };
  });
  console.log('Hero accent em style:', JSON.stringify(heroStyle, null, 2));

  const resolverBox = await page.locator('.resolver-gateway-box');
  const resolverStyle = await resolverBox.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      border: cs.border,
      borderRadius: cs.borderRadius
    };
  });
  console.log('Resolver box style:', JSON.stringify(resolverStyle, null, 2));

  const heading = page.locator('#hero-heading');
  await heading.screenshot({ path: '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850/before_hero_accent.png' });

  await resolverBox.screenshot({ path: '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850/before_resolver_box.png' });

  await browser.close();
  console.log('Screenshots saved.');
})();
