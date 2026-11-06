'use strict';
/* Dados de exemplo. Pessoas, trabalhos e TCs são fictícios. */

const ACERVO = [
  ['Aprendizado de máquina na previsão de safra no Vale do Rio Pardo', 'Luísa Hartmann', 'Rafael Dias', 'Ciência da Computação', 'Inteligência Artificial', 2025, 68, ['aprendizado de máquina', 'agricultura', 'regressão'], 'Compara modelos de regressão para estimar a produção de pequenas propriedades a partir de dados climáticos e do histórico de colheitas.', 412],
  ['Chatbots no atendimento ao estudante: estudo de caso', 'Fernanda Moraes', 'Paula Mendes', 'Ciência da Computação', 'Inteligência Artificial', 2025, 54, ['chatbot', 'atendimento', 'processamento de linguagem natural'], 'Avalia um assistente virtual na secretaria de um curso de graduação e mede a redução de chamados repetidos.', 287],
  ['Detecção de fraudes em cartões com florestas aleatórias', 'Eduardo Silveira', 'Rafael Dias', 'Ciência da Computação', 'Inteligência Artificial', 2024, 61, ['aprendizado de máquina', 'fraude', 'classificação'], 'Treina classificadores com bases desbalanceadas e compara técnicas de reamostragem.', 198],
  ['Visão computacional para classificação de grãos', 'Henrique Kunz', 'Rafael Dias', 'Engenharia de Computação', 'Inteligência Artificial', 2022, 73, ['visão computacional', 'agricultura', 'redes convolucionais'], 'Classifica amostras de grãos por imagem com redes convolucionais e compara o resultado com a inspeção manual.', 356],
  ['Reconhecimento de placas de trânsito em tempo real', 'Natália Fontana', 'Sônia Krause', 'Engenharia de Computação', 'Inteligência Artificial', 2023, 66, ['visão computacional', 'tempo real'], 'Implementa um detector em placa embarcada e mede a taxa de acerto em diferentes condições de luz.', 241],
  ['Plataforma web para gestão de estágios', 'Gabriel Schmitt', 'Paula Mendes', 'Ciência da Computação', 'Engenharia de Software', 2024, 59, ['web', 'gestão', 'estágio'], 'Descreve o desenvolvimento de um sistema para acompanhar contratos de estágio, do cadastro ao relatório final.', 523],
  ['Migração de monólito para microsserviços em uma cooperativa', 'Vinícius Rech', 'Paula Mendes', 'Ciência da Computação', 'Engenharia de Software', 2025, 72, ['microsserviços', 'arquitetura', 'migração'], 'Relata a migração gradual de um sistema legado e compara desempenho e custo antes e depois.', 339],
  ['Testes automatizados em aplicações móveis híbridas', 'Carolina Dutra', 'Sônia Krause', 'Ciência da Computação', 'Engenharia de Software', 2023, 48, ['testes', 'mobile', 'qualidade de software'], 'Compara ferramentas de teste e propõe um fluxo de integração contínua para equipes pequenas.', 176],
  ['Métricas de qualidade de código em projetos acadêmicos', 'Rodrigo Azevedo', 'Paula Mendes', 'Ciência da Computação', 'Engenharia de Software', 2022, 51, ['qualidade de software', 'métricas'], 'Analisa repositórios de disciplinas de programação e relaciona métricas de código com as notas dos alunos.', 122],
  ['Aplicativo móvel para acompanhamento de pacientes com diabetes', 'Tiago Becker', 'Paula Mendes', 'Ciência da Computação', 'Interação Humano-Computador', 2024, 63, ['mobile', 'saúde', 'usabilidade'], 'Apresenta um aplicativo de registro de glicemia e o teste de usabilidade com doze usuários.', 268],
  ['Acessibilidade em portais de universidades do Rio Grande do Sul', 'Mariana Lenz', 'Sônia Krause', 'Ciência da Computação', 'Interação Humano-Computador', 2025, 57, ['acessibilidade', 'web', 'avaliação'], 'Avalia a conformidade de portais acadêmicos com as diretrizes de acessibilidade e lista as falhas mais comuns.', 301],
  ['Gamificação no ensino de lógica de programação', 'Jéssica Thomas', 'Sônia Krause', 'Ciência da Computação', 'Interação Humano-Computador', 2023, 55, ['gamificação', 'educação', 'programação'], 'Aplica um jogo educativo em uma turma de primeiro semestre e compara o desempenho com a turma anterior.', 214],
  ['Detecção de intrusão em redes IoT com redes neurais', 'Júlia Kern', 'Rafael Dias', 'Engenharia de Computação', 'Redes e Segurança', 2024, 70, ['segurança', 'IoT', 'redes neurais'], 'Treina e compara classificadores com tráfego capturado de dispositivos domésticos.', 389],
  ['Análise de vulnerabilidades em sistemas web de pequenas empresas', 'Bruna Oliveira', 'Rafael Dias', 'Ciência da Computação', 'Redes e Segurança', 2025, 58, ['segurança', 'web', 'pentest'], 'Aplica testes de invasão autorizados em cinco sistemas e propõe um checklist de correção.', 445],
  ['Adequação à LGPD em clínicas de pequeno porte', 'Igor Marques', 'Sônia Krause', 'Ciência da Computação', 'Redes e Segurança', 2024, 52, ['LGPD', 'privacidade', 'segurança'], 'Propõe um roteiro de adequação e o aplica em duas clínicas da região.', 278],
  ['Redes definidas por software em laboratórios de ensino', 'Alex Reichert', 'Rafael Dias', 'Engenharia de Computação', 'Redes e Segurança', 2022, 64, ['redes', 'SDN'], 'Monta um ambiente de testes com controladores abertos para aulas práticas de redes.', 97],
  ['Automação residencial de baixo custo com ESP32', 'Mateus Lopes', 'Paula Mendes', 'Engenharia de Computação', 'Sistemas Embarcados e IoT', 2023, 60, ['automação', 'ESP32', 'IoT'], 'Monta um protótipo de controle de iluminação e mede a economia de energia em um mês de uso.', 634],
  ['Monitoramento de umidade do solo com LoRa', 'Patrícia Ruschel', 'Sônia Krause', 'Engenharia de Computação', 'Sistemas Embarcados e IoT', 2025, 67, ['IoT', 'agricultura', 'LoRa'], 'Avalia o alcance e o consumo de sensores sem fio em uma propriedade rural de Vera Cruz.', 372],
  ['Sistema embarcado para controle de estufas', 'Guilherme Haas', 'Sônia Krause', 'Engenharia de Computação', 'Sistemas Embarcados e IoT', 2024, 62, ['sistemas embarcados', 'automação', 'agricultura'], 'Desenvolve um controlador de temperatura e irrigação e valida o protótipo em uma estufa de hortaliças.', 233],
  ['Sensores vestíveis para detecção de quedas em idosos', 'Amanda Vogt', 'Sônia Krause', 'Engenharia de Computação', 'Sistemas Embarcados e IoT', 2022, 69, ['IoT', 'saúde', 'acelerômetro'], 'Compara algoritmos de detecção com dados de acelerômetro coletados em voluntários.', 188],
  ['Bancos relacionais e orientados a documentos em sistemas de gestão', 'Camila Wagner', 'Rafael Dias', 'Ciência da Computação', 'Banco de Dados', 2023, 56, ['banco de dados', 'desempenho'], 'Mede o desempenho dos dois modelos em consultas típicas de um sistema de gestão.', 265],
  ['Data warehouse para indicadores de uma secretaria de saúde', 'Otto Lehmann', 'Paula Mendes', 'Ciência da Computação', 'Banco de Dados', 2024, 65, ['data warehouse', 'indicadores', 'saúde'], 'Modela e carrega um repositório analítico com dados públicos e constrói painéis de acompanhamento.', 151],
  ['Otimização de consultas em bancos com grande volume de dados', 'Sabrina Kuhn', 'Rafael Dias', 'Ciência da Computação', 'Banco de Dados', 2022, 53, ['banco de dados', 'desempenho', 'índices'], 'Compara estratégias de indexação e particionamento em uma base de vendas com cem milhões de registros.', 140],
  ['Mineração de dados na evasão de cursos de graduação', 'Felipe Assmann', 'Paula Mendes', 'Ciência da Computação', 'Banco de Dados', 2025, 71, ['mineração de dados', 'educação', 'evasão'], 'Identifica padrões de evasão em dados anonimizados e aponta os semestres de maior risco.', 318]
];

