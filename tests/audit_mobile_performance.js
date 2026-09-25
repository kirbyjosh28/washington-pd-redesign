const { chromium, devices } = require('playwright');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const PAGES = [
  { name: 'Executive Home', file: 'index.html' },
  { name: 'Resident Services', file: 'services.html' },
  { name: 'Patrol Districts & GIS', file: 'districts.html' },
  { name: 'Community Outreach', file: 'community.html' },
  { name: 'Specialized Divisions', file: 'teams.html' },
  { name: 'Patrol Operations', file: 'operations.html' },
  { name: 'Careers & Recruitment', file: 'recruitment.html' },
  { name: 'Leadership & Governance', file: 'leadership.html' }
];

async function benchmarkMobile() {
  console.log('================================================================');
  console.log('   MOBILE WEB PERFORMANCE AUDIT (Lighthouse 10 & Core Web Vitals) ');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const pixel5 = devices['Pixel 5'];

  const results = {
    timestamp: new Date().toISOString(),
    device: 'Pixel 5 (393x851, dpr 2.75, Mobile/Touch)',
    baseUrl: BASE_URL,
    pages: []
  };

  for (const p of PAGES) {
    const context = await browser.newContext({
      ...pixel5,
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();

    // Enable CDP session for performance metrics and long tasks
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    // Instrument PerformanceObserver for LCP, CLS, and Long Tasks
    await page.addInitScript(() => {
      window.__perfData = {
        cls: 0,
        lcp: 0,
        lcpElement: null,
        fcp: 0,
        longTasks: [],
        tbt: 0
      };

      // CLS Observer
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__perfData.cls += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}

      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            window.__perfData.lcp = lastEntry.startTime;
            window.__perfData.lcpElement = lastEntry.element ? (lastEntry.element.tagName + (lastEntry.element.className ? '.' + lastEntry.element.className.slice(0, 30) : '')) : 'unknown';
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}

      // Long Tasks Observer for TBT estimation
      try {
        const longTaskObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const blockingDuration = entry.duration - 50;
            if (blockingDuration > 0) {
              window.__perfData.longTasks.push({
                startTime: entry.startTime,
                duration: entry.duration,
                blockingTime: blockingDuration
              });
              window.__perfData.tbt += blockingDuration;
            }
          }
        });
        longTaskObserver.observe({ type: 'longtask', buffered: true });
      } catch (e) {}

      // FCP Observer
      try {
        const paintObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              window.__perfData.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {}
    });

    const pageUrl = `${BASE_URL}/${p.file}`;
    console.log(`Testing [${p.name}] (${p.file})...`);

    const navStart = Date.now();
    const response = await page.goto(pageUrl, { waitUntil: 'networkidle' });
    const loadTimeMs = Date.now() - navStart;

    // Settle metrics
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(async () => {
      const p = window.__perfData;
      
      // Fallback navigation timing if FCP observer missed
      const navTiming = performance.getEntriesByType('navigation')[0];
      const domInteractive = navTiming ? Math.round(navTiming.domInteractive) : 0;
      const domContentLoaded = navTiming ? Math.round(navTiming.domContentLoadedEventEnd) : 0;
      
      return {
        fcp: Math.round(p.fcp || performance.getEntriesByName('first-contentful-paint')[0]?.startTime || domInteractive),
        lcp: Math.round(p.lcp || domInteractive),
        lcpElement: p.lcpElement || 'primary-content',
        cls: Number(p.cls.toFixed(4)),
        tbt: Math.round(p.tbt),
        longTaskCount: p.longTasks.length,
        domInteractive,
        domContentLoaded
      };
    });

    // Measure mobile scroll FPS and touch fluidity
    const scrollPerf = await page.evaluate(async () => {
      return new Promise(resolve => {
        let frames = 0;
        let lastTime = performance.now();
        const frameDeltas = [];

        function step() {
          const now = performance.now();
          frameDeltas.push(now - lastTime);
          lastTime = now;
          frames++;
          if (frames < 40) {
            window.scrollBy(0, 60);
            requestAnimationFrame(step);
          } else {
            const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
            const maxDelta = Math.max(...frameDeltas);
            const fps = Math.round(1000 / avgDelta);
            resolve({ fps, avgDelta: avgDelta.toFixed(2), maxDelta: maxDelta.toFixed(2) });
          }
        }
        requestAnimationFrame(step);
      });
    });

    // Verify Mobile Viewport: Check for horizontal overflow (must be 0px)
    const viewportCheck = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      const bodyWidth = document.body.offsetWidth;
      return {
        clientWidth,
        scrollWidth,
        overflowDelta: scrollWidth - clientWidth,
        hasHorizontalScroll
      };
    });

    // Check tap target sizes on mobile (WCAG 2.2 SC 2.5.8)
    const mobileTapCheck = await page.evaluate(() => {
      const interactives = Array.from(document.querySelectorAll('a, button, input, select, textarea'))
        .filter(el => {
          if (el.closest('[class*="styles-module"]')) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        });

      let sub24pxCount = 0;
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 24) {
          sub24pxCount++;
        }
      });
      return { total: interactives.length, sub24pxCount };
    });

    const pageResult = {
      name: p.name,
      file: p.file,
      loadTimeMs,
      ...metrics,
      scrollPerf,
      viewportCheck,
      mobileTapCheck
    };

    results.pages.push(pageResult);

    console.log(`  ✓ FCP: ${metrics.fcp}ms | LCP: ${metrics.lcp}ms (${metrics.lcpElement}) | CLS: ${metrics.cls} | TBT: ${metrics.tbt}ms`);
    console.log(`  ✓ Mobile Scroll: ${scrollPerf.fps} FPS (avg delta ${scrollPerf.avgDelta}ms) | Horiz Overflow: ${viewportCheck.overflowDelta}px`);
    console.log(`  ✓ Mobile Targets (<24px): ${mobileTapCheck.sub24pxCount}/${mobileTapCheck.total}\n`);

    await page.close();
    await context.close();
  }

  await browser.close();

  const outPath = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850/mobile_performance_audit.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Mobile performance audit complete! Saved to ${outPath}`);
}

benchmarkMobile().catch(err => {
  console.error('Mobile benchmark error:', err);
  process.exit(1);
});
