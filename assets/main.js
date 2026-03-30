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

  document.querySelectorAll('.product-thumbnail').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      if (!mainImageEl) return;

      // Swap main image src from data-full attribute
      const fullSrc = this.getAttribute('data-full');
      if (fullSrc) {
        mainImageEl.setAttribute('src', fullSrc);
      }

      // Update active state
      document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('is-active'));
      this.classList.add('is-active');
    });
  });

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

    const selectedColor = activeColor ? activeColor.getAttribute('data-color') : null;
    const selectedSize = activeSize ? activeSize.getAttribute('data-size') : null;

    // Find the matching variant
    const match = variants.find(function (v) {
      const colorMatch = !selectedColor || v.option1 === selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.option2 === selectedSize || v.size === selectedSize;
      return colorMatch && sizeMatch;
    });

    if (!match) return;

    // Update hidden variant input
    if (variantIdInput) {
      variantIdInput.value = match.id;
    }

    // Update displayed price if variant has different price
    const priceEl = document.querySelector('.product-price');
    if (priceEl && match.price != null) {
      // Shopify prices are in cents
      const formatted = (match.price / 100).toFixed(2);
      priceEl.textContent = '$' + formatted;
    }

    // Update main image if variant has an associated image
    if (mainImageEl && match.featured_image && match.featured_image.src) {
      mainImageEl.setAttribute('src', match.featured_image.src);
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
     9. Add to Cart (AJAX)
     ========================================================================== */

  const addToCartForm = document.querySelector('.add-to-cart-form');

  if (addToCartForm) {
    addToCartForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      // Show loading state
      if (submitBtn) submitBtn.classList.add('is-loading');

      const variantId = this.querySelector('input[name="id"]');
      const qtyInput = this.querySelector('input[name="quantity"]') || this.querySelector('.qty-input');
      const id = variantId ? variantId.value : null;
      const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, quantity: quantity })
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Add to cart failed');
          return response.json();
        })
        .then(function () {
          // Success — update button text briefly
          if (submitBtn) {
            submitBtn.textContent = 'Added!';
          }
          updateCartCount();

          setTimeout(function () {
            if (submitBtn) {
              submitBtn.textContent = originalText;
              submitBtn.classList.remove('is-loading');
            }
          }, 1500);
        })
        .catch(function (err) {
          console.error(err);
          alert('Could not add to cart. Please try again.');
          if (submitBtn) submitBtn.classList.remove('is-loading');
        });
    });
  }

  /* ==========================================================================
     10. Cart Count Update
     ========================================================================== */

  function updateCartCount() {
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        var countEls = document.querySelectorAll('.cart-count');
        countEls.forEach(function (el) {
          el.textContent = cart.item_count;
          if (cart.item_count > 0) {
            el.classList.add('has-items');
          } else {
            el.classList.remove('has-items');
          }
        });
      })
      .catch(function (err) {
        console.error('Cart count update failed:', err);
      });
  }

});
