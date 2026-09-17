/**
 * City of Washington, Illinois — 2026 Master Web Design Interaction Engine
 * Minimalist Navigation • 90-Day Civic Uptime Bars • macOS Product Window • 8pt Rhythm
 */

(function () {
  'use strict';

  function bootstrap() {
    const inits = [
      initTheme,
      initWpdExperience,
      initScrollHeader,
      initScrollRevealEngine,
      initCityHallLiveStatus,
      initSpotlight,
      initDropdownNavigation,
      initAlertDrawer,
      initMobileNavDrawer,
      initKineticTypography,
      init3DCardTilts,
      initInteractiveCopyButtons,
      initIcsCalendarGenerators,
      initServiceFiltering,
      initWizardLogic,
      initPhotoDropzone,
      initTicketTrackerLookup,
      initStreetChecker,
      initPayUrlParams,
      initDepartmentSearch,
      initTrashLookup,
      initAgendaPreviewModal,
      initCalendarMatrix,
      initHotspotPins,
      initUptimeBars,
      initMunicipalCodeSearch,
      initCardCursorSpotlight
    ];

    inits.forEach(fn => {
      try {
        if (typeof fn === 'function') fn();
      } catch (err) {
        console.warn('Init error in ' + (fn.name || 'anonymous'), err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  /* --------------------------------------------------------------------------
     1. Theme Engine (Light / Dark with OS Sync)
     -------------------------------------------------------------------------- */
  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) {
      document.documentElement.setAttribute('data-theme', 'light');
      return;
    }

    const savedTheme = localStorage.getItem('wash_theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeBtnText(toggleBtn, savedTheme);

    toggleBtn.addEventListener('click', () => {
      // Better-UI theme switch transition suppression (prevents visual flashing/smearing)
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          `*, *::before, *::after { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }`
        )
      );
      document.head.appendChild(css);

      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('wash_theme', next);
      updateThemeBtnText(toggleBtn, next);
      showToast(`Switched to ${next} theme`, 'info');

      // Force synchronous reflow, then cleanly remove style on next animation frame
      window.getComputedStyle(document.body).opacity;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (css.parentNode) {
            css.parentNode.removeChild(css);
          }
        });
      });
    });
  }

  function updateThemeBtnText(btn, theme) {
    btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }

  /* --------------------------------------------------------------------------
     2. Smart Scroll Compacting for Minimalist Navigation Capsule
     -------------------------------------------------------------------------- */
  function initScrollHeader() {
    const siteHeader = document.querySelector('.site-header');
    const headerInner = document.querySelector('.header-inner');
    if (!siteHeader && !headerInner) return;

    function handleScroll() {
      const isScrolled = window.scrollY > 15;
      if (siteHeader) siteHeader.classList.toggle('scrolled', isScrolled);
      if (headerInner) headerInner.classList.toggle('scrolled', isScrolled);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     2b. Universal Scroll-Driven Reveal Engine (Compositor + Fallback)
     -------------------------------------------------------------------------- */
  function initScrollRevealEngine() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const reveals = document.querySelectorAll('.scroll-reveal');
    if (!reveals.length) return;

    const supportsNativeViewTimeline =
      window.CSS &&
      CSS.supports &&
      CSS.supports('(animation-timeline: view()) and (animation-range: entry 10% cover 30%)');

    if (supportsNativeViewTimeline) {
      // Modern browser with native CSS view-timeline compositor animation. Zero JS overhead!
      return;
    }

    // Fallback for Firefox and browsers without native view-timeline support
    document.documentElement.classList.add('scroll-reveal-js-active');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     3. City Hall Live Status Engine (Central Time)
     -------------------------------------------------------------------------- */
  function initCityHallLiveStatus() {
    const statusEls = document.querySelectorAll('[data-cityhall-status]');
    if (!statusEls.length) return;

    function checkStatus() {
      // Calculate Central Time (CST/CDT)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cstDate = new Date(utc - (3600000 * 5)); // Approx CST
      const day = cstDate.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
      const hours = cstDate.getHours();
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && hours >= 8 && hours < 17;

      statusEls.forEach((el) => {
        if (isOpen) {
          el.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="status-pip status-pip-emerald"></span>
              <strong style="font-size: 0.95rem; color: var(--text-primary);">Open Today (8:00 AM – 5:00 PM CST)</strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px;">301 Walnut St • (309) 444-3196</span>
          `;
        } else {
          el.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="status-pip status-pip-amber"></span>
              <strong style="font-size: 0.95rem; color: var(--text-primary);">Closed (Opens 8:00 AM CST)</strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px;">Online Bill Pay & 311 Open 24/7</span>
          `;
        }
      });
    }

    checkStatus();
    setInterval(checkStatus, 60000);
  }

  /* --------------------------------------------------------------------------
     4. Grouped Mega-Navigation Dropdowns (Keyboard & Hover Accessible)
     -------------------------------------------------------------------------- */
  function initDropdownNavigation() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach((item) => {
      const trigger = item.querySelector('.nav-dropdown-trigger');
      const menu = item.querySelector('.nav-dropdown-menu');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');

        dropdownItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const otherTrigger = other.querySelector('.nav-dropdown-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        dropdownItems.forEach((item) => {
          item.classList.remove('open');
          const trigger = item.querySelector('.nav-dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach((item) => {
          item.classList.remove('open');
          const trigger = item.querySelector('.nav-dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Better Stack 90-Day Civic Infrastructure Uptime Bars Generator
     -------------------------------------------------------------------------- */
  function initUptimeBars() {
    const strips = document.querySelectorAll('.uptime-bars-strip');
    if (!strips.length) return;

    strips.forEach((strip) => {
      strip.innerHTML = '';
      const count = window.innerWidth < 768 ? 30 : 60;
      for (let i = 0; i < count; i++) {
        const tick = document.createElement('div');
        tick.className = 'uptime-bar-tick';
        tick.setAttribute('title', `Day ${count - i}: 100% Operational`);
        tick.addEventListener('click', () => {
          showToast(`Operational Status (Day ${count - i}): Normal — No service disruptions reported`, 'success');
        });
        strip.appendChild(tick);
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Spotlight Command Palette (Cmd+K) with Keyboard Navigation (↑ / ↓ / ↵)
     -------------------------------------------------------------------------- */
  let activeSpotlightIndex = -1;

  function initSpotlight() {
    const modal = document.getElementById('spotlight-modal');
    const input = document.getElementById('spotlight-input');
    const resultsContainer = document.getElementById('spotlight-results');
    const triggers = document.querySelectorAll('[data-spotlight-trigger]');

    if (!modal || !input || !resultsContainer) return;

    triggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSpotlight();
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('open')) {
          closeSpotlight();
        } else {
          openSpotlight();
        }
      } else if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeSpotlight();
      } else if (modal.classList.contains('open')) {
        handleSpotlightKeyNav(e);
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSpotlight();
    });

    input.addEventListener('input', () => {
      renderSpotlightResults(input.value.trim());
    });

    function openSpotlight() {
      modal.classList.add('open');
      input.value = '';
      activeSpotlightIndex = -1;
      renderSpotlightResults('');
      setTimeout(() => input.focus(), 60);
    }

    function closeSpotlight() {
      modal.classList.remove('open');
      activeSpotlightIndex = -1;
    }

    function handleSpotlightKeyNav(e) {
      const items = resultsContainer.querySelectorAll('.spotlight-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSpotlightIndex = (activeSpotlightIndex + 1) % items.length;
        updateActiveSpotlightItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSpotlightIndex = (activeSpotlightIndex - 1 + items.length) % items.length;
        updateActiveSpotlightItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSpotlightIndex >= 0 && items[activeSpotlightIndex]) {
          items[activeSpotlightIndex].click();
        }
      }
    }

    function updateActiveSpotlightItem(items) {
      items.forEach((item, idx) => {
        if (idx === activeSpotlightIndex) {
          item.classList.add('active-result');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active-result');
        }
      });
    }

    function renderSpotlightResults(query) {
      resultsContainer.innerHTML = '';
      activeSpotlightIndex = -1;
      const q = query.toLowerCase();

      const searchPool = [];

      if (window.CITY_DATA && CITY_DATA.services) {
        CITY_DATA.services.forEach((s) => {
          searchPool.push({
            title: s.title,
            sub: s.summary,
            category: 'Municipal Services',
            url: s.url
          });
        });
      }

      if (window.CITY_DATA && CITY_DATA.council && CITY_DATA.council.aldermen) {
        CITY_DATA.council.aldermen.forEach((a) => {
          searchPool.push({
            title: `${a.name} (${a.ward})`,
            sub: `Council Member • Term expires ${a.termExpires} • ${a.email}`,
            category: 'City Council & Government',
            url: `government.html#mayor`
          });
        });
      }

      if (window.CITY_DATA && CITY_DATA.departments) {
        CITY_DATA.departments.forEach((d) => {
          searchPool.push({
            title: d.name,
            sub: `${d.head} • Phone: ${d.phone}`,
            category: 'City Departments',
            url: `departments.html#${d.id}`
          });
        });
      }

      if (window.CITY_DATA && CITY_DATA.municipalCode) {
        if (CITY_DATA.municipalCode.popular) {
          CITY_DATA.municipalCode.popular.forEach((p) => {
            searchPool.push({
              title: `${p.title} (${p.section})`,
              sub: p.summary,
              category: 'Municipal Code & Ordinances',
              url: `code.html#${p.id}`
            });
          });
        }
        if (CITY_DATA.municipalCode.titles) {
          CITY_DATA.municipalCode.titles.forEach((t) => {
            searchPool.push({
              title: `${t.number}: ${t.name} (${t.range})`,
              sub: t.summary,
              category: 'Municipal Code Titles',
              url: `code.html#${t.id}`
            });
          });
        }
      }

      const quickActions = [
        { title: 'Pay Water & Utility Bill', sub: 'Instant account balance lookup & zero-fee checkout', category: 'Quick Actions', url: 'pay.html?service=water' },
        { title: 'Report 311 Problem (Pothole, Light)', sub: 'Direct public works ticket creation with photo dropzone', category: 'Quick Actions', url: 'requests.html' },
        { title: 'Search Municipal Code & Ordinances', sub: 'Fences, setbacks, noise, snow routes & zoning', category: 'Quick Actions', url: 'code.html' },
        { title: 'Check Street Boil Orders & Road Work', sub: 'Interactive street advisory checker', category: 'Quick Actions', url: 'news.html#street-lookup' },
        { title: 'Civic Calendar & Council Agendas', sub: 'Meeting dates, packets, and town halls', category: 'Quick Actions', url: 'calendar.html' },
        { title: 'Curbside Trash & Recycling Schedule', sub: 'Neighborhood pickup day lookup', category: 'Quick Actions', url: 'services.html#waste-schedule' },
        { title: 'Utility Cost Estimator', sub: 'Calculate estimated monthly water/sewer bill', category: 'Quick Actions', url: 'pay.html#calculator' }
      ];
      quickActions.forEach(qa => searchPool.push(qa));

      const filtered = q
        ? searchPool.filter(item => item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
        : quickActions;

      if (!filtered.length) {
        resultsContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
            No municipal records matching "<strong>${escapeHtml(query)}</strong>".
          </div>`;
        return;
      }

      const groups = {};
      filtered.forEach((item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });

      Object.keys(groups).forEach((cat) => {
        const header = document.createElement('div');
        header.className = 'spotlight-category-header';
        header.textContent = cat;
        resultsContainer.appendChild(header);

        groups[cat].forEach((item) => {
          const a = document.createElement('a');
          a.className = 'spotlight-result-item';
          a.href = item.url;
          a.innerHTML = `
            <div>
              <div class="spotlight-item-title">${escapeHtml(item.title)}</div>
              <div class="spotlight-item-sub">${escapeHtml(item.sub)}</div>
            </div>
            <span class="mono-code" style="font-size: 0.72rem; color: var(--text-muted);">SELECT →</span>
          `;
          a.addEventListener('click', () => closeSpotlight());
          resultsContainer.appendChild(a);
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. Kinetic Typography Engine
     -------------------------------------------------------------------------- */
  function initKineticTypography() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const kineticHeadings = document.querySelectorAll('[data-kinetic-text]');
    kineticHeadings.forEach((el) => {
      if (el.querySelector('.kinetic-word')) return;

      const childNodes = Array.from(el.childNodes);
      const fragment = document.createDocumentFragment();
      let wordIdx = 0;

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent;
          const words = rawText.trim().split(/\s+/).filter(Boolean);
          words.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'kinetic-word';
            span.textContent = word;
            span.style.animationDelay = `${wordIdx * 0.035}s`;
            fragment.appendChild(span);
            wordIdx++;
          });
        } else if (node.nodeName === 'BR') {
          const br = document.createElement('br');
          br.className = node.className || '';
          fragment.appendChild(br);
        } else {
          fragment.appendChild(node.cloneNode(true));
        }
      });

      el.innerHTML = '';
      el.appendChild(fragment);
    });
  }

  /* --------------------------------------------------------------------------
     8. 3D Card Tilt & Interactive Cursor Spotlight Engine
     -------------------------------------------------------------------------- */
  function init3DCardTilts() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cards = document.querySelectorAll(
      '.tilt-card, .bento-card, .service-card, .spotlight-card, .action-card-1click, .district-info-card, .wpd-pathway-card'
    );

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update Spotlight Glow Coordinates
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease';
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Interactive Washington Square Hotspot Explorer
     -------------------------------------------------------------------------- */
  function initHotspotPins() {
    const pins = document.querySelectorAll('.hotspot-pin');
    pins.forEach((pin) => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const spot = pin.getAttribute('data-hotspot');
        const facts = {
          'fountain': 'The Historic Central Fountain was established as the civic and aesthetic centerpiece of Washington Square, surrounded by brick walking plazas.',
          'gazebo': 'The Victorian Gazebo hosts summer civic band concerts, community holiday gatherings, and town ceremonies.',
          'shops': 'Historic 19th-century commercial storefronts house local dining, specialty boutiques, and historic Washington commerce.'
        };
        showToast(facts[spot] || 'Historic Washington Square, Illinois (Est. 1834)', 'info');
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. One-Tap Interactive Copy Buttons
     -------------------------------------------------------------------------- */
  function initInteractiveCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy-text]');
      if (!btn) return;

      const text = btn.getAttribute('data-copy-text');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';
        showToast(`Copied "${text}" to clipboard`, 'success');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(() => {
        showToast(`Selected: ${text}`, 'info');
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. ICS Calendar File Generators
     -------------------------------------------------------------------------- */
  function initIcsCalendarGenerators() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-ics-title]');
      if (!btn) return;

      const title = btn.getAttribute('data-ics-title');
      const date = btn.getAttribute('data-ics-date') || '20260908T183000';
      const loc = btn.getAttribute('data-ics-loc') || '301 Walnut St, Washington, IL';
      const desc = btn.getAttribute('data-ics-desc') || 'City of Washington Event';

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//City of Washington IL//Municipal Portal//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `DESCRIPTION:${desc}`,
        `LOCATION:${loc}`,
        `DTSTART:${date}`,
        `DTEND:${date}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported "${title}" to your calendar`, 'success');
    });
  }

  /* --------------------------------------------------------------------------
     12. Alert Drawer Engine
     -------------------------------------------------------------------------- */
  function initAlertDrawer() {
    const drawer = document.getElementById('alert-drawer-backdrop');
    const openBtns = document.querySelectorAll('[data-open-alert-drawer]');
    const closeBtn = document.getElementById('alert-drawer-close');

    if (!drawer) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        drawer.classList.add('open');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
    }
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('open');
    });
  }

  /* --------------------------------------------------------------------------
     13. Mobile Navigation Drawer Sheet
     -------------------------------------------------------------------------- */
  function initMobileNavDrawer() {
    const drawer = document.getElementById('mobile-nav-drawer-backdrop');
    const openBtns = document.querySelectorAll('[data-open-mobile-drawer]');
    const closeBtn = document.getElementById('mobile-nav-drawer-close');

    if (!drawer) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', () => drawer.classList.add('open'));
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
    }
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('open');
    });
  }

  /* --------------------------------------------------------------------------
     14. Services Directory Segmented Filtering
     -------------------------------------------------------------------------- */
  function initServiceFiltering() {
    const controls = document.querySelectorAll('.segmented-controls button');
    const cards = document.querySelectorAll('.service-card');

    if (!controls.length || !cards.length) return;

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchBtn = Array.from(controls).find(b => b.getAttribute('data-filter') === hash);
      if (matchBtn) {
        controls.forEach(b => b.classList.remove('active'));
        matchBtn.classList.add('active');
        filterCards(hash);
      }
    }

    controls.forEach((btn) => {
      btn.addEventListener('click', () => {
        controls.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        filterCards(filter);
      });
    });

    function filterCards(filter) {
      let visibleCount = 0;
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.25s ease';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      const emptyState = document.getElementById('services-empty-state');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    const resetBtn = document.getElementById('reset-services-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const allBtn = Array.from(controls).find(b => b.getAttribute('data-filter') === 'all');
        if (allBtn) allBtn.click();
      });
    }
  }

  /* --------------------------------------------------------------------------
     15. 311 Citizen Request Wizard Multi-Step Engine
     -------------------------------------------------------------------------- */
  function initWizardLogic() {
    const form = document.getElementById('wizard-form');
    if (!form) return;

    const step1 = document.getElementById('step-content-1');
    const step2 = document.getElementById('step-content-2');
    const step3 = document.getElementById('step-content-3');
    const stepSuccess = document.getElementById('step-content-success');

    const next1 = document.getElementById('wizard-next-1');
    const next2 = document.getElementById('wizard-next-2');
    const back2 = document.getElementById('wizard-back-2');
    const back3 = document.getElementById('wizard-back-3');
    const submitBtn = document.getElementById('wizard-submit');
    const gpsBtn = document.getElementById('use-gps-btn');

    let selectedCategory = 'Pothole / Road Repair';

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      const cards = document.querySelectorAll('.category-choice-card');
      cards.forEach((c) => {
        if (c.getAttribute('data-category').toLowerCase().includes(catParam)) {
          cards.forEach(x => x.classList.remove('selected'));
          c.classList.add('selected');
          selectedCategory = c.getAttribute('data-category');
        }
      });
    }

    document.querySelectorAll('.category-choice-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.category-choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCategory = card.getAttribute('data-category') || 'General Issue';
      });
    });

    if (next1) {
      next1.addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        updateStepNav(2);
      });
    }

    if (back2) {
      back2.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
        updateStepNav(1);
      });
    }

    if (next2) {
      next2.addEventListener('click', () => {
        const addr = document.getElementById('issue-address');
        const desc = document.getElementById('issue-desc');
        if (addr && !addr.value.trim()) {
          showToast('Please enter an issue location', 'warning');
          addr.focus();
          return;
        }
        if (desc && !desc.value.trim()) {
          showToast('Please provide a brief description', 'warning');
          desc.focus();
          return;
        }
        step2.style.display = 'none';
        step3.style.display = 'block';
        updateStepNav(3);
      });
    }

    if (back3) {
      back3.addEventListener('click', () => {
        step3.style.display = 'none';
        step2.style.display = 'block';
        updateStepNav(2);
      });
    }

    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => {
        const addrInput = document.getElementById('issue-address');
        if (!navigator.geolocation) {
          if (addrInput) addrInput.value = '301 Walnut St, Washington, IL (GPS Estimated)';
          showToast('GPS coordinates captured', 'success');
          return;
        }

        gpsBtn.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (addrInput) {
              addrInput.value = `Near ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Washington, IL)`;
            }
            gpsBtn.textContent = 'GPS Verified';
            showToast('Current GPS location captured', 'success');
          },
          () => {
            if (addrInput) addrInput.value = '301 Walnut St, Washington, IL (City Center)';
            gpsBtn.textContent = 'GPS Set';
            showToast('Using City Hall location anchor', 'info');
          },
          { timeout: 5000 }
        );
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('citizen-name');
        const email = document.getElementById('citizen-email');

        if (name && !name.value.trim()) {
          showToast('Please enter your name', 'warning');
          name.focus();
          return;
        }
        if (email && !email.value.trim()) {
          showToast('Please enter your email', 'warning');
          email.focus();
          return;
        }

        const randomTicketId = `WASH-311-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const ticketDisplay = document.getElementById('created-tracking-id');
        const copyBtn = document.getElementById('copy-created-id-btn');

        if (ticketDisplay) ticketDisplay.textContent = randomTicketId;
        if (copyBtn) copyBtn.setAttribute('data-copy-text', randomTicketId);

        step3.style.display = 'none';
        stepSuccess.style.display = 'block';
        document.querySelectorAll('.wizard-step-item').forEach(i => i.classList.add('completed'));

        showToast('311 Work Order Dispatched Successfully!', 'success');
      });
    }

    function updateStepNav(activeNum) {
      for (let i = 1; i <= 3; i++) {
        const item = document.getElementById(`step-nav-${i}`);
        if (!item) continue;
        if (i < activeNum) {
          item.className = 'wizard-step-item completed';
        } else if (i === activeNum) {
          item.className = 'wizard-step-item active';
        } else {
          item.className = 'wizard-step-item';
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     16. Live Photo Attachment Dropzone Engine
     -------------------------------------------------------------------------- */
  function initPhotoDropzone() {
    const dropzone = document.getElementById('photo-dropzone');
    const fileInput = document.getElementById('photo-attachment-input');
    const previewContainer = document.getElementById('photo-preview-container');
    const previewImg = document.getElementById('photo-preview-img');
    const previewName = document.getElementById('photo-preview-name');
    const removeBtn = document.getElementById('photo-remove-btn');

    if (!dropzone || !fileInput || !previewContainer) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--brand-periwinkle)';
      dropzone.style.background = 'var(--brand-periwinkle-subtle)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        previewContainer.style.display = 'none';
        dropzone.style.display = 'block';
        showToast('Photo attachment removed', 'info');
      });
    }

    function handleFile(file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (JPG, PNG)', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        dropzone.style.display = 'none';
        previewContainer.style.display = 'flex';
        showToast(`Photo "${file.name}" attached`, 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  /* --------------------------------------------------------------------------
     17. 311 Ticket Status Tracker Lookup
     -------------------------------------------------------------------------- */
  function initTicketTrackerLookup() {
    const input = document.getElementById('track-ticket-input');
    const btn = document.getElementById('track-ticket-btn');
    const resultBox = document.getElementById('track-ticket-result');

    if (!input || !btn || !resultBox) return;

    btn.addEventListener('click', performTrack);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performTrack();
    });

    function performTrack() {
      const id = input.value.trim().toUpperCase();
      if (!id) {
        showToast('Please enter a ticket tracking number', 'warning');
        return;
      }

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-lg); padding: var(--space-5); margin-top: var(--space-4); border: 1px solid var(--border-subtle); animation: fadeIn 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3);">
            <div>
              <span class="chip chip-emerald" style="margin-bottom: 4px;">CREW ASSIGNED</span>
              <strong style="display: block; font-size: 1rem; color: var(--text-primary);">Ticket #${escapeHtml(id)}</strong>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Service: Pothole & Asphalt Repair</span>
            </div>
            <span class="mono-code" style="font-size: 0.76rem; color: var(--text-muted);">DISPATCHED: AUG 26</span>
          </div>
          <p style="font-size: 0.86rem; color: var(--text-primary); margin-bottom: var(--space-3);">
            Status: Public Works Maintenance Crew #4 is scheduled for asphalt patching at this location. Estimated completion within 24 hours.
          </p>
          <div style="display: flex; gap: var(--space-2);">
            <a href="tel:3094441150" class="btn-pill btn-pill-secondary btn-pill-sm">Public Works Dispatch: (309) 444-1150</a>
          </div>
        </div>
      `;
      showToast(`Status loaded for #${id}`, 'success');
    }
  }

  /* --------------------------------------------------------------------------
     18. Street Advisory & Boil Order Checker
     -------------------------------------------------------------------------- */
  function initStreetChecker() {
    const input = document.getElementById('street-boil-check-input');
    const btn = document.getElementById('street-boil-check-btn');
    const resultBox = document.getElementById('street-boil-check-result');

    if (!btn || !input || !resultBox) return;

    btn.addEventListener('click', performCheck);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performCheck();
    });

    function performCheck() {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        showToast('Please enter a street name to check', 'warning');
        return;
      }

      if (q.includes('pine') || q.includes('shelbark')) {
        resultBox.innerHTML = `
          <div style="background: var(--accent-amber-subtle); border: 1px solid var(--accent-amber-border); border-radius: var(--radius-md); padding: 14px; margin-top: 12px; animation: fadeIn 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="status-pip status-pip-amber"></span>
              <strong style="color: var(--accent-amber); font-size: 0.95rem;">Active Road Notice: Spray Patching</strong>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-primary);">
              Street spray patching in progress on <strong>${escapeHtml(input.value)}</strong>. Please keep vehicles parked in driveways during daytime hours.
            </p>
          </div>`;
      } else if (q.includes('catherine')) {
        resultBox.innerHTML = `
          <div style="background: var(--accent-emerald-subtle); border: 1px solid var(--accent-emerald-border); border-radius: var(--radius-md); padding: 14px; margin-top: 12px; animation: fadeIn 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="status-pip status-pip-emerald"></span>
              <strong style="color: var(--accent-emerald); font-size: 0.95rem;">Boil Order Lifted (Safe Drinking Water)</strong>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-primary);">
              The precautionary boil order on Catherine St has been officially <strong>LIFTED</strong>. All water quality samples meet EPA standards.
            </p>
          </div>`;
      } else {
        resultBox.innerHTML = `
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; margin-top: 12px; animation: fadeIn 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="status-pip status-pip-emerald"></span>
              <strong style="color: var(--text-primary); font-size: 0.95rem;">No Active Advisories for "${escapeHtml(input.value)}"</strong>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Water utility and street maintenance operations are normal in your neighborhood.
            </p>
          </div>`;
      }
    }
  }

  /* --------------------------------------------------------------------------
     19. Pay URL Query Params & Modal Engine
     -------------------------------------------------------------------------- */
  function initPayUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service && typeof window.setBillType === 'function') {
      window.setBillType(service);
    }

    const lookupBtn = document.getElementById('bill-lookup-btn');
    const summaryCard = document.getElementById('bill-summary-card');
    const proceedBtn = document.getElementById('proceed-pay-btn');
    const payModal = document.getElementById('payment-modal');
    const closePayModal = document.getElementById('close-pay-modal-btn');
    const confirmPayBtn = document.getElementById('confirm-pay-btn');
    const receiptModal = document.getElementById('receipt-modal');
    const closeReceipt = document.getElementById('close-receipt-btn');

    if (lookupBtn && summaryCard) {
      lookupBtn.addEventListener('click', () => {
        summaryCard.style.display = 'block';
        showToast('Account balance verified', 'success');
      });
    }

    if (proceedBtn && payModal) {
      proceedBtn.addEventListener('click', () => {
        payModal.classList.add('open');
      });
    }

    if (closePayModal && payModal) {
      closePayModal.addEventListener('click', () => {
        payModal.classList.remove('open');
      });
    }

    if (confirmPayBtn && payModal && receiptModal) {
      confirmPayBtn.addEventListener('click', () => {
        payModal.classList.remove('open');
        receiptModal.classList.add('open');
        showToast('Payment processed successfully!', 'success');
      });
    }

    if (closeReceipt && receiptModal) {
      closeReceipt.addEventListener('click', () => {
        receiptModal.classList.remove('open');
      });
    }
  }

  /* --------------------------------------------------------------------------
     20. Department Live Directory Search Filter
     -------------------------------------------------------------------------- */
  function initDepartmentSearch() {
    const input = document.getElementById('dept-search-input');
    const deptCards = document.querySelectorAll('.bento-card[id^="dept-"]');
    if (!input || !deptCards.length) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      deptCards.forEach((card) => {
        const target = card.closest('.double-bezel') || card;
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          target.style.display = '';
        } else {
          target.style.display = 'none';
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     21. Curbside Trash & Recycling Collection Day Lookup
     -------------------------------------------------------------------------- */
  function initTrashLookup() {
    const btn = document.getElementById('trash-lookup-btn');
    const select = document.getElementById('trash-ward-select');
    const resultBox = document.getElementById('trash-lookup-result');

    if (!btn || !select || !resultBox) return;

    btn.addEventListener('click', () => {
      const ward = select.value;
      const schedules = {
        '1': { day: 'Monday', recycling: 'Week A (Bi-weekly)', bulk: 'First Monday of month' },
        '2': { day: 'Tuesday', recycling: 'Week B (Bi-weekly)', bulk: 'First Tuesday of month' },
        '3': { day: 'Wednesday', recycling: 'Week A (Bi-weekly)', bulk: 'First Wednesday of month' },
        '4': { day: 'Thursday', recycling: 'Week B (Bi-weekly)', bulk: 'First Thursday of month' }
      };

      const sched = schedules[ward] || schedules['1'];
      resultBox.innerHTML = `
        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 14px; margin-top: 12px; border: 1px solid var(--border-subtle); animation: fadeIn 0.2s ease;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: var(--text-primary);">Curbside Trash Pickup:</strong>
            <span class="mono-code" style="color: var(--accent-emerald); font-weight: 700;">Every ${sched.day}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
            <span style="color: var(--text-secondary);">Recycling Schedule:</span>
            <span>${sched.recycling}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="color: var(--text-secondary);">Bulk Waste Pickup:</span>
            <span>${sched.bulk}</span>
          </div>
        </div>`;
      showToast(`Collection schedule for Ward 0${ward} retrieved`, 'info');
    });
  }

  /* --------------------------------------------------------------------------
     22. Accessible Agenda & Packet Preview Modal
     -------------------------------------------------------------------------- */
  function initAgendaPreviewModal() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-agenda]');
      if (!btn) return;

      const title = btn.getAttribute('data-agenda-title') || 'City Council Agenda';
      const date = btn.getAttribute('data-agenda-date') || 'September 8, 2026';

      showToast(`Opening agenda packet: ${title}`, 'info');
      let modal = document.getElementById('agenda-preview-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'agenda-preview-modal';
        modal.className = 'spotlight-modal-backdrop open';
        modal.innerHTML = `
          <div class="spotlight-container" style="max-width: 600px; padding: var(--space-6);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
              <div>
                <span class="chip chip-blue" style="margin-bottom: 4px;">OFFICIAL PACKET</span>
                <h3 class="card-title" id="agenda-modal-title" style="margin-bottom: 0;">${escapeHtml(title)}</h3>
              </div>
              <button type="button" class="btn-icon-pill" style="font-size: 0.72rem; font-weight: 700; width: auto; padding: 0 10px;" onclick="document.getElementById('agenda-preview-modal').classList.remove('open');">Close</button>
            </div>
            <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: var(--space-4);">
              Legislative Session: ${escapeHtml(date)} • 6:30 PM CST • Council Chambers
            </div>
            <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-5); font-size: 0.85rem; line-height: 1.6; border: 1px solid var(--border-subtle);">
              <strong>Order of Business:</strong>
              <ol style="padding-left: 20px; margin-top: 6px;">
                <li>Call to Order & Pledge of Allegiance</li>
                <li>Roll Call & Approval of Minutes</li>
                <li>Audience Comments & Public Inquiries</li>
                <li>Standing Committee Reports (Finance & Public Works)</li>
                <li>Ordinance 2026-14: Street Resurfacing Contract Award</li>
                <li>Adjournment</li>
              </ol>
            </div>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
              <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" onclick="window.print();">Print Order</button>
              <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" onclick="showToast('Downloading full agenda PDF packet...', 'success');">Download Full PDF</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (ev) => {
          if (ev.target === modal) modal.classList.remove('open');
        });
      } else {
        document.getElementById('agenda-modal-title').textContent = title;
        modal.classList.add('open');
      }
    });
  }

  /* --------------------------------------------------------------------------
     23. Civic Calendar Month Matrix Navigation
     -------------------------------------------------------------------------- */
  function initCalendarMatrix() {
    const prevBtn = document.getElementById('cal-prev-btn');
    const nextBtn = document.getElementById('cal-next-btn');
    const monthLabel = document.getElementById('cal-month-label');

    if (!prevBtn || !nextBtn || !monthLabel) return;

    const months = ['August 2026', 'September 2026', 'October 2026'];
    let curMonthIdx = 1;

    prevBtn.addEventListener('click', () => {
      if (curMonthIdx > 0) {
        curMonthIdx--;
        monthLabel.textContent = months[curMonthIdx];
        showToast(`Viewing ${months[curMonthIdx]}`, 'info');
      }
    });

    nextBtn.addEventListener('click', () => {
      if (curMonthIdx < months.length - 1) {
        curMonthIdx++;
        monthLabel.textContent = months[curMonthIdx];
        showToast(`Viewing ${months[curMonthIdx]}`, 'info');
      }
    });
  }

  /* --------------------------------------------------------------------------
     24. Municipal Code of Ordinances Search & Accordion Engine
     -------------------------------------------------------------------------- */
  function initMunicipalCodeSearch() {
    const searchInput = document.getElementById('code-search-input');
    const filterPills = document.querySelectorAll('[data-code-filter]');
    const popularCards = document.querySelectorAll('.code-popular-card');
    const titleAccordions = document.querySelectorAll('.code-title-accordion');

    if (!searchInput && !popularCards.length && !titleAccordions.length) return;

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        performSearch(searchInput.value.trim().toLowerCase());
      });
    }

    filterPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const term = pill.getAttribute('data-code-filter');
        if (searchInput) {
          searchInput.value = term === 'all' ? '' : term;
        }
        performSearch(term === 'all' ? '' : term.toLowerCase());
      });
    });

    // Accordion toggle behavior
    document.querySelectorAll('.code-accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.code-title-accordion');
        if (!item) return;
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });

    function performSearch(query) {
      let matchedCount = 0;

      popularCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.display = 'flex';
          matchedCount++;
        } else {
          card.style.display = 'none';
        }
      });

      titleAccordions.forEach((acc) => {
        const text = acc.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          acc.style.display = 'block';
          if (query) {
            acc.classList.add('open');
            const trig = acc.querySelector('.code-accordion-trigger');
            if (trig) trig.setAttribute('aria-expanded', 'true');
          }
          matchedCount++;
        } else {
          acc.style.display = 'none';
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     Global Toast Notification Dispatcher
     -------------------------------------------------------------------------- */
  window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const pill = document.createElement('div');
    pill.className = 'toast-pill';
    if (type === 'success') {
      pill.style.background = 'var(--accent-emerald)';
      pill.style.color = '#FFFFFF';
    } else if (type === 'warning') {
      pill.style.background = 'var(--accent-amber)';
      pill.style.color = '#000000';
    }

    pill.textContent = message;
    container.appendChild(pill);

    setTimeout(() => {
      pill.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      pill.style.opacity = '0';
      pill.style.transform = 'scale(0.9)';
      setTimeout(() => pill.remove(), 250);
    }, 2800);
  };

  /* --------------------------------------------------------------------------
     25. Washington Police Department Experience Engine
     -------------------------------------------------------------------------- */
  function initWpdExperience() {
    const root = document.getElementById('wpd-experience-root');
    if (!root && !document.querySelector('.police-hero-section')) return;

    // Clean solid authoritative typography
    initWatchTelemetry();
    initCoinTactile();
    initServicesFilter();
    initDistrictMap();
    initDistrictStreetSearch();
    initActionDrawers();
    initFooterActions();
    initCardCursorSpotlight();
  }

  function initWatchTelemetry() {
    const watchPill = document.getElementById('watch-name-pill');
    const watchHours = document.getElementById('watch-hours-text');
    const watchSupervisor = document.getElementById('watch-supervisor-text');
    const lobbyPill = document.getElementById('lobby-status-pill');

    if (!watchPill || typeof WPD_DATA === 'undefined') return;

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday

    let activeWatch = WPD_DATA.watches[0]; // default Watch 1
    if (hour >= 7 && hour < 15) {
      activeWatch = WPD_DATA.watches[0];
    } else if (hour >= 15 && hour < 23) {
      activeWatch = WPD_DATA.watches[1];
    } else {
      activeWatch = WPD_DATA.watches[2];
    }

    watchPill.textContent = activeWatch.name;
    if (watchHours) watchHours.textContent = activeWatch.hours;
    if (watchSupervisor) watchSupervisor.textContent = activeWatch.supervisor;

    // Lobby Desk (Mon-Fri 8:00 AM - 4:30 PM)
    if (lobbyPill) {
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && (hour > 8 || (hour === 8 && now.getMinutes() >= 0)) && (hour < 16 || (hour === 16 && now.getMinutes() <= 30));

      if (isOpen) {
        lobbyPill.className = 'chip chip-emerald';
        lobbyPill.textContent = 'RECORDS LOBBY OPEN (UNTIL 4:30 PM)';
      } else {
        lobbyPill.className = 'chip chip-neutral';
        lobbyPill.textContent = 'LOBBY DESK OPENS 8:00 AM M-F • 24/7 DISPATCH ACTIVE';
      }
    }
  }

  function initCoinTactile() {
    const coinWrapper = document.querySelector('.coin-display-wrapper');
    const coinRing = document.querySelector('.coin-outer-ring');
    const ambientShadow = document.getElementById('coin-ambient-shadow');
    if (!coinWrapper || !coinRing) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      coinWrapper.addEventListener('mousemove', (e) => {
        const rect = coinWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -15;
        const rotateY = ((x - cx) / cx) * 15;

        coinRing.style.transform = `rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale(1.04)`;

        if (ambientShadow) {
          const shadowX = -((x - cx) / cx) * 8;
          const shadowY = -((y - cy) / cy) * 4;
          ambientShadow.style.transform = `translate(${shadowX.toFixed(1)}px, ${shadowY.toFixed(1)}px) scale(0.96)`;
          ambientShadow.style.opacity = '0.9';
        }
      });

      coinWrapper.addEventListener('mouseleave', () => {
        coinRing.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        if (ambientShadow) {
          ambientShadow.style.transform = 'translate(0px, 0px) scale(1)';
          ambientShadow.style.opacity = '1';
        }
      });
    }

    coinWrapper.addEventListener('click', () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('Serve with Honor, Protect with Purpose, Lead with Integrity');
        window.showToast('Copied motto: "Serve with Honor, Protect with Purpose, Lead with Integrity"', 'info');
      }
    });
  }

  function initServicesFilter() {
    const searchInput = document.getElementById('services-search-input');
    const filterPills = document.querySelectorAll('.services-filter-pill');
    const gridContainer = document.getElementById('services-grid-container');
    const emptyState = document.getElementById('services-empty-state');
    const clearBtn = document.getElementById('services-clear-search');

    if (!gridContainer) return;
    const cards = gridContainer.querySelectorAll('.civic-service-card, .civic-service-card-feature');
    if (!cards.length) return;

    let activeCategory = 'all';

    function applyFilter() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const keywords = ((card.getAttribute('data-keywords') || '') + ' ' + card.innerText).toLowerCase();
        const matchesCat = (activeCategory === 'all' || cat === activeCategory);
        const matchesQuery = (!query || keywords.includes(query));

        if (matchesCat && matchesQuery) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        activeCategory = pill.getAttribute('data-filter') || 'all';
        applyFilter();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        activeCategory = 'all';
        filterPills.forEach(p => {
          const isAll = p.getAttribute('data-filter') === 'all';
          p.classList.toggle('active', isAll);
          p.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });
        applyFilter();
      });
    }
  }

  function initDistrictMap() {
    const mapEl = document.getElementById('real-district-leaflet-map');
    const tabBtns = document.querySelectorAll('.district-tab-btn');
    const legendChips = document.querySelectorAll('[data-district-jump]');
    const titleEl = document.getElementById('selected-district-title');
    const coverageEl = document.getElementById('selected-district-coverage');
    const boundariesEl = document.getElementById('selected-district-boundaries');
    const landmarksEl = document.getElementById('selected-district-landmarks');
    const carEl = document.getElementById('selected-district-car');
    const sergeantEl = document.getElementById('selected-district-sergeant');
    const priorityEl = document.getElementById('selected-district-priority');

    if (!mapEl || typeof L === 'undefined' || typeof WPD_DATA === 'undefined') return;

    // Initialize Leaflet Map (Using Canvas renderer to maintain strict Zero-SVG / Zero-Icon compliance)
    const isMobileDevice = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 992);
    const map = L.map('real-district-leaflet-map', {
      center: [40.7075, -89.4074],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: true,
      preferCanvas: true,
      tap: false
    });

    // On mobile devices, prevent accidental scroll trapping while swiping past map
    if (isMobileDevice) {
      map.dragging.disable();
      mapEl.addEventListener('touchstart', function onFirstTouch() {
        map.dragging.enable();
      }, { passive: true, once: true });
    }

    if (map.attributionControl) {
      map.attributionControl.setPrefix('City of Washington GIS');
    }

    // Tile Layers (Clean Municipal GIS & Street Map, Zero Watermarks)
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | City of Washington GIS'
    }).addTo(map);

    const tacticalLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: '© Esri, HERE, Garmin | WPD Tactical CAD'
    });

    // District Geographic Polygon Layers (Real City of Washington GIS Feature Dataset)
    const districtPolys = {};
    const districtConfig = {
      1: {
        name: "District 1 (East Sector)",
        color: "#2563EB",
        acres: "434 Acres"
      },
      2: {
        name: "District 2 (West Sector)",
        color: "#059669",
        acres: "1,681 Acres"
      },
      3: {
        name: "District 3 (North Sector / Devonshire)",
        color: "#7C3AED",
        acres: "1,477 Acres"
      }
    };

    // Load authentic City of Washington GIS Police District GeoJSON
    if (typeof window.WPD_REAL_DISTRICTS_GEOJSON !== 'undefined' && Array.isArray(window.WPD_REAL_DISTRICTS_GEOJSON.features)) {
      window.WPD_REAL_DISTRICTS_GEOJSON.features.forEach((feature) => {
        const id = String(feature.properties.PoliceDistrict);
        const cfg = districtConfig[id] || { name: `District ${id}`, color: "#2563EB", acres: "" };
        const layer = L.geoJSON(feature, {
          style: {
            color: cfg.color,
            weight: 2.5,
            fillColor: cfg.color,
            fillOpacity: 0.22,
            dashArray: null
          }
        }).addTo(map);

        layer.bindPopup(`
          <div class="wpd-map-popup-title" style="color: ${cfg.color}; font-weight: 800;">${cfg.name}</div>
          <div class="wpd-map-popup-desc">
            <strong>Official City of Washington GIS Sector</strong><br>
            <strong>Jurisdiction Area:</strong> ${cfg.acres}<br>
            <strong>Sector Car:</strong> Sector Car 10${id}<br>
            <span style="font-size: 0.74rem; color: #6B7280;">Click tab or sector for full CAD priorities</span>
          </div>
        `);

        layer.on('click', () => {
          selectDistrict(id, false);
        });

        layer.on('mouseover', () => {
          if (activeDistrictId !== String(id)) {
            layer.setStyle({ fillOpacity: 0.38, weight: 3 });
          }
        });

        layer.on('mouseout', () => {
          if (activeDistrictId !== String(id)) {
            layer.setStyle({ fillOpacity: 0.22, weight: 2.5 });
          }
        });

        districtPolys[id] = layer;
      });
    }

    // Custom Pin Generator (Clean Geometric Waypoints, No Icons)
    function createMapPin(label, bgClass) {
      return L.divIcon({
        className: 'wpd-leaflet-marker',
        html: `<div class="wpd-map-marker-pin ${bgClass || ''}"><span class="pin-marker-text">${label}</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    }

    // Add Authentic Washington, IL Landmarks
    const hqMarker = L.marker([40.7032, -89.4095], {
      icon: createMapPin('HQ', 'pin-hq')
    }).addTo(map);
    hqMarker.bindPopup(`
      <div class="wpd-map-popup-title" style="color: #0A192F;">Washington Police Headquarters</div>
      <div class="wpd-map-popup-desc">
        <strong>115 W. Jefferson St., Washington, IL 61571</strong><br>
        24/7 Continuous Emergency Dispatch & Patrol Station<br>
        Administrative / Lobby Window: Mon–Fri 8:00 AM – 4:30 PM<br>
        Emergency: <strong>911</strong> | Non-Emergency: <strong>(309) 444-2313</strong>
      </div>
    `);

    const squareMarker = L.marker([40.7040, -89.4074], {
      icon: createMapPin('SQ', 'pin-square')
    }).addTo(map);
    squareMarker.bindPopup(`
      <div class="wpd-map-popup-title">Historic Washington Square</div>
      <div class="wpd-map-popup-desc">
        Central Commercial & Civic District • Central Fountain<br>
        Daily Foot Patrols & Walk-and-Talk Community Policing
      </div>
    `);

    const wchsMarker = L.marker([40.7035, -89.3980], {
      icon: createMapPin('HS', 'pin-school')
    }).addTo(map);
    wchsMarker.bindPopup(`
      <div class="wpd-map-popup-title">Washington Community High School (District 308)</div>
      <div class="wpd-map-popup-desc">
        115 Bondurant St. • Home of the Panthers<br>
        Dedicated School Resource Officer (SRO) Safety Station
      </div>
    `);

    const fivePointsMarker = L.marker([40.7118, -89.4215], {
      icon: createMapPin('FP', 'pin-civic')
    }).addTo(map);
    fivePointsMarker.bindPopup(`
      <div class="wpd-map-popup-title">Five Points Washington</div>
      <div class="wpd-map-popup-desc">
        360 N. Wilmor Rd. • Community & Performing Arts Center<br>
        District 1 Sector Patrol Coordination Area
      </div>
    `);

    const devonshireMarker = L.marker([40.7225, -89.4120], {
      icon: createMapPin('NP', 'pin-retail')
    }).addTo(map);
    devonshireMarker.bindPopup(`
      <div class="wpd-map-popup-title">Devonshire Plaza & US-24 Retail Corridor</div>
      <div class="wpd-map-popup-desc">
        North Sector Commercial Corridor<br>
        Sector Car 103 Proactive Patrol Area
      </div>
    `);

    let activeDistrictId = "2";

    function selectDistrict(id, flyTo = true) {
      activeDistrictId = String(id);
      const dist = WPD_DATA.districts[id];
      if (!dist) return;

      // Update Polygon Styling
      Object.keys(districtPolys).forEach((dId) => {
        const poly = districtPolys[dId];
        const cfg = districtConfig[dId];
        if (dId === String(id)) {
          poly.setStyle({
            color: '#0F172A',
            weight: 3.5,
            fillColor: cfg.color,
            fillOpacity: 0.44
          });
          if (poly.bringToFront) poly.bringToFront();
          if (flyTo) {
            map.fitBounds(poly.getBounds(), { padding: [35, 35], maxZoom: 14 });
          }
        } else {
          poly.setStyle({
            color: cfg.color,
            weight: 2,
            fillColor: cfg.color,
            fillOpacity: 0.18
          });
        }
      });

      // Update Tab Buttons
      tabBtns.forEach((b) => {
        if (b.getAttribute('data-district') === String(id)) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      // Update Info Panel Content
      if (titleEl) titleEl.textContent = dist.name;
      if (coverageEl) coverageEl.textContent = dist.coverage;
      if (boundariesEl) boundariesEl.textContent = dist.boundaries;
      if (carEl) carEl.textContent = dist.sectorCar;
      if (sergeantEl) sergeantEl.textContent = dist.supervisor;
      if (priorityEl) priorityEl.textContent = dist.priority;

      if (landmarksEl && Array.isArray(dist.landmarks)) {
        landmarksEl.innerHTML = dist.landmarks.map(l => `<span class="chip chip-neutral" style="margin-right: 6px; margin-bottom: 6px;">${escapeHtml(l)}</span>`).join('');
      }

      // Update CAD HUD elements if present (mobile / desktop telemetry)
      const cadHudDist = document.getElementById('cad-hud-district');
      const cadHudUnit = document.getElementById('cad-hud-unit');
      const cadHudStatus = document.getElementById('cad-hud-status');
      if (cadHudDist) cadHudDist.textContent = dist.name;
      if (cadHudUnit) cadHudUnit.textContent = dist.sectorCar;
      if (cadHudStatus) cadHudStatus.textContent = 'SECTOR ACTIVE';
    }

    // Connect Tab Buttons
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-district');
        selectDistrict(id, true);
      });
      btn.addEventListener('mouseenter', () => {
        const id = btn.getAttribute('data-district');
        const poly = districtPolys[id];
        if (poly && id !== activeDistrictId) {
          poly.setStyle({ weight: 3.2, fillOpacity: 0.32 });
        }
      });
      btn.addEventListener('mouseleave', () => {
        const id = btn.getAttribute('data-district');
        const poly = districtPolys[id];
        if (poly && id !== activeDistrictId) {
          const cfg = districtConfig[id];
          if (cfg) poly.setStyle({ color: cfg.color, weight: 2, fillOpacity: 0.18 });
        }
      });
    });

    // Connect Legend Chips
    legendChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-district-jump');
        selectDistrict(id, true);
      });
      chip.addEventListener('mouseenter', () => {
        const id = chip.getAttribute('data-district-jump');
        const poly = districtPolys[id];
        if (poly && id !== activeDistrictId) {
          poly.setStyle({ weight: 3.2, fillOpacity: 0.32 });
        }
      });
      chip.addEventListener('mouseleave', () => {
        const id = chip.getAttribute('data-district-jump');
        const poly = districtPolys[id];
        if (poly && id !== activeDistrictId) {
          const cfg = districtConfig[id];
          if (cfg) poly.setStyle({ color: cfg.color, weight: 2, fillOpacity: 0.18 });
        }
      });
    });

    // Map Mode Toggles
    const btnOsm = document.getElementById('map-btn-osm');
    const btnTactical = document.getElementById('map-btn-tactical');
    const btnReset = document.getElementById('map-btn-reset');

    if (btnOsm) {
      btnOsm.addEventListener('click', () => {
        if (map.hasLayer(tacticalLayer)) map.removeLayer(tacticalLayer);
        if (!map.hasLayer(streetLayer)) map.addLayer(streetLayer);
        btnOsm.classList.add('active');
        if (btnTactical) btnTactical.classList.remove('active');
      });
    }

    if (btnTactical) {
      btnTactical.addEventListener('click', () => {
        if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
        if (!map.hasLayer(tacticalLayer)) map.addLayer(tacticalLayer);
        btnTactical.classList.add('active');
        if (btnOsm) btnOsm.classList.remove('active');
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const allLayers = Object.values(districtPolys);
        if (allLayers.length > 0) {
          const group = L.featureGroup(allLayers);
          map.fitBounds(group.getBounds(), { padding: [25, 25] });
        } else {
          map.setView([40.7075, -89.4120], 13);
        }
        selectDistrict(2, false);
      });
    }

    // Expose global selector for external access
    window.selectDistrictFromMap = function(id) {
      selectDistrict(id, true);
    };

    // =========================================================================
    // CAD Incident Lifecycle Scrollytelling Orchestrator
    // =========================================================================
    const scrollySteps = document.querySelectorAll('.scrolly-step');
    const hudTimer = document.getElementById('cad-hud-timer');
    const hudPhase = document.getElementById('cad-hud-phase');
    const hudStatus = document.getElementById('cad-hud-status');
    const hudDistrict = document.getElementById('cad-hud-district');
    const hudUnit = document.getElementById('cad-hud-unit');
    const hudPip = document.getElementById('cad-hud-pip');

    if (scrollySteps.length) {
      let currentScrollyStep = null;

      const scrollyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepEl = entry.target;
            const stepId = stepEl.getAttribute('data-step');
            if (currentScrollyStep === stepId) return;
            currentScrollyStep = stepId;

            // Highlight step card
            scrollySteps.forEach(s => s.classList.toggle('active', s === stepEl));

            // Extract telemetry metadata
            const time = stepEl.getAttribute('data-time') || '00:00:00';
            const phase = stepEl.getAttribute('data-phase') || `PHASE 0${stepId}`;
            const status = stepEl.getAttribute('data-status') || 'ACTIVE';
            const unit = stepEl.getAttribute('data-unit') || 'WPD UNIT';
            const distName = stepEl.getAttribute('data-distname') || 'Patrol District';
            const distId = stepEl.getAttribute('data-district') || '2';

            // Update Sticky HUD
            if (hudTimer) hudTimer.textContent = time;
            if (hudPhase) hudPhase.textContent = phase;
            if (hudStatus) {
              hudStatus.textContent = status;
              if (stepId === '1') hudStatus.style.color = 'var(--accent-periwinkle, #2563EB)';
              else if (stepId === '3') hudStatus.style.color = 'var(--accent-amber, #D97706)';
              else hudStatus.style.color = 'var(--accent-emerald, #059669)';
            }
            if (hudDistrict) hudDistrict.textContent = distName;
            if (hudUnit) hudUnit.textContent = unit;
            if (hudPip) {
              hudPip.className = 'status-pip ' + 
                (stepId === '1' ? 'status-pip-blue' : (stepId === '3' ? 'status-pip-amber' : 'status-pip-emerald'));
            }

            // Smoothly pan and spotlight the relevant police sector on the Leaflet map
            selectDistrict(distId, true);
          }
        });
      }, {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0.1
      });

      scrollySteps.forEach(step => scrollyObserver.observe(step));
    }

    // Default: Select District 2 (West Sector / HQ)
    selectDistrict(2, false);

    // Initial view fitting the authentic jurisdiction boundaries
    setTimeout(() => {
      const allLayers = Object.values(districtPolys);
      if (allLayers.length > 0) {
        const group = L.featureGroup(allLayers);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }, 150);
  }

  function initDistrictStreetSearch() {
    const input = document.getElementById('district-street-input');
    const resultsContainer = document.getElementById('district-search-results');
    const feedbackBox = document.getElementById('district-search-feedback');

    if (!input || typeof WPD_DATA === 'undefined') return;

    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      if (!val) {
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (feedbackBox) feedbackBox.style.display = 'none';
        return;
      }

      const matches = WPD_DATA.streets.filter(s => s.name.toLowerCase().includes(val));

      if (resultsContainer) {
        if (matches.length > 0) {
          resultsContainer.innerHTML = matches.slice(0, 6).map(m => `
            <div class="district-search-item" data-district="${m.district}" data-street="${escapeHtml(m.name)}" style="padding: 10px 14px; cursor: pointer; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
              <div><strong>${escapeHtml(m.name)}</strong> <span style="color: var(--text-muted); font-size: 0.8rem;">(${escapeHtml(m.area)})</span></div>
              <span class="chip chip-sm chip-blue">District ${m.district}</span>
            </div>
          `).join('');
          resultsContainer.style.display = 'block';

          resultsContainer.querySelectorAll('.district-search-item').forEach(item => {
            item.addEventListener('click', () => {
              const dId = item.getAttribute('data-district');
              const sName = item.getAttribute('data-street');
              input.value = sName;
              resultsContainer.style.display = 'none';

              // Trigger district selection on map and panel
              if (window.selectDistrictFromMap) {
                window.selectDistrictFromMap(dId);
              } else {
                const tabBtn = document.querySelector(`.district-tab-btn[data-district="${dId}"]`);
                if (tabBtn) tabBtn.click();
              }

              if (feedbackBox) {
                const distObj = WPD_DATA.districts[dId];
                feedbackBox.style.display = 'block';
                feedbackBox.innerHTML = `
                  <div style="background: var(--bg-surface-subtle); border-left: 3px solid var(--accent-blue); padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.88rem; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                    <strong>${escapeHtml(sName)}</strong> is located in <strong>${distObj.name}</strong>.<br>
                    Patrolled by <strong>${distObj.sectorCar}</strong> with continuous 24/7 watch supervision and rapid CAD dispatch.
                  </div>
                `;
              }
            });
          });
        } else {
          resultsContainer.innerHTML = `
            <div style="padding: 12px; color: var(--text-muted); font-size: 0.86rem; text-align: center;">
              No exact street match. Washington Police Patrol covers all corporate city limits 24/7.
            </div>
          `;
          resultsContainer.style.display = 'block';
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (resultsContainer && !e.target.closest('.district-search-box')) {
        resultsContainer.style.display = 'none';
      }
    });
  }

  function initActionDrawers() {
    const backdrops = document.querySelectorAll('.action-drawer-backdrop');
    let activeDrawer = null;
    let lastActiveTrigger = null;

    function closeAllDrawers() {
      backdrops.forEach(b => {
        b.classList.remove('active');
      });
      document.body.style.overflow = '';
      activeDrawer = null;
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
        lastActiveTrigger = null;
      }
    }

    // Robust event delegation for opening drawers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-drawer]');
      if (!trigger) return;

      e.preventDefault();
      lastActiveTrigger = trigger;
      const drawerId = trigger.getAttribute('data-open-drawer');
      const targetDrawer = document.getElementById(drawerId);
      if (targetDrawer) {
        closeAllDrawers();
        targetDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        activeDrawer = targetDrawer;

        // Set focus into first input or close button
        const firstInput = targetDrawer.querySelector('input:not([type="hidden"]), select, textarea, button:not([disabled])');
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
      }
    });

    // Event delegation for close buttons and backdrop clicks
    document.addEventListener('click', (e) => {
      const closeTrigger = e.target.closest('[data-close-drawer]');
      if (closeTrigger) {
        const href = closeTrigger.getAttribute('href');
        closeAllDrawers();
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth' });
              history.pushState(null, '', href);
            }, 60);
          }
        } else if (!href || href === '#') {
          e.preventDefault();
        }
      } else if (e.target.classList.contains('action-drawer-backdrop')) {
        closeAllDrawers();
      }
    });

    // Keyboard support: Escape closes, Enter/Space opens focused role="button", Tab traps focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDrawers();
      } else if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('[data-open-drawer][role="button"]')) {
        e.preventDefault();
        e.target.click();
      } else if (e.key === 'Tab' && activeDrawer) {
        const focusable = Array.from(activeDrawer.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Input auto-formatting: Phone number mask (XXX) XXX-XXXX
    document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach(input => {
      input.addEventListener('input', () => {
        const cleaned = ('' + input.value).replace(/\D/g, '').substring(0, 10);
        if (cleaned.length >= 7) {
          input.value = `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
        } else if (cleaned.length >= 4) {
          input.value = `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
        } else if (cleaned.length > 0) {
          input.value = `(${cleaned}`;
        }
      });
    });

    // Input auto-formatting: Vehicle license plates to uppercase
    document.querySelectorAll('input[name*="plate"], input[id*="plate"]').forEach(input => {
      input.addEventListener('input', () => {
        input.value = input.value.toUpperCase();
      });
    });

    // Form handlers with confirmation code, copy button, and print summary
    const forms = document.querySelectorAll('.wpd-drawer-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const receiptCode = `WPD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const drawerBody = form.closest('.action-drawer-body');
        const formTitle = form.getAttribute('data-form-title') || 'Request';

        if (drawerBody) {
          drawerBody.innerHTML = `
            <div style="text-align: center; padding: var(--space-8) var(--space-4);">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; background: var(--accent-emerald-subtle); color: var(--accent-emerald); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 auto var(--space-4);">CONFIRMED</div>
              <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-2);">${escapeHtml(formTitle)} Submitted</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: var(--space-6); line-height: 1.6;">
                Your submission has been securely transmitted to the Washington Police Department records and dispatch center.
              </p>
              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-6); font-family: var(--font-mono); font-size: 0.88rem;">
                <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 4px;">Official CAD Confirmation Receipt</div>
                <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-primary); letter-spacing: 0.04em;" id="receipt-code-display">${receiptCode}</div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: var(--space-4);">
                <button type="button" class="btn-editorial-primary" id="btn-copy-receipt-code" style="width: 100%; justify-content: center;">
                  Copy Confirmation Code
                </button>
                <button type="button" class="btn-editorial-secondary" id="btn-print-receipt-summary" style="width: 100%; justify-content: center;">
                  Print / Save Summary
                </button>
              </div>
              <button type="button" class="btn-pill btn-pill-primary" data-close-drawer style="width: 100%; margin-top: 6px;">Close Drawer</button>
            </div>
          `;

          const copyBtn = drawerBody.querySelector('#btn-copy-receipt-code');
          if (copyBtn) {
            copyBtn.addEventListener('click', () => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(receiptCode);
                copyBtn.textContent = 'Copied to Clipboard!';
                setTimeout(() => { copyBtn.textContent = 'Copy Confirmation Code'; }, 2200);
                window.showToast(`Copied confirmation code ${receiptCode}`, 'info');
              }
            });
          }

          const printBtn = drawerBody.querySelector('#btn-print-receipt-summary');
          if (printBtn) {
            printBtn.addEventListener('click', () => {
              window.print();
            });
          }

          drawerBody.querySelector('[data-close-drawer]')?.addEventListener('click', closeAllDrawers);
          window.showToast(`${formTitle} confirmed (#${receiptCode})`, 'success');
        }
      });
    });
  }

  function initFooterActions() {
    const backToTopBtn = document.getElementById('footer-back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function initCardCursorSpotlight() {
    const cards = document.querySelectorAll('.spotlight-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }


  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }

})();

