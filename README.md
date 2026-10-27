# UNINASSAU Recife — redesign institucional

Projeto front-end em HTML, CSS e JavaScript puros (sem bibliotecas). Para abrir, basta abrir o `index.html` no navegador (ou usar o Live Server no VS Code).

## Estrutura
- `index.html` — estrutura semântica de todas as seções
- `styles.css` — design system (tokens no `:root`), componentes e responsividade
- `script.js` — header, mega menu, menu mobile, buscador/filtros, modal de curso, abas de ingresso, mapa, count-up, accordion e animações
- `data.js` — **base de cursos e listas de filtros. Edite aqui para incluir ou atualizar cursos.**

## Onde inserir dados oficiais
| O quê | Onde |
|---|---|
| Cursos, modalidade, turno, unidade | `data.js` → `COURSES` (arrays vazios = "Consultar oferta") |
| Números institucionais | `index.html`, seção `.numbers` → preencha `data-count` (o count-up é automático) |
| Foto do hero | `index.html` → `.hero-photo` (há um comentário com o `<img>` pronto) |
| Fotos da vida universitária | `index.html` → substitua cada `.photo-placeholder` por `<img>` |

## Regras de conteúdo
Não foram inseridos mensalidades, bolsas, descontos, notas do MEC, duração, estatísticas, datas ou endereços novos. Endereços, telefone e links vieram do projeto original.
A modalidade, o turno e a unidade de Enfermagem, Biomedicina, Sistemas de Informação, Direito e Psicologia vieram de listagens públicas consultadas em out/2026 e **devem ser confirmados** em https://vest.uninassau.edu.br/ antes de publicar.

## Observação
Projeto demonstrativo/conceitual, não é o site oficial publicado pela UNINASSAU.
