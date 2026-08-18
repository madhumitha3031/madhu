/**
 * Madhumitha V — Personal Portfolio
 * Core Logic: Lenis Smooth Scrolling, GSAP Animations, Theme Switching, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* --------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLLING SETUP & GSAP INTEGRATION
     -------------------------------------------------------------------------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* --------------------------------------------------------------------------
     2. THEME SWITCHING (DARK / LIGHT) WITH LOCALSTORAGE
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('mv-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('mv-theme', nextTheme);

      // Subtle GSAP flash/transition effect on toggle button
      gsap.fromTo(themeToggleBtn, 
        { scale: 0.92 }, 
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    });
  }

  /* --------------------------------------------------------------------------
     3. MOBILE FULLSCREEN MENU
     -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const mobileNavOverlay = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  let isMobileMenuOpen = false;

  const openMobileMenu = () => {
    isMobileMenuOpen = true;
    mobileNavOverlay.classList.add('is-active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    
    // Animate hamburger to X
    gsap.to('.hamburger-line.top', { rotation: 45, y: 4, duration: 0.3 });
    gsap.to('.hamburger-line.bottom', { rotation: -45, y: -4, duration: 0.3 });

    // GSAP reveal overlay and links
    gsap.to(mobileNavOverlay, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.mobile-nav-link', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    );
    gsap.fromTo('.mobile-nav-footer',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.4 }
    );
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen = false;
    mobileToggleBtn.setAttribute('aria-expanded', 'false');

    gsap.to('.hamburger-line.top', { rotation: 0, y: 0, duration: 0.3 });
    gsap.to('.hamburger-line.bottom', { rotation: 0, y: 0, duration: 0.3 });

    gsap.to(mobileNavOverlay, { 
      opacity: 0, 
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: () => {
        mobileNavOverlay.classList.remove('is-active');
      }
    });
  };

  if (mobileToggleBtn && mobileNavOverlay) {
    mobileToggleBtn.addEventListener('click', () => {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        closeMobileMenu();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -60, duration: 1.2 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. NAVBAR ACTIVE SECTION INDICATOR & SMOOTH ANCHORS
     -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-links-desktop .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Smooth scroll on desktop nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -40, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Active section tracking with ScrollTrigger
  sections.forEach((section) => {
    const sectionId = section.getAttribute('id');
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => updateActiveNav(sectionId),
      onEnterBack: () => updateActiveNav(sectionId),
    });
  });

  function updateActiveNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-section') === id);
    });
  }

  /* --------------------------------------------------------------------------
     5. HERO ENTRANCE SEQUENCE (GSAP TIMELINE)
     -------------------------------------------------------------------------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Navbar reveals from top
  heroTl.fromTo('.site-header', 
    { y: -30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
  );

  // 2. Hero label / badge reveal
  heroTl.fromTo('.hero-badge-wrap', 
    { y: 15, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 }, 
    '-=0.5'
  );

  // 3. Main heading reveals line-by-line
  heroTl.fromTo('.hero-line-inner', 
    { y: '110%' }, 
    { y: '0%', duration: 0.9, stagger: 0.14, ease: 'power4.out' }, 
    '-=0.4'
  );

  // 4. Description fades up
  heroTl.fromTo('.hero-description', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    '-=0.5'
  );

  // 5. Buttons and metadata appear
  heroTl.fromTo('.hero-cta-group .btn', 
    { y: 15, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
    '-=0.4'
  );

  heroTl.fromTo('.hero-meta-strip', 
    { y: 15, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 }, 
    '-=0.3'
  );

  // 6. Right visual enters with subtle scale + opacity
  heroTl.fromTo('.product-window-card', 
    { y: 40, opacity: 0, scale: 0.96 }, 
    { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, 
    '-=0.8'
  );

  // 7. Floating tech badges entrance
  heroTl.fromTo('.float-badge',
    { scale: 0.8, opacity: 0, y: 10 },
    { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' },
    '-=0.5'
  );

  /* --------------------------------------------------------------------------
     6. HERO RIGHT VISUAL SUBTLE MOUSE PARALLAX
     -------------------------------------------------------------------------- */
  const heroVisualContainer = document.getElementById('hero-visual');
  const floatingBadges = document.querySelectorAll('.float-badge');

  if (heroVisualContainer && window.matchMedia('(pointer: fine)').matches) {
    heroVisualContainer.addEventListener('mousemove', (e) => {
      const rect = heroVisualContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to('.product-window-card', {
        rotationY: x * 8,
        rotationX: -y * 8,
        duration: 0.8,
        ease: 'power2.out',
        transformPerspective: 1000
      });

      floatingBadges.forEach((badge) => {
        const depth = parseFloat(badge.getAttribute('data-depth') || 0.2);
        gsap.to(badge, {
          x: x * depth * 60,
          y: y * depth * 60,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });

    heroVisualContainer.addEventListener('mouseleave', () => {
      gsap.to('.product-window-card', {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'power2.out'
      });

      floatingBadges.forEach((badge) => {
        gsap.to(badge, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. SECTION-BY-SECTION SCROLL REVEALS
     -------------------------------------------------------------------------- */
  const revealGroups = document.querySelectorAll('.reveal-group');

  revealGroups.forEach((group) => {
    gsap.fromTo(group, 
      { y: 35, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stagger skills items when scrolled into view
  const skillCategories = document.querySelectorAll('.skill-category-row');
  skillCategories.forEach((row) => {
    const skillItems = row.querySelectorAll('.skill-item-typo');
    gsap.fromTo(skillItems,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Stagger certification rows
  const certRows = document.querySelectorAll('.cert-row-item');
  gsap.fromTo(certRows,
    { y: 25, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.certifications-list',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Cert row hover micro-interactions via GSAP
  certRows.forEach((row) => {
    const arrow = row.querySelector('.cert-arrow');
    row.addEventListener('mouseenter', () => {
      gsap.to(row, { x: 8, duration: 0.35, ease: 'power2.out' });
      if (arrow) {
        gsap.to(arrow, { x: 6, duration: 0.35, ease: 'power2.out' });
      }
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(row, { x: 0, duration: 0.35, ease: 'power2.out' });
      if (arrow) {
        gsap.to(arrow, { x: 0, duration: 0.35, ease: 'power2.out' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. SELECTED WORK: FILTER & SPOTLIGHT CARDS
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const spotlightCards = document.querySelectorAll('.project-spotlight-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');

      spotlightCards.forEach((card) => {
        if (target === 'all' || card.getAttribute('id') === target) {
          card.style.display = 'block';
          gsap.fromTo(card,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
          );
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // Spotlight Card 3D Hover Depth on Desktop
  spotlightCards.forEach((card) => {
    if (window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
      });
    }
  });

  /* --------------------------------------------------------------------------
     9. PROJECT 01: INTERACTIVE WORKFLOW CONSOLE
     -------------------------------------------------------------------------- */
  const cTabBtns = document.querySelectorAll('.c-tab-btn');
  const cPanes = document.querySelectorAll('.console-pane');
  const btnDispatchEvent = document.getElementById('btn-dispatch-event');
  const crudStateLabel = document.getElementById('crud-state-label');
  const archBoxes = document.querySelectorAll('.arch-box');

  // Architecture Feature Boxes Toggle
  archBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      archBoxes.forEach((b) => b.classList.remove('active'));
      box.classList.add('active');
      gsap.fromTo(box, 
        { scale: 0.98 }, 
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    });
  });

  // Console Subnav Tabs
  cTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPane = btn.getAttribute('data-pane');
      cTabBtns.forEach((b) => b.classList.remove('active'));
      cPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`pane-${targetPane}`);
      if (activePane) {
        activePane.classList.add('active');
        gsap.fromTo(activePane, 
          { opacity: 0, y: 8 }, 
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  });

  // Dispatch CRUD Action Event Simulation
  if (btnDispatchEvent) {
    btnDispatchEvent.addEventListener('click', () => {
      const originalText = btnDispatchEvent.innerHTML;
      btnDispatchEvent.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-accent"></i> <span>Processing...</span>';
      
      if (crudStateLabel) crudStateLabel.textContent = 'Writing to MongoDB...';

      setTimeout(() => {
        btnDispatchEvent.innerHTML = '<i class="fa-solid fa-check text-accent"></i> <span>Event Committed</span>';
        if (crudStateLabel) crudStateLabel.textContent = 'Synchronized (200 OK)';

        // Flash swimlane cards
        gsap.fromTo('.task-card.verified', 
          { scale: 1.02, borderColor: 'var(--accent)' }, 
          { scale: 1, borderColor: 'rgba(216, 255, 79, 0.2)', duration: 0.5, stagger: 0.1, ease: 'power2.out' }
        );

        setTimeout(() => {
          btnDispatchEvent.innerHTML = originalText;
        }, 2200);
      }, 550);
    });
  }

  /* --------------------------------------------------------------------------
     10. PROJECT 02: INTERACTIVE ML SOIL TELEMETRY ENGINE
     -------------------------------------------------------------------------- */
  const mlChips = document.querySelectorAll('.ml-chip');
  const txtCropName = document.getElementById('txt-crop-name');
  const txtSoilType = document.getElementById('txt-soil-type');
  const txtConfVal = document.getElementById('txt-conf-val');
  const trackConf = document.getElementById('track-conf');
  const txtN = document.getElementById('txt-n');
  const txtP = document.getElementById('txt-p');
  const txtK = document.getElementById('txt-k');
  const txtEnv = document.getElementById('txt-env');
  const trackN = document.getElementById('track-n');
  const trackP = document.getElementById('track-p');
  const trackK = document.getElementById('track-k');
  const trackEnv = document.getElementById('track-env');

  mlChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      mlChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const crop = chip.getAttribute('data-crop');
      const soil = chip.getAttribute('data-soil');
      const conf = chip.getAttribute('data-conf');
      const n = chip.getAttribute('data-n');
      const p = chip.getAttribute('data-p');
      const k = chip.getAttribute('data-k');
      const env = chip.getAttribute('data-env');

      if (txtN) txtN.textContent = `${n} mg/kg`;
      if (txtP) txtP.textContent = `${p} mg/kg`;
      if (txtK) txtK.textContent = `${k} mg/kg`;
      if (txtEnv) txtEnv.textContent = env;
      if (txtSoilType) txtSoilType.textContent = soil;

      if (trackN) gsap.to(trackN, { width: `${Math.min(100, (n / 140) * 100)}%`, duration: 0.5, ease: 'power2.out' });
      if (trackP) gsap.to(trackP, { width: `${Math.min(100, (p / 100) * 100)}%`, duration: 0.5, ease: 'power2.out' });
      if (trackK) gsap.to(trackK, { width: `${Math.min(100, (k / 100) * 100)}%`, duration: 0.5, ease: 'power2.out' });

      if (txtCropName) {
        gsap.fromTo(txtCropName,
          { opacity: 0, y: -6 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.35, 
            ease: 'power2.out',
            onStart: () => {
              txtCropName.textContent = crop;
            }
          }
        );
      }

      if (txtConfVal) txtConfVal.textContent = conf;
      if (trackConf) gsap.to(trackConf, { width: conf, duration: 0.6, ease: 'power2.out' });
    });
  });

});


