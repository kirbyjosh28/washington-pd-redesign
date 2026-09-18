/**
 * Washington Police Department (WPD) — Official Interaction Engine
 * Clean Authoritative Typography • 24/7 CAD Dispatch Telemetry • WCAG 2.2 AA Compliance
 * Zero Icons • Pure Typographic Architecture
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
      if (window.showToast) window.showToast(`Switched to ${next} theme`, 'info');

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
    const siteHeader = document.querySelector('.civic-floating-bar');
    if (!siteHeader) return;

    function handleScroll() {
      const isScrolled = window.scrollY > 15;
      siteHeader.classList.toggle('scrolled', isScrolled);
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
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cards = document.querySelectorAll(
      '.tilt-card, .bento-card, .civic-service-card, .civic-service-card-feature, .spotlight-card, .wpd-bento-item'
    );

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
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

    initWatchTelemetry();
    initCoinTactile();
    initServicesFilter();
    initDistrictMap();
    initActionDrawers();
    initFooterActions();
    initCardCursorSpotlight();
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
      zoomControl: true,
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
      1: { name: "District 1 (East Sector)", color: "#2563EB", acres: "434 Acres" },
      2: { name: "District 2 (West Sector)", color: "#059669", acres: "1,681 Acres" },
      3: { name: "District 3 (North Sector / Devonshire)", color: "#7C3AED", acres: "1,477 Acres" }
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

    // Authentic Washington, IL Landmarks
    L.marker([40.7032, -89.4095], { icon: createMapPin('HQ', 'pin-hq') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title" style="color: #0A192F;">Washington Police Headquarters</div>
        <div class="wpd-map-popup-desc">
          <strong>115 W. Jefferson St., Washington, IL 61571</strong><br>
          24/7 Continuous Emergency Dispatch & Patrol Station<br>
          Administrative / Lobby Window: Mon–Fri 8:00 AM – 4:30 PM<br>
          Emergency: <strong>911</strong> | Non-Emergency: <strong>(309) 444-2313</strong>
        </div>
      `);

    L.marker([40.7040, -89.4074], { icon: createMapPin('SQ', 'pin-square') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Historic Washington Square</div>
        <div class="wpd-map-popup-desc">
          Central Commercial & Civic District • Central Fountain<br>
          Daily Foot Patrols & Walk-and-Talk Community Policing
        </div>
      `);

    L.marker([40.7035, -89.3980], { icon: createMapPin('HS', 'pin-school') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Washington Community High School (District 308)</div>
        <div class="wpd-map-popup-desc">
          115 Bondurant St. • Home of the Panthers<br>
          Dedicated School Resource Officer (SRO) Safety Station
        </div>
      `);

    L.marker([40.7118, -89.4215], { icon: createMapPin('FP', 'pin-civic') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Five Points Washington</div>
        <div class="wpd-map-popup-desc">
          360 N. Wilmor Rd. • Community & Performing Arts Center<br>
          District 1 Sector Patrol Coordination Area
        </div>
      `);

    L.marker([40.7225, -89.4120], { icon: createMapPin('NP', 'pin-retail') })
      .addTo(map)
      .bindPopup(`
        <div class="wpd-map-popup-title">Devonshire Plaza & US-24 Retail Corridor</div>
        <div class="wpd-map-popup-desc">
          North Sector Commercial Corridor<br>
          Sector Car 103 Proactive Patrol Area
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
      if (cadHudDist) cadHudDist.textContent = dist.name;
      if (cadHudUnit) cadHudUnit.textContent = dist.sectorCar;
      if (cadHudStatus) cadHudStatus.textContent = 'SECTOR ACTIVE';
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-district');
        selectDistrict(id, true);
      });
    });

    legendChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-district-jump');
        selectDistrict(id, true);
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
        selectDistrict(2, false);
      });
    }

    window.selectDistrictFromMap = function(id) {
      selectDistrict(id, true);
    };

    // CAD Incident Lifecycle Scrollytelling Orchestrator
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

            scrollySteps.forEach(s => s.classList.toggle('active', s === stepEl));

            const time = stepEl.getAttribute('data-time') || '00:00:00';
            const phase = stepEl.getAttribute('data-phase') || `PHASE 0${stepId}`;
            const status = stepEl.getAttribute('data-status') || 'ACTIVE';
            const unit = stepEl.getAttribute('data-unit') || 'WPD UNIT';
            const distName = stepEl.getAttribute('data-distname') || 'Patrol District';
            const distId = stepEl.getAttribute('data-district') || '2';

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

            selectDistrict(distId, true);
          }
        });
      }, {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0.1
      });

      scrollySteps.forEach(step => scrollyObserver.observe(step));
    }

    selectDistrict(2, false);

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
        const body = targetDrawer.querySelector('.action-drawer-body');
        if (body && body.querySelector('#receipt-code-display') && initialDrawerBodies.has(body)) {
          restoreDrawerBody(body);
        }
        targetDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        activeDrawer = targetDrawer;

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
              <button type="button" class="btn-editorial-secondary" id="btn-submit-another" style="width: 100%; justify-content: center;">
                Submit Another Request
              </button>
            </div>
            <button type="button" class="btn-pill btn-pill-primary" data-close-drawer style="width: 100%; margin-top: 6px;">Close Drawer</button>
          </div>
        `;
        if (window.showToast) window.showToast(`${formTitle} confirmed (#${receiptCode})`, 'success');
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
