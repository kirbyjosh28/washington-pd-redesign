/**
 * Washington Police Department (WPD): Official Interaction Engine
 * Clean Authoritative Typography • 24/7 CAD Dispatch Telemetry • WCAG 2.2 AA Compliance
 * Zero Icons • Typographic Design System
 */

(function () {
  'use strict';

  function bootstrap() {
    const inits = [
      initTheme,
      initWpdExperience,
      initScrollHeader,
      initScrollRevealEngine,
      initKineticTypography,
      init3DCardTilts,
      initInteractiveCopyButtons,
      initCardCursorSpotlight,
      initFaqKnowledgeBase
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
     1. Theme Engine (Strict Municipal White Paper Light Mode)
     -------------------------------------------------------------------------- */
  function initTheme() {
    try {
      localStorage.removeItem('wash_theme');
    } catch (e) {
      /* ignore */
    }
    document.documentElement.setAttribute('data-theme', 'light');
  }

  /* --------------------------------------------------------------------------
     2. Smart Scroll Compacting for Minimalist Navigation Capsule
     -------------------------------------------------------------------------- */
  function initScrollHeader() {
    const siteHeader = document.querySelector('.civic-floating-bar');
    if (!siteHeader) return;

    let ticking = false;
    let lastScrolled = null;

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 15;
          if (lastScrolled !== isScrolled) {
            lastScrolled = isScrolled;
            siteHeader.classList.toggle('scrolled', isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     3. Universal Scroll-Driven Reveal Engine (Compositor + Fallback)
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
      return;
    }

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
     4. Kinetic Typography Engine
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
     5. 3D Card Tilt Engine
     -------------------------------------------------------------------------- */
  function init3DCardTilts() {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    }

    const cards = document.querySelectorAll(
      '.tilt-card, .bento-card, .civic-service-card, .civic-service-card-feature, .spotlight-card, .wpd-bento-item'
    );
    if (!cards.length) return;

    cards.forEach((card) => {
      let rect = null;
      let rafId = null;
      let clientX = 0;
      let clientY = 0;

      function updateTilt() {
        if (!rect) return;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
        rafId = null;
      }

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      }, { passive: true });

      card.addEventListener('mousemove', (e) => {
        if (!rect) {
          rect = card.getBoundingClientRect();
        }
        clientX = e.clientX;
        clientY = e.clientY;
        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        rect = null;
        card.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease';
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. One-Tap Interactive Copy Buttons
     -------------------------------------------------------------------------- */
  function initInteractiveCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy-text]');
      if (!btn) return;

      const text = btn.getAttribute('data-copy-text');
      if (!text) return;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'COPIED';
          if (window.showToast) window.showToast(`Copied "${text}" to clipboard`, 'success');

          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(() => {
          if (window.showToast) window.showToast(`Selected: ${text}`, 'info');
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Global Toast Notification Dispatcher
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
      pill.style.background = 'var(--accent-emerald, #059669)';
      pill.style.color = '#FFFFFF';
    } else if (type === 'warning') {
      pill.style.background = 'var(--accent-amber, #D97706)';
      pill.style.color = '#FFFFFF';
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
     8. Washington Police Department Experience Engine
     -------------------------------------------------------------------------- */
  function initWpdExperience() {
    const root = document.getElementById('wpd-experience-root');
    if (!root && !document.querySelector('.hero-editorial-section')) return;

    initActiveNavLinks();
    initWatchTelemetry();
    initCoinTactile();
    initServicesFilter();
    initDistrictMap();
    initActionDrawers();
    initSkiperGooeyMenu();
    initFooterActions();
    initCardCursorSpotlight();
    initStationTelemetry();
    initCommandPalette();
    initAddressResolver();
  }

  function initActiveNavLinks() {
    let currentFile = window.location.pathname.split('/').pop() || 'index.html';
    if (currentFile === '' || currentFile === '/') currentFile = 'index.html';
    document.querySelectorAll('.civic-nav-link, .civic-nav-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentFile || href.split('#')[0] === currentFile)) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function initWatchTelemetry() {
    const watchPill = document.getElementById('watch-name-pill');
    const watchHours = document.getElementById('watch-hours-text');
    const watchSupervisor = document.getElementById('watch-supervisor-text');
    const lobbyPill = document.getElementById('lobby-status-pill');

    if (!watchPill || typeof WPD_DATA === 'undefined' || !WPD_DATA.watches) return;

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday

    let activeWatch = WPD_DATA.watches[0]; // default Day Shift
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
    const searchClearBtn = document.getElementById('services-search-clear');
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

      if (searchClearBtn) {
        searchClearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
      }

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const keywords = ((card.getAttribute('data-keywords') || '') + ' ' + card.innerText).toLowerCase();
        const catList = cat.toLowerCase().split(/\s+/);
        const matchesCat = (activeCategory === 'all' || catList.includes(activeCategory.toLowerCase()));
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

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        applyFilter();
      });
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

    if (!mapEl || typeof L === 'undefined' || typeof WPD_DATA === 'undefined') return;

    const isMobileDevice = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 992);
    const map = L.map('real-district-leaflet-map', {
      center: [40.7075, -89.4074],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: false,
      preferCanvas: true,
      tap: false
    });

    if (isMobileDevice) {
      map.dragging.disable();
      mapEl.addEventListener('touchstart', function onFirstTouch() {
        map.dragging.enable();
      }, { passive: true, once: true });
    }

    if (map.attributionControl) {
      map.attributionControl.setPrefix('City of Washington GIS');
    }

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | City of Washington GIS'
    }).addTo(map);

    const tacticalLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: '© Esri, HERE, Garmin | WPD Tactical CAD'
    });

    const districtPolys = {};
    const districtConfig = {
      1: { name: "District 1 (Historic Core & East)", color: "#2563EB", acres: "434 Acres" },
      2: { name: "District 2 (West Sector)", color: "#059669", acres: "1,681 Acres" },
      3: { name: "District 3 (North Sector / Bypass)", color: "#7C3AED", acres: "1,477 Acres" }
    };

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

    function createMapPin(label, bgClass) {
      return L.divIcon({
        className: 'wpd-leaflet-marker',
        html: `<div class="wpd-map-marker-pin ${bgClass || ''}"><span class="pin-marker-text">${label}</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    }

    // Authentic Washington, IL Landmarks (Exact GIS Verified Coordinates)
    // --- District 1 Markers (Core & East Sector) ---
    L.marker([40.705261, -89.408731], { icon: createMapPin('HQ', 'pin-hq') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title" style="color: #0A192F;">Washington Police Headquarters</div>
        <div class="wpd-map-popup-desc">
          <strong>115 W. Jefferson St., Washington, IL 61571</strong><br>
          District 1 Civic Core Beat • 24/7 Dispatch Station<br>
          Administrative Window: Mon–Fri 8:00 AM – 4:30 PM<br>
          Emergency: <strong>911</strong> | Non-Emergency: <strong>(309) 444-2313</strong>
        </div>
      `);

    L.marker([40.703241, -89.406824], { icon: createMapPin('SQ', 'pin-square') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Historic Washington Square</div>
        <div class="wpd-map-popup-desc">
          District 1 Sector Heart • Central Fountain & Commercial Core<br>
          Historic Downtown Commercial District & Community Center
        </div>
      `);

    L.marker([40.704368, -89.418084], { icon: createMapPin('HS', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Washington Community High School (District 308)</div>
        <div class="wpd-map-popup-desc">
          115 Bondurant St. • District 1 Core & East Sector<br>
          Dedicated School Resource Officer (SRO) Safety Station
        </div>
      `);

    L.marker([40.714403, -89.413580], { icon: createMapPin('DE', 'pin-civic') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Devonshire Estates</div>
        <div class="wpd-map-popup-desc">
          Devonshire Road Corridor • District 1 Sector<br>
          Devonshire Neighborhood Area & Residential Sector
        </div>
      `);

    L.marker([40.718057, -89.407216], { icon: createMapPin('MS', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Washington Middle School (District 52)</div>
        <div class="wpd-map-popup-desc">
          1100 N. Main St. • District 1 Core & East Sector<br>
          Dedicated School Resource Officer (SRO) & Campus Safety
        </div>
      `);

    L.marker([40.709767, -89.410749], { icon: createMapPin('LS', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Lincoln Grade School</div>
        <div class="wpd-map-popup-desc">
          375 W. Peoria St. • District 1 Sector<br>
          School Zone Safety & Recreational Trail Connection
        </div>
      `);

    // --- District 2 Markers (West Sector) ---
    L.marker([40.702889, -89.423556], { icon: createMapPin('AL', 'pin-retail') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">ALDI & Peoria Street Commercial Center</div>
        <div class="wpd-map-popup-desc">
          1110 Peoria St. • District 2 West Commercial Hub<br>
          Retail Loss Deterrence & Commercial Traffic Calming
        </div>
      `);

    L.marker([40.706890, -89.457002], { icon: createMapPin('FP', 'pin-retail') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Freedom Parkway Commercial Center</div>
        <div class="wpd-map-popup-desc">
          1980 Freedom Pkwy • District 2 West Sector Hub<br>
          Walmart Supercenter & Retail Commercial Corridor
        </div>
      `);

    L.marker([40.689469, -89.463509], { icon: createMapPin('MV', 'pin-square') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Meadow Valley Park</div>
        <div class="wpd-map-popup-desc">
          525 Ernest St. • District 2 West Sector<br>
          Washington Park District Facility & Recreation Area
        </div>
      `);

    // --- District 3 Markers (North Sector & Bypass) ---
    L.marker([40.706959, -89.421734], { icon: createMapPin('5P', 'pin-civic') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Five Points Washington</div>
        <div class="wpd-map-popup-desc">
          360 N. Wilmor Rd. • Community & Performing Arts Center<br>
          District 3 Sector Patrol Coordination Area
        </div>
      `);

    L.marker([40.707374, -89.425492], { icon: createMapPin('CP', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Central Primary School (District 51)</div>
        <div class="wpd-map-popup-desc">
          1400 Newcastle Rd. • District 3 North Sector<br>
          Dedicated School Resource Officer (SRO) & D.A.R.E. Program
        </div>
      `);

    L.marker([40.707417, -89.426338], { icon: createMapPin('CI', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Central Intermediate School (District 51)</div>
        <div class="wpd-map-popup-desc">
          1301 Eagle Ave. • District 3 North Sector<br>
          Dedicated School Resource Officer (SRO) Campus Safety
        </div>
      `);

    L.marker([40.705480, -89.422589], { icon: createMapPin('F1', 'pin-hq') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Washington Fire Department Station 1</div>
        <div class="wpd-map-popup-desc">
          200 N. Wilmor Rd. • District 3 North Sector<br>
          First Responder Inter-Agency Emergency Operations
        </div>
      `);

    L.marker([40.706227, -89.448216], { icon: createMapPin('CT', 'pin-retail') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Cherry Tree Shopping Center</div>
        <div class="wpd-map-popup-desc">
          Peoria St. (North Side) • District 3 Commercial Corridor<br>
          Kroger & Retail Area Proactive Police Presence
        </div>
      `);

    let activeDistrictId = "2";

    function selectDistrict(id, flyTo = true) {
      activeDistrictId = String(id);
      const dist = WPD_DATA.districts && WPD_DATA.districts[id];
      if (!dist) return;

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

      tabBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-district') === String(id));
      });

      const cadHudDist = document.getElementById('cad-hud-district');
      const cadHudUnit = document.getElementById('cad-hud-unit');
      const cadHudStatus = document.getElementById('cad-hud-status');
      const cadHudPhase = document.getElementById('cad-hud-phase');
      const cadHudTimer = document.getElementById('cad-hud-timer');
      const cadHudPip = document.getElementById('cad-hud-pip');

      if (cadHudDist) cadHudDist.textContent = dist.name;
      if (cadHudUnit) cadHudUnit.textContent = dist.sectorCar;
      if (cadHudStatus) {
        cadHudStatus.textContent = 'SECTOR ACTIVE';
        if (String(id) === '1') cadHudStatus.style.color = '#60A5FA';
        else if (String(id) === '3') cadHudStatus.style.color = '#C084FC';
        else cadHudStatus.style.color = '#34D399';
      }
      if (cadHudPhase) cadHudPhase.textContent = `DISTRICT ${id} // SECTOR PATROL`;
      if (cadHudTimer && dist.acres) cadHudTimer.textContent = dist.acres.toUpperCase();
      if (cadHudPip) {
        cadHudPip.className = 'status-pip ' + 
          (String(id) === '1' ? 'status-pip-blue' : (String(id) === '3' ? 'status-pip-purple' : 'status-pip-emerald'));
      }
    }

    let isProgrammaticScrolling = false;
    let scrollTimeout = null;
    let currentScrollyStep = null;
    const scrollySteps = document.querySelectorAll('.scrolly-step');
    const hudTimer = document.getElementById('cad-hud-timer');
    const hudPhase = document.getElementById('cad-hud-phase');
    const hudStatus = document.getElementById('cad-hud-status');
    const hudDistrict = document.getElementById('cad-hud-district');
    const hudUnit = document.getElementById('cad-hud-unit');
    const hudPip = document.getElementById('cad-hud-pip');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-district');
        isProgrammaticScrolling = true;
        currentScrollyStep = String(id);
        scrollySteps.forEach(s => s.classList.toggle('active', s.getAttribute('data-district') === String(id)));
        selectDistrict(id, true);
        const targetStep = document.querySelector(`.scrolly-step[data-district="${id}"]`);
        if (targetStep) targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isProgrammaticScrolling = false;
        }, 800);
      });
    });

    legendChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-district-jump');
        isProgrammaticScrolling = true;
        currentScrollyStep = String(id);
        scrollySteps.forEach(s => s.classList.toggle('active', s.getAttribute('data-district') === String(id)));
        selectDistrict(id, true);
        const targetStep = document.querySelector(`.scrolly-step[data-district="${id}"]`);
        if (targetStep) targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isProgrammaticScrolling = false;
        }, 800);
      });
    });

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
        isProgrammaticScrolling = true;
        currentScrollyStep = '1';
        scrollySteps.forEach(s => s.classList.toggle('active', s.getAttribute('data-district') === '1'));
        selectDistrict(1, false);
        const targetStep = document.querySelector(`.scrolly-step[data-district="1"]`);
        if (targetStep) targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isProgrammaticScrolling = false;
        }, 800);
      });
    }

    window.selectDistrictFromMap = function(id) {
      selectDistrict(id, true);
    };

    // District Sector Scrollytelling Orchestrator
    if (scrollySteps.length) {
      const scrollyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (isProgrammaticScrolling) return;
          if (entry.isIntersecting) {
            const stepEl = entry.target;
            const stepId = stepEl.getAttribute('data-step');
            if (currentScrollyStep === stepId) return;
            currentScrollyStep = stepId;

            scrollySteps.forEach(s => s.classList.toggle('active', s === stepEl));

            const time = stepEl.getAttribute('data-time') || '434 ACRES';
            const phase = stepEl.getAttribute('data-phase') || `DISTRICT 0${stepId}`;
            const status = stepEl.getAttribute('data-status') || 'SECTOR ACTIVE';
            const unit = stepEl.getAttribute('data-unit') || 'WPD UNIT';
            const distName = stepEl.getAttribute('data-distname') || 'Patrol District';
            const distId = stepEl.getAttribute('data-district') || '1';

            if (hudTimer) hudTimer.textContent = time;
            if (hudPhase) hudPhase.textContent = phase;
            if (hudStatus) {
              hudStatus.textContent = status;
              if (distId === '1') hudStatus.style.color = '#2563EB';
              else if (distId === '3') hudStatus.style.color = '#7C3AED';
              else hudStatus.style.color = '#059669';
            }
            if (hudDistrict) hudDistrict.textContent = distName;
            if (hudUnit) hudUnit.textContent = unit;
            if (hudPip) {
              hudPip.className = 'status-pip ' + 
                (distId === '1' ? 'status-pip-blue' : (distId === '3' ? 'status-pip-purple' : 'status-pip-emerald'));
            }

            selectDistrict(distId, true);
          }
        });
      }, {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0.1
      });

      scrollySteps.forEach(step => scrollyObserver.observe(step));
    }

    selectDistrict(1, false);

    setTimeout(() => {
      const allLayers = Object.values(districtPolys);
      if (allLayers.length > 0) {
        const group = L.featureGroup(allLayers);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }, 150);
  }

  function initActionDrawers() {
    const backdrops = document.querySelectorAll('.action-drawer-backdrop');
    let activeDrawer = null;
    let lastActiveTrigger = null;

    // Cache initial drawer body HTML for clean restoration
    const initialDrawerBodies = new Map();
    document.querySelectorAll('.wpd-drawer-form').forEach(form => {
      const body = form.closest('.action-drawer-body');
      if (body && !initialDrawerBodies.has(body)) {
        initialDrawerBodies.set(body, body.innerHTML);
      }
    });

    function restoreDrawerBody(body) {
      if (!body || !initialDrawerBodies.has(body)) return;
      body.innerHTML = initialDrawerBodies.get(body);
    }

    function closeAllDrawers() {
      backdrops.forEach(b => {
        b.classList.remove('active');
        const body = b.querySelector('.action-drawer-body');
        if (body && body.querySelector('#receipt-code-display') && initialDrawerBodies.has(body)) {
          restoreDrawerBody(body);
        }
      });
      document.body.style.overflow = '';
      activeDrawer = null;
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
        lastActiveTrigger = null;
      }
    }
    window.closeAllDrawers = closeAllDrawers;

    // Event delegation for opening action drawers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-drawer]');
      if (!trigger) return;

      e.preventDefault();
      lastActiveTrigger = trigger;
      const drawerId = trigger.getAttribute('data-open-drawer');
      const targetDrawer = document.getElementById(drawerId);
      if (targetDrawer) {
        closeAllDrawers();
        const body = targetDrawer.querySelector('.action-drawer-body');
        if (body && body.querySelector('#receipt-code-display') && initialDrawerBodies.has(body)) {
          restoreDrawerBody(body);
        }
        targetDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        activeDrawer = targetDrawer;

        const firstInput = targetDrawer.querySelector('input:not([type="hidden"]), select, textarea, button:not([disabled])');
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
      } else if (drawerId && drawerId !== 'drawer-nav-menu') {
        window.location.href = `services.html?drawer=${encodeURIComponent(drawerId)}`;
      }
    });

    // Auto-open drawer if requested in URL parameter (e.g. services.html?drawer=drawer-parking-permits)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const requested = urlParams.get('drawer') || urlParams.get('openDrawer');
      if (requested) {
        const target = document.getElementById(requested);
        if (target) {
          setTimeout(() => {
            target.classList.add('active');
            document.body.style.overflow = 'hidden';
            activeDrawer = target;
          }, 200);
        }
      }
    } catch (_) {}

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

    // Submit Another Request button click
    document.addEventListener('click', (e) => {
      const anotherBtn = e.target.closest('#btn-submit-another');
      if (anotherBtn) {
        const body = anotherBtn.closest('.action-drawer-body');
        if (body && initialDrawerBodies.has(body)) {
          restoreDrawerBody(body);
          const firstInput = body.querySelector('input:not([type="hidden"]), select, textarea');
          if (firstInput) setTimeout(() => firstInput.focus(), 60);
        }
      }
    });

    // Copy Confirmation Code button click
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('#btn-copy-receipt-code');
      if (copyBtn) {
        const receiptCodeEl = document.getElementById('receipt-code-display');
        const code = receiptCodeEl ? receiptCodeEl.textContent.trim() : '';
        if (navigator.clipboard && code) {
          navigator.clipboard.writeText(code);
          copyBtn.textContent = 'Copied to Clipboard!';
          setTimeout(() => { copyBtn.textContent = 'Copy Confirmation Code'; }, 2200);
          if (window.showToast) window.showToast(`Copied confirmation code ${code}`, 'info');
        }
      }
    });

    // Print Receipt Summary button click
    document.addEventListener('click', (e) => {
      const printBtn = e.target.closest('#btn-print-receipt-summary');
      if (printBtn) {
        window.print();
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

    // Set minimum date today for all drawer date inputs
    try {
      const todayIso = new Date().toISOString().split('T')[0];
      document.querySelectorAll('.wpd-drawer-form input[type="date"]').forEach(dInput => {
        dInput.setAttribute('min', todayIso);
      });
    } catch (_) {}

    // Input auto-formatting: Phone number mask (XXX) XXX-XXXX
    document.addEventListener('input', (e) => {
      const input = e.target;
      if (!input || !input.matches) return;
      if (input.matches('input[type="tel"], input[name*="phone"], input[id*="phone"]')) {
        const cleaned = ('' + input.value).replace(/\D/g, '').substring(0, 10);
        if (cleaned.length >= 7) {
          input.value = `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
        } else if (cleaned.length >= 4) {
          input.value = `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
        } else if (cleaned.length > 0) {
          input.value = `(${cleaned}`;
        }
      } else if (input.matches('input[name*="plate"], input[id*="plate"]')) {
        input.value = input.value.toUpperCase();
      }
    });

    // Form submission handler with confirmation code, copy button, print summary, and reset
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('.wpd-drawer-form');
      if (!form) return;

      e.preventDefault();
      const rand1 = Math.floor(1000 + Math.random() * 9000);
      const rand2 = Math.floor(1000 + Math.random() * 9000);
      const receiptCode = `WPD-2026-${rand1}-${rand2}`;
      const drawerBody = form.closest('.action-drawer-body');
      const formTitle = form.getAttribute('data-form-title') || 'Request';
      const nowCST = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });

      if (drawerBody) {
        drawerBody.innerHTML = `
          <div class="civic-receipt-card" style="text-align: center; padding: var(--space-6) var(--space-4);">
            <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; background: var(--accent-emerald-subtle, rgba(5,150,105,0.12)); color: var(--accent-emerald, #059669); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 auto var(--space-4);">CIVIC RECORD CONFIRMED</div>
            <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-2);">${escapeHtml(formTitle)} Recorded</h3>
            <p style="color: var(--text-secondary); font-size: 0.90rem; margin-bottom: var(--space-4); line-height: 1.6;">
              Your submission has been logged into the Washington Police departmental dispatch record on <strong>${nowCST} CST</strong>. If this is an active parking exemption, please save or print this official confirmation reference.
            </p>
            <div style="background: var(--bg-surface-subtle, #F8FAFC); border: 1px solid var(--border-subtle, rgba(11,27,54,0.12)); border-radius: var(--radius-lg, 14px); padding: var(--space-4); margin-bottom: var(--space-6); font-family: var(--font-mono, monospace); font-size: 0.88rem;">
              <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.05em;">Official CAD Tracking Reference</div>
              <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-primary); letter-spacing: 0.06em;" id="receipt-code-display">${receiptCode}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Washington Police Dispatch • 115 W. Jefferson St</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: var(--space-4);">
              <button type="button" class="btn-editorial-primary" id="btn-print-receipt-summary" style="width: 100%; justify-content: center;">
                Print / Save Receipt
              </button>
              <button type="button" class="btn-editorial-secondary" id="btn-copy-receipt-code" style="width: 100%; justify-content: center;">
                Copy Reference Code
              </button>
              <a href="tel:3094442313" class="btn-editorial-secondary" style="width: 100%; justify-content: center; text-decoration: none;">
                Verify via Dispatch: (309) 444-2313
              </a>
              <button type="button" class="btn-editorial-secondary" id="btn-submit-another" style="width: 100%; justify-content: center;">
                Submit Another Request
              </button>
            </div>
            <button type="button" class="btn-pill btn-pill-primary" data-close-drawer style="width: 100%; margin-top: 6px;">Close Drawer</button>
          </div>
        `;
        if (window.showToast) window.showToast(`${formTitle} recorded (#${receiptCode})`, 'success');
      }
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
    // Handled with requestAnimationFrame throttling and cached rects in init3DCardTilts
  }

  function initSkiperGooeyMenu() {
    const wrappers = document.querySelectorAll('.skiper-gooey-menu-wrapper');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.skiper-goo-btn');
      const panel = wrapper.querySelector('.skiper-gooey-panel');
      if (!trigger || !panel) return;

      function openMenu() {
        wrapper.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      }

      function closeMenu() {
        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }

      // Explicit Click Toggle (Persistent — No hover trigger)
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('is-open');
        if (isOpen) {
          closeMenu();
        } else {
          // Close any other open dropdowns first
          document.querySelectorAll('.skiper-gooey-menu-wrapper.is-open').forEach(w => {
            w.classList.remove('is-open');
            const b = w.querySelector('.skiper-goo-btn');
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          openMenu();
        }
      });

      // Close when navigating or activating an action item inside panel
      panel.querySelectorAll('a, button').forEach(item => {
        item.addEventListener('click', () => {
          closeMenu();
        });
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.skiper-gooey-menu-wrapper')) {
        document.querySelectorAll('.skiper-gooey-menu-wrapper.is-open').forEach(w => {
          w.classList.remove('is-open');
          const btn = w.querySelector('.skiper-goo-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        document.body.classList.remove('menu-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.skiper-gooey-menu-wrapper.is-open').forEach(w => {
          w.classList.remove('is-open');
          const btn = w.querySelector('.skiper-goo-btn');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
          }
        });
        document.body.classList.remove('menu-open');
      }
    });
  }

  /* --------------------------------------------------------------------------
     14. Interactive Resident Knowledge Base Controller
     Instant search (<16ms), category filter pills, accessible accordion, deep-links
     -------------------------------------------------------------------------- */
  function initFaqKnowledgeBase() {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;

    const searchInput = document.getElementById('faq-search-input');
    const clearBtn = document.getElementById('faq-search-clear');
    const liveCounter = document.getElementById('faq-result-count');
    const filterPills = faqSection.querySelectorAll('.faq-filter-pill');
    const cards = Array.from(faqSection.querySelectorAll('.faq-card'));
    const emptyState = document.getElementById('faq-empty-state');
    const emptyResetBtn = document.getElementById('faq-empty-reset');

    // Pre-cache search index in memory to avoid DOM innerText layout thrashing on every keystroke
    const cardIndex = cards.map(card => ({
      el: card,
      category: card.getAttribute('data-category') || 'all',
      keywords: (card.getAttribute('data-keywords') || '').toLowerCase(),
      text: (card.textContent || '').toLowerCase()
    }));

    let currentCategory = 'all';
    let currentQuery = '';
    let searchRaf = null;

    function filterKnowledgeBase() {
      let visibleCount = 0;
      const q = currentQuery.trim().toLowerCase();

      cardIndex.forEach(item => {
        const matchesCat = (currentCategory === 'all' || item.category === currentCategory);
        const matchesQuery = !q || item.text.includes(q) || item.keywords.includes(q);

        if (matchesCat && matchesQuery) {
          item.el.style.display = '';
          visibleCount++;
        } else {
          item.el.style.display = 'none';
        }
      });

      if (liveCounter) {
        if (q || currentCategory !== 'all') {
          liveCounter.textContent = `Showing ${visibleCount} of ${cards.length} verified questions`;
        } else {
          liveCounter.textContent = `Showing all ${cards.length} verified questions`;
        }
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        if (!searchRaf) {
          searchRaf = requestAnimationFrame(() => {
            filterKnowledgeBase();
            searchRaf = null;
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        currentQuery = '';
        filterKnowledgeBase();
      });
    }

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentQuery = '';
        currentCategory = 'all';
        filterPills.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-filter') === 'all'));
        filterKnowledgeBase();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        currentCategory = pill.getAttribute('data-filter') || 'all';
        filterKnowledgeBase();
      });
    });

    // Accordion Toggle
    faqSection.addEventListener('click', (e) => {
      const trigger = e.target.closest('.faq-trigger');
      if (!trigger) return;

      const card = trigger.closest('.faq-card');
      if (!card) return;

      const isOpen = card.classList.contains('is-open');
      card.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Keyboard Arrow Navigation for Accordion
    faqSection.addEventListener('keydown', (e) => {
      const trigger = e.target.closest('.faq-trigger');
      if (!trigger) return;

      const visibleCards = Array.from(faqSection.querySelectorAll('.faq-card')).filter(c => c.style.display !== 'none');
      const triggers = visibleCards.map(c => c.querySelector('.faq-trigger')).filter(Boolean);
      const idx = triggers.indexOf(trigger);
      if (idx === -1) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = triggers[(idx + 1) % triggers.length];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = triggers[(idx - 1 + triggers.length) % triggers.length];
        if (prev) prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        if (triggers[0]) triggers[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        if (triggers[triggers.length - 1]) triggers[triggers.length - 1].focus();
      }
    });

    // Deep-linking via URL hash (e.g. services.html#faq-snow-emergency)
    function handleFaqDeepLink() {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#faq-')) return;

      const targetCard = document.querySelector(hash);
      if (targetCard && targetCard.classList.contains('faq-card')) {
        targetCard.style.display = '';
        targetCard.classList.add('is-open', 'is-active-hash');
        const trigger = targetCard.querySelector('.faq-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');

        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);

        setTimeout(() => {
          targetCard.classList.remove('is-active-hash');
        }, 3000);
      }
    }

    handleFaqDeepLink();
    window.addEventListener('hashchange', handleFaqDeepLink);
  }

  /* --------------------------------------------------------------------------
     14. Ambient Station Telemetry (Central Time Lobby Hours & Snow Status)
     -------------------------------------------------------------------------- */
  function initStationTelemetry() {
    function updateLobbyTelemetry() {
      try {
        const now = new Date();
        const options = { timeZone: 'America/Chicago', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
        const partObj = {};
        parts.forEach(p => { partObj[p.type] = p.value; });

        const weekday = partObj.weekday; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        const hour = parseInt(partObj.hour, 10);
        const minute = parseInt(partObj.minute, 10);
        const currentMinutes = hour * 60 + minute;

        const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
        const isOpen = isWeekday && (currentMinutes >= 8 * 60 && currentMinutes < 16 * 60 + 30); // 8:00 AM - 4:30 PM CST

        const pipElements = document.querySelectorAll('.skiper-lobby-pip');
        const textElements = document.querySelectorAll('.skiper-lobby-text');
        const footerStatusElements = document.querySelectorAll('.civic-footer-lobby-status');

        pipElements.forEach(pip => {
          pip.className = 'telemetry-pip ' + (isOpen ? 'telemetry-pip-open' : 'telemetry-pip-closed');
        });

        textElements.forEach(text => {
          text.textContent = isOpen 
            ? 'Records Lobby: OPEN until 4:30 PM CST' 
            : 'Records Lobby: CLOSED (24/7 Patrol Active)';
        });

        footerStatusElements.forEach(el => {
          el.textContent = isOpen
            ? 'Records Lobby: Open until 4:30 PM CST · Mon–Fri'
            : 'Records Lobby: Closed · 24/7 Police Patrol Active';
        });
      } catch (err) {
        console.warn('Telemetry calculation error:', err);
      }
    }

    updateLobbyTelemetry();
    setInterval(updateLobbyTelemetry, 60000);
  }

  /* --------------------------------------------------------------------------
     15. Universal Civic Command Palette (⌘K / Ctrl+K / /)
     -------------------------------------------------------------------------- */
  function initCommandPalette() {
    let dialog = document.getElementById('wpdCommandDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'wpdCommandDialog';
      dialog.className = 'wpd-command-dialog';
      dialog.setAttribute('aria-label', 'Civic Command Palette & Service Search');
      dialog.innerHTML = `
        <div class="wpd-command-shell">
          <div class="wpd-command-header">
            <svg class="wpd-command-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" id="wpdCommandInput" class="wpd-command-input" placeholder="Search city services, permits, records, dispatch, or pages..." autocomplete="off" spellcheck="false" aria-label="Search civic services and navigation" />
            <div class="wpd-command-header-actions">
              <kbd class="wpd-command-key-hint">ESC</kbd>
              <button type="button" class="wpd-command-close-btn" id="wpdCommandClose" aria-label="Close search">✕</button>
            </div>
          </div>
          <div class="wpd-command-filter-bar">
            <button type="button" class="wpd-filter-chip is-active" data-cat="all">All Services</button>
            <button type="button" class="wpd-filter-chip" data-cat="city">City Portals ↗</button>
            <button type="button" class="wpd-filter-chip" data-cat="wpd">WPD Forms →</button>
            <button type="button" class="wpd-filter-chip" data-cat="nav">Navigation</button>
          </div>
          <div class="wpd-command-body" id="wpdCommandResults" role="listbox"></div>
          <div class="wpd-command-footer">
            <span class="wpd-command-footer-hint"><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span class="wpd-command-footer-hint"><kbd>↵</kbd> Select</span>
            <span class="wpd-command-footer-hint"><kbd>ESC</kbd> Close</span>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
    }

    const input = dialog.querySelector('#wpdCommandInput');
    const resultsContainer = dialog.querySelector('#wpdCommandResults');
    const closeBtn = dialog.querySelector('#wpdCommandClose');
    const filterChips = dialog.querySelectorAll('.wpd-filter-chip');

    let selectedIndex = 0;
    let currentFilter = 'all';
    let filteredItems = [];

    const searchData = (typeof WPD_COMMAND_SEARCH_INDEX !== 'undefined') ? WPD_COMMAND_SEARCH_INDEX : [];

    function renderResults(query = '') {
      const q = query.trim().toLowerCase();
      filteredItems = searchData.filter(item => {
        if (currentFilter === 'city' && item.type !== 'city-portal') return false;
        if (currentFilter === 'wpd' && item.type !== 'wpd-drawer') return false;
        if (currentFilter === 'nav' && item.type !== 'nav-link' && item.type !== 'phone') return false;

        if (!q) return true;
        const haystack = `${item.title} ${item.keywords || ''} ${item.desc || ''} ${item.category || ''}`.toLowerCase();
        return q.split(/\s+/).every(token => haystack.includes(token));
      });

      if (filteredItems.length === 0) {
        resultsContainer.innerHTML = `
          <div class="wpd-command-empty">
            <p>No matching municipal services found for "<strong>${escapeHtml(query)}</strong>"</p>
            <span class="wpd-command-empty-sub">Try searching for "parking", "foia", "ticket", "bike", or call dispatch at (309) 444-2313.</span>
          </div>
        `;
        return;
      }

      selectedIndex = 0;
      let html = '';
      let lastCat = '';

      filteredItems.forEach((item, idx) => {
        if (item.category !== lastCat) {
          lastCat = item.category;
          html += `<div class="wpd-command-group-heading">${escapeHtml(lastCat)}</div>`;
        }
        const isSelected = idx === selectedIndex;
        let badgeClass = 'badge-city';
        if (item.type === 'wpd-drawer') badgeClass = 'badge-wpd';
        else if (item.type === 'partner-portal') badgeClass = 'badge-partner';
        else if (item.type === 'phone') badgeClass = 'badge-phone';
        else if (item.type === 'nav-link') badgeClass = 'badge-nav';

        html += `
          <div class="wpd-command-item ${isSelected ? 'is-selected' : ''}" role="option" aria-selected="${isSelected}" data-index="${idx}">
            <div class="wpd-command-item-main">
              <div class="wpd-command-item-title">${escapeHtml(item.title)}</div>
              <div class="wpd-command-item-desc">${escapeHtml(item.desc)}</div>
            </div>
            <span class="wpd-command-badge ${badgeClass}">${escapeHtml(item.badge)}</span>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;
      updateSelectedAria();
    }

    function updateSelectedAria() {
      const items = resultsContainer.querySelectorAll('.wpd-command-item');
      items.forEach((el, idx) => {
        const isSelected = idx === selectedIndex;
        el.classList.toggle('is-selected', isSelected);
        el.setAttribute('aria-selected', isSelected);
        if (isSelected) {
          el.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    function executeItem(item) {
      if (!item) return;
      closePalette();

      if (item.type === 'city-portal' || item.type === 'partner-portal') {
        window.open(item.action, '_blank', 'noopener,noreferrer');
      } else if (item.type === 'phone') {
        window.location.href = item.action;
      } else if (item.type === 'nav-link') {
        window.location.href = item.action;
      } else if (item.type === 'wpd-drawer') {
        const drawerEl = document.getElementById(item.action);
        if (drawerEl) {
          setTimeout(() => {
            if (typeof window.closeAllDrawers === 'function') {
              window.closeAllDrawers();
            } else {
              document.querySelectorAll('.action-drawer-backdrop.active').forEach(b => b.classList.remove('active'));
            }
            drawerEl.classList.add('active');
            document.body.style.overflow = 'hidden';
            const firstInput = drawerEl.querySelector('input:not([type="hidden"]), select, textarea, button:not([disabled])');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
          }, 100);
        } else {
          window.location.href = `services.html?drawer=${encodeURIComponent(item.action)}`;
        }
      }
    }

    let canCloseOnBackdrop = false;

    function openPalette() {
      canCloseOnBackdrop = false;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'true');
      }
      document.body.classList.add('command-palette-open');
      input.value = '';
      currentFilter = 'all';
      filterChips.forEach(c => c.classList.toggle('is-active', c.getAttribute('data-cat') === 'all'));
      renderResults();
      setTimeout(() => {
        canCloseOnBackdrop = true;
        input.focus();
      }, 100);
    }

    function closePalette() {
      canCloseOnBackdrop = false;
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      document.body.classList.remove('command-palette-open');
    }

    // Trigger button listeners
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#wpdCommandTrigger, [data-open-command-palette]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        openPalette();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closePalette);

    dialog.addEventListener('click', (e) => {
      if (!canCloseOnBackdrop) return;
      if (e.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closePalette();
        }
      }
    });

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        currentFilter = chip.getAttribute('data-cat');
        renderResults(input.value);
      });
    });

    resultsContainer.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.wpd-command-item');
      if (itemEl) {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        executeItem(filteredItems[idx]);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredItems.length;
          updateSelectedAria();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
          updateSelectedAria();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          executeItem(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });

    document.addEventListener('keydown', (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement && document.activeElement.tagName) || '');

      if (isCmdK || isSlash) {
        e.preventDefault();
        if (dialog.open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     16. Instant Address-to-Patrol Beat GIS Resolver (districts.html)
     -------------------------------------------------------------------------- */
  function initAddressResolver() {
    const resolverSection = document.getElementById('address-resolver');
    if (!resolverSection) return;

    const input = document.getElementById('addressResolverInput');
    const clearBtn = document.getElementById('addressResolverClear');
    const suggestionsBox = document.getElementById('addressResolverSuggestions');
    const resultCard = document.getElementById('addressResolverResult');
    const quickChips = resolverSection.querySelectorAll('.address-quick-chip');

    if (!input || !resultCard) return;

    const streets = (typeof WPD_DATA !== 'undefined' && WPD_DATA.streets) ? WPD_DATA.streets : [];
    const districts = (typeof WPD_DATA !== 'undefined' && WPD_DATA.districts) ? WPD_DATA.districts : {};

    function resolveStreet(streetObj) {
      if (!streetObj) return;
      const distInfo = districts[streetObj.district] || {};
      const sectorCar = distInfo.sectorCar || `Sector Car 10${streetObj.district}`;
      const supervisor = distInfo.supervisor || 'Patrol Shift Supervisor';
      const color = distInfo.color || '#2563EB';

      input.value = streetObj.name;
      if (suggestionsBox) suggestionsBox.style.display = 'none';

      resultCard.innerHTML = `
        <div class="resolved-beat-card" style="border-left: 4px solid ${color};">
          <div class="resolved-beat-header">
            <div>
              <span class="resolved-beat-tag" style="background: ${color}18; color: ${color}; border: 1px solid ${color}40;">
                DISTRICT ${streetObj.district} SECTOR
              </span>
              <h3 class="resolved-beat-title" style="margin-top: 6px; font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${escapeHtml(distInfo.name || `District ${streetObj.district}`)}</h3>
            </div>
            <div class="resolved-unit-pill">
              <span class="status-pip status-pip-emerald" aria-hidden="true"></span>
              <strong>${escapeHtml(sectorCar)}</strong>
            </div>
          </div>
          <div class="resolved-beat-details">
            <div class="resolved-detail-item">
              <span class="resolved-detail-label">Matched Street / Area:</span>
              <strong class="resolved-detail-val">${escapeHtml(streetObj.name)} (${escapeHtml(streetObj.area || 'Washington, IL')})</strong>
            </div>
            <div class="resolved-detail-item">
              <span class="resolved-detail-label">Patrol Shift Supervisor:</span>
              <strong class="resolved-detail-val">${escapeHtml(supervisor)}</strong>
            </div>
            <div class="resolved-detail-item">
              <span class="resolved-detail-label">Sector Coverage Focus:</span>
              <strong class="resolved-detail-val">${escapeHtml(distInfo.priority || '24/7 Residential and Commercial Patrol')}</strong>
            </div>
          </div>
          <div class="resolved-beat-actions">
            <button type="button" class="btn-editorial-primary" id="btn-resolver-jump-map" data-target-district="${streetObj.district}">
              Focus Sector on Tactical Map ↓
            </button>
            <a href="tel:3094442313" class="btn-editorial-secondary" style="text-decoration: none;">
              Call Dispatch (309) 444-2313
            </a>
            <a href="tel:911" class="btn-editorial-secondary" style="text-decoration: none; color: #DC2626; border-color: rgba(220,38,38,0.3);">
              Emergency: 911
            </a>
          </div>
        </div>
      `;
      resultCard.style.display = 'block';

      const mapJumpBtn = resultCard.querySelector('#btn-resolver-jump-map');
      if (mapJumpBtn) {
        mapJumpBtn.addEventListener('click', () => {
          const mapSection = document.getElementById('districts');
          if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          const legendBtn = document.querySelector(`[data-district-jump="${streetObj.district}"]`);
          if (legendBtn) {
            setTimeout(() => legendBtn.click(), 300);
          }
        });
      }
    }

    const expandMap = {
      'st': ['st', 'street'],
      'rd': ['rd', 'road'],
      'dr': ['dr', 'drive'],
      'ave': ['ave', 'avenue'],
      'ln': ['ln', 'lane'],
      'ct': ['ct', 'court'],
      'cir': ['cir', 'circle'],
      'blvd': ['blvd', 'boulevard'],
      'pkwy': ['pkwy', 'parkway'],
      'pl': ['pl', 'place'],
      'way': ['way'],
      'trl': ['trl', 'trail'],
      'n': ['n', 'north'],
      's': ['s', 'south'],
      'e': ['e', 'east'],
      'w': ['w', 'west']
    };
    const wordToRoot = {};
    for (const [root, variants] of Object.entries(expandMap)) {
      for (const v of variants) {
        wordToRoot[v] = root;
      }
    }

    function tokenize(text) {
      if (!text) return { norm: '', tokens: [] };
      const norm = text.toLowerCase()
        .replace(/^\d+\s*/, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const tokens = norm.split(' ').filter(Boolean).map(w => wordToRoot[w] || w);
      return { norm, tokens };
    }

    let currentMatches = [];
    let focusedIndex = -1;

    function searchStreets(q) {
      if (!q || q.trim().length < 2) {
        if (suggestionsBox) suggestionsBox.style.display = 'none';
        currentMatches = [];
        focusedIndex = -1;
        return;
      }

      const { norm: qNorm, tokens: qTokens } = tokenize(q);
      const rawLower = q.trim().toLowerCase().replace(/^\d+\s+/, '');

      if (!qNorm && !rawLower) {
        if (suggestionsBox) suggestionsBox.style.display = 'none';
        currentMatches = [];
        focusedIndex = -1;
        return;
      }

      const scored = [];
      for (let i = 0; i < streets.length; i++) {
        const s = streets[i];
        const sNameLower = s.name.toLowerCase();
        const { norm: sNorm, tokens: sTokens } = tokenize(s.name);
        const areaLower = (s.area || '').toLowerCase();

        let score = 0;
        if (sNameLower === rawLower || sNorm === qNorm) {
          score = 1000;
        } else if (sNameLower.startsWith(rawLower) || (qNorm && sNorm.startsWith(qNorm))) {
          score = 500;
        } else if (sNameLower.split(' ').some(w => w.startsWith(rawLower)) || (qNorm && sNorm.split(' ').some(w => w.startsWith(qNorm)))) {
          score = 300;
        } else if (sNameLower.includes(rawLower) || (qNorm && sNorm.includes(qNorm))) {
          score = 150;
        } else {
          const allTokensMatch = qTokens.length > 0 && qTokens.every(qt =>
            sTokens.some(st => st.startsWith(qt) || qt.startsWith(st))
          );
          if (allTokensMatch) {
            score = 100;
          } else if (areaLower.includes(rawLower) || (qNorm && areaLower.includes(qNorm))) {
            score = 50;
          }
        }

        if (score > 0) {
          scored.push({ s, score });
        }
      }

      scored.sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name));
      currentMatches = scored.slice(0, 8).map(x => x.s);
      focusedIndex = -1;

      if (currentMatches.length > 0 && suggestionsBox) {
        suggestionsBox.innerHTML = currentMatches.map((m, idx) => `
          <button type="button" class="address-suggestion-item" data-idx="${idx}" role="option" aria-selected="false">
            <span class="suggestion-name">${escapeHtml(m.name)}</span>
            <span class="suggestion-district" style="color: ${districts[m.district] ? districts[m.district].color : 'var(--mtw-police-gold)'};">
              District ${m.district} • ${escapeHtml(m.area || '')}
            </span>
          </button>
        `).join('');
        suggestionsBox.style.display = 'block';
      } else if (suggestionsBox) {
        suggestionsBox.innerHTML = `
          <div class="address-suggestion-empty">No Washington street matched "${escapeHtml(q)}". Try typing Main, Jefferson, Centennial, or Wilmor.</div>
        `;
        suggestionsBox.style.display = 'block';
      }
    }

    function updateFocusedItem(items) {
      items.forEach((item, idx) => {
        if (idx === focusedIndex) {
          item.classList.add('active-suggestion');
          item.setAttribute('aria-selected', 'true');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active-suggestion');
          item.setAttribute('aria-selected', 'false');
        }
      });
    }

    input.addEventListener('input', (e) => {
      searchStreets(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (!suggestionsBox || suggestionsBox.style.display === 'none') {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchStreets(input.value);
          if (currentMatches.length > 0) {
            resolveStreet(currentMatches[0]);
          }
        }
        return;
      }

      const items = suggestionsBox.querySelectorAll('.address-suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIndex = (focusedIndex + 1) % items.length;
        updateFocusedItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIndex = (focusedIndex - 1 + items.length) % items.length;
        updateFocusedItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const targetIdx = focusedIndex >= 0 ? focusedIndex : 0;
        if (currentMatches[targetIdx]) {
          resolveStreet(currentMatches[targetIdx]);
        }
      } else if (e.key === 'Escape') {
        suggestionsBox.style.display = 'none';
        focusedIndex = -1;
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        if (suggestionsBox) suggestionsBox.style.display = 'none';
        resultCard.style.display = 'none';
        currentMatches = [];
        focusedIndex = -1;
        input.focus();
      });
    }

    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const streetName = chip.getAttribute('data-street');
        const match = streets.find(s => s.name.toLowerCase() === streetName.toLowerCase());
        if (match) {
          resolveStreet(match);
        }
      });
    });

    if (suggestionsBox) {
      suggestionsBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.address-suggestion-item');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && currentMatches[idx]) {
          resolveStreet(currentMatches[idx]);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.address-search-box') && suggestionsBox) {
        suggestionsBox.style.display = 'none';
        focusedIndex = -1;
      }
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
