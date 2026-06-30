// ── Nav scroll ──
function scroll(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ── Active nav dot ──
(function () {
  const dots = document.querySelectorAll('.nav-dot');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dots.forEach(dot => {
        const m = dot.getAttribute('onclick').match(/'([^']+)'/);
        dot.classList.toggle('active', !!(m && m[1] === id));
      });
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
})();

// ── Scroll Reveal ──
(function () {
  function done(el) {
    el.addEventListener('animationend', () => {
      el.classList.remove('reveal-anim', 'revealed');
      el.style.opacity = '1';
    }, { once: true });
  }

  function revealEl(el, delay) {
    el.classList.add('reveal-anim');
    setTimeout(() => {
      el.classList.add('revealed');
      done(el);
    }, delay || 0);
  }

  // Staggered grid
  function watchGrid(selector) {
    document.querySelectorAll(selector).forEach(grid => {
      const children = Array.from(grid.children);
      children.forEach(child => child.classList.add('reveal-anim'));

      new IntersectionObserver(([entry], obs) => {
        if (!entry.isIntersecting) return;
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('revealed');
            done(child);
          }, i * 110);
        });
        obs.disconnect();
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }).observe(grid);
    });
  }

  // Single element
  function watchEl(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal-anim');
      new IntersectionObserver(([entry], obs) => {
        if (!entry.isIntersecting) return;
        el.classList.add('revealed');
        done(el);
        obs.disconnect();
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }).observe(el);
    });
  }

  // Section headings (hero 제외)
  document.querySelectorAll('section:not(#hero)').forEach(sec => {
    const els = [
      sec.querySelector('.label'),
      sec.querySelector('h2'),
      sec.querySelector('.sub-desc, .visual-sub')
    ].filter(Boolean);
    els.forEach(el => el.classList.add('reveal-anim'));

    new IntersectionObserver(([entry], obs) => {
      if (!entry.isIntersecting) return;
      els.forEach((el, i) => {
        setTimeout(() => { el.classList.add('revealed'); done(el); }, i * 90);
      });
      obs.disconnect();
    }, { threshold: 0.15 }).observe(sec);
  });

  watchGrid('.research-grid, .goal-cards, .persona-grid, .ut-grid, .typo-grid, .closing-badges');
  watchEl('.but-box, .goal-final, .bp-scroll, .flow-canvas, .comp-table-box, .pos-map-box, .comp-features, .color-dual, .logo-showcase, .feature-block');
})();

// ── Counter Animation ──
(function () {
  function animCount(el, to) {
    const dur = 1100;
    let t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * to) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animCount(entry.target, +entry.target.dataset.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.donut-label').forEach(el => {
    el.dataset.target = parseInt(el.textContent);
    el.textContent = '0%';
    obs.observe(el);
  });
})();

// ── Bar Fill Animation ──
(function () {
  document.querySelectorAll('.bar-fill').forEach(el => {
    el.dataset.w = el.style.width;
    el.style.width = '0';
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.bar-fill').forEach((fill, i) => {
        setTimeout(() => { fill.style.width = fill.dataset.w; }, 200 + i * 130);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.research-card').forEach(el => {
    if (el.querySelector('.bar-fill')) obs.observe(el);
  });
})();

// ── Progress Bar Animation (Feature phones) ──
(function () {
  document.querySelectorAll('.ps-progress-fill').forEach(el => {
    el.dataset.w = el.style.width;
    el.style.width = '0';
    el.style.transition = 'width 0.9s cubic-bezier(.22,.61,.36,1)';
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.ps-progress-fill').forEach((fill, i) => {
        setTimeout(() => { fill.style.width = fill.dataset.w; }, 400 + i * 220);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.phone-frame').forEach(el => obs.observe(el));
})();
