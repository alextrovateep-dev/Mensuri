// Dados Mockados - Sistema de Saúde
// Base visual e de decisão (dados fictícios para análise de produto/UX)
const MOCK_META = {
  projeto: 'APP Saude',
  ambiente: 'mock',
  versao: '1.1.0',
  dataReferencia: '2024-01-25',
  observacao: 'Dados não reais. Uso exclusivo para prototipação e análise.'
};

const mockData = {
  meta: MOCK_META,
  usuario: {
    id: '1',
    tipo: 'paciente',
    nome: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    dataNascimento: '1985-05-15',
    telefone: '(11) 98765-4321',
    fotoPerfil: '👤',
    dataCadastro: '2024-01-01',
    ativo: true
  },

  // Catálogo de Medicamentos (pré-cadastrados)
  catalogoMedicamentos: [
    { id: 1, nome: 'Dipirona', formas: ['comprimido', 'gotas'], dosagens: ['500mg', '1000mg', '20 gotas', '1 comprimido'], foto: '💊' },
    { id: 2, nome: 'Losartana', formas: ['comprimido'], dosagens: ['25mg', '50mg', '100mg', '1 comprimido'], foto: '💊' },
    { id: 3, nome: 'Metformina', formas: ['comprimido'], dosagens: ['500mg', '850mg', '1000mg', '1 comprimido'], foto: '💊' },
    { id: 4, nome: 'Atorvastatina', formas: ['comprimido'], dosagens: ['10mg', '20mg', '40mg', '1 comprimido'], foto: '💊' },
    { id: 5, nome: 'Omeprazol', formas: ['capsula'], dosagens: ['20mg', '40mg', '1 capsula'], foto: '💊' },
    { id: 6, nome: 'Diazepam', formas: ['comprimido', 'gotas'], dosagens: ['5mg', '10mg', '5 gotas'], foto: '💊' },
    { id: 7, nome: 'Amoxicilina', formas: ['capsula', 'solucao'], dosagens: ['250mg', '500mg', '5ml', '1 capsula'], foto: '💊' },
    { id: 8, nome: 'Ibuprofeno', formas: ['comprimido', 'solucao'], dosagens: ['200mg', '400mg', '600mg', '5ml'], foto: '💊' },
    { id: 9, nome: 'Paracetamol', formas: ['comprimido', 'gotas', 'solucao'], dosagens: ['500mg', '750mg', '200mg/ml', '15 gotas'], foto: '💊' },
    { id: 10, nome: 'AAS', formas: ['comprimido'], dosagens: ['100mg', '300mg', '1 comprimido'], foto: '💊' },
    { id: 11, nome: 'Levotiroxina', formas: ['comprimido'], dosagens: ['25mcg', '50mcg', '75mcg', '100mcg'], foto: '💊' },
    { id: 12, nome: 'Sinvastatina', formas: ['comprimido'], dosagens: ['10mg', '20mg', '40mg', '1 comprimido'], foto: '💊' },
    { id: 13, nome: 'Anlodipino', formas: ['comprimido'], dosagens: ['5mg', '10mg', '1 comprimido'], foto: '💊' },
    { id: 14, nome: 'Hidroclorotiazida', formas: ['comprimido'], dosagens: ['12.5mg', '25mg', '1 comprimido'], foto: '💊' },
    { id: 15, nome: 'Furosemida', formas: ['comprimido'], dosagens: ['20mg', '40mg', '1 comprimido'], foto: '💊' },
    { id: 16, nome: 'Prednisona', formas: ['comprimido'], dosagens: ['5mg', '20mg', '1 comprimido'], foto: '💊' },
    { id: 17, nome: 'Loratadina', formas: ['comprimido', 'xarope'], dosagens: ['10mg', '5ml', '10ml', '1 comprimido'], foto: '💊' },
    { id: 18, nome: 'Cetirizina', formas: ['comprimido', 'gotas'], dosagens: ['10mg', '10 gotas', '20 gotas'], foto: '💊' },
    { id: 19, nome: 'Nimesulida', formas: ['comprimido', 'solucao'], dosagens: ['100mg', '50mg/ml', '1 comprimido'], foto: '💊' },
    { id: 20, nome: 'Ranitidina', formas: ['comprimido', 'solucao'], dosagens: ['150mg', '300mg', '10ml'], foto: '💊' },
    { id: 21, nome: 'Pantoprazol', formas: ['comprimido'], dosagens: ['20mg', '40mg', '1 comprimido'], foto: '💊' },
    { id: 22, nome: 'Azitromicina', formas: ['comprimido', 'solucao'], dosagens: ['500mg', '40mg/ml', '5ml'], foto: '💊' },
    { id: 23, nome: 'Clavulin', formas: ['comprimido', 'solucao'], dosagens: ['500mg + 125mg', '875mg + 125mg', '5ml'], foto: '💊' },
    { id: 24, nome: 'Insulina NPH', formas: ['injetavel'], dosagens: ['10 UI', '20 UI', '30 UI', '1 unidade'], foto: '💉' },
    { id: 25, nome: 'Salbutamol', formas: ['spray', 'solucao'], dosagens: ['100mcg/jato', '2 jatos', '5ml'], foto: '💨' },
    { id: 26, nome: 'Vitamina D', formas: ['capsula', 'gotas'], dosagens: ['1000 UI', '7000 UI', '1 capsula'], foto: '💊' },
    { id: 27, nome: 'Complexo B', formas: ['capsula', 'comprimido', 'solucao'], dosagens: ['1 capsula', '2 comprimidos', '5ml'], foto: '💊' },
    { id: 28, nome: 'Xarope para Tosse', formas: ['xarope', 'colher'], dosagens: ['5ml', '10ml', '1 colher de cha', '1 colher de sopa'], foto: '🥄' },
    { id: 29, nome: 'Lactulose', formas: ['xarope', 'colher'], dosagens: ['10ml', '15ml', '1 colher de sopa'], foto: '🥄' },
    { id: 30, nome: 'Soro Fisiologico', formas: ['solucao', 'gotas', 'unidade'], dosagens: ['5ml', '10ml', '20 gotas', '1 unidade'], foto: '💧' }
  ],

  // Configuração de sinais vitais (ativo/inativo e valores ideais)
  configSinaisVitais: {
    'Batimento Cardíaco':      { exibirSaude: true,  exibirDashboard: true  },
    'Pressão Arterial':        { exibirSaude: true,  exibirDashboard: true  },
    'Temperatura':             { exibirSaude: true,  exibirDashboard: false },
    'Passos':                  { exibirSaude: true,  exibirDashboard: true  },
    'Oxigenação':             { exibirSaude: true,  exibirDashboard: true  },
    'Calorias':                { exibirSaude: true,  exibirDashboard: false },
    'Glicemia':                { exibirSaude: true,  exibirDashboard: true  },
    'HRV':                     { exibirSaude: true,  exibirDashboard: false },
    'Nível de Estresse':       { exibirSaude: true,  exibirDashboard: true  },
    'Sono':                    { exibirSaude: true,  exibirDashboard: true  },
    'Hidratação':             { exibirSaude: true,  exibirDashboard: false },
    'Freq. Respiratória':     { exibirSaude: true,  exibirDashboard: false }
  },

  sinaisVitais: [
    { 
      id: 1, 
      tipo: 'Batimento Cardíaco', 
      valor: 78, 
      unidade: 'bpm', 
      ideal: '60-100', 
      fonte: 'Pulseira', 
      tempo: 'Há 2 horas', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 14:30', 
      icon: '🫀',
      variacao: 'normal',
      tendencia: 'up',
      percentualVariacao: 5,
      historico: [
        { data: '2024-01-25', hora: '14:30', valor: 78, status: 'normal', anterior: 75 },
        { data: '2024-01-25', hora: '10:00', valor: 75, status: 'normal', anterior: 72 },
        { data: '2024-01-24', hora: '15:00', valor: 82, status: 'normal', anterior: 78 },
        { data: '2024-01-24', hora: '09:00', valor: 76, status: 'normal', anterior: 80 },
        { data: '2024-01-23', hora: '14:00', valor: 80, status: 'normal', anterior: 77 }
      ]
    },
    { 
      id: 2, 
      tipo: 'Pressão Arterial', 
      valor: '125/82', 
      unidade: 'mmHg', 
      ideal: '120/80', 
      fonte: 'Manual', 
      tempo: 'Há 4 horas', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 12:15', 
      icon: '🩸',
      variacao: 'ligeiramente_alta',
      tendencia: 'up',
      percentualVariacao: 3,
      alerta: { ativo: true, acima: 140, abaixo: 90 },
      historico: [
        { data: '2024-01-25', hora: '12:15', valor: '125/82', status: 'ligeiramente_alta', anterior: '120/80' },
        { data: '2024-01-25', hora: '08:00', valor: '120/80', status: 'normal', anterior: '118/79' },
        { data: '2024-01-24', hora: '14:00', valor: '122/81', status: 'normal', anterior: '120/80' },
        { data: '2024-01-24', hora: '09:00', valor: '118/79', status: 'normal', anterior: '120/81' },
        { data: '2024-01-23', hora: '15:00', valor: '128/85', status: 'ligeiramente_alta', anterior: '125/82' }
      ]
    },
    { 
      id: 3, 
      tipo: 'Temperatura', 
      valor: 36.8, 
      unidade: '°C', 
      ideal: '36-37.5', 
      fonte: 'Manual', 
      tempo: 'Há 1 hora', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 15:45', 
      icon: '🌡️',
      variacao: 'normal',
      tendencia: 'down',
      percentualVariacao: -2,
      historico: [
        { data: '2024-01-25', hora: '15:45', valor: 36.8, status: 'normal', anterior: 36.9 },
        { data: '2024-01-25', hora: '09:00', valor: 36.5, status: 'normal', anterior: 36.8 },
        { data: '2024-01-24', hora: '14:00', valor: 36.9, status: 'normal', anterior: 36.7 },
        { data: '2024-01-24', hora: '08:00', valor: 36.7, status: 'normal', anterior: 36.9 },
        { data: '2024-01-23', hora: '15:00', valor: 37.0, status: 'normal', anterior: 36.8 }
      ]
    },
    { 
      id: 4, 
      tipo: 'Passos', 
      valor: 8234, 
      unidade: 'passos', 
      ideal: '5000-15000', 
      fonte: 'Google Fit', 
      tempo: 'Hoje', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 23:59', 
      icon: '👟',
      variacao: 'normal',
      tendencia: 'up',
      percentualVariacao: 8,
      historico: [
        { data: '2024-01-25', valor: 8234, status: 'normal', anterior: 7600 },
        { data: '2024-01-24', valor: 9500, status: 'normal', anterior: 8900 },
        { data: '2024-01-23', valor: 7200, status: 'normal', anterior: 8100 },
        { data: '2024-01-22', valor: 10500, status: 'normal', anterior: 9200 },
        { data: '2024-01-21', valor: 6800, status: 'normal', anterior: 7500 }
      ]
    },
    { 
      id: 5, 
      tipo: 'Oxigenação', 
      valor: 98, 
      unidade: '%', 
      ideal: '95-100', 
      fonte: 'Pulseira', 
      tempo: 'Há 30 min', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 16:00', 
      icon: '💨',
      variacao: 'normal',
      tendencia: 'up',
      percentualVariacao: 1,
      historico: [
        { data: '2024-01-25', hora: '16:00', valor: 98, status: 'normal', anterior: 97 },
        { data: '2024-01-25', hora: '10:00', valor: 97, status: 'normal', anterior: 96 },
        { data: '2024-01-24', hora: '15:00', valor: 99, status: 'normal', anterior: 98 },
        { data: '2024-01-24', hora: '09:00', valor: 96, status: 'normal', anterior: 97 },
        { data: '2024-01-23', hora: '14:00', valor: 98, status: 'normal', anterior: 99 }
      ]
    },
    { 
      id: 6, 
      tipo: 'Calorias', 
      valor: 2100, 
      unidade: 'kcal', 
      ideal: '1800-2500', 
      fonte: 'Google Fit', 
      tempo: 'Hoje', 
      categoria: 'saude', 
      status: 'normal', 
      dataHora: '25/01/2024 23:59', 
      icon: '🔥',
      variacao: 'normal',
      tendencia: 'down',
      percentualVariacao: -5,
      historico: [
        { data: '2024-01-25', valor: 2100, status: 'normal', anterior: 2200 },
        { data: '2024-01-24', valor: 2300, status: 'normal', anterior: 2100 },
        { data: '2024-01-23', valor: 1900, status: 'normal', anterior: 2300 },
        { data: '2024-01-22', valor: 2200, status: 'normal', anterior: 1900 },
        { data: '2024-01-21', valor: 2050, status: 'normal', anterior: 2200 }
      ]
    },
    {
      id: 7,
      tipo: 'Glicemia',
      valor: 94,
      unidade: 'mg/dL',
      ideal: '70-99',
      fonte: 'Manual',
      tempo: 'Hoje',
      categoria: 'saude',
      status: 'normal',
      dataHora: '25/01/2024 07:30',
      icon: '🩺',
      variacao: 'normal',
      tendencia: 'down',
      percentualVariacao: -2,
      alerta: { ativo: true, acima: 126, abaixo: 70 },
      historico: [
        { data: '2024-01-25', hora: '07:30', valor: 94, status: 'normal', anterior: 96 },
        { data: '2024-01-24', hora: '07:15', valor: 96, status: 'normal', anterior: 98 },
        { data: '2024-01-23', hora: '07:45', valor: 102, status: 'atencao', anterior: 96 },
        { data: '2024-01-22', hora: '07:30', valor: 98, status: 'normal', anterior: 95 },
        { data: '2024-01-21', hora: '07:20', valor: 95, status: 'normal', anterior: 97 }
      ]
    },
    {
      id: 8,
      tipo: 'HRV',
      valor: 52,
      unidade: 'ms',
      ideal: '40-80',
      fonte: 'Pulseira',
      tempo: 'Esta manhã',
      categoria: 'saude',
      status: 'normal',
      dataHora: '25/01/2024 06:00',
      icon: '💓',
      variacao: 'normal',
      tendencia: 'up',
      percentualVariacao: 4,
      historico: [
        { data: '2024-01-25', hora: '06:00', valor: 52, status: 'normal', anterior: 50 },
        { data: '2024-01-24', hora: '06:00', valor: 50, status: 'normal', anterior: 48 },
        { data: '2024-01-23', hora: '06:00', valor: 45, status: 'normal', anterior: 50 },
        { data: '2024-01-22', hora: '06:00', valor: 48, status: 'normal', anterior: 46 },
        { data: '2024-01-21', hora: '06:00', valor: 46, status: 'normal', anterior: 49 }
      ]
    },
    {
      id: 9,
      tipo: 'Nível de Estresse',
      valor: 38,
      unidade: '%',
      ideal: '0-40',
      fonte: 'Pulseira',
      tempo: 'Há 1 hora',
      categoria: 'saude',
      status: 'normal',
      dataHora: '25/01/2024 15:00',
      icon: '🧠',
      variacao: 'normal',
      tendencia: 'down',
      percentualVariacao: -5,
      historico: [
        { data: '2024-01-25', hora: '15:00', valor: 38, status: 'normal', anterior: 43 },
        { data: '2024-01-25', hora: '12:00', valor: 43, status: 'atencao', anterior: 35 },
        { data: '2024-01-24', hora: '15:00', valor: 35, status: 'normal', anterior: 40 },
        { data: '2024-01-24', hora: '12:00', valor: 40, status: 'normal', anterior: 38 },
        { data: '2024-01-23', hora: '15:00', valor: 55, status: 'atencao', anterior: 42 }
      ]
    },
    {
      id: 10,
      tipo: 'Sono',
      valor: 7.2,
      unidade: 'h',
      ideal: '7-9',
      fonte: 'Apple Health',
      tempo: 'Ontem',
      categoria: 'saude',
      status: 'normal',
      dataHora: '24/01/2024 06:30',
      icon: '😴',
      variacao: 'normal',
      tendencia: 'up',
      percentualVariacao: 3,
      historico: [
        { data: '2024-01-24', valor: 7.2, status: 'normal', anterior: 6.8 },
        { data: '2024-01-23', valor: 6.8, status: 'atencao', anterior: 7.5 },
        { data: '2024-01-22', valor: 7.5, status: 'normal', anterior: 7.0 },
        { data: '2024-01-21', valor: 7.0, status: 'normal', anterior: 6.5 },
        { data: '2024-01-20', valor: 6.5, status: 'atencao', anterior: 7.2 }
      ]
    },
    {
      id: 11,
      tipo: 'Hidratação',
      valor: 1800,
      unidade: 'ml',
      ideal: '2000-3000',
      fonte: 'Manual',
      tempo: 'Hoje',
      categoria: 'saude',
      status: 'atencao',
      dataHora: '25/01/2024 16:00',
      icon: '💧',
      variacao: 'abaixo',
      tendencia: 'up',
      percentualVariacao: 10,
      historico: [
        { data: '2024-01-25', valor: 1800, status: 'atencao', anterior: 1600 },
        { data: '2024-01-24', valor: 2200, status: 'normal', anterior: 1900 },
        { data: '2024-01-23', valor: 1600, status: 'atencao', anterior: 2100 },
        { data: '2024-01-22', valor: 2400, status: 'normal', anterior: 2200 },
        { data: '2024-01-21', valor: 1900, status: 'atencao', anterior: 2300 }
      ]
    },
    {
      id: 12,
      tipo: 'Freq. Respiratória',
      valor: 16,
      unidade: 'rpm',
      ideal: '12-20',
      fonte: 'Pulseira',
      tempo: 'Há 2 horas',
      categoria: 'saude',
      status: 'normal',
      dataHora: '25/01/2024 14:00',
      icon: '🫁',
      variacao: 'normal',
      tendencia: 'down',
      percentualVariacao: -1,
      historico: [
        { data: '2024-01-25', hora: '14:00', valor: 16, status: 'normal', anterior: 17 },
        { data: '2024-01-25', hora: '08:00', valor: 17, status: 'normal', anterior: 16 },
        { data: '2024-01-24', hora: '14:00', valor: 15, status: 'normal', anterior: 16 },
        { data: '2024-01-24', hora: '08:00', valor: 16, status: 'normal', anterior: 15 },
        { data: '2024-01-23', hora: '14:00', valor: 18, status: 'normal', anterior: 16 }
      ]
    }
  ],

  // Configuração de composição corporal
  configComposicao: {
    'Peso':                    { exibirCorpo: true,  exibirDashboard: true  },
    'Altura':                  { exibirCorpo: true,  exibirDashboard: false },
    'IMC':                     { exibirCorpo: true,  exibirDashboard: true  },
    'Percentual de Gordura':   { exibirCorpo: true,  exibirDashboard: false },
    'Massa Muscular':          { exibirCorpo: true,  exibirDashboard: false },
    'Circunferência Cintura':  { exibirCorpo: true,  exibirDashboard: false }
  },

  // Composição Corporal
  composicaoCorporal: [
    {
      id: 1,
      tipo: 'Peso',
      valor: 75,
      unidade: 'kg',
      ideal: 70,
      dataHora: '25/01/2024',
      variacao: 'acima',
      icon: '⚖️',
      fonte: 'Balança Inteligente',
      historico: [
        { data: '2024-01-25', valor: 75, variacao: 'acima', fonte: 'Balança Inteligente' },
        { data: '2024-01-24', valor: 74.8, variacao: 'acima', fonte: 'Balança Inteligente' },
        { data: '2024-01-23', valor: 74.5, variacao: 'acima', fonte: 'Balança Inteligente' },
        { data: '2024-01-22', valor: 74.2, variacao: 'acima', fonte: 'Balança Inteligente' },
        { data: '2024-01-21', valor: 73.9, variacao: 'acima', fonte: 'Balança Inteligente' }
      ]
    },
    {
      id: 2,
      tipo: 'Altura',
      valor: 1.78,
      unidade: 'm',
      ideal: 1.78,
      dataHora: '15/01/2024',
      variacao: 'normal',
      icon: '📏',
      fonte: 'Manual',
      historico: []
    },
    {
      id: 3,
      tipo: 'IMC',
      valor: 23.7,
      unidade: 'kg/m²',
      ideal: '18.5-24.9',
      dataHora: '25/01/2024',
      variacao: 'normal',
      icon: '📊',
      fonte: 'Calculado',
      historico: [
        { data: '2024-01-25', valor: 23.7, variacao: 'normal', fonte: 'Calculado' },
        { data: '2024-01-24', valor: 23.6, variacao: 'normal', fonte: 'Calculado' },
        { data: '2024-01-23', valor: 23.5, variacao: 'normal', fonte: 'Calculado' },
        { data: '2024-01-22', valor: 23.4, variacao: 'normal', fonte: 'Calculado' },
        { data: '2024-01-21', valor: 23.3, variacao: 'normal', fonte: 'Calculado' }
      ]
    },
    {
      id: 4,
      tipo: 'Percentual de Gordura',
      valor: 22,
      unidade: '%',
      ideal: '15-25',
      dataHora: '20/01/2024',
      variacao: 'normal',
      icon: '🔴',
      fonte: 'Balança Inteligente',
      historico: [
        { data: '2024-01-20', valor: 22, variacao: 'normal', fonte: 'Balança Inteligente' },
        { data: '2024-01-15', valor: 22.5, variacao: 'normal', fonte: 'Balança Inteligente' },
        { data: '2024-01-10', valor: 23, variacao: 'normal', fonte: 'Balança Inteligente' }
      ]
    },
    {
      id: 5,
      tipo: 'Massa Muscular',
      valor: 58,
      unidade: 'kg',
      ideal: '55-65',
      dataHora: '20/01/2024',
      variacao: 'normal',
      icon: '💪',
      fonte: 'Balança Inteligente',
      historico: [
        { data: '2024-01-20', valor: 58, variacao: 'normal', fonte: 'Balança Inteligente' },
        { data: '2024-01-15', valor: 57.8, variacao: 'normal', fonte: 'Balança Inteligente' },
        { data: '2024-01-10', valor: 57.5, variacao: 'normal', fonte: 'Balança Inteligente' }
      ]
    },
    {
      id: 6,
      tipo: 'Circunferência Cintura',
      valor: 82,
      unidade: 'cm',
      ideal: '< 94',
      dataHora: '20/01/2024',
      variacao: 'normal',
      icon: '📐',
      fonte: 'Manual',
      historico: [
        { data: '2024-01-20', valor: 82, variacao: 'normal', fonte: 'Manual' },
        { data: '2024-01-15', valor: 81.5, variacao: 'normal', fonte: 'Manual' },
        { data: '2024-01-10', valor: 81, variacao: 'normal', fonte: 'Manual' }
      ]
    }
  ],

  // ECG
  ecgs: [
    {
      id: 1,
      frequenciaCardiaca: 72,
      ritmo: 'Normal',
      interpretacao: 'Normal - Sem alterações detectadas',
      dataHora: '25/01/2024 10:00',
      arquivo: 'ecg_25_01_2024.pdf',
      status: 'normal',
      icon: '📈',
      historico: [
        { data: '2024-01-25', hora: '10:00', frequencia: 72, ritmo: 'Normal', interpretacao: 'Normal - Sem alterações detectadas' },
        { data: '2024-01-20', hora: '09:30', frequencia: 75, ritmo: 'Normal', interpretacao: 'Normal - Sem alterações detectadas' },
        { data: '2024-01-15', hora: '14:00', frequencia: 70, ritmo: 'Normal', interpretacao: 'Normal - Sem alterações detectadas' },
        { data: '2024-01-10', hora: '11:00', frequencia: 73, ritmo: 'Normal', interpretacao: 'Normal - Sem alterações detectadas' },
        { data: '2024-01-05', hora: '15:30', frequencia: 71, ritmo: 'Normal', interpretacao: 'Normal - Sem alterações detectadas' }
      ]
    }
  ],

  medicacoes: [
    { 
      id: 1, 
      nome: 'Dipirona', 
      dosagem: '500mg', 
      horarios: ['08:00', '14:30', '20:00'],
      frequencia: '3x ao dia',
      dataInicio: '2024-01-15',
      dataFim: '2024-02-15',
      estoqueAtual: 18,
      estoqueMinimo: 7,
      exibirDashboard: true,
      alertas: { lembrete: true, antecedencia: 10, atrasada: true, estoqueBaixo: true },
      categoria: 'medicacao',
      historico: [
        { data: '25/01/2024', hora: '08:00', status: 'tomado' },
        { data: '25/01/2024', hora: '14:30', status: 'tomado' },
        { data: '25/01/2024', hora: '20:00', status: 'pendente' },
        { data: '24/01/2024', hora: '08:00', status: 'tomado' },
        { data: '24/01/2024', hora: '14:30', status: 'tomado' },
        { data: '24/01/2024', hora: '20:00', status: 'tomado' },
        { data: '23/01/2024', hora: '08:00', status: 'tomado' },
        { data: '23/01/2024', hora: '14:30', status: 'tomado' },
        { data: '23/01/2024', hora: '20:00', status: 'tomado' }
      ]
    },
    { 
      id: 2, 
      nome: 'Losartana', 
      dosagem: '50mg', 
      horarios: ['08:00'],
      frequencia: '1x ao dia',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      estoqueAtual: 25,
      estoqueMinimo: 5,
      exibirDashboard: true,
      alertas: { lembrete: true, antecedencia: 10, atrasada: true, estoqueBaixo: true },
      categoria: 'medicacao',
      historico: [
        { data: '25/01/2024', hora: '08:00', status: 'tomado' },
        { data: '24/01/2024', hora: '08:00', status: 'tomado' },
        { data: '23/01/2024', hora: '08:00', status: 'tomado' },
        { data: '22/01/2024', hora: '08:00', status: 'tomado' },
        { data: '21/01/2024', hora: '08:00', status: 'tomado' }
      ]
    },
    { 
      id: 3, 
      nome: 'Metformina', 
      dosagem: '850mg', 
      horarios: ['08:00', '20:00'],
      frequencia: '2x ao dia',
      dataInicio: '2024-01-10',
      dataFim: '2024-03-10',
      estoqueAtual: 40,
      estoqueMinimo: 10,
      exibirDashboard: false,
      alertas: { lembrete: true, antecedencia: 15, atrasada: false, estoqueBaixo: true },
      categoria: 'medicacao',
      historico: [
        { data: '25/01/2024', hora: '08:00', status: 'tomado' },
        { data: '25/01/2024', hora: '20:00', status: 'pendente' },
        { data: '24/01/2024', hora: '08:00', status: 'tomado' },
        { data: '24/01/2024', hora: '20:00', status: 'tomado' },
        { data: '23/01/2024', hora: '08:00', status: 'tomado' },
        { data: '23/01/2024', hora: '20:00', status: 'tomado' }
      ]
    },
    { 
      id: 4, 
      nome: 'Atorvastatina', 
      dosagem: '20mg', 
      horarios: ['20:00'],
      frequencia: '1x ao dia',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      estoqueAtual: 6,
      estoqueMinimo: 5,
      exibirDashboard: false,
      alertas: { lembrete: true, antecedencia: 10, atrasada: true, estoqueBaixo: true },
      categoria: 'medicacao',
      historico: [
        { data: '25/01/2024', hora: '20:00', status: 'pendente' },
        { data: '24/01/2024', hora: '20:00', status: 'tomado' },
        { data: '23/01/2024', hora: '20:00', status: 'tomado' },
        { data: '22/01/2024', hora: '20:00', status: 'tomado' },
        { data: '21/01/2024', hora: '20:00', status: 'tomado' }
      ]
    },
    { 
      id: 5, 
      nome: 'Omeprazol', 
      dosagem: '20mg', 
      horarios: ['07:00'],
      frequencia: '1x ao dia',
      dataInicio: '2024-01-05',
      dataFim: '2024-02-05',
      estoqueAtual: 4,
      estoqueMinimo: 7,
      exibirDashboard: true,
      alertas: { lembrete: true, antecedencia: 10, atrasada: true, estoqueBaixo: true },
      categoria: 'medicacao',
      historico: [
        { data: '25/01/2024', hora: '07:00', status: 'tomado' },
        { data: '24/01/2024', hora: '07:00', status: 'tomado' },
        { data: '23/01/2024', hora: '07:00', status: 'tomado' },
        { data: '22/01/2024', hora: '07:00', status: 'tomado' },
        { data: '21/01/2024', hora: '07:00', status: 'nao_tomado' }
      ]
    }
  ],

  consultas: [
    { 
      id: 1, 
      medico: 'Dr. Carlos Silva', 
      especialidade: 'Cardiologia', 
      data: '10/02/2024', 
      hora: '14:30', 
      tipo: 'Presencial', 
      status: 'Agendado',
      local: 'Clínica Central',
      motivo: 'Acompanhamento cardíaco',
      categoria: 'agenda',
      alerta: { ativo: true, antecedencia: 1440 }
    },
    { 
      id: 2, 
      medico: 'Dra. Ana Santos', 
      especialidade: 'Clínica Geral', 
      data: '15/02/2024', 
      hora: '10:00', 
      tipo: 'Online', 
      status: 'Agendado',
      local: 'Telemedicina',
      motivo: 'Consulta de rotina',
      categoria: 'agenda',
      alerta: { ativo: true, antecedencia: 120 }
    }
  ],

  examesAgendados: [
    { 
      id: 1, 
      nome: 'Hemograma Completo', 
      data: '05/02/2024', 
      local: 'Laboratório ABC', 
      medico: 'Dr. Carlos Silva', 
      status: 'Agendado',
      categoria: 'agenda'
    },
    { 
      id: 2, 
      nome: 'Eletrocardiograma', 
      data: '12/02/2024', 
      local: 'Clínica Central', 
      medico: 'Dr. Carlos Silva', 
      status: 'Agendado',
      categoria: 'agenda'
    }
  ],

  examesRealizados: [
    { 
      id: 1, 
      nome: 'Hemograma Completo', 
      data: '28/01/2024', 
      local: 'Laboratório ABC', 
      resultado: 'Resultado normal. Todos os valores dentro dos limites esperados.',
      categoria: 'agenda'
    },
    { 
      id: 2, 
      nome: 'Eletrocardiograma', 
      data: '20/01/2024', 
      local: 'Clínica Central', 
      resultado: 'Ritmo cardíaco normal. Sem alterações detectadas.',
      categoria: 'agenda'
    }
  ],

  compartilhamentos: [
    {
      id: 1,
      medico: 'Dr. Carlos Silva',
      especialidade: 'Cardiologia',
      dadosCompartilhados: ['sinais_vitais', 'medicacoes', 'exames'],
      dataAutorizacao: '2024-01-15',
      ativo: true
    }
  ],

  // Catálogo de tipos de dispositivos e o que cada um pode coletar
  catalogoDispositivos: [
    {
      tipo: 'Relógio / Pulseira',
      icon: '⌚',
      sinaisDisponiveis: ['Batimento Cardíaco', 'Pressão Arterial', 'Oxigenação', 'Passos', 'Calorias', 'Sono', 'HRV', 'Nível de Estresse', 'Freq. Respiratória']
    },
    {
      tipo: 'Balança Inteligente',
      icon: '⚖️',
      sinaisDisponiveis: ['Peso', 'IMC', 'Percentual de Gordura', 'Massa Muscular', 'Hidratação']
    },
    {
      tipo: 'Glicosímetro',
      icon: '🩺',
      sinaisDisponiveis: ['Glicemia']
    },
    {
      tipo: 'Termômetro',
      icon: '🌡️',
      sinaisDisponiveis: ['Temperatura']
    },
    {
      tipo: 'Esfigmomanômetro',
      icon: '🩺',
      sinaisDisponiveis: ['Pressão Arterial', 'Batimento Cardíaco']
    },
    {
      tipo: 'App / Plataforma',
      icon: '📱',
      sinaisDisponiveis: ['Passos', 'Calorias', 'Sono', 'Hidratação', 'Batimento Cardíaco', 'Peso']
    }
  ],

  dispositivos: [
    {
      id: 1,
      nome: 'Apple Watch Series 9',
      tipo: 'Relógio / Pulseira',
      icon: '⌚',
      conectado: true,
      sinaisColetados: ['Batimento Cardíaco', 'Oxigenação', 'Passos', 'Calorias', 'Sono', 'HRV', 'Nível de Estresse']
    },
    {
      id: 2,
      nome: 'Balança Xiaomi Mi',
      tipo: 'Balança Inteligente',
      icon: '⚖️',
      conectado: true,
      sinaisColetados: ['Peso', 'IMC', 'Percentual de Gordura', 'Massa Muscular']
    },
    {
      id: 3,
      nome: 'Google Fit',
      tipo: 'App / Plataforma',
      icon: '📱',
      conectado: true,
      sinaisColetados: ['Passos', 'Calorias', 'Sono']
    }
  ]
};

