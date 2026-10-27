# UNINASSAU Recife — redesign institucional (v2)

Site estático em HTML, CSS e JavaScript puros, sem bibliotecas e sem etapa de build.
Projeto acadêmico demonstrativo: **não é o site oficial da UNINASSAU.**

## Como abrir

- Mais simples: abra `index.html` no navegador.
- Recomendado (para testar tudo como em produção): sirva a pasta com um servidor local, por exemplo
  `python3 -m http.server 8000` e acesse `http://localhost:8000`, ou use o **Live Server** do VS Code.

## Como publicar

Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, Hostinger):
envie a pasta inteira mantendo a estrutura. `404.html` já é reconhecido por GitHub Pages e Netlify.

## Estrutura

```
index.html            Início
cursos.html           Catálogo com busca e filtros (?q=&area=&grau=&modalidade=&turno=&unidade=)
curso.html            Página de cada curso (curso.html?id=psicologia)
ingresso.html         Formas de ingresso, passo a passo, PROUNI/FIES, dúvidas
unidades.html         Endereços, mapa sob demanda e cursos por unidade
institucional.html    Por que estudar, vida universitária, pós-graduação, números
atendimento.html      Canais e todas as dúvidas frequentes
acessibilidade.html   Recursos, atalhos e limitações
404.html              Página não encontrada
assets/css/styles.css Design system (tokens, temas, componentes, responsivo)
assets/js/data.js     >>> BASE DE DADOS: cursos, unidades, números <<<
assets/js/app.js      Todas as páginas: ajustes de leitura, menu, redirecionamentos
assets/js/home.js     Destaques e contagem por área na página inicial
assets/js/catalog.js  Busca e filtros do catálogo
assets/js/course.js   Monta a página do curso
assets/js/units.js    Mapa e cursos por unidade
assets/js/institutional.js  Seção de números (só aparece com dado oficial)
assets/img/           Fotos em WebP + JPG (640, 960 e 1600 px)
```

## Como editar

| O quê | Onde |
|---|---|
| Incluir/alterar curso | `assets/js/data.js` → `COURSES`. A página `curso.html?id=<id>` passa a existir sozinha. |
| Modalidade, turno, unidade | Mesmo objeto. Deixe `[]` quando não confirmado: aparece "Oferta a confirmar". |
| Graduações em destaque | `destaque: true` no curso. |
| Números institucionais | `data.js` → `NUMEROS[].valor`. A seção aparece em `institucional.html` quando houver valor. |
| Endereços | `data.js` → `UNIDADES_INFO` **e** o HTML de `index.html`/`unidades.html` (o texto está no HTML para funcionar sem JavaScript). |
| Telefone, rodapé, menu | O cabeçalho e o rodapé se repetem em todas as páginas: altere em todos os arquivos `.html` (use "Substituir em arquivos" do editor). |
| Trocar foto | Substitua os arquivos em `assets/img/` mantendo os nomes (ver mapa no RELATORIO.md). |

## Observações

- Sem JavaScript o site continua navegável: menus viram lista, a busca envia o formulário e o catálogo mostra todos os cursos (o filtro instantâneo precisa de JavaScript).
- Logotipo, favicon e fontes são carregados de servidores externos (logo.uninassau.edu.br e Google Fonts). Se o logotipo não carregar, aparece o nome "UNINASSAU" em texto.
- O mapa do Google só é carregado quando a pessoa clica em "Carregar mapa" ou "Ver no mapa".
