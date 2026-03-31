/**
 * Main JavaScript — GetPostured Theme
 * Vanilla JS, no dependencies.
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     1. Scroll Animations (IntersectionObserver)
     ========================================================================== */

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

  /* ==========================================================================
     2. Sticky Header Scroll Detection
     ========================================================================== */

  const siteHeader = document.querySelector('.site-header');
  let lastKnownScrollY = 0;
  let ticking = false;

  function updateHeader() {
    if (lastKnownScrollY > 80) {
      siteHeader && siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader && siteHeader.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    lastKnownScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ==========================================================================
     3. Mobile Navigation
     ========================================================================== */

  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const headerToggle = document.querySelector('.header__toggle');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('is-open');
    mobileOverlay && mobileOverlay.classList.add('is-open');
    headerToggle && headerToggle.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    mobileOverlay && mobileOverlay.classList.remove('is-open');
    headerToggle && headerToggle.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  if (headerToggle) {
    headerToggle.addEventListener('click', function () {
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close on overlay click
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close on close-button click (if a dedicated close button exists inside the nav)
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // Close when clicking a nav link inside the mobile nav
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ==========================================================================
     4. Smooth Scroll
     ========================================================================== */

  const HEADER_OFFSET = 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile nav if open
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        closeMobileNav();
      }

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     5. FAQ Accordion
     ========================================================================== */

  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     6. Product Image Gallery
     ========================================================================== */

  const mainImageEl = document.querySelector('.product-main-image img');
  const galleryThumbs = Array.from(document.querySelectorAll('.product-thumbnail'));
  let currentGalleryIndex = 0;

  function goToGalleryImage(index) {
    if (!galleryThumbs.length || !mainImageEl) return;
    if (index < 0) index = galleryThumbs.length - 1;
    if (index >= galleryThumbs.length) index = 0;
    currentGalleryIndex = index;

    const target = galleryThumbs[index];
    const fullSrc = target.getAttribute('data-full');
    if (fullSrc) {
      mainImageEl.style.opacity = '0';
      setTimeout(function () {
        mainImageEl.setAttribute('src', fullSrc);
        mainImageEl.style.opacity = '1';
      }, 150);
    }
    galleryThumbs.forEach(function (t) { t.classList.remove('is-active'); });
    target.classList.add('is-active');
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  galleryThumbs.forEach(function (thumb, idx) {
    thumb.addEventListener('click', function () { goToGalleryImage(idx); });
  });

  // Prev / Next arrow buttons
  var galleryPrev = document.querySelector('.gallery-arrow--prev');
  var galleryNext = document.querySelector('.gallery-arrow--next');
  if (galleryPrev) galleryPrev.addEventListener('click', function () { goToGalleryImage(currentGalleryIndex - 1); });
  if (galleryNext) galleryNext.addEventListener('click', function () { goToGalleryImage(currentGalleryIndex + 1); });

  // Touch / swipe on the main image
  var mainImageWrapper = document.querySelector('.product-main-image');
  if (mainImageWrapper && galleryThumbs.length > 1) {
    var touchStartX = 0;
    mainImageWrapper.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    mainImageWrapper.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToGalleryImage(diff > 0 ? currentGalleryIndex + 1 : currentGalleryIndex - 1);
      }
    }, { passive: true });
  }

  /* ==========================================================================
     7. Product Variant Selectors
     ========================================================================== */

  const variantIdInput = document.querySelector('input[name="id"]');

  /**
   * Look up the matching variant from the window.productVariants array
   * based on the currently selected color and size, then update the
   * hidden input, displayed price, and main image if applicable.
   */
  function updateVariantSelection() {
    const variants = window.productVariants;
    if (!variants || !Array.isArray(variants)) return;

    const activeColor = document.querySelector('.color-swatch.is-active');
    const activeSize = document.querySelector('.size-option.is-active');

    const selectedColor = activeColor ? activeColor.getAttribute('data-value') : null;
    const selectedSize = activeSize ? activeSize.getAttribute('data-value') : null;

    // Find the matching variant (options array: [option1, option2, ...])
    const match = variants.find(function (v) {
      var opts = v.options || [];
      var colorMatch = !selectedColor || opts[0] === selectedColor;
      var sizeMatch  = !selectedSize  || opts[1] === selectedSize;
      return colorMatch && sizeMatch;
    });

    if (!match) return;

    // Update hidden variant input
    if (variantIdInput) {
      variantIdInput.value = match.id;
    }

    // Update displayed price — keep compare-at price visible
    var currentPriceEl = document.getElementById('product-current-price');
    var comparePriceEl = document.getElementById('product-compare-price');
    if (currentPriceEl && match.price != null) {
      currentPriceEl.textContent = '$' + (match.price / 100).toFixed(2);
    }
    if (comparePriceEl) {
      if (match.compare_at_price && match.compare_at_price > match.price) {
        comparePriceEl.textContent = '$' + (match.compare_at_price / 100).toFixed(2);
        comparePriceEl.style.display = '';
      } else {
        comparePriceEl.style.display = 'none';
      }
    }

    // Update main image if variant has an associated image
    if (mainImageEl && match.featured_image) {
      var imgSrc = typeof match.featured_image === 'string' ? match.featured_image : match.featured_image.src;
      if (imgSrc) mainImageEl.setAttribute('src', imgSrc);
    }
  }

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('is-active'));
      this.classList.add('is-active');
      updateVariantSelection();
    });
  });

  // Size options
  document.querySelectorAll('.size-option').forEach(function (option) {
    option.addEventListener('click', function () {
      document.querySelectorAll('.size-option').forEach(s => s.classList.remove('is-active'));
      this.classList.add('is-active');
      updateVariantSelection();
    });
  });

  /* ==========================================================================
     8. Quantity Selector
     ========================================================================== */

  document.querySelectorAll('.qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const wrapper = this.closest('.qty-selector') || this.parentElement;
      const input = wrapper.querySelector('.qty-input');
      if (!input) return;

      let value = parseInt(input.value, 10) || 1;
      const action = this.getAttribute('data-action');

      if (action === 'increase' && value < 10) {
        value++;
      } else if (action === 'decrease' && value > 1) {
        value--;
      }

      input.value = value;

      // Also update a hidden quantity input if present
      const hiddenQty = document.querySelector('input[name="quantity"]');
      if (hiddenQty) {
        hiddenQty.value = value;
      }
    });
  });

  /* ==========================================================================
     9. Cart Drawer
     ========================================================================== */

  var drawerOverlay = document.getElementById('cart-drawer-overlay');
  var drawer        = document.getElementById('cart-drawer');
  var drawerBody    = document.getElementById('cart-drawer-body');
  var drawerFooter  = document.getElementById('cart-drawer-footer');
  var drawerCount   = document.getElementById('cart-drawer-count');
  var drawerSubtotal = document.getElementById('cart-drawer-subtotal');

  function moneyFmt(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function openCartDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    loadCartDrawer();
  }

  function closeCartDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  if (drawerOverlay) drawerOverlay.addEventListener('click', closeCartDrawer);
  var drawerCloseBtn = document.getElementById('cart-drawer-close');
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeCartDrawer();
  });

  function loadCartDrawer() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCartDrawer(cart); })
      .catch(function (err) { console.error('Failed to load cart', err); });
  }

  function renderCartDrawer(cart) {
    if (!drawerBody) return;

    // Update header count + badge
    if (drawerCount) drawerCount.textContent = cart.item_count;
    var countEls = document.querySelectorAll('.cart-count');
    countEls.forEach(function (el) {
      el.textContent = cart.item_count;
      el.classList.toggle('has-items', cart.item_count > 0);
    });

    if (cart.item_count === 0) {
      drawerBody.innerHTML = '<p class="cart-drawer__empty">Your cart is empty.</p>';
      if (drawerFooter) drawerFooter.style.display = 'none';
      return;
    }

    if (drawerFooter) drawerFooter.style.display = '';
    if (drawerSubtotal) drawerSubtotal.textContent = moneyFmt(cart.total_price);

    var html = '';
    cart.items.forEach(function (item, idx) {
      var line = idx + 1;
      var imgSrc = item.image ? item.image.replace(/(\.[a-z]+)(\?|$)/, '_160x160$1$2') : '';
      html += '<div class="cart-drawer__item" data-line="' + line + '">';
      if (imgSrc) html += '<img class="cart-drawer__item-image" src="' + imgSrc + '" alt="" width="64" height="64" loading="lazy">';
      html += '<div class="cart-drawer__item-info">';
      html += '<p class="cart-drawer__item-title">' + item.product_title + '</p>';
      if (item.variant_title && item.variant_title !== 'Default Title') html += '<p class="cart-drawer__item-variant">' + item.variant_title + '</p>';
      html += '<p class="cart-drawer__item-price">' + moneyFmt(item.final_line_price) + '</p>';
      html += '</div>';
      html += '<div class="cart-drawer__item-actions">';
      html += '<div class="cart-drawer__qty">';
      html += '<button type="button" class="cart-drawer__qty-btn" data-line="' + line + '" data-action="decrease" aria-label="Decrease">−</button>';
      html += '<span class="cart-drawer__qty-val">' + item.quantity + '</span>';
      html += '<button type="button" class="cart-drawer__qty-btn" data-line="' + line + '" data-action="increase" aria-label="Increase">+</button>';
      html += '</div>';
      html += '<button type="button" class="cart-drawer__remove" data-line="' + line + '" aria-label="Remove">Remove</button>';
      html += '</div>';
      html += '</div>';
    });
    drawerBody.innerHTML = html;

    // Bind qty / remove buttons
    drawerBody.querySelectorAll('.cart-drawer__qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var line = parseInt(this.getAttribute('data-line'), 10);
        var valEl = this.closest('.cart-drawer__qty').querySelector('.cart-drawer__qty-val');
        var current = parseInt(valEl.textContent, 10) || 1;
        var next = this.getAttribute('data-action') === 'increase' ? current + 1 : Math.max(0, current - 1);
        // Optimistic update
        valEl.textContent = next;
        var itemRow = this.closest('.cart-drawer__item');
        if (next <= 0 && itemRow) itemRow.style.opacity = '0.4';
        changeDrawerLine(line, next);
      });
    });
    drawerBody.querySelectorAll('.cart-drawer__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var itemRow = this.closest('.cart-drawer__item');
        if (itemRow) itemRow.style.opacity = '0.4';
        changeDrawerLine(parseInt(this.getAttribute('data-line'), 10), 0);
      });
    });
  }

  var changeTimer = null;
  var pendingChanges = {};

  function changeDrawerLine(line, qty) {
    // Debounce rapid clicks on same line
    pendingChanges[line] = qty;
    clearTimeout(changeTimer);
    changeTimer = setTimeout(function () {
      var entries = Object.entries(pendingChanges);
      pendingChanges = {};
      // Process the last change (most common: single line)
      var lastEntry = entries[entries.length - 1];
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: parseInt(lastEntry[0], 10), quantity: lastEntry[1] })
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCartDrawer(cart); })
      .catch(function (err) { console.error('Cart change failed', err); });
    }, 300);
  }

  /* ── Cart icon → open drawer instead of navigating ── */
  document.querySelectorAll('.header__cart').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  /* ==========================================================================
     9b. Add to Cart — AJAX → open drawer
     ========================================================================== */

  const addToCartForm = document.querySelector('.add-to-cart-form');

  if (addToCartForm) {
    addToCartForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.classList.add('is-loading');

      var activePack = this.querySelector('.bundle-option.is-active');
      var bundleQty = activePack ? parseInt(activePack.getAttribute('data-qty'), 10) || 1 : 1;

      // If no bundles or qty=1, simple single add
      if (bundleQty <= 1) {
        var formData = new FormData(this);
        formData.delete('return_to');
        fetch('/cart/add.js', { method: 'POST', body: formData })
          .then(function (r) { return r.json(); })
          .then(function () {
            if (submitBtn) submitBtn.classList.remove('is-loading');
            openCartDrawer();
          })
          .catch(function (err) {
            console.error('Add to cart failed', err);
            if (submitBtn) submitBtn.classList.remove('is-loading');
          });
        return;
      }

      // Multi-item bundle: build items array
      var items = [];

      // Item 1: main selected variant
      var mainVariantId = this.querySelector('input[name="id"]');
      if (mainVariantId) {
        items.push({ id: parseInt(mainVariantId.value, 10), quantity: 1 });
      }

      // Items 2+: from bundle pickers
      var pickers = document.querySelectorAll('.bundle-picker');
      pickers.forEach(function (picker) {
        var colorEl = picker.querySelector('.bundle-picker__swatch.is-active');
        var sizeEl = picker.querySelector('.bundle-picker__size.is-active');
        var color = colorEl ? colorEl.getAttribute('data-value') : null;
        var size = sizeEl ? sizeEl.getAttribute('data-value') : null;
        var vid = findVariantId(color, size);
        if (vid) {
          items.push({ id: vid, quantity: 1 });
        } else if (mainVariantId) {
          // fallback to main variant
          items.push({ id: parseInt(mainVariantId.value, 10), quantity: 1 });
        }
      });

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items })
      })
      .then(function (r) { return r.json(); })
      .then(function () {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        openCartDrawer();
      })
      .catch(function (err) {
        console.error('Add to cart failed', err);
        if (submitBtn) submitBtn.classList.remove('is-loading');
      });
    });
  }

  /* ==========================================================================
     10. (Cart count updated by renderCartDrawer above)
     ========================================================================== */

  /* ==========================================================================
     11. Bundle Pack Selector + Per-Item Pickers
     ========================================================================== */

  var bundleOptions = document.querySelectorAll('.bundle-option');
  var bundleQtyInput = document.querySelector('.qty-hidden');
  var pickerContainer = document.getElementById('bundle-item-pickers');
  var productOpts = window.productOptions || {};

  function findVariantId(color, size) {
    var variants = window.productVariants;
    if (!variants) return null;
    var match = variants.find(function (v) {
      var opts = v.options || [];
      var cMatch = !color || opts[0] === color;
      var sMatch = !size || opts[1] === size;
      return cMatch && sMatch;
    });
    return match ? match.id : null;
  }

  function buildItemPicker(index, colors, sizes) {
    var h = '<div class="bundle-picker" data-picker-index="' + index + '">';
    h += '<p class="bundle-picker__label">Item ' + (index + 1) + '</p>';
    if (colors && colors.length > 0) {
      h += '<div class="bundle-picker__row"><span class="bundle-picker__opt-label">Color</span><div class="bundle-picker__swatches">';
      colors.forEach(function (c, i) {
        h += '<button type="button" class="color-swatch bundle-picker__swatch' + (i === 0 ? ' is-active' : '') + '" data-value="' + c + '" style="background-color:' + c.toLowerCase().replace(/\s/g, '') + ';" aria-label="' + c + '"></button>';
      });
      h += '</div></div>';
    }
    if (sizes && sizes.length > 0) {
      h += '<div class="bundle-picker__row"><span class="bundle-picker__opt-label">Size</span><div class="bundle-picker__sizes">';
      sizes.forEach(function (s, i) {
        h += '<button type="button" class="size-option bundle-picker__size' + (i === 0 ? ' is-active' : '') + '" data-value="' + s + '">' + s + '</button>';
      });
      h += '</div></div>';
    }
    h += '</div>';
    return h;
  }

  function renderBundlePickers(qty) {
    if (!pickerContainer) return;
    if (qty <= 1) {
      pickerContainer.style.display = 'none';
      pickerContainer.innerHTML = '';
      return;
    }
    var colors = productOpts.colors || [];
    var sizes = productOpts.sizes || [];
    if (!colors.length && !sizes.length) { pickerContainer.style.display = 'none'; return; }

    // Get currently selected main options as defaults
    var html = '<p class="bundle-picker__heading">Customize each item:</p>';
    // Item 1 uses the main selectors above
    html += '<p class="bundle-picker__note">Item 1 uses your selection above.</p>';
    for (var i = 1; i < qty; i++) {
      html += buildItemPicker(i, colors, sizes);
    }
    pickerContainer.innerHTML = html;
    pickerContainer.style.display = '';

    // Bind swatch/size clicks within pickers
    pickerContainer.querySelectorAll('.bundle-picker').forEach(function (picker) {
      picker.querySelectorAll('.bundle-picker__swatch').forEach(function (sw) {
        sw.addEventListener('click', function () {
          picker.querySelectorAll('.bundle-picker__swatch').forEach(function (s) { s.classList.remove('is-active'); });
          this.classList.add('is-active');
        });
      });
      picker.querySelectorAll('.bundle-picker__size').forEach(function (sz) {
        sz.addEventListener('click', function () {
          picker.querySelectorAll('.bundle-picker__size').forEach(function (s) { s.classList.remove('is-active'); });
          this.classList.add('is-active');
        });
      });
    });
  }

  bundleOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      bundleOptions.forEach(function (o) { o.classList.remove('is-active'); });
      this.classList.add('is-active');
      var qty = parseInt(this.getAttribute('data-qty'), 10) || 1;
      if (bundleQtyInput) bundleQtyInput.value = qty;
      renderBundlePickers(qty);
    });
  });

});