// Cores por categoria - Paleta Padrão do Projeto
const categoryColors = {
  medicacao: {
    primary: '#9058A7',
    light: '#E8D5F2',
    border: '#7d4a8f',
    icon: '💊'
  },
  saude: {
    primary: '#7e91cd',
    light: '#D4DFF0',
    border: '#5a6ba8',
    icon: '❤️'
  },
  agenda: {
    primary: '#2E7D9A',
    light: '#D8EEF7',
    border: '#1F627D',
    icon: '📅'
  }
};

// Status colors
const statusColors = {
  normal: '#00AA00',
  atencao: '#F5A623',
  aviso: '#FFA500',
  critico: '#FF0000'
};

// =========================
// Normalização para análise
// =========================
function toISODate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // Formato já ISO: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Formato BR: DD/MM/YYYY
  const br = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) {
    const [, dd, mm, yyyy] = br;
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

function toISODateTime(dateStr, timeStr) {
  const isoDate = toISODate(dateStr);
  if (!isoDate) return null;
  if (!timeStr) return `${isoDate}T00:00:00`;
  return `${isoDate}T${timeStr}:00`;
}

function parseIdealObject(ideal) {
  if (ideal == null) return null;
  if (typeof ideal === 'object' && ideal.label) return ideal;
  if (typeof ideal === 'number') {
    return { type: 'target', target: ideal, min: ideal, max: ideal, label: String(ideal) };
  }
  if (typeof ideal !== 'string') return { type: 'raw', label: String(ideal) };

  const pressure = ideal.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (pressure) {
    const sistolica = parseInt(pressure[1], 10);
    const diastolica = parseInt(pressure[2], 10);
    return {
      type: 'pressure',
      systolic: sistolica,
      diastolic: diastolica,
      label: `${sistolica}/${diastolica}`
    };
  }

  const range = ideal.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/);
  if (range) {
    const min = parseFloat(range[1]);
    const max = parseFloat(range[2]);
    return { type: 'range', min, max, label: `${min}-${max}` };
  }

  const lt = ideal.match(/^<\s*(-?\d+(?:\.\d+)?)$/);
  if (lt) {
    const max = parseFloat(lt[1]);
    return { type: 'max', min: null, max, label: `< ${max}` };
  }

  const gt = ideal.match(/^>\s*(-?\d+(?:\.\d+)?)$/);
  if (gt) {
    const min = parseFloat(gt[1]);
    return { type: 'min', min, max: null, label: `> ${min}` };
  }

  return { type: 'raw', label: ideal };
}

