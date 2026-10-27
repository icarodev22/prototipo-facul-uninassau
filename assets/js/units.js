/* =====================================================================
   UNINASSAU Recife — units.js (unidades.html)
   Mapa do Google carregado somente por ação do usuário · cursos por unidade
   ===================================================================== */
(() => {
  'use strict';
  const UN = window.UN;
  const DATA = window.UNINASSAU;
  if (!UN) return;
  const { $, $$, esc } = UN;

  const cards = $$('[data-unit]');
  const panel = $('[data-map]');
  const consent = $('[data-map-consent]');
  let iframe = null;

  const setActive = (card) => cards.forEach((c) => c.classList.toggle('is-active', c === card));
  const showMap = (card, moveFocus) => {
    const q = card.dataset.mapQuery;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.loading = 'lazy';
      panel.appendChild(iframe);
      consent.hidden = true;
    }
    iframe.title = `Mapa do Google: ${card.dataset.unit}`;
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
    setActive(card);
    if (moveFocus && window.matchMedia('(max-width: 55.99em)').matches) {
      panel.scrollIntoView({ block: 'start' });
      panel.focus({ preventScroll: true });
    }
  };

  cards.forEach((card) => {
    $('[data-show-map]', card)?.addEventListener('click', () => showMap(card, true));
  });
  $('[data-map-load]')?.addEventListener('click', () => {
    const target = cards.find((c) => `#${c.id}` === location.hash) || cards[0];
    showMap(target, false);
  });

  // Destaca a unidade aberta pelo link (ex.: unidades.html#unidade-gracas)
  const fromHash = () => { const c = cards.find((x) => `#${x.id}` === location.hash); if (c) setActive(c); };
  fromHash();
  window.addEventListener('hashchange', fromHash);

  // Cursos com oferta confirmada em cada unidade (fonte: data.js)
  if (DATA && Array.isArray(DATA.COURSES)) {
    cards.forEach((card) => {
      const nome = card.dataset.unit;
      const list = DATA.COURSES.filter((c) => c.unidades.includes(nome)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      const box = $('[data-unit-courses]', card);
      box.innerHTML = list.length
        ? `<h3>Cursos com oferta confirmada nesta unidade</h3><ul>${list.map((c) => `<li><a href="curso.html?id=${encodeURIComponent(c.id)}">${esc(c.nome)}</a></li>`).join('')}</ul>`
        : '<h3>Cursos nesta unidade</h3><p class="hint">Oferta ainda não confirmada no catálogo. <a href="cursos.html">Ver todos os cursos</a>.</p>';
      box.hidden = false;
    });
  }
})();
