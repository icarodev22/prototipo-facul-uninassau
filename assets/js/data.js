/* =====================================================================
   UNINASSAU Recife — base de cursos e configurações de conteúdo
   ---------------------------------------------------------------------
   COMO EDITAR
   - Cada curso é um objeto dentro de COURSES.
   - area: uma das chaves de AREAS (saude, tecnologia, engenharias,
     negocios, humanas, direito, comunicacao).
   - modalidades / turnos / unidades: deixe [] quando a oferta não
     estiver confirmada. O card exibirá "Consultar oferta" e o curso só
     aparecerá nos filtros de Modalidade/Turno/Unidade quando esses
     dados forem preenchidos.
   - destaque: true exibe o curso em "Graduações em destaque" (página inicial).
   - Cada curso tem página própria: curso.html?id=<id>

   FONTE DOS DADOS
   - Psicologia, Direito, Administração, Enfermagem, Farmácia e ADS
     vieram do projeto original.
   - Modalidade/turno/unidade de Enfermagem, Biomedicina, Sistemas de
     Informação, Direito e Psicologia: listagens públicas de oferta
     consultadas em out/2026. CONFIRMAR em https://vest.uninassau.edu.br/
     antes de publicar.
   - Demais cursos: apenas nome/área/grau. Oferta em Recife a confirmar.
   - NÃO inserir mensalidades, bolsas, notas do MEC ou duração sem fonte
     oficial.
   ===================================================================== */

