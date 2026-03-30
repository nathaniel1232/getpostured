/**
 * Main Theme JavaScript
 * Vanilla JS — no jQuery, no libraries
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. Scroll Reveal Animation (IntersectionObserver)
     ========================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* =========================================================
     2. FAQ Accordion
     ========================================================= */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');
      const answer = parentItem.querySelector('.faq-answer');
      const isOpen = parentItem.classList.contains('active');

      // Close every open FAQ first
      document.querySelectorAll('.faq-item.active').forEach((openItem) => {
        openItem.classList.remove('active');
        const openAnswer = openItem.querySelector('.faq-answer');
        if (openAnswer) openAnswer.style.maxHeight = null;
      });

      // Toggle the clicked item (open only if it was closed)
      if (!isOpen) {
        parentItem.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* =========================================================
     3. Mobile Navigation
     ========================================================= */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuClose = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    document.body.classList.add('nav-open');
  }

  function closeMobileNav() {
    document.body.classList.remove('nav-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMobileNav);
  }

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (
      document.body.classList.contains('nav-open') &&
      mobileNav &&
      !mobileNav.contains(e.target) &&
      menuToggle &&
      !menuToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });

  /* =========================================================
     4. Smooth Scroll for Anchor Links
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Close mobile nav if open
      closeMobileNav();

      const headerOffset = 80;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  /* =========================================================
     5. Product Image Gallery
     ========================================================= */
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.querySelector('.product-main-image img');

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (!mainImage) return;

      // Swap active class
      thumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      // Swap main image src
      const newSrc = thumb.dataset.src || thumb.querySelector('img')?.src;
      if (newSrc) mainImage.src = newSrc;
    });
  });

  /* =========================================================
     6. Size Selector
     ========================================================= */
  const sizeOptions = document.querySelectorAll('.size-option');

  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      // Remove active from siblings
      const parent = option.parentElement;
      parent.querySelectorAll('.size-option').forEach((sib) => sib.classList.remove('active'));

      option.classList.add('active');

      // Update hidden input or data attribute
      const selectedSize = option.dataset.size || option.textContent.trim();
      const hiddenInput = parent.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = selectedSize;
      } else {
        parent.dataset.selectedSize = selectedSize;
      }
    });
  });

  /* =========================================================
     7. Quantity Selector
     ========================================================= */
  document.querySelectorAll('.qty-minus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (!input) return;
      const current = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, current - 1);
    });
  });

  document.querySelectorAll('.qty-plus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (!input) return;
      const current = parseInt(input.value, 10) || 1;
      input.value = Math.min(10, current + 1);
    });
  });

  /* =========================================================
     8. Sticky Header
     ========================================================= */
  const siteHeader = document.querySelector('.site-header');

  if (siteHeader) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };

    // Run once on load and then on every scroll
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =========================================================
     9. Add to Cart (AJAX)
     ========================================================= */
  const cartForms = document.querySelectorAll('.add-to-cart-form');

  cartForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      // Disable button while request is in flight
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding…';
      }

      fetch('/cart/add.js', {
        method: 'POST',
        body: new FormData(form),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Add to cart failed');
          return res.json();
        })
        .then(() => {
          // Brief success state
          if (submitBtn) submitBtn.textContent = 'Added ✓';

          // Update cart count in header
          return fetch('/cart.js');
        })
        .then((res) => res.json())
        .then((cart) => {
          const cartCount = document.querySelector('.cart-count');
          if (cartCount) cartCount.textContent = cart.item_count;
        })
        .catch((err) => {
          console.error(err);
          if (submitBtn) submitBtn.textContent = 'Error – try again';
        })
        .finally(() => {
          // Restore button after a short delay
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            }
          }, 2000);
        });
    });
  });
});