function parsePressureValue(value) {
  if (!value) return null;
  if (typeof value === 'object' && value.sistolica != null && value.diastolica != null) return value;
  if (typeof value !== 'string') return null;
  const parts = value.split('/');
  if (parts.length !== 2) return null;
  const sistolica = parseInt(parts[0], 10);
  const diastolica = parseInt(parts[1], 10);
  if (Number.isNaN(sistolica) || Number.isNaN(diastolica)) return null;
  return { sistolica, diastolica };
}

function formatIdealLabel(ideal) {
  if (!ideal) return '-';
  if (typeof ideal === 'string') return ideal;
  if (ideal.label) return ideal.label;
  if (ideal.type === 'pressure') return `${ideal.systolic}/${ideal.diastolic}`;
  if (ideal.min != null && ideal.max != null) return `${ideal.min}-${ideal.max}`;
  if (ideal.min != null) return `> ${ideal.min}`;
  if (ideal.max != null) return `< ${ideal.max}`;
  if (ideal.target != null) return String(ideal.target);
  return '-';
}

function formatVitalValue(vital) {
  if (!vital) return '-';
  if (vital.tipo === 'Pressão Arterial' && vital.valor && typeof vital.valor === 'object') {
    return `${vital.valor.sistolica}/${vital.valor.diastolica}`;
  }
  return String(vital.valor ?? '-');
}

