export const LEGAL_SKILLS = [
  {
    id: "analise-juridica",
    name: "Análise Jurídica",
    description: "Avaliação completa dos aspectos jurídicos do caso, identificando pontos de direito aplicáveis.",
    category: "Análise",
    icon: "Scale"
  },
  {
    id: "identificacao-partes",
    name: "Identificação das Partes",
    description: "Identificação e qualificação jurídica das partes envolvidas no litígio.",
    category: "Processual",
    icon: "Users"
  },
  {
    id: "qualificacao-juridica",
    name: "Qualificação Jurídica",
    description: "Enquadramento legal dos fatos apresentados na norma jurídica aplicável.",
    category: "Análise",
    icon: "FileText"
  },
  {
    id: "pesquisa-jurisprudencia",
    name: "Pesquisa de Jurisprudência",
    description: "Levantamento de precedentes judiciais aplicáveis ao caso em análise.",
    category: "Pesquisa",
    icon: "Search"
  },
  {
    id: "fundamentacao-legal",
    name: "Fundamentação Legal",
    description: "Elaboração da base legal e normativa que sustenta a decisão ou recomendação.",
    category: "Redação",
    icon: "BookOpen"
  },
  {
    id: "analise-provas",
    name: "Análise de Provas",
    description: "Avaliação do conjunto probatório e sua adequação ao ônus da prova.",
    category: "Análise",
    icon: "Microscope"
  },
  {
    id: "calculo-prazos",
    name: "Cálculo de Prazos",
    description: "Verificação e cálculo de prazos processuais e prescricionais.",
    category: "Processual",
    icon: "Clock"
  },
  {
    id: "admissibilidade",
    name: "Admissibilidade",
    description: "Verificação dos requisitos de admissibilidade da ação ou recurso.",
    category: "Processual",
    icon: "CheckSquare"
  },
  {
    id: "medidas-cautelares",
    name: "Medidas Cautelares",
    description: "Análise da necessidade e cabimento de medidas cautelares ou de urgência.",
    category: "Tutela",
    icon: "Shield"
  },
  {
    id: "tutela-antecipada",
    name: "Tutela Antecipada",
    description: "Avaliação dos requisitos para concessão de tutela provisória antecipada.",
    category: "Tutela",
    icon: "Zap"
  },
  {
    id: "responsabilidade-civil",
    name: "Responsabilidade Civil",
    description: "Análise dos elementos da responsabilidade civil: ato, dano, nexo causal e culpa.",
    category: "Especialidade",
    icon: "AlertTriangle"
  },
  {
    id: "direito-consumidor",
    name: "Direito do Consumidor",
    description: "Aplicação das normas consumeristas e identificação de práticas abusivas.",
    category: "Especialidade",
    icon: "ShoppingCart"
  },
  {
    id: "direito-trabalho",
    name: "Direito do Trabalho",
    description: "Análise das relações trabalhistas e aplicação da CLT e normas correlatas.",
    category: "Especialidade",
    icon: "Briefcase"
  },
  {
    id: "direito-familia",
    name: "Direito de Família",
    description: "Análise de questões familiares, guarda, alimentos e partilha de bens.",
    category: "Especialidade",
    icon: "Home"
  },
  {
    id: "direito-previdenciario",
    name: "Direito Previdenciário",
    description: "Análise de benefícios previdenciários e aplicação da legislação do INSS.",
    category: "Especialidade",
    icon: "Heart"
  },
  {
    id: "execucao-fiscal",
    name: "Execução Fiscal",
    description: "Análise de execuções fiscais e defesas tributárias aplicáveis.",
    category: "Especialidade",
    icon: "DollarSign"
  },
  {
    id: "habeas-corpus",
    name: "Habeas Corpus",
    description: "Análise de situações de constrangimento ilegal e cabimento de habeas corpus.",
    category: "Constitucional",
    icon: "Lock"
  },
  {
    id: "mandado-seguranca",
    name: "Mandado de Segurança",
    description: "Análise do cabimento de mandado de segurança e direito líquido e certo.",
    category: "Constitucional",
    icon: "Star"
  },
  {
    id: "recursos",
    name: "Análise de Recursos",
    description: "Avaliação dos requisitos de admissibilidade e mérito de recursos processuais.",
    category: "Recursal",
    icon: "ArrowUp"
  },
  {
    id: "cumprimento-sentenca",
    name: "Cumprimento de Sentença",
    description: "Análise do procedimento de cumprimento de sentença e execução de títulos.",
    category: "Executivo",
    icon: "Gavel"
  },
  {
    id: "conciliacao-mediacao",
    name: "Conciliação e Mediação",
    description: "Identificação de pontos de convergência para solução consensual do litígio.",
    category: "Resolução",
    icon: "Handshake"
  },
  {
    id: "danos-morais",
    name: "Danos Morais",
    description: "Avaliação da ocorrência e quantum de danos morais no caso concreto.",
    category: "Especialidade",
    icon: "Heart"
  },
  {
    id: "direito-imobiliario",
    name: "Direito Imobiliário",
    description: "Análise de questões imobiliárias, contratos e posse de bens imóveis.",
    category: "Especialidade",
    icon: "Building"
  }
];

export const WORKFLOW_PROMPTS: Record<string, string> = {
  sentenca_civel: `Você é um juiz federal especializado em direito cível brasileiro. Com base nos fatos, partes, problema e objetivo do caso apresentado, elabore uma SENTENÇA CÍVEL completa e fundamentada, seguindo a estrutura formal exigida pelo CPC/2015.

A sentença deve conter:
1. RELATÓRIO - Síntese dos fatos e do processo
2. FUNDAMENTAÇÃO - Análise jurídica detalhada com base no direito positivo, doutrina e jurisprudência
3. DISPOSITIVO - Parte decisória com resolução do mérito

Use linguagem jurídica formal e técnica. Cite artigos de lei, súmulas e precedentes aplicáveis.`,

  saneamento: `Você é um juiz federal especializado em processo civil brasileiro. Com base nos fatos e questões processuais do caso apresentado, elabore uma DECISÃO DE SANEAMENTO E ORGANIZAÇÃO DO PROCESSO, conforme o art. 357 do CPC/2015.

A decisão deve:
1. Resolver as questões processuais pendentes (competência, legitimidade, pressupostos processuais)
2. Delimitar as questões de fato e de direito controvertidas
3. Especificar as provas necessárias e deferir as requeridas
4. Designar audiência de instrução se necessário
5. Fixar o prazo para manifestação das partes

Use linguagem jurídica formal e técnica.`,

  despacho: `Você é um juiz federal. Com base no caso e situação processual apresentados, elabore um DESPACHO judicial adequado ao momento processual.

O despacho deve:
1. Identificar a questão processual que enseja o despacho
2. Determinar as providências necessárias
3. Fixar prazos processuais
4. Indicar as consequências do descumprimento

Use linguagem jurídica formal, concisa e técnica.`,

  conciliacao: `Você é um conciliador/mediador judicial especializado em resolução de conflitos. Com base nos fatos, partes e problema apresentados, elabore uma PROPOSTA DE CONCILIAÇÃO estruturada para resolver o litígio de forma consensual.

A proposta deve:
1. Identificar os interesses reais de cada parte (além das posições declaradas)
2. Mapear os pontos de convergência possíveis
3. Apresentar proposta(s) de acordo estruturada(s)
4. Calcular os benefícios mútuos da conciliação vs. continuidade do processo
5. Sugerir cláusulas e condições do acordo

Use linguagem acessível e propositiva.`
};
