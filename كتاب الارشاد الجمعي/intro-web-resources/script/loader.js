(function () {
  // Helper to dynamically load external CSS
  function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  // Helper to dynamically load external JS
  function loadScript(src, callback) {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    } else if (callback) {
      callback();
    }
  }

  function init() {
    // 1. Inject responsive CSS and JS
    loadCSS('responsive-fit.css');
    loadScript('responsive-fit.js');

    // 2. Load radial scroll JS and mount component with dark theme
    loadScript('radial-scroll-top.js', () => {
      if (!document.querySelector('radial-scroll-top')) {
        const scrollComponent = document.createElement('radial-scroll-top');
        scrollComponent.setAttribute('theme', 'dark');
        document.body.appendChild(scrollComponent);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();