function formatHistoricValue(vitalTipo, historicoItem) {
  if (vitalTipo === 'Pressão Arterial' && historicoItem && typeof historicoItem.valor === 'object') {
    return `${historicoItem.valor.sistolica}/${historicoItem.valor.diastolica}`;
  }
  return String(historicoItem?.valor ?? '-');
}

function formatISODateBR(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const [yyyy, mm, dd] = isoDate.split('-');
  if (!yyyy || !mm || !dd) return isoDate;
  return `${dd}/${mm}/${yyyy}`;
}

function formatISODateTimeBR(isoDateTime) {
  if (!isoDateTime || typeof isoDateTime !== 'string') return '';
  const parts = isoDateTime.split('T');
  if (parts.length !== 2) return formatISODateBR(isoDateTime);
  const date = formatISODateBR(parts[0]);
  const time = parts[1].slice(0, 5);
  return `${date} ${time}`;
}

function enrichItemDateFields(item) {
  if (!item || typeof item !== 'object') return;
  if (item.data) {
    const iso = toISODate(item.data);
    if (iso) item.data = iso;
    item.dataISO = item.data;
  }
  if (item.dataHora) {
    const parts = item.dataHora.split(' ');
    if (parts.length === 2) {
      const isoDateTime = toISODateTime(parts[0], parts[1]);
      if (isoDateTime) item.dataHora = isoDateTime;
    } else {
      const isoDate = toISODate(item.dataHora);
      if (isoDate) item.dataHora = `${isoDate}T00:00:00`;
    }
    item.dataHoraISO = item.dataHora;
  }
}

