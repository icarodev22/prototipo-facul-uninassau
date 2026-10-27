/* UNINASSAU Recife — home.js
   Atualiza "Graduações em destaque" e a contagem por área a partir de data.js,
   para que a página inicial acompanhe edições na base de cursos. */
(() => {
  'use strict';
  const DATA = window.UNINASSAU;
  const { $, $$, esc, icon } = window.UN || {};
  if (!DATA || !$) return; // mantém o conteúdo estático já presente no HTML

  const AREAS = DATA.AREAS;
  const ORDER = ['psicologia', 'direito', 'administracao', 'enfermagem', 'farmacia', 'ads'];
  const destaque = DATA.COURSES.filter((c) => c.destaque);
  destaque.sort((a, b) => {
    const ia = ORDER.indexOf(a.id), ib = ORDER.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.nome.localeCompare(b.nome, 'pt-BR');
  });
  const list = $('[data-featured]');
  if (list && destaque.length) {
    list.innerHTML = destaque.map((c, i) => `
      <li><a href="curso.html?id=${encodeURIComponent(c.id)}"><span class="rank-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <span><span class="rank-name">${esc(c.nome)}</span><span class="rank-meta">${esc(AREAS[c.area].label)} · ${esc(c.grau)}</span></span>${icon('arrow')}</a></li>`).join('');
  }

  $$('[data-area-link]').forEach((a) => {
    const n = DATA.COURSES.filter((c) => c.area === a.dataset.areaLink).length;
    const span = $('[data-area-count]', a);
    if (span) span.textContent = `${n} ${n === 1 ? 'curso' : 'cursos'}`;
  });
})();
