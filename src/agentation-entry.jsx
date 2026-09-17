import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

function mountAgentation() {
  const host = window.location.hostname || '';
  const protocol = window.location.protocol || '';
  const search = window.location.search || '';
  const params = new URLSearchParams(search);

  // 1. Strict exclusion on shared links
  const isSharedLink =
    host.includes('vercel.app') ||
    host.includes('ci.washington.il.us') ||
    host.includes('washington-il.gov');

  if (isSharedLink) return;

  // 2. Explicit disable flag
  if (params.get('agentation') === '0' || params.get('agentation') === 'false') {
    return;
  }

  // 3. Local computer environment detection
  const isLocalComputer =
    params.get('agentation') === '1' ||
    params.get('agentation') === 'true' ||
    protocol === 'file:' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local') ||
    host.endsWith('.test') ||
    host.endsWith('.internal') ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    window.location.port !== '' ||
    (!host.includes('.') && host.length > 0);

  if (!isLocalComputer) return;

  if (document.getElementById('agentation-root')) return;

  const container = document.createElement('div');
  container.id = 'agentation-root';
  container.setAttribute('data-agentation-container', 'true');
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Agentation endpoint="http://localhost:4747" />
    </React.StrictMode>
  );

  function tryAutoExpand() {
    const trigger = document.querySelector(
      '[data-feedback-toolbar] [role="button"], [data-feedback-toolbar] [title="Start feedback mode"], [data-agentation-toolbar] [role="button"]'
    );
    const isExpanded = document.querySelector('[data-feedback-toolbar] [class*="expanded"], [data-agentation-toolbar] [class*="expanded"]');
    if (trigger && !isExpanded) {
      trigger.click();
      return true;
    }
    return !!isExpanded;
  }

  // Attempt auto-expand at progressive intervals
  setTimeout(tryAutoExpand, 250);
  setTimeout(tryAutoExpand, 600);
  setTimeout(tryAutoExpand, 1200);

  window.openAgentation = () => {
    const trigger = document.querySelector(
      '[data-feedback-toolbar] [role="button"], [data-feedback-toolbar] [title="Start feedback mode"], [data-agentation-toolbar] [role="button"]'
    );
    const isExpanded = document.querySelector('[data-feedback-toolbar] [class*="expanded"], [data-agentation-toolbar] [class*="expanded"]');
    if (trigger && !isExpanded) trigger.click();
  };

  window.toggleAgentation = () => {
    const isExpanded = document.querySelector('[data-feedback-toolbar] [class*="expanded"], [data-agentation-toolbar] [class*="expanded"]');
    const closeBtn = document.querySelector(
      '[data-feedback-toolbar] [class*="expanded"] button[title*="Close"], [data-feedback-toolbar] [class*="expanded"] [class*="controlButton"]:last-child, [data-agentation-toolbar] [class*="expanded"] [class*="controlButton"]:last-child'
    );
    if (isExpanded && closeBtn) closeBtn.click();
    else window.openAgentation();
  };

  window.__agentation = {
    open: window.openAgentation,
    toggle: window.toggleAgentation
  };

  console.log('[Agentation] Toolbar active on local computer.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAgentation);
} else {
  mountAgentation();
}
