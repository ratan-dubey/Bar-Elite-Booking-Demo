/* ===========================
   BAR BOOKING DEMO - script.js
   RD Studios by Ratan
=========================== */

// ===== PACKAGE PRICES =====
const PACKAGE_PRICES = {
  basic: 400,
  premium: 700,
  vip: 1200,
};

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initCalculator();
  initBookingForm();
  initParallax();
  initStatCounters();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 80;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile nav if open
        closeMobileNav();
      }
    });
  });
}

// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closeMobileNav = function () {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

// ===== CALCULATOR =====
function initCalculator() {
  const guestsInput = document.getElementById('calcGuests');
  const packageSelect = document.getElementById('calcPackage');
  const resultEl = document.getElementById('calcResult');

  let animationFrame;
  let currentDisplayed = 0;

  function animateCount(from, to, duration = 600) {
    cancelAnimationFrame(animationFrame);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);

      resultEl.textContent = '₹' + current.toLocaleString('en-IN');

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        currentDisplayed = to;
      }
    }

    animationFrame = requestAnimationFrame(update);
  }

  function updateCalc() {
    const guests = parseInt(guestsInput?.value) || 0;
    const pkg = packageSelect?.value || 'basic';
    const pricePerPerson = PACKAGE_PRICES[pkg] || 0;
    const total = guests * pricePerPerson;

    if (guests > 0) {
      animateCount(currentDisplayed, total);
      // Flash animation
      resultEl.style.animation = 'none';
      requestAnimationFrame(() => {
        resultEl.style.animation = 'countUp 0.4s ease';
      });
    } else {
      animateCount(currentDisplayed, 0);
    }
  }

  if (guestsInput) guestsInput.addEventListener('input', updateCalc);
  if (packageSelect) packageSelect.addEventListener('change', updateCalc);
}

// ===== BOOKING FORM =====
function initBookingForm() {
  const form = document.getElementById('bookingForm');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('#bookName')?.value?.trim();
    const phone = form.querySelector('#bookPhone')?.value?.trim();

    if (!name || !phone) {
      showToast('⚠️ Missing Info', 'Please fill in all required fields.', true);
      return;
    }

    // Simulate loading state
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loader-dots">Processing</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      showToast('🎉 Booking Submitted!', 'Your booking request has been received. We will contact you shortly. (Demo)');
    }, 1800);
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(title, message, isError = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon" id="toastIcon">🥂</div>
      <div class="toast-content">
        <h4 id="toastTitle"></h4>
        <p id="toastMsg"></p>
      </div>
    `;
    document.body.appendChild(toast);
  }

  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = message;
  document.getElementById('toastIcon').textContent = isError ? '⚠️' : '🥂';

  if (isError) {
    toast.style.background = 'linear-gradient(135deg, rgba(80,40,0,0.95), rgba(30,10,0,0.98))';
  } else {
    toast.style.background = 'linear-gradient(135deg, rgba(139,0,0,0.9), rgba(50,0,0,0.95))';
  }

  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

// ===== PARALLAX =====
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

// ===== STAT COUNTERS =====
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, 0, target, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, from, to, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== BOOK AGAIN =====
window.bookAgain = function () {
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    const offset = 80;
    const top = bookingSection.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// ===== PACKAGE SELECT (From Pricing Card) =====
window.selectPackage = function (pkg) {
  const formPackage = document.getElementById('bookPackage');
  const calcPackage = document.getElementById('calcPackage');
  if (formPackage) formPackage.value = pkg;
  if (calcPackage) {
    calcPackage.value = pkg;
    calcPackage.dispatchEvent(new Event('change'));
  }

  // Scroll to booking form
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    const offset = 80;
    const top = bookingSection.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};
