# Relatório da reformulação — UNINASSAU Recife

Data: 26/10/2026 · Tecnologia mantida: HTML, CSS e JavaScript puros (o protótipo já era assim e atende ao projeto).

---

## 1. Diagnóstico do protótipo original

Arquivos analisados: `index.html` (708 linhas), `styles.css` (1017), `script.js` (562), `data.js` (116), `README.md`.

**Arquitetura**
- Página única: não havia página por curso (detalhes em janela modal, sem endereço próprio para compartilhar), nem páginas de ingresso, unidades, atendimento ou acessibilidade.
- Menu "Cursos" em mega menu que abria ao passar o mouse e usava o padrão de abas (`role="tab"`) para uma navegação, o que confunde leitores de tela e quem tem pouca precisão no mouse.

**Acessibilidade**
- 214 elementos de texto abaixo de 16 px (rótulos de 11 a 14,5 px, muitos em caixa alta com espaçamento largo).
- Conteúdo escondido (`opacity: 0`) até o JavaScript "revelar" ao rolar a página: se o script falhasse, seções inteiras ficavam invisíveis.
- Atalho de tecla única "/" sem opção de desligar (falha no critério 2.1.4 da WCAG).
- Cabeçalho `position: fixed` com compensação de rolagem menor que a altura real em telas grandes (foco podia ficar escondido).
- Textos brancos com 40–55% de opacidade sobre azul escuro (contraste insuficiente em números e rótulos).
- Nenhum controle de tamanho de texto, contraste ou animação.

**Conteúdo e funcionamento**
- Marcadores "[ DADO OFICIAL ]" e "Foto · eventos" visíveis para o público.
- Elementos decorativos com cara de template (cartões flutuantes "03 modalidades", brilhos, grade de fundo, texto vertical).
- Mapa do Google carregava sozinho ao rolar (serviço de terceiros sem ação do usuário, peso extra).
- `aria-hidden="false"` sem efeito e `role="img"` em espaços vazios.
- Sem erros de JavaScript no console. As únicas falhas de rede eram recursos externos (fontes e logotipo), que não carregam no ambiente de teste.

**Preservado do original:** todos os 18 cursos e seus resumos, as 4 unidades e endereços, o telefone, os links oficiais (processo seletivo, Portal do Aluno, site institucional), as 7 perguntas frequentes, os textos de modalidades, formas de ingresso, "por que estudar" e vida universitária.

---

## 2. Nova identidade visual

- **Cores:** azul institucional `#0B4AA2` (links e ações secundárias, 7,9:1 sobre branco), navy `#0A2150` nas faixas escuras, amarelo `#FFC629` como destaque (sempre com texto navy, nunca texto amarelo sobre branco), neutros frios para leitura.
- **Tipografia:** Atkinson Hyperlegible Next no corpo (fonte criada pelo Braille Institute para baixa visão), 18 px; Plus Jakarta Sans 800 nos títulos. Menor texto do site: 16 px.
- **Assinatura gráfica:** traço amarelo curto antes dos rótulos de seção; foto do topo sobre um bloco navy deslocado; listas editoriais com linha superior forte em vez de grades de cartões.
- **Ritmo:** cada seção da página inicial tem uma composição diferente (dividida, faixa escura de busca, régua de acessos, lista numerada, foto sangrada + texto, colunas com divisórias, grade de unidades, chamada final).
- **Movimento:** só transições curtas de cor/seta. Sem animações de entrada, carrosséis ou paralaxe.

---

## 3. Arquitetura revisada

| Página | Conteúdo |
|---|---|
| `index.html` | Hero · busca de cursos (área + modalidade) · acesso rápido (6) · graduações em destaque · experiência universitária · modalidades, áreas e pós · unidades · chamada final |
| `cursos.html` | Catálogo: nome, área, nível, modalidade, turno, unidade; filtros ativos removíveis; estados de carregamento, vazio e erro; URL compartilhável |
| `curso.html?id=` | Página de cada curso: oferta (com links para as unidades), aviso sobre dados do processo seletivo, cursos relacionados; estado "curso não encontrado" |
| `ingresso.html` | 4 formas de ingresso (com âncoras), passo a passo, PROUNI/FIES, dúvidas |
| `unidades.html` | 4 unidades, mapa sob demanda, rota, cursos com oferta confirmada em cada unidade |
| `institucional.html` | Por que estudar, vida universitária, números (oculto até haver dado oficial), pós-graduação |
| `atendimento.html` | Telefone, processo seletivo, Portal do Aluno, unidades, 7 dúvidas |
| `acessibilidade.html` | Recursos, atalhos, limitações e como relatar barreiras |
| `404.html` | Caminhos de volta |

