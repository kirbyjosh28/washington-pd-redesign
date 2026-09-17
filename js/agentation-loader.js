/**
 * Agentation Universal Environment Loader
 * Activates visual feedback toolbar exclusively on local development machines.
 * Strictly prevents toolbar injection on shared public links (e.g., Vercel).
 */
(function () {
  try {
    const host = window.location.hostname || '';
    const protocol = window.location.protocol || '';
    const search = window.location.search || '';
    const params = new URLSearchParams(search);

    // 1. Never load on shared production / staging links
    const isSharedLink =
      host.includes('vercel.app') ||
      host.includes('ci.washington.il.us') ||
      host.includes('washington-il.gov');

    if (isSharedLink) {
      return;
    }

    // 2. Explicit disable flag
    if (params.get('agentation') === '0' || params.get('agentation') === 'false') {
      return;
    }

    // 3. Local development environment detection:
    // - Explicit query override: ?agentation=1
    // - Local file protocol (opening directly from disk / Finder)
    // - Localhost loopback addresses (127.0.0.1, localhost, 0.0.0.0, ::1)
    // - Local network mDNS (.local, .test, .internal)
    // - Private network IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    // - Any local server with an active port (e.g. :8000, :3000, :5173)
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

    if (!isLocalComputer) {
      return;
    }

    // Avoid duplicate injection
    if (document.getElementById('agentation-bundle-script')) {
      return;
    }

    function injectBundle() {
      if (document.getElementById('agentation-bundle-script')) return;
      const script = document.createElement('script');
      script.id = 'agentation-bundle-script';
      // Compute relative path to js/agentation.bundle.js based on current document
      const currentPath = window.location.pathname;
      const isInSubdir = currentPath.includes('/scratch/') || currentPath.includes('/sub/');
      script.src = (isInSubdir ? '../' : '') + 'js/agentation.bundle.js?v=' + Date.now();
      script.async = true;
      document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBundle);
    } else {
      injectBundle();
    }
  } catch (err) {
    console.warn('[Agentation] Loader error:', err);
  }
})();
