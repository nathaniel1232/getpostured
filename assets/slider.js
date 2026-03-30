/**
 * Before / After Image Comparison Slider
 * Vanilla JS, no dependencies.
 *
 * Expected markup per slider:
 *   .ba-slider
 *     .ba-container
 *       .ba-before-wrapper  (full-width image)
 *       .ba-after-wrapper   (clip-revealed image, width controlled by JS)
 *       .ba-handle          (draggable divider)
 */
document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.ba-slider').forEach(slider => {
    const container = slider.querySelector('.ba-container');
    const afterWrapper = slider.querySelector('.ba-after-wrapper');
    const handle = slider.querySelector('.ba-handle');
    if (!container || !afterWrapper || !handle) return;

    const afterImg = afterWrapper.querySelector('img');
    let isDragging = false;

    /* Keep after image sized to container (not wrapper) */
    function syncAfterImageWidth() {
      if (afterImg) afterImg.style.width = container.offsetWidth + 'px';
    }
    syncAfterImageWidth();
    window.addEventListener('resize', syncAfterImageWidth);

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      afterWrapper.style.width = (pos * 100) + '%';
      handle.style.left = (pos * 100) + '%';
    }

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Click anywhere on container
    container.addEventListener('click', (e) => {
      if (!isDragging) setPosition(e.clientX);
    });
  });

});