function normalizeMockDataForAnalysis(data) {
  // Sinais vitais
  data.sinaisVitais.forEach(vital => {
    enrichItemDateFields(vital);
    vital.ideal = parseIdealObject(vital.ideal);

    if (vital.tipo === 'Pressão Arterial') {
      const parsed = parsePressureValue(vital.valor);
      if (parsed) vital.valor = parsed;
    }

    if (Array.isArray(vital.historico)) {
      vital.historico.forEach(h => {
        if (h.data) {
          const isoDate = toISODate(h.data);
          if (isoDate) h.data = isoDate;
        }
        h.dataISO = h.data;
        h.dataHoraISO = toISODateTime(h.data, h.hora || '00:00');

        if (vital.tipo === 'Pressão Arterial') {
          const parsedValor = parsePressureValue(h.valor);
          const parsedAnterior = parsePressureValue(h.anterior);
          if (parsedValor) h.valor = parsedValor;
          if (parsedAnterior) h.anterior = parsedAnterior;
        }
      });
    }
  });

  // Composição corporal
  data.composicaoCorporal.forEach(item => {
    enrichItemDateFields(item);
    item.ideal = parseIdealObject(item.ideal);
    if (Array.isArray(item.historico)) {
      item.historico.forEach(h => {
        if (h.data) {
          const isoDate = toISODate(h.data);
          if (isoDate) h.data = isoDate;
        }
        h.dataISO = h.data;
      });
    }
  });

  // Medicações e histórico
  data.medicacoes.forEach(med => {
    med.dataInicio = toISODate(med.dataInicio) || med.dataInicio;
    med.dataFim = toISODate(med.dataFim) || med.dataFim;
    med.dataInicioISO = med.dataInicio;
    med.dataFimISO = med.dataFim;
    if (Array.isArray(med.historico)) {
      med.historico.forEach(h => {
        if (h.data) {
          const isoDate = toISODate(h.data);
          if (isoDate) h.data = isoDate;
        }
        h.dataISO = h.data;
        h.dataHoraISO = toISODateTime(h.data, h.hora || '00:00');
      });
    }
  });

  // Agenda / exames
  data.consultas.forEach(item => {
    item.data = toISODate(item.data) || item.data;
    item.dataISO = item.data;
    item.dataHoraISO = toISODateTime(item.data, item.hora || '00:00');
  });

  data.examesAgendados.forEach(item => {
    item.data = toISODate(item.data) || item.data;
    item.dataISO = item.data;
  });

  data.examesRealizados.forEach(item => {
    item.data = toISODate(item.data) || item.data;
    item.dataISO = item.data;
  });

  data.ecgs.forEach(item => {
    enrichItemDateFields(item);
    if (Array.isArray(item.historico)) {
      item.historico.forEach(h => {
        if (h.data) {
          const isoDate = toISODate(h.data);
          if (isoDate) h.data = isoDate;
        }
        h.dataISO = h.data;
        h.dataHoraISO = toISODateTime(h.data, h.hora || '00:00');
      });
    }
  });
}

normalizeMockDataForAnalysis(mockData);