**Componentes compartilhados:** barra de acessibilidade, cabeçalho fixo com página ativa, menu compacto (celular e texto ampliado), rodapé em 4 grupos, breadcrumbs em todas as páginas internas.

**Rotas antigas:** as âncoras do protótipo de página única (`#cursos`, `#ingresso`, `#institucional`, `#pos-graduacao`, `#vida`, `#faq`, `#contato`) redirecionam para a página nova correspondente. `#destaques`, `#modalidades` e `#unidades` continuam existindo na página inicial.

---

## 4. Recursos de acessibilidade implementados

- Atalhos no padrão brasileiro (eMAG): 1 conteúdo, 2 menu, 3 busca, 4 rodapé.
- Texto A− / A / A+ em 6 níveis (93% a 175%), com o estado anunciado ao leitor de tela.
- Alto contraste (preto/branco/amarelo) e "Reduzir animações", com `aria-pressed`; respeita `prefers-reduced-motion`.
- Preferências salvas no navegador e aplicadas antes da página aparecer (sem "piscar").
- Com texto a 150% ou mais, o cabeçalho deixa de ser fixo e os layouts viram uma coluna.
- Foco visível de 3 px em tudo; `scroll-padding` para o foco nunca ficar sob o cabeçalho.
- Alvos de toque de no mínimo 44 × 44 px.
- Menu do celular com `aria-expanded`, fecha com Esc e devolve o foco ao botão.
- Perguntas frequentes com `<details>` nativo (funciona sem JavaScript).
- Contagem de resultados anunciada (`role="status"`), filtros removíveis por teclado.
- Links que abrem nova aba avisam isso por ícone e texto para leitor de tela.

---

## 5. Erros corrigidos

1. Conteúdo invisível sem JavaScript (animações de entrada) → removido; todo conteúdo é visível por padrão.
2. Atalho "/" de tecla única → removido; atalhos agora usam modificador do navegador (accesskey).
3. Textos de 11–14,5 px → mínimo de 16 px; corpo de 18 px.
4. Contraste baixo em rótulos sobre azul → todas as cores verificadas em 4,5:1 ou mais.
5. Mega menu por hover com papel de abas → links diretos, sem menus aninhados.
6. Detalhes do curso só em modal → página própria por curso, com URL.
7. Marcadores "[ DADO OFICIAL ]" públicos → seção de números só aparece com dado preenchido.
8. Espaços "Foto · ..." vazios → fotos reais inseridas onde há imagem; o resto foi redesenhado sem depender de foto.
9. Mapa carregado sem pedir → carregado só por clique, com aviso de que é serviço do Google.
10. Filtro de unidade escondendo cursos sem explicar → aviso de quantos cursos não aparecem e por quê.
11. Página do curso inexistente / id inválido → estado "Curso não encontrado".
12. Rolagem horizontal em 320 px e com texto ampliado (detectada nos testes da nova versão) → grades fluídas, quebra de palavra quando necessário.
13. Cabeçalho apertado em notebooks de 1280 px → busca vira ícone abaixo de 1440 px; menu compacto abaixo de 1280 px.

---

## 6. Testes realizados

Ferramentas: Chromium (Playwright) com um auditor próprio escrito para este projeto. O axe-core não pôde ser instalado (registro npm bloqueado no ambiente de trabalho), então as verificações abaixo foram implementadas manualmente.

