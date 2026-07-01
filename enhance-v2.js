'use strict';

/**
 * WOW LAYER (v2)
 * Additive enhancements on top of script.js: smooth scroll, scroll progress,
 * cursor spotlight on cards, 3D portrait tilt, hero parallax, a title
 * scramble-in, and a count-up. All guarded for reduced-motion / coarse pointer
 * and degrade gracefully if Lenis fails to load.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasLenis = typeof window.Lenis !== 'undefined';

  /* 1 — SMOOTH SCROLL (Lenis) ------------------------------------------- */
  let lenis = null;
  if (!reduce && hasLenis) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 1
    });
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // route in-page anchors through Lenis (capture so it wins)
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -8, duration: 1.1 });
    }, true);
  }

  /* 2 — SCROLL PROGRESS BAR --------------------------------------------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const updBar = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const sc = window.scrollY || h.scrollTop || 0;
    bar.style.transform = 'scaleX(' + (max > 0 ? (sc / max).toFixed(4) : 0) + ')';
  };
  window.addEventListener('scroll', updBar, { passive: true });
  window.addEventListener('resize', updBar);
  updBar();

  /* 3 — CURSOR SPOTLIGHT ON CARDS --------------------------------------- */
  if (fine) {
    document.querySelectorAll('.cert-card, .note-card, .role-node, .mode-lane, .mentor-quote, .contact-pill').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* 4 — 3D PORTRAIT TILT (portrait is not magnetic, so no conflict) ------ */
  const portrait = document.querySelector('.portrait-card');
  if (portrait && fine && !reduce) {
    portrait.classList.add('has-tilt');
    portrait.addEventListener('pointermove', (e) => {
      const r = portrait.getBoundingClientRect();
      const rx = (((e.clientY - r.top) / r.height) - 0.5) * -9;
      const ry = (((e.clientX - r.left) / r.width) - 0.5) * 11;
      portrait.style.setProperty('--tiltX', rx.toFixed(2) + 'deg');
      portrait.style.setProperty('--tiltY', ry.toFixed(2) + 'deg');
    });
    portrait.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--tiltX', '0deg');
      portrait.style.setProperty('--tiltY', '0deg');
    });
  }

  /* 5 — HERO PARALLAX (decorative, non-reveal elements only) ------------ */
  if (!reduce) {
    const cornerL = document.querySelector('.corner-left');
    const cornerR = document.querySelector('.corner-right');
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY || 0;
      if (cornerL) cornerL.style.transform = `translateY(${(y * 0.16).toFixed(1)}px)`;
      if (cornerR) cornerR.style.transform = `translateY(${(y * -0.1).toFixed(1)}px)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* 6 — HERO TITLE SCRAMBLE-IN ------------------------------------------ */
  if (!reduce) {
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/0123456789';
    document.querySelectorAll('.hero-line').forEach((el, line) => {
      const finalText = el.textContent;
      let frame = 0;
      const settle = 8 + line * 6;
      const total = finalText.length * 3 + settle + 6;
      const id = window.setInterval(() => {
        frame++;
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') { out += ' '; continue; }
          if (i < (frame - settle) / 3) out += finalText[i];
          else out += glyphs[(Math.random() * glyphs.length) | 0];
        }
        el.textContent = out;
        if (frame > total) { window.clearInterval(id); el.textContent = finalText; }
      }, 38);
    });
  }

  /* 7 — COUNT-UP CORNER NUMBER ------------------------------------------ */
  const cr = document.querySelector('.corner-right');
  if (cr && !reduce) {
    cr.textContent = '0';
    let n = 0;
    const id = window.setInterval(() => {
      n += 3;
      if (n >= 100) { n = 100; window.clearInterval(id); }
      cr.textContent = String(n);
    }, 22);
  }
})();
