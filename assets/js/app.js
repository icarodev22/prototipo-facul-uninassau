/* =====================================================================
   UNINASSAU Recife — app.js (todas as páginas)
   Ajustes de leitura · menu móvel · redirecionamento de âncoras antigas
   Utilitários compartilhados em window.UN
   ===================================================================== */
(() => {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const root = document.documentElement;

  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? window.localStorage.removeItem(k) : window.localStorage.setItem(k, v); } catch (e) { /* armazenamento indisponível: o ajuste vale só nesta página */ } }
  };

  /* Utilitários usados pelos outros scripts */
  const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const joinPt = (arr) => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`);
  const icon = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const hasOffer = (c) => c.modalidades.length || c.turnos.length || c.unidades.length;
  const offerText = (c) => {
    if (!hasOffer(c)) return '<span class="pending">Oferta em Recife a confirmar</span>';
    const p = [];
    if (c.modalidades.length) p.push(`Modalidade: ${joinPt(c.modalidades)}`);
    if (c.turnos.length) p.push(`Turno: ${joinPt(c.turnos)}`);
    if (c.unidades.length) p.push(`Unidades: ${joinPt(c.unidades)}`);
    return esc(p.join(' · '));
  };
  const courseRow = (c, AREAS) => `
    <li><a class="course-row" href="curso.html?id=${encodeURIComponent(c.id)}">
      <span><span class="course-row-name">${esc(c.nome)}</span>
      <span class="course-row-meta"><span class="tag">${esc(AREAS[c.area].label)}</span><span>${esc(c.grau)}</span></span>
      <span class="course-row-offer">${offerText(c)}</span></span>${icon('arrow')}</a></li>`;
  window.UN = { $, $$, esc, joinPt, icon, norm, hasOffer, offerText, courseRow, store };

  /* ------------------------------------------------------------------
     AJUSTES DE LEITURA — tamanho do texto, contraste, movimento
  ------------------------------------------------------------------ */
  const status = $('[data-a11y-status]');
  const announce = (msg) => { if (!status) return; status.textContent = ''; setTimeout(() => { status.textContent = msg; }, 60); };
  const FONT_MIN = -1, FONT_MAX = 4;
  const FONT_LABEL = { '-1': '93%', 0: '100%', 1: '112%', 2: '125%', 3: '150%', 4: '175%' };
  let font = Number(root.getAttribute('data-fonte') || 0);
  if (Number.isNaN(font) || font < FONT_MIN || font > FONT_MAX) font = 0;

  const fontBtns = { dec: $('[data-font="dec"]'), reset: $('[data-font="reset"]'), inc: $('[data-font="inc"]') };
  const applyFont = (say) => {
    if (font === 0) root.removeAttribute('data-fonte'); else root.setAttribute('data-fonte', String(font));
    store.set('un-fonte', font === 0 ? null : String(font));
    if (fontBtns.dec) fontBtns.dec.disabled = font <= FONT_MIN;
    if (fontBtns.inc) fontBtns.inc.disabled = font >= FONT_MAX;
    if (say) announce(`Tamanho do texto: ${FONT_LABEL[font]}`);
  };
  Object.entries(fontBtns).forEach(([k, btn]) => btn && btn.addEventListener('click', () => {
    if (k === 'dec') font = Math.max(FONT_MIN, font - 1);
    if (k === 'inc') font = Math.min(FONT_MAX, font + 1);
    if (k === 'reset') font = 0;
    applyFont(true);
  }));
  applyFont(false);

  const systemReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const PREFS = {
    contraste: { attr: 'data-contraste', on: 'alto', off: null, key: 'un-contraste', msgOn: 'Alto contraste ativado', msgOff: 'Alto contraste desativado',
      isOn: () => root.getAttribute('data-contraste') === 'alto' },
    movimento: { attr: 'data-movimento', on: 'reduzido', off: 'normal', key: 'un-movimento', msgOn: 'Animações reduzidas', msgOff: 'Animações ativadas',
      isOn: () => { const v = root.getAttribute('data-movimento'); return v ? v === 'reduzido' : systemReduce.matches; } }
  };
  $$('[data-pref]').forEach((btn) => {
    const p = PREFS[btn.dataset.pref];
    if (!p) return;
    const sync = () => btn.setAttribute('aria-pressed', String(p.isOn()));
    sync();
    btn.addEventListener('click', () => {
      const turnOn = !p.isOn();
      const val = turnOn ? p.on : p.off;
      if (val) root.setAttribute(p.attr, val); else root.removeAttribute(p.attr);
      store.set(p.key, val);
      sync();
      announce(turnOn ? p.msgOn : p.msgOff);
    });
    if (btn.dataset.pref === 'movimento') systemReduce.addEventListener?.('change', sync);
  });

  // No celular os ajustes ficam recolhidos atrás de um botão
  const a11yToggle = $('[data-a11y-toggle]');
  const a11yControls = $('[data-a11y-controls]');
  if (a11yToggle && a11yControls) {
    a11yToggle.addEventListener('click', () => {
      const open = a11yToggle.getAttribute('aria-expanded') !== 'true';
      a11yToggle.setAttribute('aria-expanded', String(open));
      a11yControls.classList.toggle('is-open', open);
      if (open) $('button', a11yControls)?.focus();
    });
  }

  /* ------------------------------------------------------------------
     MENU MÓVEL — painel de divulgação (sem armadilha de foco)
  ------------------------------------------------------------------ */
  const menuBtn = $('[data-menu-toggle]');
  const panel = $('[data-menu-panel]');
  const menuLabel = $('[data-menu-label]');
  if (menuBtn && panel) {
    const setMenu = (open, returnFocus) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (menuLabel) menuLabel.textContent = open ? 'Fechar' : 'Menu';
      if (open) $('input, a', panel)?.focus();
      else if (returnFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true', false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) setMenu(false, true);
    });
    // Fecha se o foco sair do cabeçalho (ex.: Tab após o último link)
    $('[data-header]').addEventListener('focusout', (e) => {
      if (!panel.hidden && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setMenu(false, false);
    });
    window.matchMedia('(min-width: 80em)').addEventListener?.('change', (mq) => { if (mq.matches) setMenu(false, false); });
  }

  /* ------------------------------------------------------------------
     Atalho "Ir para a busca": foca o campo quando a página abre em #q
  ------------------------------------------------------------------ */
  const focusHash = () => {
    if (location.hash === '#q') { const q = document.getElementById('q'); if (q) q.focus(); }
  };
  focusHash();
  window.addEventListener('hashchange', focusHash);

  /* ------------------------------------------------------------------
     Âncoras do protótipo antigo (página única) → novas páginas
  ------------------------------------------------------------------ */
  const LEGACY = {
    cursos: 'cursos.html', ingresso: 'ingresso.html', institucional: 'institucional.html',
    'pos-graduacao': 'institucional.html#pos-graduacao', vida: 'institucional.html#vida',
    faq: 'atendimento.html#duvidas', contato: 'atendimento.html'
  };
  const isHome = /(^|\/)(index\.html)?$/.test(location.pathname);
  const h = decodeURIComponent(location.hash.slice(1));
  if (isHome && h && !document.getElementById(h) && LEGACY[h]) location.replace(LEGACY[h]);
})();