const PARES_BANCA = [['Davi Antunes', 'Lia Ferreira'], ['Lia Ferreira', 'Otávio Reis'], ['Davi Antunes', 'Otávio Reis']];

function exemplo() {
  const agora = Date.now(), dd = n => agora + n * 864e5;
  const pessoaBase = (id, login, nome, papel, curso) => ({ id, login, nome, papel, curso, email: `${login}@exemplo.edu.br` });
  const biblioteca = ACERVO.map((c, i) => ({
    id: `l${i + 1}`, titulo: c[0], autor: c[1], orientador: c[2], curso: c[3], area: c[4], ano: c[5], paginas: c[6], palavras: c[7], resumo: c[8], downloads: c[9],
    banca: PARES_BANCA[i % 3], defesa: `${c[5]}-${i % 2 ? '12' : '07'}-${String(3 + (i * 3) % 24).padStart(2, '0')}`, status: 'publicado', enviadoPor: null
  }));
  biblioteca.push({
    id: 'l25', titulo: 'Assistente de voz para consulta ao acervo de bibliotecas', autor: 'Roberta Siqueira', orientador: 'Paula Mendes', curso: 'Ciência da Computação', area: 'Inteligência Artificial', ano: 2026, paginas: 58,
    palavras: ['assistente de voz', 'bibliotecas'], resumo: 'Desenvolve um assistente que responde perguntas sobre o acervo e avalia a precisão das respostas.', downloads: 0,
    banca: ['Davi Antunes', 'Lia Ferreira'], defesa: emDias(-20), status: 'pendente', enviadoPor: 'o1'
  });
  return {
    usuarios: [
      pessoaBase('a1', 'aluno', 'Ana Lima', 'aluno', 'Ciência da Computação'),
      pessoaBase('a2', 'caio', 'Caio Souza', 'aluno', 'Engenharia de Computação'),
      pessoaBase('a3', 'marina', 'Marina Rocha', 'aluno', 'Ciência da Computação'),
      pessoaBase('a4', 'pedro', 'Pedro Nunes', 'aluno', 'Ciência da Computação'),
      pessoaBase('a5', 'julia', 'Júlia Prass', 'aluno', 'Engenharia de Computação'),
      pessoaBase('a6', 'lucas', 'Lucas Weber', 'aluno', 'Ciência da Computação'),
      pessoaBase('o1', 'orientador', 'Paula Mendes', 'orientador', 'Ciência da Computação'),
      pessoaBase('o2', 'rafael', 'Rafael Dias', 'orientador', 'Ciência da Computação'),
      pessoaBase('o3', 'sonia', 'Sônia Krause', 'orientador', 'Engenharia de Computação'),
      pessoaBase('c1', 'coordenador', 'Marta Vieira', 'coordenador', 'Ciência da Computação'),
      pessoaBase('b1', 'banca', 'Davi Antunes', 'banca', 'Ciência da Computação'),
      pessoaBase('b2', 'lia', 'Lia Ferreira', 'banca', 'Engenharia de Computação'),
      pessoaBase('b3', 'otavio', 'Otávio Reis', 'banca', 'Ciência da Computação')
    ],
    trabalhos: [
      { id: 't1', alunoId: 'a1', tema: 'Aplicativo de monitoramento de irrigação para pequenas propriedades', orientadorId: 'o1', bancaIds: ['b1', 'b2'] },
      { id: 't2', alunoId: 'a2', tema: 'Detecção de falhas em esteiras industriais com visão computacional', orientadorId: 'o1', bancaIds: ['b1', 'b3'] },
      { id: 't3', alunoId: 'a3', tema: 'Chatbot para triagem de chamados de TI', orientadorId: 'o2', bancaIds: [] },
      { id: 't4', alunoId: 'a4', tema: 'Rastreio de entregas para cooperativas', orientadorId: null, bancaIds: [] },
      { id: 't5', alunoId: 'a5', tema: 'Medição de consumo de energia em prédios públicos com sensores sem fio', orientadorId: 'o3', bancaIds: ['b2'] },
      { id: 't6', alunoId: 'a6', tema: 'Sistema de reservas para laboratórios da universidade', orientadorId: 'o2', bancaIds: [] }
    ],
    itens: [
      { id: 'e1', titulo: 'Proposta', fase: 'TC1', prazo: emDias(-70), descricao: 'Tema, problema, objetivos e cronograma.' },
      { id: 'e2', titulo: 'TCI', fase: 'TC1', prazo: emDias(-35), descricao: 'Referencial teórico e metodologia.' },
      { id: 'e3', titulo: 'Desenvolvimento e implementação', fase: 'TC2', prazo: emDias(5), descricao: 'Versão funcional do projeto e relatório de andamento.' },
      { id: 'e4', titulo: 'Testes e validações', fase: 'TC2', prazo: emDias(21), descricao: 'Plano de testes e resultados.' },
      { id: 'e5', titulo: 'Documento final', fase: 'TC2', prazo: emDias(35), descricao: 'Texto completo do trabalho.' },
      { id: 'e6', titulo: 'Entrega para a banca', fase: 'TC2', prazo: emDias(45), descricao: 'Versão que vai para a defesa.' }
    ],
    envios: [
      { id: 'n1', tid: 't1', iid: 'e1', nome: 'Proposta_Ana_Lima.pdf', tam: 842000, data: dd(-71) },
      { id: 'n2', tid: 't1', iid: 'e2', nome: 'TCI_Ana_Lima.pdf', tam: 2310000, data: dd(-36) },
      { id: 'n3', tid: 't2', iid: 'e1', nome: 'Proposta_Caio_Souza.pdf', tam: 760000, data: dd(-70) },
      { id: 'n4', tid: 't2', iid: 'e2', nome: 'TCI_Caio_Souza.docx', tam: 1540000, data: dd(-35) },
      { id: 'n5', tid: 't2', iid: 'e3', nome: 'Desenvolvimento_Caio_Souza.zip', tam: 18400000, data: dd(-1) },
      { id: 'n6', tid: 't3', iid: 'e1', nome: 'Proposta_Marina_Rocha.pdf', tam: 690000, data: dd(-72) },
      { id: 'n7', tid: 't3', iid: 'e2', nome: 'TCI_Marina_Rocha.pdf', tam: 1980000, data: dd(-34) },
      { id: 'n8', tid: 't4', iid: 'e1', nome: 'Proposta_Pedro_Nunes.pdf', tam: 610000, data: dd(-70) },
      { id: 'n9', tid: 't5', iid: 'e1', nome: 'Proposta_Julia_Prass.pdf', tam: 720000, data: dd(-71) },
      { id: 'n10', tid: 't5', iid: 'e2', nome: 'TCI_Julia_Prass.pdf', tam: 2050000, data: dd(-36) },
      { id: 'n11', tid: 't6', iid: 'e1', nome: 'Proposta_Lucas_Weber.pdf', tam: 655000, data: dd(-70) }
    ],
    feedbacks: [
      { id: 'f1', tid: 't1', iid: 'e1', autorId: 'o1', nota: 8.5, texto: 'Problema bem delimitado. Faltou citar trabalhos parecidos na justificativa.', data: dd(-64) },
      { id: 'f2', tid: 't1', iid: 'e1', autorId: 'b1', nota: 8, texto: 'Os objetivos estão claros. Revisar o cronograma do TC2.', data: dd(-62) },
      { id: 'f3', tid: 't1', iid: 'e2', autorId: 'o1', nota: 9, texto: 'Metodologia boa. Ajustar as referências para a ABNT antes do TC2.', data: dd(-30) },
      { id: 'f4', tid: 't2', iid: 'e1', autorId: 'o1', nota: 7.5, texto: 'Definir melhor o conjunto de imagens que vai ser usado.', data: dd(-63) },
      { id: 'f5', tid: 't2', iid: 'e2', autorId: 'b1', nota: 7, texto: 'Falta comparar com pelo menos dois métodos existentes.', data: dd(-29) },
      { id: 'f6', tid: 't3', iid: 'e1', autorId: 'o2', nota: 8, texto: 'Bom recorte. Limitar o chatbot a um setor na primeira versão.', data: dd(-65) }
    ],
    conversas: [
      { id: 'c1', participantes: ['a1', 'o1'] }, { id: 'c2', participantes: ['a2', 'o1'] }, { id: 'c3', participantes: ['a3', 'o2'] },
      { id: 'c4', participantes: ['a1', 'a2'] }, { id: 'c5', participantes: ['o1', 'c1'] }, { id: 'c6', participantes: ['b1', 'c1'] }, { id: 'c7', participantes: ['a4', 'c1'] }
    ],
    mensagens: [
      { id: 'm1', cid: 'c1', autorId: 'o1', texto: 'Ana, li o TCI. Pode seguir para a implementação.', data: dd(-6) },
      { id: 'm2', cid: 'c1', autorId: 'a1', texto: 'Obrigada, professora! Posso mandar a arquitetura antes da entrega?', data: dd(-6) + 36e5 },
      { id: 'm3', cid: 'c1', autorId: 'o1', texto: 'Pode sim. Manda por aqui e a gente fecha na reunião.', data: dd(-1) },
      { id: 'm4', cid: 'c2', autorId: 'a2', texto: 'Professora, enviei o desenvolvimento ontem. Consegue olhar até sexta?', data: agora - 72e5 },
      { id: 'm5', cid: 'c3', autorId: 'o2', texto: 'Marina, faltou o feedback do TCI. Mando até amanhã.', data: dd(-2) },
      { id: 'm6', cid: 'c4', autorId: 'a2', texto: 'Ana, qual modelo de referência tu usou no TCI?', data: dd(-3) },
      { id: 'm7', cid: 'c4', autorId: 'a1', texto: 'O da biblioteca, o TC da Fernanda Moraes ajudou bastante.', data: dd(-3) + 18e5 },
      { id: 'm8', cid: 'c5', autorId: 'c1', texto: 'Paula, consegue pegar mais um orientando este semestre?', data: dd(-4) },
      { id: 'm9', cid: 'c5', autorId: 'o1', texto: 'Consigo um. Qual é o tema?', data: dd(-4) + 72e5 },
      { id: 'm10', cid: 'c6', autorId: 'c1', texto: 'Davi, liberei teu acesso aos trabalhos da Ana e do Caio.', data: dd(-8) },
      { id: 'm11', cid: 'c7', autorId: 'a4', texto: 'Professora, ainda estou sem orientação definida.', data: dd(-1) }
    ],
    reunioes: [
      { id: 'r1', tid: 't1', data: emDias(3), hora: '14:00', assunto: 'Revisar a arquitetura do aplicativo', status: 'aceita' },
      { id: 'r2', tid: 't2', data: emDias(2), hora: '16:30', assunto: 'Dúvida sobre os testes', status: 'pendente' },
      { id: 'r3', tid: 't1', data: emDias(-12), hora: '10:00', assunto: 'Fechamento do TCI', status: 'aceita' }
    ],
    biblioteca,
    salvos: { a1: ['l2', 'l6'] },
    leitura: { 'a1:c1': dd(-2), 'o1:c1': agora, 'o1:c2': dd(-1), 'o2:c3': agora, 'a3:c3': dd(-3), 'a1:c4': agora, 'a2:c4': agora, 'o1:c5': agora, 'c1:c5': agora, 'c1:c6': agora, 'b1:c6': agora, 'a4:c7': agora }
  };
}
