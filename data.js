// Dados Mockados - Sistema de Saúde
const mockData = {
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

  sinaisVitais: [
    { id: 1, tipo: 'Batimento Cardíaco', valor: 78, unidade: 'bpm', ideal: '60-100', fonte: 'Pulseira', tempo: 'Há 2 horas', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 14:30', icon: '🫀' },
    { id: 2, tipo: 'Pressão Arterial', valor: '125/82', unidade: 'mmHg', ideal: '120/80', fonte: 'Manual', tempo: 'Há 4 horas', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 12:15', icon: '🩸' },
    { id: 3, tipo: 'Temperatura', valor: 36.8, unidade: '°C', ideal: '36-37.5', fonte: 'Manual', tempo: 'Há 1 hora', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 15:45', icon: '🌡️' },
    { id: 4, tipo: 'Passos', valor: 8234, unidade: 'passos', ideal: '5000-15000', fonte: 'Google Fit', tempo: 'Hoje', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 23:59', icon: '👟' },
    { id: 5, tipo: 'Oxigenação', valor: 98, unidade: '%', ideal: '95-100', fonte: 'Pulseira', tempo: 'Há 30 min', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 16:00', icon: '💨' },
    { id: 6, tipo: 'Calorias', valor: 2100, unidade: 'kcal', ideal: '1800-2500', fonte: 'Google Fit', tempo: 'Hoje', categoria: 'saude', status: 'normal', dataHora: '25/01/2024 23:59', icon: '🔥' }
  ],

  medicacoes: [
    { 
      id: 1, 
      nome: 'Dipirona', 
      dosagem: '500mg', 
      horario: '14:30', 
      proximo: 'em 2h', 
      ultimo: '08:00 ✅', 
      estoque: '30 comprimidos', 
      aderencia: '95%', 
      frequencia: '3x ao dia',
      dataInicio: '2024-01-15',
      dataFim: '2024-02-15',
      valor: 15.50,
      estoqueMinimo: 7,
      categoria: 'medicacao',
      foto: 'Mensuri.png',
      historico: [
        { data: '2024-01-25', hora: '08:00', status: 'tomado' },
        { data: '2024-01-25', hora: '14:30', status: 'tomado' },
        { data: '2024-01-25', hora: '20:00', status: 'pendente' }
      ]
    },
    { 
      id: 2, 
      nome: 'Losartana', 
      dosagem: '50mg', 
      horario: '08:00', 
      proximo: 'amanhã', 
      ultimo: '08:00 ✅', 
      estoque: '28 comprimidos', 
      aderencia: '93%', 
      frequencia: '1x ao dia',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      valor: 45.00,
      estoqueMinimo: 5,
      categoria: 'medicacao',
      foto: 'Mensuri.png',
      historico: []
    },
    { 
      id: 3, 
      nome: 'Metformina', 
      dosagem: '850mg', 
      horario: '08:00', 
      proximo: 'em 6h', 
      ultimo: '08:00 ✅', 
      estoque: '60 comprimidos', 
      aderencia: '98%', 
      frequencia: '2x ao dia',
      dataInicio: '2024-01-10',
      dataFim: '2024-03-10',
      valor: 32.00,
      estoqueMinimo: 10,
      categoria: 'medicacao',
      foto: 'Mensuri.png',
      historico: []
    },
    { 
      id: 4, 
      nome: 'Atorvastatina', 
      dosagem: '20mg', 
      horario: '20:00', 
      proximo: 'em 8h', 
      ultimo: '20:00 ✅', 
      estoque: '25 comprimidos', 
      aderencia: '96%', 
      frequencia: '1x ao dia',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      valor: 28.50,
      estoqueMinimo: 5,
      categoria: 'medicacao',
      foto: 'Mensuri.png',
      historico: []
    },
    { 
      id: 5, 
      nome: 'Omeprazol', 
      dosagem: '20mg', 
      horario: '07:00', 
      proximo: 'amanhã', 
      ultimo: '07:00 ✅', 
      estoque: '28 comprimidos', 
      aderencia: '94%', 
      frequencia: '1x ao dia',
      dataInicio: '2024-01-05',
      dataFim: '2024-02-05',
      valor: 22.00,
      estoqueMinimo: 7,
      categoria: 'medicacao',
      foto: 'Mensuri.png',
      historico: []
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
      categoria: 'agenda'
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
      categoria: 'agenda'
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
  ]
};

// Cores por categoria - Paleta Padrão do Projeto
const categoryColors = {
  medicacao: {
    primary: '#9058A7',      // Roxo Principal
    light: '#E8D5F2',        // Roxo Claro
    border: '#7d4a8f',       // Roxo Escuro
    icon: '💊'
  },
  saude: {
    primary: '#7e91cd',      // Azul Secundário
    light: '#D4DFF0',        // Azul Claro
    border: '#5a6ba8',       // Azul Escuro
    icon: '❤️'
  },
  agenda: {
    primary: '#9058A7',      // Roxo Principal
    light: '#E8D5F2',        // Roxo Claro
    border: '#7d4a8f',       // Roxo Escuro
    icon: '📅'
  }
};

// Status colors
const statusColors = {
  normal: '#00AA00',
  atencao: '#FFFF00',
  aviso: '#FFA500',
  critico: '#FF0000'
};
