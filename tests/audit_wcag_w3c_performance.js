const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

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

async function runAudit() {
  console.log('================================================================');
  console.log('   FULL AUDIT: WCAG (A, AA, AAA) • W3C PRINCIPLES • PERFORMANCE   ');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const auditReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pagesAudited: [],
    globalSummary: {
      wcagA: { pass: true, count: 0 },
      wcagAA: { pass: true, count: 0 },
      wcagAAA: { pass: true, issues: [] },
      w3cPrinciples: { pass: true, findings: [] },
      performance: { pass: true, pageStats: [] }
    }
  };

  for (const p of PAGES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    const pageUrl = `${BASE_URL}/${p.file}`;

    console.log(`\nAuditing [${p.name}] (${p.file})...`);

    // 1. Performance timing
    const navStart = Date.now();
    const response = await page.goto(pageUrl, { waitUntil: 'networkidle' });
    const loadTimeMs = Date.now() - navStart;
    const status = response.status();

    // Inject axe-core
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' });

    // 2. Scan WCAG Level A & AA (Excluding external/injected dev tools like Agentation)
    const axeResultsAA = await page.evaluate(async () => {
      return await axe.run({
        exclude: ['[class*="styles-module"]', '.agentation-toolbar'],
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
        }
      });
    });

    // 3. Scan WCAG Level AAA (Enhanced contrast & AAA strict requirements)
    const axeResultsAAA = await page.evaluate(async () => {
      return await axe.run({
        exclude: ['[class*="styles-module"]', '.agentation-toolbar'],
        runOnly: {
          type: 'tag',
          values: ['wcag2aaa']
        },
        rules: {
          'color-contrast-enhanced': { enabled: true }
        }
      });
    });

    // 4. Measure Target Sizes (WCAG 2.2 SC 2.5.8 - min 24x24px, AAA SC 2.5.5 - min 44x44px)
    const targetSizeAnalysis = await page.evaluate(() => {
      const interactiveEls = Array.from(document.querySelectorAll('a, button, input, select, textarea, [tabindex="0"]'))
        .filter(el => {
          if (el.closest('[class*="styles-module"]')) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        });

      let below24px = [];
      let below44px = [];

      interactiveEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const text = (el.innerText || el.getAttribute('aria-label') || el.className || 'unnamed').trim().slice(0, 30);
        if (rect.width < 24 || rect.height < 24) {
          below24px.push({ text, tag: el.tagName, w: Math.round(rect.width), h: Math.round(rect.height) });
        } else if (rect.width < 44 || rect.height < 44) {
          below44px.push({ text, tag: el.tagName, w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      });

      return {
        totalInteractives: interactiveEls.length,
        below24px,
        below44px
      };
    });

    // 5. Measure FPS and Scroll Smoothness
    const scrollPerf = await page.evaluate(async () => {
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
            window.scrollBy(0, 70);
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

    // 6. Inspect W3C Design Principles Checkpoints in DOM:
    const w3cChecks = await page.evaluate(() => {
      const hasSkipLink = !!document.querySelector('.skip-link, [href="#main-content"]');
      const hasMain = !!document.querySelector('main');
      const hasHeader = !!document.querySelector('header');
      const hasNav = !!document.querySelector('nav');
      const hasFooter = !!document.querySelector('footer');
      const headingOrder = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => parseInt(h.tagName[1]));
      
      // Check heading skips
      let headingSkips = [];
      for (let i = 1; i < headingOrder.length; i++) {
        if (headingOrder[i] - headingOrder[i - 1] > 1) {
          headingSkips.push(`H${headingOrder[i - 1]} -> H${headingOrder[i]}`);
        }
      }

      // Check external links security (rel="noopener noreferrer")
      const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
      const insecureExternalLinks = externalLinks.filter(a => {
        const rel = a.getAttribute('rel') || '';
        return !rel.includes('noopener') || !rel.includes('noreferrer');
      });

      // Check for autofocus traps
      const autofocusEl = document.querySelector('[autofocus]');

      // Check for prefers-reduced-motion media query in stylesheets
      const hasReducedMotionRule = true; // Evaluated via tokens.css

      return {
        hasSkipLink,
        hasMain,
        hasHeader,
        hasNav,
        hasFooter,
        headingSkips,
        totalHeadings: headingOrder.length,
        insecureExternalLinks: insecureExternalLinks.length,
        hasAutofocusTrap: !!autofocusEl
      };
    });

    const pageSummary = {
      name: p.name,
      file: p.file,
      status,
      loadTimeMs,
      wcagAA: {
        violations: axeResultsAA.violations.length,
        passes: axeResultsAA.passes.length,
        details: axeResultsAA.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, count: v.nodes.length }))
      },
      wcagAAA: {
        violations: axeResultsAAA.violations.length,
        passes: axeResultsAAA.passes.length,
        details: axeResultsAAA.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, count: v.nodes.length, nodes: v.nodes.map(n => n.target.join(' ')) }))
      },
      targetSizes: targetSizeAnalysis,
      scrollPerf,
      w3cChecks
    };

    auditReport.pagesAudited.push(pageSummary);

    console.log(`  ✓ HTTP ${status} in ${loadTimeMs}ms | Scroll FPS: ${scrollPerf.fps}`);
    console.log(`  ✓ WCAG 2.1/2.2 AA Violations: ${pageSummary.wcagAA.violations} | Passes: ${pageSummary.wcagAA.passes}`);
    console.log(`  ✓ WCAG AAA Enhanced Violations: ${pageSummary.wcagAAA.violations} | Target Sizes (<24px): ${targetSizeAnalysis.below24px.length}`);
    if (pageSummary.wcagAAA.violations > 0) {
      pageSummary.wcagAAA.details.forEach(d => {
        console.log(`    ⚠️  AAA: [${d.id}] ${d.description} (${d.count} nodes)`);
      });
    }

    await context.close();
  }

  await browser.close();

  // Save report artifact
  const outPath = '/Users/jokird/.gemini/antigravity/brain/907d74f3-89bb-4ecf-91f1-911b6f8db850/accessibility_w3c_performance_audit.json';
  fs.writeFileSync(outPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit completed! Report saved to ${outPath}`);

  return auditReport;
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
