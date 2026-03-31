/**
 * Before / After Image Comparison Slider
 * Both images are always 100% × 100% of the container.
 * The after image wrapper is clipped via clip-path: inset(0 X% 0 0).
 * The handle follows via left: X%.
 * No width manipulation — no size changes, ever.
 */
document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var container = slider.querySelector('.ba-container');
    var afterWrap = slider.querySelector('.ba-after-wrapper');
    var handle    = slider.querySelector('.ba-handle');
    if (!container || !afterWrap || !handle) return;

    var isDragging = false;

    function setPosition(clientX) {
      var rect = container.getBoundingClientRect();
      var pct  = (clientX - rect.left) / rect.width;
      pct = Math.max(0.02, Math.min(0.98, pct));
      var rightPct = ((1 - pct) * 100).toFixed(4);
      afterWrap.style.clipPath = 'inset(0 ' + rightPct + '% 0 0)';
      handle.style.left = (pct * 100).toFixed(4) + '%';
    }

    /* initial position: far left — shows full "before" image */
    setPosition(container.getBoundingClientRect().left + container.offsetWidth * 0.05);

    /* ── Mouse ── */
    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (isDragging) setPosition(e.clientX);
    });
    document.addEventListener('mouseup', function () { isDragging = false; });

    /* ── Touch ── */
    handle.addEventListener('touchstart', function (e) {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener('touchend', function () { isDragging = false; });

    /* ── Click anywhere on container ── */
    container.addEventListener('click', function (e) {
      if (!isDragging) setPosition(e.clientX);
    });
  });

});