| Teste | Escopo | Resultado |
|---|---|---|
| Contraste de texto (WCAG 1.4.3) | 12 URLs × 3 modos (padrão, alto contraste, texto 175%) × 3 larguras | 0 falhas |
| Tamanho mínimo de fonte (16 px) | idem | 0 falhas |
| Alvos de toque ≥ 44 px | idem | 0 falhas (após corrigir o logotipo) |
| Rótulos de campos, nomes de botões/links, `alt` | idem | 0 falhas |
| IDs duplicados, `aria-controls` quebrado, âncoras inexistentes | idem | 0 falhas |
| Hierarquia de títulos, 1 `h1`, landmarks, `lang` | idem | 0 falhas |
| Rolagem horizontal | 9 páginas × 6 tamanhos de texto × 320/375/768/1024/1280/1920 px | 0 ocorrências |
| Links internos | 51 links únicos | todos resolvem (página e âncora) |
| Erros de JavaScript no console | todas as páginas | nenhum |
| Teclado: menu do celular | Enter abre e foca a busca; Esc fecha e devolve o foco | ok |
| Ajustes de leitura | A+, contraste, anúncio de status, persistência entre páginas | ok |
| Catálogo | busca, filtros combinados, remoção de filtro, URL sincronizada, estado vazio | ok |
| Redirecionamento de âncora antiga | `index.html#faq` → `atendimento.html#duvidas` | ok |
| Sem JavaScript | navegação, busca e lista completa de cursos | ok (sem filtragem instantânea) |

**Limitações dos testes**
- Não foram feitos testes com leitores de tela reais (NVDA, VoiceOver, TalkBack) nem com usuários idosos ou com deficiência. Não declaramos conformidade total com a WCAG 2.2 AA.
- Fontes do Google, logotipo e mapa não carregam no ambiente de teste; o layout foi validado com as fontes de reserva do sistema. Confirme a aparência final em um navegador com internet.
- Navegadores testados: apenas Chromium. Recomenda-se conferir em Safari (iPhone) e Firefox.

---

## 7. Mapa de imagens

As duas fotos enviadas foram otimizadas (PNG 2 MB → WebP 20–75 KB) e entregues em 3 larguras, com JPG de reserva.

| Arquivo | Finalidade | Caminho | Onde aparece |
|---|---|---|---|
| `estudantes-campus-{640,960,1600}.{webp,jpg}` | Imagem principal: estudantes caminhando no campus | `assets/img/` | `index.html` → hero (`.hero-media`), carregada com prioridade alta e pré-carregada |
| `laboratorio-pratica-{640,960,1600}.{webp,jpg}` | Aprendizado prático em laboratório | `assets/img/` | `index.html` → seção "Experiência universitária" (`#experiencia`), carregamento tardio |

Espaços que **não** receberam imagem (opcionais, se houver fotos oficiais): topo de `institucional.html` (vida no campus/eventos), cartões de `unidades.html` (fachada de cada unidade, sugerido `assets/img/unidade-<slug>-960.webp`).

> As fotos enviadas são ilustrativas (geradas). Antes de publicar como site oficial, substitua por fotografias reais da instituição com autorização de uso de imagem, mantendo os mesmos nomes de arquivo.

---

## 8. Pendências (dependem de informação ou serviço externo)

1. **Oferta de cursos:** 13 dos 18 cursos estão sem modalidade/turno/unidade confirmados. Os 5 preenchidos vieram de listagens públicas (out/2026) e também precisam de confirmação em https://vest.uninassau.edu.br/.
2. **Números institucionais** (cursos, estudantes, anos, docentes): preencher em `data.js` → `NUMEROS` somente com fonte oficial.
3. **Notícias e eventos:** não havia conteúdo no protótipo; a seção não foi criada para não inventar notícias. Precisa de fonte (feed ou lista oficial).
4. **Depoimentos:** omitidos por falta de conteúdo autêntico e autorizado.
5. **Redes sociais oficiais, e-mail, política de privacidade e horários de atendimento:** não constavam no protótipo; não foram inventados.
6. **Links oficiais do PROUNI e FIES no MEC:** não incluídos por não terem sido verificados; a página orienta a consultar os canais oficiais.
7. **Logotipo:** carregado de `logo.uninassau.edu.br` (mesmo endereço do protótipo). Para uso definitivo, baixar o arquivo oficial do manual da marca e colocar em `assets/img/`.
8. **Fotos reais** (ver seção 7).
9. **VLibras** (tradução para Libras do governo federal): pode ser adicionado com o script oficial do vlibras.gov.br; não foi incluído para não carregar serviço externo sem decisão da instituição.
10. **Teste com tecnologia assistiva e usuários reais** (ver limitações).
