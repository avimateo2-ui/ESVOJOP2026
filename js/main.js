/* ═══════════════════════════════════════════
   VOLEIBOL · PASIÓN EN LA RED
   Shared JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cursor Glow ── */
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  /* ── Hamburger Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  /* ── Scroll Reveal ── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ── Shop Filters ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card');
  if (filterBtns.length && products.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        products.forEach((p) => {
          if (filter === 'all' || p.dataset.category === filter) {
            p.style.display = 'block';
          } else {
            p.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Guide Tabs ── */
  const tabs = document.querySelectorAll('.guide-tab');
  const contents = document.querySelectorAll('.guide-content');
  if (tabs.length && contents.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        contents.forEach((c) => c.classList.remove('active'));
        const target = document.getElementById(tab.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ── Add to Cart Toast ── */
  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Producto agregado al carrito ✓');
    });
  });

  /* ── Toast System ── */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ── Lightbox Shared ── */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbClose = document.getElementById('lbClose');
    const lbImg = document.getElementById('lbImg');

    lbClose?.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', e => {
      if (e.target === e.currentTarget) lightbox.classList.remove('open');
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft' && typeof changeImage === 'function') changeImage(-1);
      if (e.key === 'ArrowRight' && typeof changeImage === 'function') changeImage(1);
    });

    /* ── Lightbox (Gallery) ── */
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      const galleryImgs = Array.from(galleryItems).map(item => item.querySelector('img')?.src).filter(Boolean);
      let currentIdx = 0;

      window.changeImage = function(dir) {
        currentIdx = (currentIdx + dir + galleryImgs.length) % galleryImgs.length;
        lbImg.src = galleryImgs[currentIdx];
      };

      function openLightbox(idx) {
        currentIdx = idx;
        lbImg.src = galleryImgs[currentIdx];
        lbImg.alt = galleryItems[currentIdx].querySelector('img')?.alt || '';
        lightbox.classList.add('open');
      }

      galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
      });

      document.getElementById('lbPrev')?.addEventListener('click', () => changeImage(-1));
      document.getElementById('lbNext')?.addEventListener('click', () => changeImage(1));
    }

    /* ── Lightbox (Extra Cards) ── */
    document.querySelectorAll('.extra-card[data-img]').forEach(card => {
      card.addEventListener('click', () => {
        lbImg.src = card.dataset.img;
        lbImg.alt = card.querySelector('img')?.alt || '';
        lightbox.classList.add('open');
      });
    });
  }
});
