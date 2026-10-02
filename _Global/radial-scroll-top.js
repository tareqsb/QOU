(function () {
  if (customElements.get('radial-scroll-top')) return;

  class RadialScrollTop extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      // Link external stylesheet inside Shadow DOM
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', '../_Global/radial-scroll-top.css');

      const container = document.createElement('div');
      container.style.display = 'contents';
      container.innerHTML = `
        <div class="font-controls">
          <button class="btn-font btn-increase" title="Increase Font (+1%)" aria-label="Increase Font Size">+</button>
          <button class="btn-font btn-decrease" title="Decrease Font (-1%)" aria-label="Decrease Font Size">−</button>
        </div>

        <button class="cs-scroll-top" role="button" aria-label="Scroll to top button">
          <svg class="cs-icon-chevron-up" viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <div class="cs-scroll-top-border">
            <svg width="48" height="48" viewBox="0 0 52 52">
              <path d="M26,2 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48"></path>
            </svg>
          </div>
          <div class="cs-scroll-top-progress">
            <svg width="48" height="48" viewBox="0 0 52 52">
              <path d="M26,2 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48"></path>
            </svg>
          </div>
        </button>
      `;

      shadow.appendChild(linkElem);
      shadow.appendChild(container);

      this.scrollBtn = shadow.querySelector('.cs-scroll-top');
      this.fontControlsGroup = shadow.querySelector('.font-controls');
      this.btnIncrease = shadow.querySelector('.btn-increase');
      this.btnDecrease = shadow.querySelector('.btn-decrease');
      this.progressPath = shadow.querySelector('.cs-scroll-top-progress path');
      
      this.pathLength = this.progressPath.getTotalLength();

      this.currentFontPercent = 100;
      this.minFontPercent = 95;
      this.maxFontPercent = 105;
    }

    connectedCallback() {
      this.progressPath.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
      this.progressPath.style.strokeDashoffset = this.pathLength;

      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.counterZoom);

      this.scrollBtn.addEventListener('click', this.scrollToTop);

      this.btnIncrease.addEventListener('click', (e) => {
        e.stopPropagation();
        this.adjustFontSize(1);
      });

      this.btnDecrease.addEventListener('click', (e) => {
        e.stopPropagation();
        this.adjustFontSize(-1);
      });

      this.applyFontOverrideRule();
      this.counterZoom();
      this.handleScroll();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.counterZoom);
      this.scrollBtn.removeEventListener('click', this.scrollToTop);
    }

    counterZoom = () => {
      const targetWidth = 450;
      const maxZoom = 2.222;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      let scale = viewportWidth / targetWidth;
      if (scale > maxZoom) {
        scale = maxZoom;
      }

      if (scale > 0) {
        this.style.transform = `scale(${1 / scale})`;
      }
    };

    adjustFontSize = (delta) => {
      let newPercent = this.currentFontPercent + delta;

      if (newPercent > this.maxFontPercent) newPercent = this.maxFontPercent;
      if (newPercent < this.minFontPercent) newPercent = this.minFontPercent;

      this.currentFontPercent = newPercent;
      this.applyFontOverrideRule();
    };

    applyFontOverrideRule = () => {
      let fontOverrideStyle = document.getElementById('radial-font-override');
      if (!fontOverrideStyle) {
        fontOverrideStyle = document.createElement('style');
        fontOverrideStyle.id = 'radial-font-override';
        document.head.appendChild(fontOverrideStyle);
      }

      fontOverrideStyle.textContent = `
        body, body * {
          font-size: ${this.currentFontPercent}% !important;
          line-height: 1.6 !important;
        }
      `;
    };

    handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTotal > 0) {
        const scrollPercent = scrollTop / scrollTotal;
        const drawLength = this.pathLength * scrollPercent;
        this.progressPath.style.strokeDashoffset = this.pathLength - drawLength;
      }

      if (scrollTop > 100) {
        this.scrollBtn.classList.add('is-active');
        this.fontControlsGroup.classList.add('is-active');
      } else {
        this.scrollBtn.classList.remove('is-active');
        this.fontControlsGroup.classList.remove('is-active');
      }
    };

    scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  }

  customElements.define('radial-scroll-top', RadialScrollTop);
})();