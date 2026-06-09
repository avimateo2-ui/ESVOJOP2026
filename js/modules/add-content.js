/* ═══════════════════════════════════════════
   Admin + Add Content Module
   Admin login, gallery upload, card creator, delete
   ═══════════════════════════════════════════ */

const AddContent = (() => {
  'use strict';

  const ADMIN_USER = 'esvojop';
  const ADMIN_PASS = 'esvojop2026';

  /* ── Admin state (no persistence — always require login) ── */
  let _admin = false;

  function isAdmin() { return _admin; }

  function setAdmin(state) {
    _admin = state;
    document.body.classList.toggle('admin-mode', state);
    const toggle = document.querySelector('.admin-toggle');
    if (toggle) toggle.textContent = state ? '🔓' : '🔒';
    if (state) {
      applyDeleteButtons('.gallery-item');
      applyDeleteButtons('.extra-card');
      applyDeleteButtons('.prog-item');
      applyDeleteButtons('.bene-item');
      applyDeleteButtons('.met-item');
      applyDeleteButtons('.com-card');
      applyDeleteButtons('.level-card');
    }
  }

  /* ── Admin login modal ── */
  function showLoginModal() {
    const overlay = document.createElement('div');
    overlay.className = 'ac-modal';
    overlay.innerHTML = `
      <div class="ac-modal-box">
        <button class="ac-modal-close">&times;</button>
        <h3 class="ac-title">Acceso Administrador</h3>
        <form class="ac-form" id="adminLoginForm">
          <label>Usuario <input type="text" name="username" value="esvojop" readonly></label>
          <label>Contraseña <input type="password" name="password" required autofocus></label>
          <button type="submit" class="btn btn-secondary">Ingresar</button>
        </form>
      </div>`;

    overlay.querySelector('.ac-modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    const form = overlay.querySelector('#adminLoginForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(this);
      if (data.get('username') === ADMIN_USER && data.get('password') === ADMIN_PASS) {
        setAdmin(true);
        overlay.remove();
      } else {
        const msg = this.querySelector('.ac-error') || document.createElement('p');
        msg.className = 'ac-error';
        msg.textContent = 'Usuario o contraseña incorrectos';
        msg.style.color = '#ff3333';
        msg.style.fontSize = '0.85rem';
        msg.style.margin = '0';
        if (!this.querySelector('.ac-error')) this.appendChild(msg);
      }
    });
  }

  /* ── Admin toggle button ── */
  function initAdminToggle() {
    if (document.querySelector('.admin-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'admin-toggle';
    toggle.title = isAdmin() ? 'Cerrar sesión admin' : 'Iniciar sesión admin';
    toggle.setAttribute('aria-label', 'Administrador');
    toggle.textContent = isAdmin() ? '🔓' : '🔒';

    toggle.addEventListener('click', () => {
      if (isAdmin()) {
        setAdmin(false);
      } else {
        showLoginModal();
      }
    });

    const target = document.querySelector('footer .social') || document.querySelector('footer');
    if (target) target.appendChild(toggle);
  }

  /* ── Delete button for items ── */
  function addDeleteBtn(item) {
    if (item.querySelector('.delete-btn')) return;
    const del = document.createElement('button');
    del.className = 'delete-btn admin-only';
    del.innerHTML = '&times;';
    del.title = 'Eliminar';
    del.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      item.remove();
    });
    item.appendChild(del);
  }

  /* ── Apply delete buttons to existing items ── */
  function applyDeleteButtons(selector) {
    document.querySelectorAll(selector).forEach(addDeleteBtn);
  }

  /* ── Shared: floating "+" button — admin-only ── */
  function createAddBtn(container, label) {
    const btn = document.createElement('button');
    btn.className = 'add-content-btn admin-only';
    btn.innerHTML = '<span>+</span>';
    btn.title = label || 'Agregar';
    btn.setAttribute('aria-label', label || 'Agregar');
    container.appendChild(btn);
    return btn;
  }

  /* ── Shared: modal overlay ── */
  function showModal(html) {
    const existing = document.querySelector('.ac-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'ac-modal';
    overlay.innerHTML = `
      <div class="ac-modal-box">
        <button class="ac-modal-close">&times;</button>
        ${html}
      </div>`;

    overlay.querySelector('.ac-modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    const box = overlay.querySelector('.ac-modal-box');
    box.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });

    return overlay;
  }

  /* ── Gallery: upload photos ── */
  function initGalleryUpload(gridSelector) {
    const grid = document.querySelector(gridSelector || '.gallery-grid');
    if (!grid) return;

    const section = grid.closest('section') || grid.parentElement;
    const btn = createAddBtn(section, 'Agregar fotos');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    section.appendChild(input);

    btn.addEventListener('click', () => input.click());

    input.addEventListener('change', function () {
      const files = Array.from(this.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          item.innerHTML = `
            <img src="${e.target.result}" alt="${label}" loading="lazy">
            <div class="overlay"><span>${label}</span></div>`;
          grid.appendChild(item);

          // if admin is logged in, add delete btn
          if (isAdmin()) addDeleteBtn(item);

          requestAnimationFrame(() => item.classList.add('visible'));
        };
        reader.readAsDataURL(file);
      });
      this.value = '';
    });
  }

  /* ── Extra content: add info card (with optional image) ── */
  function initExtraCardAdder(gridSelector) {
    const grid = document.querySelector(gridSelector || '.extra-grid');
    if (!grid) return;

    const section = grid.closest('section') || grid.parentElement;
    const btn = createAddBtn(section, 'Agregar contenido');

    btn.addEventListener('click', () => {
      const overlay = showModal(`
        <h3 class="ac-title">Agregar contenido</h3>
        <form class="ac-form" id="acExtraForm">
          <label>Categoría <input type="text" name="cat" placeholder="Ej: Camisa + Pantaloneta" required></label>
          <label>Título <input type="text" name="title" placeholder="Nombre del producto" required></label>
          <label>Imagen <input type="file" name="img" accept="image/*"></label>
          <button type="submit" class="btn btn-secondary">Agregar</button>
        </form>`);

      const form = overlay.querySelector('#acExtraForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const cat = data.get('cat');
        const title = data.get('title');
        const imgFile = data.get('img');

        if (imgFile && imgFile.size) {
          const reader = new FileReader();
          reader.onload = ev => {
            addExtraCard(grid, cat, title, ev.target.result);
            overlay.remove();
          };
          reader.readAsDataURL(imgFile);
        } else {
          addExtraCard(grid, cat, title, 'img/rodillera.svg');
          overlay.remove();
        }
      });
    });
  }

  function addExtraCard(grid, cat, title, src) {
    const card = document.createElement('div');
    card.className = 'extra-card reveal';
    card.setAttribute('data-img', src);
    card.innerHTML = `
      <div class="ec-overlay"></div>
      <img src="${src}" alt="${title}" class="ec-img">
      <div class="ec-body">
        <div class="ec-cat">${cat}</div>
        <h4>${title}</h4>
      </div>`;
    grid.appendChild(card);
    if (isAdmin()) addDeleteBtn(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  }

  /* ── Index sections: add info cards ── */
  function initSectionCardAdder(gridSelector, fields) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const section = grid.closest('section') || grid.parentElement;
    const btn = createAddBtn(section, 'Agregar');

    btn.addEventListener('click', () => {
      const f = fields || [
        { name: 'icon', type: 'text', label: 'Icono (emoji)', placeholder: 'Ej: 🏐' },
        { name: 'title', type: 'text', label: 'Título', placeholder: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción', placeholder: 'Descripción...' }
      ];

      let html = '<h3 class="ac-title">Agregar contenido</h3><form class="ac-form" id="acSectionForm">';
      f.forEach(field => {
        if (field.type === 'textarea') {
          html += `<label>${field.label} <textarea name="${field.name}" placeholder="${field.placeholder || ''}"></textarea></label>`;
        } else {
          html += `<label>${field.label} <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}"></label>`;
        }
      });
      html += '<button type="submit" class="btn btn-secondary">Agregar</button></form>';

      const overlay = showModal(html);

      const form = overlay.querySelector('#acSectionForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        addSectionCard(grid, fields ? data : {
          icon: data.icon || '📌',
          title: data.title || 'Nuevo',
          desc: data.desc || ''
        });
        overlay.remove();
      });
    });
  }

  function addSectionCard(grid, data) {
    let id = grid.id || '';
    let cls = grid.className || '';
    let inner = '';

    if (cls.includes('prog-grid') || id === 'programa') {
      inner = `<div class="p-icon">${data.icon || '🏐'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
    } else if (cls.includes('bene-grid') || id === 'beneficios') {
      inner = `<div class="b-icon">${data.icon || '⭐'}</div><div><h4>${data.title}</h4><p>${data.desc}</p></div>`;
    } else if (cls.includes('met-grid') || id === 'metodologia') {
      inner = `<div class="met-icon">${data.icon || '📋'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
    } else if (cls.includes('levels-grid') || id === 'etapas') {
      inner = `<div class="level-badge level-inicial">Nuevo</div>
        <div class="level-icon">${data.icon || '🏆'}</div>
        <h3>${data.title}</h3>
        <p style="font-size:0.82rem;color:var(--gray);margin-bottom:1rem;line-height:1.7;">${data.desc}</p>`;
    } else if (cls.includes('com-grid')) {
      inner = `<div class="com-icon">${data.icon || '📌'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
    } else {
      inner = `<h4>${data.title}</h4><p>${data.desc}</p>`;
    }

    const card = document.createElement('div');
    card.className = 'reveal';
    card.innerHTML = inner;
    const sibling = grid.querySelector(':scope > div');
    if (sibling) card.className += ' ' + sibling.className.replace('reveal', '').trim();
    grid.appendChild(card);
    if (isAdmin()) addDeleteBtn(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  }

  /* ── Init ── */
  function init() {
    initAdminToggle();
  }

  /* ── Public API ── */
  return {
    gallery: initGalleryUpload,
    extraCards: initExtraCardAdder,
    sectionCards: initSectionCardAdder,
    init: init
  };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => AddContent.init());
