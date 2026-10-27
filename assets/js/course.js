/* =====================================================================
   UNINASSAU Recife — course.js (curso.html?id=<id>)
   Monta a página do curso a partir de data.js.
   ===================================================================== */
(() => {
  'use strict';
  const UN = window.UN;
  const DATA = window.UNINASSAU;
  if (!UN) return;
  const { $, esc, icon, joinPt } = UN;

  const title = $('[data-c-title]');
  const notFound = $('[data-c-notfound]');
  const body = $('[data-c-body]');
  const crumb = $('[data-crumb-current]');

  const id = new URLSearchParams(location.search).get('id');
  const c = DATA && id ? DATA.COURSES.find((x) => x.id === id) : null;

  if (!c) {
    title.textContent = 'Curso não encontrado';
    crumb.textContent = 'Curso não encontrado';
    $('[data-c-area]').textContent = 'Cursos';
    document.title = 'Curso não encontrado | UNINASSAU Recife';
    notFound.hidden = false;
    return;
  }

  const AREAS = DATA.AREAS;
  const area = AREAS[c.area];
  const units = DATA.UNIDADES_INFO || [];
  const unitLink = (nome) => {
    const u = units.find((x) => x.nome === nome);
    return u ? `<a href="unidades.html#unidade-${u.slug}">${esc(nome)}</a>` : esc(nome);
  };
  const pending = '<span class="pending">A confirmar no processo seletivo</span>';
  const listOr = (arr, fmt = esc) => (arr.length ? joinPt(arr.map(fmt)) : pending);

  document.title = `${c.nome} | Cursos | UNINASSAU Recife`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${c.nome} (${c.grau}) na UNINASSAU Recife. ${c.resumo || ''}`.trim());

  crumb.textContent = c.nome;
  $('[data-c-area]').textContent = `${area.label} · Graduação`;
  title.textContent = c.nome;
  $('[data-c-summary]').textContent = c.resumo || '';
  $('[data-c-tags]').innerHTML = [c.grau, ...c.modalidades].map((t) => `<span class="tag-pill">${esc(t)}</span>`).join('');

  $('[data-c-offer]').innerHTML = `
    <div><dt>Nível de formação</dt><dd>${esc(c.grau)}</dd></div>
    <div><dt>Área</dt><dd><a href="cursos.html?area=${encodeURIComponent(c.area)}">${esc(area.label)}</a></dd></div>
    <div><dt>Modalidade</dt><dd>${listOr(c.modalidades)}</dd></div>
    <div><dt>Turno</dt><dd>${listOr(c.turnos)}</dd></div>
    <div><dt>Unidades</dt><dd>${listOr(c.unidades, unitLink)}</dd></div>`;

  const related = DATA.COURSES.filter((x) => x.area === c.area && x.id !== c.id)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  $('[data-c-rel-title]').textContent = `Outros cursos de ${area.label}`;
  $('[data-c-related]').innerHTML = related.length
    ? related.map((x) => `<a href="curso.html?id=${encodeURIComponent(x.id)}">${esc(x.nome)} ${icon('arrow')}</a>`).join('')
    : '<p>Não há outros cursos desta área no catálogo.</p>';
  const areaLink = $('[data-c-area-link]');
  areaLink.href = `cursos.html?area=${encodeURIComponent(c.area)}`;
  areaLink.innerHTML = `Ver cursos de ${esc(area.label)} ${icon('arrow')}`;

  body.hidden = false;
})();
