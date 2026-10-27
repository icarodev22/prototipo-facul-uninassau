/* =====================================================================
   UNINASSAU Recife — script.js
   Módulos: logo · header · mega menu · menu mobile · buscador de cursos
   destaques · dialog · ingresso (tabs) · unidades/mapa · números
   accordion · reveal · navegação ativa
   ===================================================================== */
(() => {
  'use strict';

  const DATA = window.UNINASSAU;
  if (!DATA) { console.error('data.js não carregado'); return; }

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const norm = (str) => String(str).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const icon = (id, cls = 'ico ico-sm') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const listOr = (arr) => (arr && arr.length ? esc(arr.join(', ')) : '<span class="pending">Consultar oferta</span>');

  const AREAS = DATA.AREAS;
  const COURSES = DATA.COURSES.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const byArea = (key) => COURSES.filter((c) => c.area === key);

  /* ------------------------------------------------------------------
     LOGO — fallback textual caso o SVG oficial não carregue
  ------------------------------------------------------------------ */
  $$('[data-logo]').forEach((img) => {
    const fail = () => img.closest('.brand')?.classList.add('logo-failed');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail, { once: true });
  });

  /* ------------------------------------------------------------------
     HEADER — sticky com blur e redução de altura
  ------------------------------------------------------------------ */
  const header = $('[data-header]');
  let megaOpen = false;
  const updateHeader = () => {
    const scrolled = window.scrollY > 24;
    header.classList.toggle('is-scrolled', scrolled);
    header.classList.toggle('is-solid', scrolled || megaOpen);
    header.classList.toggle('mega-open', megaOpen);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ------------------------------------------------------------------
     MEGA MENU — Cursos
  ------------------------------------------------------------------ */
  const mega = $('[data-mega]');
  const megaToggle = $('[data-mega-toggle]');
  const megaAreasEl = $('[data-mega-areas]');
  const megaPanel = $('[data-mega-panel]');
  const scrim = $('[data-scrim]');
  const areaKeys = Object.keys(AREAS);

  megaAreasEl.innerHTML = areaKeys.map((key, i) => `
    <li role="presentation">
      <button class="mega-area" type="button" role="tab" id="mega-tab-${key}" aria-controls="mega-panel" aria-selected="${i === 0}" data-area="${key}">
        ${icon(AREAS[key].icon, 'ico')}<span>${AREAS[key].label}</span><span class="count">${byArea(key).length}</span>
      </button>
    </li>`).join('');
  megaPanel.id = 'mega-panel';
  megaPanel.setAttribute('role', 'tabpanel');

  const renderMegaPanel = (key) => {
    const list = byArea(key);
    megaPanel.setAttribute('aria-labelledby', `mega-tab-${key}`);
    megaPanel.innerHTML = `
      <div class="mega-panel-head">
        <p class="mega-panel-title">${AREAS[key].label}</p>
        <a class="mega-panel-all" href="#cursos" data-goto-area="${key}">Ver no buscador ${icon('arrow')}</a>
      </div>
      <div class="mega-courses">
        ${list.map((c) => `<button class="mega-course" type="button" data-course="${c.id}"><span>${esc(c.nome)} <small>${esc(c.grau)}</small></span>${icon('arrow')}</button>`).join('')}
      </div>`;
  };

  const selectMegaArea = (btn) => {
    $$('.mega-area', megaAreasEl).forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
    renderMegaPanel(btn.dataset.area);
  };
  renderMegaPanel(areaKeys[0]);

  megaAreasEl.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.mega-area');
    if (btn && btn.getAttribute('aria-selected') !== 'true') selectMegaArea(btn);
  });
  megaAreasEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.mega-area');
    if (btn) selectMegaArea(btn);
  });
  megaAreasEl.addEventListener('keydown', (e) => {
    const tabs = $$('.mega-area', megaAreasEl);
    const idx = tabs.indexOf(document.activeElement);
    if (idx < 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = tabs[(idx + (e.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); selectMegaArea(next);
    }
  });

  const openMega = () => {
    if (megaOpen) return;
    megaOpen = true;
    mega.hidden = false;
    megaToggle.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
    updateHeader();
  };
  const closeMega = (returnFocus = false) => {
    if (!megaOpen) return;
    megaOpen = false;
    mega.hidden = true;
    megaToggle.setAttribute('aria-expanded', 'false');
    if (!mobileOpen) scrim.hidden = true;
    updateHeader();
    if (returnFocus) megaToggle.focus();
  };
  megaToggle.addEventListener('click', () => (megaOpen ? closeMega() : openMega()));

  // Abre ao passar o mouse (desktop com ponteiro fino), com pequeno atraso para evitar aberturas acidentais
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let hoverTimer;
    const navItem = megaToggle.closest('.nav-item');
    navItem.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(openMega, 120); });
    navItem.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
    header.addEventListener('mouseleave', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(() => closeMega(), 220); });
    header.addEventListener('mouseenter', () => { if (megaOpen) clearTimeout(hoverTimer); });
  }

  mega.addEventListener('click', (e) => {
    const courseBtn = e.target.closest('[data-course]');
    if (courseBtn) { closeMega(); openCourse(courseBtn.dataset.course); return; }
    const goto = e.target.closest('[data-goto-area]');
    if (goto) { e.preventDefault(); closeMega(); setArea(goto.dataset.gotoArea); scrollToFinder(); return; }
    if (e.target.closest('[data-close-mega]')) closeMega();
  });

  /* ------------------------------------------------------------------
     MENU MOBILE — drawer com focus trap
  ------------------------------------------------------------------ */
  const mobileMenu = $('[data-mobile-menu]');
  const menuOpenBtn = $('[data-menu-open]');
  let mobileOpen = false;

  $('[data-mobile-areas]').innerHTML = areaKeys.map((key) =>
    `<li><button type="button" data-goto-area="${key}">${icon(AREAS[key].icon)}${AREAS[key].label}</button></li>`).join('');

  const openMobile = () => {
    mobileOpen = true;
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    scrim.hidden = false; scrim.classList.add('scrim-top');
    menuOpenBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    setTimeout(() => $('[data-menu-close]').focus(), 50);
  };
  const closeMobile = (returnFocus = true) => {
    if (!mobileOpen) return;
    mobileOpen = false;
    mobileMenu.classList.remove('is-open');
    scrim.classList.remove('scrim-top');
    if (!megaOpen) scrim.hidden = true;
    menuOpenBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    setTimeout(() => { if (!mobileOpen) mobileMenu.hidden = true; }, reduceMotion ? 0 : 450);
    if (returnFocus) menuOpenBtn.focus();
  };
  menuOpenBtn.addEventListener('click', openMobile);
  $('[data-menu-close]').addEventListener('click', () => closeMobile());
  mobileMenu.addEventListener('click', (e) => {
    const goto = e.target.closest('[data-goto-area]');
    if (goto) { closeMobile(false); setArea(goto.dataset.gotoArea); scrollToFinder(); return; }
    if (e.target.closest('a[href^="#"]')) closeMobile(false);
  });
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = $$('a[href], button:not([disabled]), input, summary', mobileMenu).filter((el) => el.offsetParent !== null);
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (mq) => { if (mq.matches) closeMobile(false); });

  scrim.addEventListener('click', () => { closeMega(); closeMobile(false); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileOpen) closeMobile();
      else if (megaOpen) closeMega(true);
    }
  });
  document.addEventListener('click', (e) => {
    if (megaOpen && !header.contains(e.target)) closeMega();
  });

  /* ------------------------------------------------------------------
     BUSCADOR DE CURSOS
  ------------------------------------------------------------------ */
  const state = { q: '', area: 'todos', modalidades: '', turnos: '', unidades: '' };
  const searchInput = $('[data-course-search]');
  const chipsEl = $('[data-area-chips]');
  const grid = $('[data-course-grid]');
  const countEl = $('[data-result-count]');
  const noteEl = $('[data-result-note]');
  const emptyEl = $('[data-empty]');
  const selects = $$('select[data-filter]');
  const finder = $('#cursos');

  // Opções dos selects a partir de data.js
  const optionSource = { modalidades: DATA.MODALIDADES, turnos: DATA.TURNOS, unidades: DATA.UNIDADES };
  selects.forEach((sel) => {
    sel.insertAdjacentHTML('beforeend', optionSource[sel.dataset.filter].map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join(''));
  });

  chipsEl.innerHTML = [
    `<button class="chip" type="button" data-area="todos" aria-pressed="true">Todos <span class="count">${COURSES.length}</span></button>`,
    ...areaKeys.map((key) => `<button class="chip" type="button" data-area="${key}" aria-pressed="false">${icon(AREAS[key].icon)}${AREAS[key].label} <span class="count">${byArea(key).length}</span></button>`)
  ].join('');

  const hasOffer = (c) => c.modalidades.length || c.turnos.length || c.unidades.length;
  const PAGE = 9;
  let showAll = false;
  const moreWrap = $('[data-show-more-wrap]');
  const moreBtn = $('[data-show-more]');
  const filtersToggle = $('[data-filters-toggle]');
  const selectsBox = $('#finderSelects');
  const activeCount = $('[data-active-count]');
  const searchable = (c) => norm([c.nome, AREAS[c.area].label, c.grau, c.id === 'ads' ? 'ADS' : '', c.resumo].join(' '));

  const courseCard = (c, i) => `
    <article class="course-card" style="animation-delay:${Math.min(i, 9) * 40}ms">
      <div class="course-top">
        <span class="course-area"><span class="course-area-ico">${icon(AREAS[c.area].icon)}</span>${AREAS[c.area].label}</span>
        <span class="course-degree">${esc(c.grau)}</span>
      </div>
      <h3 class="course-name">${esc(c.nome)}</h3>
      ${hasOffer(c) ? `
      <dl class="course-meta">
        <div><dt>Modalidade</dt><dd>${listOr(c.modalidades)}</dd></div>
        <div><dt>Turno</dt><dd>${listOr(c.turnos)}</dd></div>
        <div><dt>Unidade</dt><dd>${listOr(c.unidades)}</dd></div>
      </dl>` : `
      <p class="course-summary">${esc(c.resumo || '')}</p>
      <p class="course-pending">${icon('pin')}Modalidade, turno e unidade: consultar oferta</p>`}
      <button class="course-cta" type="button" data-course="${c.id}" aria-label="Conhecer curso de ${esc(c.nome)}">
        Conhecer curso <span class="course-cta-arrow">${icon('arrow')}</span>
      </button>
    </article>`;

  const applyFilters = () => {
    const q = norm(state.q);
    const facetKeys = ['modalidades', 'turnos', 'unidades'].filter((k) => state[k]);
    let hiddenUnconfirmed = 0;

    const results = COURSES.filter((c) => {
      if (state.area !== 'todos' && c.area !== state.area) return false;
      if (q && !searchable(c).includes(q)) return false;
      for (const k of facetKeys) {
        if (!c[k].length) { hiddenUnconfirmed++; return false; }
        if (!c[k].includes(state[k])) return false;
      }
      return true;
    });

    const visible = showAll ? results : results.slice(0, PAGE);
    grid.innerHTML = visible.map(courseCard).join('');
    moreWrap.hidden = results.length <= visible.length;
    moreBtn.textContent = `Mostrar todos os ${results.length} cursos`;
    const nActive = facetKeys.length;
    activeCount.hidden = !nActive; activeCount.textContent = nActive;
    emptyEl.hidden = results.length > 0;
    grid.hidden = results.length === 0;

    countEl.innerHTML = results.length
      ? `<span>${results.length}</span> ${results.length === 1 ? 'curso encontrado' : 'cursos encontrados'}`
      : 'Nenhum curso encontrado';
    noteEl.textContent = hiddenUnconfirmed
      ? `${hiddenUnconfirmed} ${hiddenUnconfirmed === 1 ? 'curso com oferta ainda não confirmada não aparece' : 'cursos com oferta ainda não confirmada não aparecem'} neste filtro. Consulte o processo seletivo.`
      : 'Oferta sujeita a confirmação no processo seletivo oficial.';

    $$('.chip', chipsEl).forEach((ch) => ch.setAttribute('aria-pressed', String(ch.dataset.area === state.area)));
  };

  moreBtn.addEventListener('click', () => {
    showAll = true; applyFilters();
    grid.querySelectorAll('.course-card')[PAGE]?.querySelector('.course-cta')?.focus({ preventScroll: true });
  });
  filtersToggle.addEventListener('click', () => {
    const open = selectsBox.classList.toggle('is-open');
    filtersToggle.setAttribute('aria-expanded', String(open));
  });
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = searchInput.value; applyFilters(); }, 120);
  });
  chipsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) setArea(chip.dataset.area);
  });
  selects.forEach((sel) => sel.addEventListener('change', () => { state[sel.dataset.filter] = sel.value; applyFilters(); }));
  $$('[data-clear-filters]').forEach((btn) => btn.addEventListener('click', () => {
    Object.assign(state, { q: '', area: 'todos', modalidades: '', turnos: '', unidades: '' });
    searchInput.value = '';
    selects.forEach((s) => (s.value = ''));
    applyFilters();
    searchInput.focus();
  }));
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-course]');
    if (btn) openCourse(btn.dataset.course);
  });

  function setArea(key) { state.area = key; applyFilters(); }
  function scrollToFinder(focus = false) {
    finder.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (focus) setTimeout(() => searchInput.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
  }

  // Formulários de busca do hero, mega menu e menu mobile
  $$('form[data-search-redirect]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = $('input', form).value;
      state.q = value; searchInput.value = value;
      state.area = 'todos';
      applyFilters();
      closeMega(); closeMobile(false);
      scrollToFinder(true);
    });
  });

  // Atalho "/" para focar a busca
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) {
      e.preventDefault(); scrollToFinder(true);
    }
  });

  // Link "Ver cursos presenciais"
  $$('[data-set-modalidade]').forEach((a) => a.addEventListener('click', () => {
    const sel = $('select[data-filter="modalidades"]');
    sel.value = a.dataset.setModalidade; state.modalidades = sel.value; applyFilters();
  }));

  applyFilters();

  /* ------------------------------------------------------------------
     GRADUAÇÕES EM DESTAQUE
  ------------------------------------------------------------------ */
  const featuredOrder = ['psicologia', 'direito', 'administracao', 'enfermagem', 'farmacia', 'ads'];
  const featured = featuredOrder.map((id) => COURSES.find((c) => c.id === id && c.destaque)).filter(Boolean);
  const featuredEl = $('[data-featured]');
  featuredEl.innerHTML = featured.map((c, i) => `
    <li class="featured-item reveal">
      <button class="featured-btn" type="button" data-course="${c.id}" aria-label="Conhecer curso de ${esc(c.nome)}">
        <span class="featured-num">${String(i + 1).padStart(2, '0')}</span>
        <span><span class="featured-name">${esc(c.nome)}</span><span class="featured-area">${AREAS[c.area].label} · ${esc(c.grau)}</span></span>
        <span class="featured-arrow">${icon('arrow')}</span>
      </button>
    </li>`).join('');
  featuredEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-course]');
    if (btn) openCourse(btn.dataset.course);
  });

  /* ------------------------------------------------------------------
     FOOTER — áreas de curso
  ------------------------------------------------------------------ */
  const footerAreas = $('[data-footer-areas]');
  footerAreas.innerHTML = areaKeys.slice(0, 6).map((key) => `<li><a href="#cursos" data-goto-area="${key}">${AREAS[key].label}</a></li>`).join('');
  footerAreas.addEventListener('click', (e) => {
    const a = e.target.closest('[data-goto-area]');
    if (a) { e.preventDefault(); setArea(a.dataset.gotoArea); scrollToFinder(); }
  });

  /* ------------------------------------------------------------------
     DIALOG — detalhes do curso
  ------------------------------------------------------------------ */
  const dialog = $('[data-course-dialog]');
  let lastFocus = null;
  function openCourse(id) {
    const c = COURSES.find((x) => x.id === id);
    if (!c) return;
    lastFocus = document.activeElement;
    $('[data-dlg-area]', dialog).innerHTML = `${icon(AREAS[c.area].icon)} ${AREAS[c.area].label} · ${esc(c.grau)}`;
    $('[data-dlg-title]', dialog).textContent = c.nome;
    $('[data-dlg-text]', dialog).textContent = c.resumo || '';
    $('[data-dlg-meta]', dialog).innerHTML = `
      <div><dt>Grau</dt><dd>${esc(c.grau)}</dd></div>
      <div><dt>Modalidade</dt><dd>${listOr(c.modalidades)}</dd></div>
      <div><dt>Turno</dt><dd>${listOr(c.turnos)}</dd></div>
      <div><dt>Unidades</dt><dd>${listOr(c.unidades)}</dd></div>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('is-locked');
  }
  const closeDialog = () => { if (dialog.open) dialog.close(); };
  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  });
  $$('[data-dialog-close]', dialog).forEach((b) => b.addEventListener('click', closeDialog));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); }); // clique no backdrop

  /* ------------------------------------------------------------------
     FORMAS DE INGRESSO — tabs acessíveis
  ------------------------------------------------------------------ */
  const tabs = $$('.adm-tab');
  const selectTab = (tab, focus = true) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (keys[e.key]) { e.preventDefault(); selectTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length]); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0]); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1]); }
    });
  });
  $$('[data-adm-tab]').forEach((a) => a.addEventListener('click', () => {
    const tab = document.getElementById(a.dataset.admTab);
    if (tab) selectTab(tab, false);
  }));

  /* ------------------------------------------------------------------
     UNIDADES — seleção + mapa carregado sob demanda
  ------------------------------------------------------------------ */
  const mapPanel = $('[data-map]');
  const mapPlaceholder = $('[data-map-placeholder]');
  const unitCards = $$('.unit-card');
  let iframe = null;

  const mapSrc = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
  const loadMap = (query) => {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapPanel.appendChild(iframe);
      mapPlaceholder.hidden = true;
    }
    iframe.title = `Mapa: ${query}`;
    iframe.src = mapSrc(query);
  };
  const activeQuery = () => ($('.unit-card.is-active')?.dataset.query || unitCards[0].dataset.query);

  unitCards.forEach((card) => {
    $('.unit-select', card).addEventListener('click', () => {
      unitCards.forEach((c) => {
        c.classList.toggle('is-active', c === card);
        $('.unit-select', c).setAttribute('aria-pressed', String(c === card));
      });
      loadMap(card.dataset.query);
    });
  });
  $('[data-map-load]').addEventListener('click', () => loadMap(activeQuery()));
  if ('IntersectionObserver' in window) {
    const mapIO = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { loadMap(activeQuery()); mapIO.disconnect(); }
    }, { rootMargin: '200px' });
    mapIO.observe(mapPanel);
  }

  /* ------------------------------------------------------------------
     NÚMEROS — placeholder ou count-up
  ------------------------------------------------------------------ */
  const numberEls = $$('.number-value');
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const fmt = (n) => Math.round(n).toLocaleString('pt-BR') + suffix;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const duration = 1600; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const numIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); numIO.unobserve(en.target); } });
  }, { threshold: .5 }) : null;
  numberEls.forEach((el) => {
    const raw = (el.dataset.count || '').trim();
    if (raw === '' || Number.isNaN(Number(raw))) { el.classList.add('is-placeholder'); return; }
    el.textContent = '0' + (el.dataset.suffix || '');
    numIO ? numIO.observe(el) : countUp(el);
  });

  /* ------------------------------------------------------------------
     ACCORDION — FAQ
  ------------------------------------------------------------------ */
  const accTriggers = $$('.acc-trigger');
  accTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      accTriggers.forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).classList.remove('is-open');
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).classList.add('is-open');
      }
    });
  });

  /* ------------------------------------------------------------------
     REVEAL — entrada conforme scroll, com stagger por grupo
  ------------------------------------------------------------------ */
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    $$('[data-journey]').forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealIO = new IntersectionObserver((entries) => {
      const batch = entries.filter((en) => en.isIntersecting);
      batch.forEach((en, i) => {
        en.target.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
        en.target.classList.add('is-visible');
        revealIO.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => revealIO.observe(el));

    const journeyIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); journeyIO.unobserve(en.target); } });
    }, { threshold: .3 });
    $$('[data-journey]').forEach((el) => journeyIO.observe(el));
  }

  /* ------------------------------------------------------------------
     NAVEGAÇÃO ATIVA — destaca a seção atual no menu
  ------------------------------------------------------------------ */
  const navLinks = $$('.nav-list a.nav-link[href^="#"]');
  const sectionMap = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const link = sectionMap.get(en.target.id);
        if (link && en.isIntersecting) {
          navLinks.forEach((l) => { l.classList.remove('is-current'); l.removeAttribute('aria-current'); });
          link.classList.add('is-current'); link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionMap.forEach((_, id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
  }
})();
