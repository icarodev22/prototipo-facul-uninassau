/* UNINASSAU Recife — institutional.js
   Mostra "UNINASSAU em números" somente quando data.js tiver valores oficiais. */
(() => {
  'use strict';
  const DATA = window.UNINASSAU;
  const UN = window.UN;
  if (!DATA || !UN || !Array.isArray(DATA.NUMEROS)) return;
  const filled = DATA.NUMEROS.filter((n) => String(n.valor || '').trim());
  if (!filled.length) return;
  UN.$('[data-numbers]').innerHTML = filled.map((n) => `<div><dt>${UN.esc(n.rotulo)}</dt><dd>${UN.esc(n.valor)}</dd></div>`).join('');
  UN.$('[data-numbers-section]').hidden = false;
})();