window.UNINASSAU = {
  links: {
    inscricao: 'https://vest.uninassau.edu.br/',
    portalAluno: 'https://aluno.sereduc.com/',
    institucional: 'https://www.uninassau.edu.br/'
  },

  AREAS: {
    saude:       { label: 'Saúde',       icon: 'heart' },
    tecnologia:  { label: 'Tecnologia',  icon: 'code' },
    engenharias: { label: 'Engenharias', icon: 'compass' },
    negocios:    { label: 'Negócios',    icon: 'trend' },
    humanas:     { label: 'Humanas',     icon: 'book' },
    direito:     { label: 'Direito',     icon: 'scale' },
    comunicacao: { label: 'Comunicação', icon: 'mic' }
  },

  /* Unidades: o "nome" precisa ser igual ao usado em COURSES[].unidades.
     Endereços vieram do projeto original — confirmar antes de publicar. */
  UNIDADES: ['Graças', 'Derby', 'Boa Viagem', 'Caxangá'],
  UNIDADES_INFO: [
    { slug: 'gracas',     nome: 'Graças',     bloco: 'Bloco A',            endereco: 'Rua Guilherme Pinto, 114 — Graças, Recife – PE',          mapa: 'UNINASSAU Rua Guilherme Pinto 114 Graças Recife' },
    { slug: 'derby',      nome: 'Derby',      bloco: 'Bloco B',            endereco: 'Rua Guilherme Pinto, 400 — Derby, Recife – PE',           mapa: 'UNINASSAU Rua Guilherme Pinto 400 Derby Recife' },
    { slug: 'boa-viagem', nome: 'Boa Viagem', bloco: 'Unidade Boa Viagem', endereco: 'Rua Jonathas de Vasconcelos, 316 — Boa Viagem, Recife – PE', mapa: 'UNINASSAU Rua Jonathas de Vasconcelos 316 Boa Viagem Recife' },
    { slug: 'caxanga',    nome: 'Caxangá',    bloco: 'Unidade Caxangá',    endereco: 'Av. Joaquim Ribeiro, 1054 — Caxangá, Recife – PE',        mapa: 'UNINASSAU Av. Joaquim Ribeiro 1054 Caxangá Recife' }
  ],
  MODALIDADES: ['Presencial', 'Semipresencial', 'EAD'],
  TURNOS: ['Manhã', 'Noite'],
  GRAUS: ['Bacharelado', 'Licenciatura', 'Tecnólogo'],

  /* Números institucionais: preencha "valor" SOMENTE com dado oficial.
     A seção "em números" (institucional.html) só aparece quando ao menos
     um item tiver valor. Ex.: { rotulo: 'Cursos de graduação', valor: '40+' } */
  NUMEROS: [
    { rotulo: 'Cursos de graduação', valor: '' },
    { rotulo: 'Estudantes',          valor: '' },
    { rotulo: 'Anos de história',    valor: '' },
    { rotulo: 'Docentes',            valor: '' }
  ],

  COURSES: [
    /* ---------- Saúde ---------- */
    { id: 'psicologia', nome: 'Psicologia', area: 'saude', grau: 'Bacharelado',
      modalidades: ['Presencial'], turnos: ['Manhã', 'Noite'], unidades: ['Graças', 'Boa Viagem', 'Caxangá'],
      destaque: true, resumo: 'Compreenda o comportamento humano e atue em clínicas, organizações, escolas e políticas públicas.' },
    { id: 'enfermagem', nome: 'Enfermagem', area: 'saude', grau: 'Bacharelado',
      modalidades: ['Presencial'], turnos: ['Manhã', 'Noite'], unidades: ['Graças', 'Boa Viagem'],
      destaque: true, resumo: 'Formação para o cuidado integral em saúde, da atenção básica aos ambientes hospitalares.' },
    { id: 'farmacia', nome: 'Farmácia', area: 'saude', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      destaque: true, resumo: 'Atuação em medicamentos, análises clínicas, indústria e assistência farmacêutica.' },
    { id: 'biomedicina', nome: 'Biomedicina', area: 'saude', grau: 'Bacharelado',
      modalidades: ['Presencial'], turnos: ['Manhã'], unidades: ['Graças', 'Boa Viagem', 'Caxangá'],
      resumo: 'Diagnóstico laboratorial, pesquisa e tecnologias aplicadas à saúde.' },
    { id: 'fisioterapia', nome: 'Fisioterapia', area: 'saude', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Prevenção, tratamento e reabilitação do movimento humano.' },
    { id: 'nutricao', nome: 'Nutrição', area: 'saude', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Alimentação, saúde coletiva e nutrição clínica e esportiva.' },
    { id: 'odontologia', nome: 'Odontologia', area: 'saude', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Saúde bucal, prevenção e procedimentos clínicos.' },

    /* ---------- Tecnologia ---------- */
    { id: 'ads', nome: 'Análise e Desenvolvimento de Sistemas', area: 'tecnologia', grau: 'Tecnólogo',
      modalidades: [], turnos: [], unidades: [],
      destaque: true, resumo: 'Desenvolvimento de software, bancos de dados e sistemas web com foco no mercado.' },
    { id: 'sistemas-informacao', nome: 'Sistemas de Informação', area: 'tecnologia', grau: 'Bacharelado',
      modalidades: ['Presencial'], turnos: ['Manhã'], unidades: ['Graças'],
      resumo: 'Tecnologia, gestão e programação para soluções digitais em organizações.' },
    { id: 'ciencia-computacao', nome: 'Ciência da Computação', area: 'tecnologia', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Fundamentos da computação, algoritmos e engenharia de software.' },

    /* ---------- Engenharias ---------- */
    { id: 'engenharia-civil', nome: 'Engenharia Civil', area: 'engenharias', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Projeto, construção e gestão de obras e infraestrutura.' },
    { id: 'arquitetura', nome: 'Arquitetura e Urbanismo', area: 'engenharias', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Projeto de espaços, edificações e cidades.' },

    /* ---------- Negócios ---------- */
    { id: 'administracao', nome: 'Administração', area: 'negocios', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      destaque: true, resumo: 'Gestão de pessoas, finanças, marketing e estratégia para empresas de todos os portes.' },
    { id: 'contabeis', nome: 'Ciências Contábeis', area: 'negocios', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Contabilidade, auditoria, tributos e controladoria.' },

    /* ---------- Humanas ---------- */
    { id: 'pedagogia', nome: 'Pedagogia', area: 'humanas', grau: 'Licenciatura',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Educação, docência e gestão escolar.' },

    /* ---------- Direito ---------- */
    { id: 'direito', nome: 'Direito', area: 'direito', grau: 'Bacharelado',
      modalidades: ['Presencial'], turnos: ['Manhã', 'Noite'], unidades: ['Graças', 'Boa Viagem', 'Caxangá'],
      destaque: true, resumo: 'Formação jurídica para advocacia, carreiras públicas e atuação empresarial.' },

    /* ---------- Comunicação ---------- */
    { id: 'jornalismo', nome: 'Jornalismo', area: 'comunicacao', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Apuração, produção de conteúdo e comunicação multiplataforma.' },
    { id: 'publicidade', nome: 'Publicidade e Propaganda', area: 'comunicacao', grau: 'Bacharelado',
      modalidades: [], turnos: [], unidades: [],
      resumo: 'Criação, estratégia de marca e comunicação digital.' }
  ]
};
