/* ============================================================
   CAREERFY – SCRIPT.JS
   Features:
   · Sticky navbar with scroll shadow
   · Hamburger / mobile menu toggle
   · Hero particle animation
   · Animated counter for stats
   · Job filter tabs
   · Scroll reveal animations
   · Testimonials auto-carousel + dot navigation
   · Back-to-top button
   · Newsletter form with toast feedback
   ============================================================ */
 
'use strict';
 
/* ─── DOM Ready ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initParticles();
  initCounters();
  initJobFilters();
  initScrollReveal();
  initTestimonialsCarousel();
  initBackToTop();
});
 
 
/* ─── 1. STICKY NAVBAR ───────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
 
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}
 
 
/* ─── 2. MOBILE MENU ─────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
 
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
 
  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
 
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}
 
 
/* ─── 3. HERO PARTICLES ──────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
 
  const count = window.innerWidth < 768 ? 12 : 24;
 
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
 
    const size = Math.random() * 80 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 14 + 10;
 
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}
 
 
/* ─── 4. ANIMATED COUNTERS ───────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-item__number[data-target]');
  if (!counters.length) return;
 
  const formatNumber = n => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k+';
    return n.toString();
  };
 
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();
 
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    };
    requestAnimationFrame(step);
  };
 
  // Trigger when stats section enters viewport
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;
 
  let ran = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !ran) {
      ran = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.3 });
 
  observer.observe(statsSection);
}
 
 
/* ─── 5. JOB FILTER TABS ─────────────────────────────────── */
function initJobFilters() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.job-card');
  if (!tabs.length) return;
 
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
 
      const filter = tab.dataset.filter;
 
      cards.forEach(card => {
        const type = card.dataset.type;
        const show = filter === 'all' || type === filter;
 
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
 
  // Inject simple fadeIn keyframe if not present
  if (!document.getElementById('filter-anim-style')) {
    const style = document.createElement('style');
    style.id = 'filter-anim-style';
    style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }`;
    document.head.appendChild(style);
  }
}
 
 
/* ─── 6. SCROLL REVEAL ───────────────────────────────────── */
function initScrollReveal() {
  // Auto-add reveal class to key elements
  const selectors = [
    '.job-card',
    '.category-card',
    '.company-card',
    '.step-card',
    '.testimonial-card',
    '.stat-item',
    '.section-header',
  ];
 
  selectors.forEach((sel, si) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger within same section
      const delay = (i % 4) * 0.1;
      el.style.transitionDelay = `${delay}s`;
    });
  });
 
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
 
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
 
 
/* ─── 7. TESTIMONIALS CAROUSEL ───────────────────────────── */
function initTestimonialsCarousel() {
  const track  = document.getElementById('testimonialsTrack');
  const dots   = document.querySelectorAll('.t-dot');
  if (!track || !dots.length) return;
 
  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  const isMobile = () => window.innerWidth < 768;
 
  let current = 0;
  let autoTimer;
 
  function showCard(idx) {
    if (!isMobile()) return; // Desktop shows all cards in grid
 
    cards.forEach((card, i) => {
      card.style.display = i === idx ? 'flex' : 'none';
    });
 
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    current = idx;
  }
 
  function applyLayout() {
    if (isMobile()) {
      track.style.display = 'block';
      showCard(current);
    } else {
      track.style.display = '';
      cards.forEach(c => (c.style.display = ''));
    }
  }
 
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      showCard(parseInt(dot.dataset.idx, 10));
      startAuto();
    });
  });
 
  function startAuto() {
    autoTimer = setInterval(() => {
      if (isMobile()) {
        const next = (current + 1) % cards.length;
        showCard(next);
      }
    }, 5000);
  }
 
  applyLayout();
  startAuto();
 
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyLayout, 200);
  });
}
 
 
/* ─── 8. BACK TO TOP ─────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
 
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
 
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
 
 
/* ─── 9. NEWSLETTER TOAST ────────────────────────────────── */
function handleNewsletter(e) {
  e.preventDefault();
  const form  = e.target;
  const input = form.querySelector('input[type="email"]');
  const email = input.value.trim();
 
  if (!email) return;
 
  showToast(`You're subscribed! We'll send job alerts to ${email}`);
 
  input.value = '';
}
 
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
 
  toast.textContent = message;
  toast.classList.add('show');
 
  setTimeout(() => toast.classList.remove('show'), 4000);
}
 
 
/* ─── 10. SEARCH BAR FOCUS EFFECT ───────────────────────── */
document.querySelectorAll('.search-field input, .search-field select').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.search-panel__inner')?.classList.add('focused');
  });
  el.addEventListener('blur', () => {
    el.closest('.search-panel__inner')?.classList.remove('focused');
  });
});
 
 
/* ─── 11. SEARCH BUTTON ─────────────────────────────────── */
const searchBtn = document.querySelector('.btn--search');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const keyword  = document.querySelector('.search-panel input[aria-label="Job title or keywords"]')?.value.trim();
    const location = document.querySelector('.search-panel input[aria-label="Location"]')?.value.trim();
    const category = document.querySelector('.search-panel select')?.value;
 
    const params = new URLSearchParams();
    if (keyword)  params.set('q', keyword);
    if (location) params.set('loc', location);
    if (category) params.set('cat', category);
 
    // Navigate to candidates page with search params
    window.location.href = `candidates.html?${params.toString()}`;
  });
}
 
 
/* ─── 12. SMOOTH ANCHOR SCROLLING ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const hash = anchor.getAttribute('href');
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10);
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
 
