/**
 * Before / After Image Comparison Slider
 * Vanilla JS — no dependencies
 *
 * Expected markup for each slider:
 *
 *   <div class="before-after-slider">
 *     <div class="before-after__before">
 *       <img src="before.jpg" alt="Before" />
 *     </div>
 *     <div class="before-after__after">
 *       <img src="after.jpg" alt="After" />
 *     </div>
 *     <div class="before-after__handle"></div>
 *   </div>
 */

class BeforeAfterSlider {
  /**
   * @param {HTMLElement} container – a .before-after-slider element
   */
  constructor(container) {
    this.container = container;
    this.overlay = container.querySelector('.before-after__after');
    this.handle = container.querySelector('.before-after__handle');

    // Current divider position (0 – 100)
    this.position = 50;
    this.dragging = false;

    this._applyBaseStyles();
    this._setPosition(this.position);
    this._bindEvents();
  }

  /* -----------------------------------------------------------
     Base inline styles (keep layout logic in JS so the component
     works without an external stylesheet)
     ----------------------------------------------------------- */
  _applyBaseStyles() {
    const { container, overlay, handle } = this;

    // Container
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.userSelect = 'none';
    container.style.touchAction = 'none'; // prevent scroll while dragging

    // Before image wrapper – sits behind, full width
    const before = container.querySelector('.before-after__before');
    if (before) {
      before.style.display = 'block';
      before.style.width = '100%';
    }

    const beforeImg = before?.querySelector('img');
    if (beforeImg) {
      beforeImg.style.display = 'block';
      beforeImg.style.width = '100%';
      beforeImg.style.height = '100%';
      beforeImg.style.objectFit = 'cover';
    }

    // After overlay – absolute, clipped by its width
    if (overlay) {
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.height = '100%';
      overlay.style.overflow = 'hidden';
    }

    const afterImg = overlay?.querySelector('img');
    if (afterImg) {
      // Image must match the container's full width so it aligns with
      // the before image; the parent's overflow: hidden does the clipping.
      afterImg.style.display = 'block';
      afterImg.style.width = container.offsetWidth + 'px';
      afterImg.style.height = '100%';
      afterImg.style.objectFit = 'cover';
    }

    // Handle
    if (handle) {
      handle.style.position = 'absolute';
      handle.style.top = '0';
      handle.style.height = '100%';
      handle.style.width = '4px';
      handle.style.background = '#fff';
      handle.style.cursor = 'grab';
      handle.style.zIndex = '10';
      handle.style.transform = 'translateX(-50%)';
      handle.style.boxShadow = '0 0 6px rgba(0,0,0,0.35)';
    }
  }

  /* -----------------------------------------------------------
     Position helpers
     ----------------------------------------------------------- */
  _setPosition(percent) {
    this.position = Math.min(100, Math.max(0, percent));

    if (this.overlay) {
      this.overlay.style.width = this.position + '%';
    }

    if (this.handle) {
      this.handle.style.left = this.position + '%';
    }

    // Keep the after image sized to the full container so the
    // revealed portion always lines up with the before image.
    const afterImg = this.overlay?.querySelector('img');
    if (afterImg) {
      afterImg.style.width = this.container.offsetWidth + 'px';
    }
  }

  _getPercentFromEvent(e) {
    const rect = this.container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  /* -----------------------------------------------------------
     Event binding
     ----------------------------------------------------------- */
  _bindEvents() {
    // --- Mouse events ---
    this.handle?.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this._startDrag();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      this._setPosition(this._getPercentFromEvent(e));
    });

    document.addEventListener('mouseup', () => {
      if (this.dragging) this._stopDrag();
    });

    // --- Touch events ---
    this.handle?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._startDrag();
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.dragging) return;
      this._setPosition(this._getPercentFromEvent(e));
    });

    document.addEventListener('touchend', () => {
      if (this.dragging) this._stopDrag();
    });

    // --- Resize: keep after image width in sync ---
    window.addEventListener('resize', () => this._setPosition(this.position));
  }

  _startDrag() {
    this.dragging = true;
    if (this.handle) this.handle.style.cursor = 'grabbing';
    document.body.style.cursor = 'grabbing';
  }

  _stopDrag() {
    this.dragging = false;
    if (this.handle) this.handle.style.cursor = 'grab';
    document.body.style.cursor = '';
  }
}

/* ===============================================================
   Initialise all sliders on the page
   =============================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.before-after-slider').forEach((el) => {
    new BeforeAfterSlider(el);
  });
});
