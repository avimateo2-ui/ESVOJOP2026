/* ═══════════════════════════════════════════
   Admin + Add Content Module
   Admin login, gallery upload, card creator, delete
   ═══════════════════════════════════════════ */

const AddContent = (() => {
  'use strict';

  const ADMIN_USER = 'esvojop';
  const ADMIN_PASS = 'esvojop2026';

  /* ── Admin state (persistent via sessionStorage) ── */
  const STORAGE_KEY = 'esvojop_admin';
  let _admin = sessionStorage.getItem(STORAGE_KEY) === 'true';

  function isAdmin() { return _admin; }

  function setAdmin(state) {
    _admin = state;
    if (state) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
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
      applyDeleteButtons('.phil-card');
      applyDeleteButtons('.val-item');
      applyDeleteButtons('.pos-card');
      applyDeleteButtons('.cert-card');
      applyDeleteButtons('.contact-card');
      applyDeleteButtons('.step-card');
      applyDeleteButtons('.loc-card');
      applyEditButtons('.gallery-item');
      applyEditButtons('.extra-card');
      applyEditButtons('.prog-item');
      applyEditButtons('.bene-item');
      applyEditButtons('.met-item');
      applyEditButtons('.com-card');
      applyEditButtons('.level-card');
      applyEditButtons('.phil-card');
      applyEditButtons('.val-item');
      applyEditButtons('.pos-card');
      applyEditButtons('.cert-card');
      applyEditButtons('.contact-card');
      applyEditButtons('.step-card');
      applyEditButtons('.loc-card');
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
    if (item.classList.contains('gallery-add-placeholder')) return;
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

  /* ── Edit button for items ── */
  function addEditBtn(item) {
    if (item.classList.contains('gallery-add-placeholder')) return;
    if (item.querySelector('.edit-btn')) return;
    const edit = document.createElement('button');
    edit.className = 'edit-btn admin-only';
    edit.innerHTML = '&#9998;';
    edit.title = 'Editar';
    edit.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      editCard(item);
    });
    item.appendChild(edit);
  }

  function applyEditButtons(selector) {
    document.querySelectorAll(selector).forEach(addEditBtn);
  }

  /* ── Edit card modal ── */
  function editCard(card) {
    const cls = card.className;
    let fields = [];
    let values = {};

    // gallery item
    if (cls.includes('gallery-item')) {
      const img = card.querySelector('img');
      const span = card.querySelector('.overlay span');
      fields = [{ name: 'title', type: 'text', label: 'Título' }];
      values.title = span ? span.textContent : (img ? img.alt : '');
    }
    // extra card
    else if (cls.includes('extra-card')) {
      const cat = card.querySelector('.ec-cat');
      const title = card.querySelector('h4');
      fields = [
        { name: 'cat', type: 'text', label: 'Categoría' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'img', type: 'file', label: 'Imagen (opcional)' }
      ];
      values.cat = cat ? cat.textContent : '';
      values.title = title ? title.textContent : '';
    }
    // certification card
    else if (cls.includes('cert-card')) {
      const title = card.querySelector('h3');
      const p = card.querySelector('p');
      fields = [
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // step card
    else if (cls.includes('step-card')) {
      const num = card.querySelector('.s-num');
      const title = card.querySelector('h4');
      const p = card.querySelector('p');
      fields = [
        { name: 'num', type: 'text', label: 'Número' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.num = num ? num.textContent : '';
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // cards with icon + h4 + p (prog, bene, met, com, loc, contact)
    else if (cls.includes('prog-item') || cls.includes('bene-item') || cls.includes('met-item') ||
             cls.includes('com-card') || cls.includes('loc-card') || cls.includes('contact-card')) {
      const iconEl = card.querySelector('.p-icon, .b-icon, .met-icon, .com-icon, .loc-icon, .icon');
      const title = card.querySelector('h4');
      const p = card.querySelector('p');
      fields = [
        { name: 'icon', type: 'text', label: 'Icono' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.icon = iconEl ? iconEl.textContent : '';
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // val item (icon + h4)
    else if (cls.includes('val-item')) {
      const iconEl = card.querySelector('.v-icon');
      const title = card.querySelector('h4');
      fields = [
        { name: 'icon', type: 'text', label: 'Icono' },
        { name: 'title', type: 'text', label: 'Título' }
      ];
      values.icon = iconEl ? iconEl.textContent : '';
      values.title = title ? title.textContent : '';
    }
    // phil card (num + h4 + p)
    else if (cls.includes('phil-card')) {
      const num = card.querySelector('.phil-num');
      const title = card.querySelector('h4');
      const p = card.querySelector('p');
      fields = [
        { name: 'num', type: 'text', label: 'Número' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.num = num ? num.textContent : '';
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // pos card (num + icon + h3 + p)
    else if (cls.includes('pos-card')) {
      const num = card.querySelector('.num');
      const iconEl = card.querySelector('.icon');
      const title = card.querySelector('h3');
      const p = card.querySelector('p');
      fields = [
        { name: 'num', type: 'text', label: 'Número' },
        { name: 'icon', type: 'text', label: 'Icono' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.num = num ? num.textContent : '';
      values.icon = iconEl ? iconEl.textContent : '';
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // level card (icon + h3 + p)
    else if (cls.includes('level-card')) {
      const iconEl = card.querySelector('.level-icon');
      const title = card.querySelector('h3');
      const p = card.querySelector('p');
      fields = [
        { name: 'icon', type: 'text', label: 'Icono' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.icon = iconEl ? iconEl.textContent : '';
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }
    // fallback: generic h4 + p
    else {
      const title = card.querySelector('h3, h4');
      const p = card.querySelector('p');
      fields = [
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'desc', type: 'textarea', label: 'Descripción' }
      ];
      values.title = title ? title.textContent : '';
      values.desc = p ? p.textContent : '';
    }

    // Build modal
    let html = '<h3 class="ac-title">Editar contenido</h3><form class="ac-form" id="acEditForm">';
    fields.forEach(f => {
      const val = (values[f.name] || '').replace(/"/g, '&quot;');
      if (f.type === 'textarea') {
        html += `<label>${f.label} <textarea name="${f.name}">${val}</textarea></label>`;
      } else if (f.type === 'file') {
        html += `<label>${f.label} <input type="file" name="${f.name}" accept="image/*"></label>`;
      } else {
        html += `<label>${f.label} <input type="text" name="${f.name}" value="${val}"></label>`;
      }
    });
    html += '<button type="submit" class="btn btn-secondary">Guardar</button></form>';

    const overlay = showModal(html);
    const form = overlay.querySelector('#acEditForm');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));

      // Update card based on type
      if (cls.includes('gallery-item')) {
        const img = card.querySelector('img');
        const span = card.querySelector('.overlay span');
        if (span) span.textContent = data.title || span.textContent;
        if (img) img.alt = data.title || img.alt;
      } else if (cls.includes('extra-card')) {
        const catEl = card.querySelector('.ec-cat');
        const titleEl = card.querySelector('h4');
        const imgFile = data.img;
        if (catEl) catEl.textContent = data.cat || catEl.textContent;
        if (titleEl) titleEl.textContent = data.title || titleEl.textContent;
        if (imgFile && imgFile.size) {
          const reader = new FileReader();
          reader.onload = ev => {
            const img = card.querySelector('.ec-img');
            if (img) { img.src = ev.target.result; img.alt = data.title || img.alt; }
            card.dataset.img = ev.target.result;
          };
          reader.readAsDataURL(imgFile);
        }
      } else {
        // Regenerate inner HTML using same pattern as addSectionCard
        let newInner = '';
        if (cls.includes('phil-card')) {
          newInner = `<div class="phil-num">${data.num || values.num}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
        } else if (cls.includes('val-item')) {
          newInner = `<div class="v-icon">${data.icon || values.icon}</div><h4>${data.title}</h4>`;
        } else if (cls.includes('pos-card')) {
          newInner = `<span class="num">${data.num || values.num}</span><span class="icon">${data.icon || values.icon}</span><h3>${data.title}</h3><p>${data.desc}</p>`;
        } else if (cls.includes('step-card')) {
          newInner = `<div class="s-num">${data.num || values.num}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
        } else if (cls.includes('cert-card')) {
          newInner = `<div class="cert-icon">🎖️</div><h3>${data.title}</h3><p>${data.desc}</p><div class="cert-seal">Excelencia ESVOJOP</div>`;
        } else if (cls.includes('level-card')) {
          newInner = `<div class="level-badge level-inicial">Editado</div><div class="level-icon">${data.icon || values.icon}</div><h3>${data.title}</h3><p style="font-size:0.82rem;color:var(--gray);margin-bottom:1rem;line-height:1.7;">${data.desc}</p>`;
        } else if (cls.includes('prog-item') || cls.includes('bene-item') || cls.includes('met-item') ||
                   cls.includes('com-card') || cls.includes('loc-card') || cls.includes('contact-card')) {
          let iconTag = '';
          if (cls.includes('prog-item')) iconTag = 'p-icon';
          else if (cls.includes('bene-item')) iconTag = 'b-icon';
          else if (cls.includes('met-item')) iconTag = 'met-icon';
          else if (cls.includes('com-card')) iconTag = 'com-icon';
          else if (cls.includes('loc-card')) iconTag = 'loc-icon';
          else iconTag = 'icon';
          if (cls.includes('bene-item')) {
            newInner = `<div class="${iconTag}">${data.icon || values.icon}</div><div><h4>${data.title}</h4><p>${data.desc}</p></div>`;
          } else {
            newInner = `<div class="${iconTag}">${data.icon || values.icon}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
          }
        } else {
          newInner = `<h4>${data.title}</h4><p>${data.desc}</p>`;
        }
        card.innerHTML = newInner;
        // Re-add admin buttons
        if (isAdmin()) { addDeleteBtn(card); addEditBtn(card); }
      }
      overlay.remove();
    });
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

  /* ── Gallery: upload photos with custom title ── */
  function initGalleryUpload(gridSelector) {
    const grid = document.querySelector(gridSelector || '.gallery-grid');
    if (!grid) return;

    /* Placeholder inside the grid (visible to all, functional only for admin) */
    const placeholder = document.createElement('div');
    placeholder.className = 'gallery-add-placeholder';
    placeholder.innerHTML = '<span class="add-icon">+</span><span class="add-text">Agregar foto</span>';
    grid.appendChild(placeholder);

    placeholder.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!isAdmin()) { showToast('Solo el administrador puede agregar contenido'); return; }
      const overlay = showModal(`
        <h3 class="ac-title">Agregar imagen</h3>
        <form class="ac-form" id="acGalleryForm">
          <label>Título <input type="text" name="title" placeholder="Nombre de la imagen" required></label>
          <label>Imagen <input type="file" name="img" accept="image/*" required></label>
          <button type="submit" class="btn btn-secondary">Agregar</button>
        </form>`);

      const form = overlay.querySelector('#acGalleryForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const title = data.get('title');
        const imgFile = data.get('img');

        if (imgFile && imgFile.size) {
          const reader = new FileReader();
          reader.onload = ev => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
              <img src="${ev.target.result}" alt="${title}" loading="lazy">
              <div class="overlay"><span>${title}</span></div>`;
            grid.insertBefore(item, placeholder);
            if (isAdmin()) { addDeleteBtn(item); addEditBtn(item); }
            requestAnimationFrame(() => item.classList.add('visible'));
            overlay.remove();
          };
          reader.readAsDataURL(imgFile);
        }
      });
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
    if (isAdmin()) { addDeleteBtn(card); addEditBtn(card); }
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
    let cardClass = 'reveal';

    if (cls.includes('prog-grid') || id === 'programa') {
      inner = `<div class="p-icon">${data.icon || '🏐'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'prog-item reveal';
    } else if (cls.includes('bene-grid') || id === 'beneficios') {
      inner = `<div class="b-icon">${data.icon || '⭐'}</div><div><h4>${data.title}</h4><p>${data.desc}</p></div>`;
      cardClass = 'bene-item reveal';
    } else if (cls.includes('met-grid') || id === 'metodologia') {
      inner = `<div class="met-icon">${data.icon || '📋'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'met-item reveal';
    } else if (cls.includes('levels-grid') || id === 'etapas') {
      inner = `<div class="level-badge level-inicial">Nuevo</div>
        <div class="level-icon">${data.icon || '🏆'}</div>
        <h3>${data.title}</h3>
        <p style="font-size:0.82rem;color:var(--gray);margin-bottom:1rem;line-height:1.7;">${data.desc}</p>`;
      cardClass = 'level-card reveal';
    } else if (cls.includes('phil-grid')) {
      inner = `<div class="phil-num">${data.num || '00'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'phil-card reveal';
    } else if (cls.includes('val-grid')) {
      inner = `<div class="v-icon">${data.icon || '⭐'}</div><h4>${data.title}</h4>`;
      cardClass = 'val-item reveal';
    } else if (cls.includes('grid-3')) {
      const hasPos = grid.querySelector(':scope > .pos-card');
      if (hasPos) {
        inner = `<span class="num">${data.num || '00'}</span><span class="icon">${data.icon || '📌'}</span><h3>${data.title}</h3><p>${data.desc}</p>`;
        cardClass = 'card pos-card reveal';
      } else {
        inner = `<span class="loc-icon">${data.icon || '📍'}</span><h4>${data.title}</h4><p>${data.desc}</p>`;
        cardClass = 'loc-card reveal';
      }
    } else if (cls.includes('steps-grid')) {
      inner = `<div class="s-num">${data.num || '00'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'step-card reveal';
    } else if (cls.includes('contact-info')) {
      inner = `<span class="icon">${data.icon || '📌'}</span><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'contact-card reveal';
    } else if (cls.includes('com-grid')) {
      inner = `<div class="com-icon">${data.icon || '📌'}</div><h4>${data.title}</h4><p>${data.desc}</p>`;
      cardClass = 'com-card reveal';
    } else {
      inner = `<h4>${data.title}</h4><p>${data.desc}</p>`;
    }

    const card = document.createElement('div');
    card.className = cardClass;
    card.innerHTML = inner;
    grid.appendChild(card);
    if (isAdmin()) { addDeleteBtn(card); addEditBtn(card); }
    requestAnimationFrame(() => card.classList.add('visible'));
  }

  /* ── Init ── */
  function init() {
    if (isAdmin()) {
      document.body.classList.add('admin-mode');
      applyDeleteButtons('.gallery-item');
      applyDeleteButtons('.extra-card');
      applyDeleteButtons('.prog-item');
      applyDeleteButtons('.bene-item');
      applyDeleteButtons('.met-item');
      applyDeleteButtons('.com-card');
      applyDeleteButtons('.level-card');
      applyDeleteButtons('.phil-card');
      applyDeleteButtons('.val-item');
      applyDeleteButtons('.pos-card');
      applyDeleteButtons('.cert-card');
      applyDeleteButtons('.contact-card');
      applyDeleteButtons('.step-card');
      applyDeleteButtons('.loc-card');
      applyEditButtons('.gallery-item');
      applyEditButtons('.extra-card');
      applyEditButtons('.prog-item');
      applyEditButtons('.bene-item');
      applyEditButtons('.met-item');
      applyEditButtons('.com-card');
      applyEditButtons('.level-card');
      applyEditButtons('.phil-card');
      applyEditButtons('.val-item');
      applyEditButtons('.pos-card');
      applyEditButtons('.cert-card');
      applyEditButtons('.contact-card');
      applyEditButtons('.step-card');
      applyEditButtons('.loc-card');
    }
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
