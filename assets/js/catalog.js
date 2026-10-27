/* =====================================================================
   UNINASSAU Recife — catalog.js (cursos.html)
   Filtros sincronizados com a URL (?q=&area=&grau=&modalidade=&turno=&unidade=)
   Funciona sem JavaScript: o formulário envia GET e a lista completa já
   vem no HTML. Com JavaScript, os resultados são filtrados na hora.
   ===================================================================== */
(() => {
  'use strict';
  const UN = window.UN;
  const DATA = window.UNINASSAU;
  if (!UN) return;
  const { $, $$, esc, norm, courseRow } = UN;

  const countEl = $('[data-count]');
  const resultsEl = $('[data-results]');
  const emptyEl = $('[data-empty]');
  const errorEl = $('[data-error]');
  const noteEl = $('[data-note]');
  const activeEl = $('[data-active-filters]');
  const form = $('[data-filters-form]');
  const badge = $('[data-active-badge]');

  // Estado de erro: data.js não carregou
  if (!DATA || !Array.isArray(DATA.COURSES)) {
    countEl.textContent = 'Catálogo indisponível';
    errorEl.hidden = false;
    return;
  }

  const AREAS = DATA.AREAS;
  const COURSES = DATA.COURSES.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const FIELDS = {
    q:          { el: $('#q'),       label: 'Nome' },
    area:       { el: $('#f-area'),  label: 'Área', show: (v) => AREAS[v]?.label },
    grau:       { el: $('#f-grau'),  label: 'Nível' },
    modalidade: { el: $('#f-mod'),   label: 'Modalidade', facet: 'modalidades' },
    turno:      { el: $('#f-turno'), label: 'Turno', facet: 'turnos' },
    unidade:    { el: $('#f-uni'),   label: 'Unidade', facet: 'unidades' }
  };
  const state = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, '']));

  // Lê a URL e valida cada valor contra as opções existentes
  const params = new URLSearchParams(location.search);
  Object.entries(FIELDS).forEach(([k, f]) => {
    const v = (params.get(k) || '').trim();
    if (!v) return;
    if (f.el.tagName === 'SELECT' && ![...f.el.options].some((o) => o.value === v)) return;
    state[k] = v; f.el.value = v;
  });

  const searchable = (c) => norm([c.nome, AREAS[c.area].label, c.grau, c.id === 'ads' ? 'ADS' : '', c.resumo].join(' '));

  const syncUrl = () => {
    const p = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => v && p.set(k, v));
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  const render = () => {
    const q = norm(state.q);
    let unconfirmed = 0;
    const results = COURSES.filter((c) => {
      if (state.area && c.area !== state.area) return false;
      if (state.grau && c.grau !== state.grau) return false;
      if (q && !searchable(c).includes(q)) return false;
      for (const [k, f] of Object.entries(FIELDS)) {
        if (!f.facet || !state[k]) continue;
        if (!c[f.facet].length) { unconfirmed++; return false; }
        if (!c[f.facet].includes(state[k])) return false;
      }
      return true;
    });

    resultsEl.innerHTML = results.map((c) => courseRow(c, AREAS)).join('');
    resultsEl.hidden = !results.length;
    emptyEl.hidden = !!results.length;

    const active = Object.entries(state).filter(([, v]) => v);
    countEl.textContent = results.length
      ? `${results.length} ${results.length === 1 ? 'curso encontrado' : 'cursos encontrados'}`
      : 'Nenhum curso encontrado';

    noteEl.textContent = unconfirmed
      ? `${unconfirmed} ${unconfirmed === 1 ? 'curso não aparece' : 'cursos não aparecem'} porque a modalidade, o turno ou a unidade ainda não foram confirmados. Consulte o processo seletivo oficial.`
      : 'Oferta sujeita a confirmação no processo seletivo oficial.';

    $('[data-empty-text]').textContent = unconfirmed
      ? 'Alguns cursos ainda não têm modalidade, turno ou unidade confirmados e por isso não aparecem nesses filtros.'
      : 'Tente outro nome ou remova algum filtro.';

    activeEl.innerHTML = active.map(([k, v]) => {
      const shown = FIELDS[k].show ? FIELDS[k].show(v) : v;
      return `<button class="chip-remove" type="button" data-remove="${k}">${esc(FIELDS[k].label)}: ${esc(shown)}<span class="x" aria-hidden="true">×</span><span class="sr-only"> — remover filtro</span></button>`;
    }).join('');
    badge.hidden = !active.length;
    badge.textContent = active.length;
    badge.setAttribute('aria-label', `${active.length} ${active.length === 1 ? 'filtro ativo' : 'filtros ativos'}`);
    syncUrl();
  };

  let timer;
  Object.entries(FIELDS).forEach(([k, f]) => {
    const ev = f.el.tagName === 'SELECT' ? 'change' : 'input';
    f.el.addEventListener(ev, () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state[k] = f.el.value.trim(); render(); }, ev === 'input' ? 250 : 0);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Object.entries(FIELDS).forEach(([k, f]) => { state[k] = f.el.value.trim(); });
    render();
    countEl.setAttribute('tabindex', '-1');
    countEl.focus();
  });

  activeEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    const k = btn.dataset.remove;
    state[k] = ''; FIELDS[k].el.value = '';
    render();
    (activeEl.querySelector('[data-remove]') || FIELDS[k].el).focus();
  });

  $$('[data-clear]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    Object.entries(FIELDS).forEach(([k, f]) => { state[k] = ''; f.el.value = ''; });
    render();
    FIELDS.q.el.focus();
  }));

  // Filtros recolhíveis no celular
  const toggle = $('[data-filters-toggle]');
  const body = $('#filtros-campos');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-open', open);
    if (open) FIELDS.q.el.focus();
  });
  // Abre os filtros se a página foi aberta para buscar (#q) ou já há filtros
  if (location.hash === '#q' || Object.values(state).some(Boolean)) {
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('is-open');
    if (location.hash === '#q') FIELDS.q.el.focus();
  }

  render();
})();
