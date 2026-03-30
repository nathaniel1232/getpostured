/**
 * Before / After Image Comparison Slider
 * - "before" image sits as the full background
 * - "after" image sits on top, clipped by the wrapper width
 * - dragging the handle reveals more or less of the after image
 */
document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var container  = slider.querySelector('.ba-container');
    var afterWrap  = slider.querySelector('.ba-after-wrapper');
    var handle     = slider.querySelector('.ba-handle');
    var afterImg   = afterWrap ? afterWrap.querySelector('img') : null;
    if (!container || !afterWrap || !handle) return;

    var isDragging = false;
    var startPercent = 0.5;

    /* ── sync after-image to full container width ── */
    function syncAfterWidth() {
      if (afterImg) {
        afterImg.style.width = container.offsetWidth + 'px';
      }
    }

    /* ── position handle + clip wrapper ── */
    function setPosition(clientX) {
      var rect = container.getBoundingClientRect();
      var pct  = (clientX - rect.left) / rect.width;
      pct = Math.max(0.03, Math.min(0.97, pct));
      afterWrap.style.width = (pct * 100) + '%';
      handle.style.left     = (pct * 100) + '%';
    }

    /* initial render */
    syncAfterWidth();
    setPosition(container.getBoundingClientRect().left + container.offsetWidth * startPercent);
    window.addEventListener('resize', function () {
      syncAfterWidth();
    });

    /* ── Mouse ── */
    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (isDragging) setPosition(e.clientX);
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    /* ── Touch ── */
    handle.addEventListener('touchstart', function (e) {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchend', function () {
      isDragging = false;
    });

    /* ── Click anywhere on container ── */
    container.addEventListener('click', function (e) {
      setPosition(e.clientX);
    });
  });

});
