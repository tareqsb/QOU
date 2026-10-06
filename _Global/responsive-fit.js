(function () {
  // 1. Inject viewport meta tag if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
    document.head.appendChild(meta);
  }

  // 2. Calculation logic capped at equivalent 1000px viewport width
  function applyResponsiveZoom() {
    const targetWidth = 380; 
    const maxZoom = 2.222; // Capped at equivalent of 1000px viewport (1000 / 450)
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    let scale = viewportWidth / targetWidth;
    if (scale > maxZoom) {
      scale = maxZoom;
    }

    document.body.style.zoom = scale;
  }

  window.addEventListener('resize', applyResponsiveZoom);
  applyResponsiveZoom();
})();
