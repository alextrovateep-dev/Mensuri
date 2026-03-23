// Lógica da Aplicação

let currentScreen = 'homeScreen';
let fotoAtualMedicacao = null;
let fotoAtualMedicacaoEdit = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  renderHome();
  setupNavigation();
  setupMedicacaoModal();
  setupEditMedicacaoModal();
  setupAlarmModal();
  setupCompartilhamentoModal();
  setupVitalModals();
  setupFotoUpload();
  checkMedicationAlerts();
});

// Atualizar data
function updateDate() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');
  document.getElementById('date').textContent = dateStr;
  document.getElementById('greeting').textContent = `Olá, ${mockData.usuario.nome.split(' ')[0]}! 👋`;
}

// ===== RENDERIZAÇÃO DE TELAS =====

function renderHome() {
  const vitalsHtml = mockData.sinaisVitais.slice(0, 3).map(createVitalCard).join('');
  document.getElementById('homeVitals').innerHTML = vitalsHtml;

  const medsHtml = mockData.medicacoes.slice(0, 1).map(createMedicacaoCard).join('');
  document.getElementById('homeMeds').innerHTML = medsHtml;

  const consultaHtml = mockData.consultas.length > 0 
    ? createConsultaCard(mockData.consultas[0])
    : '<div class="empty-state"><div class="empty-text">Nenhuma consulta agendada</div></div>';
  document.getElementById('homeConsulta').innerHTML = consultaHtml;
}

function renderSaude() {
  const html = mockData.sinaisVitais.map(createVitalCard).join('');
  document.getElementById('saudeContent').innerHTML = html || 
    '<div class="empty-state"><div class="empty-text">Nenhum sinal vital registrado</div></div>';
}

function renderMedicacoes() {
  const html = mockData.medicacoes.map(createMedicacaoCard).join('');
  document.getElementById('medicacoesContent').innerHTML = html || 
    '<div class="empty-state"><div class="empty-text">Nenhuma medicação cadastrada</div></div>';
}

function renderAgenda() {
  let html = '';

  if (mockData.consultas.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="agenda-section-title">📅 Consultas Agendadas</div>';
    html += mockData.consultas.map(createConsultaCard).join('');
    html += '</div>';
  }

  if (mockData.examesAgendados.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="agenda-section-title">🔬 Exames Agendados</div>';
    html += mockData.examesAgendados.map(e => createExameCard(e, false)).join('');
    html += '</div>';
  }

  if (mockData.examesRealizados.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="agenda-section-title">✅ Exames Realizados</div>';
    html += mockData.examesRealizados.map(e => createExameCard(e, true)).join('');
    html += '</div>';
  }

  if (!html) {
    html = '<div class="empty-state"><div class="empty-text">Nenhum agendamento</div></div>';
  }

  document.getElementById('agendaContent').innerHTML = html;
}

function renderCompartilhamento() {
  let html = '';

  if (mockData.compartilhamentos.length > 0) {
    html = mockData.compartilhamentos.map(createCompartilhamentoCard).join('');
  } else {
    html = '<div class="empty-state"><div class="empty-text">Nenhum compartilhamento ativo</div></div>';
  }

  document.getElementById('compartilhamentoContent').innerHTML = html;
}

function renderCompartilhamentoInPerfil() {
  let html = '';

  if (mockData.compartilhamentos.length > 0) {
    html = mockData.compartilhamentos.map(createCompartilhamentoCard).join('');
  } else {
    html = '<div class="empty-state"><div class="empty-text">Nenhum compartilhamento ativo</div></div>';
  }

  const compartilhamentoContent = document.getElementById('compartilhamentoContent');
  if (compartilhamentoContent) {
    compartilhamentoContent.innerHTML = html;
  }
}

function renderPerfil() {
  const usuario = mockData.usuario;
  const diasVida = calcularIdade(usuario.dataNascimento);
  
  let html = `
    <div class="profile-card">
      <div class="profile-avatar">${categoryColors.saude.icon}</div>
      <div class="profile-info">
        <div class="profile-name">${usuario.nome}</div>
        <div class="profile-email">${usuario.email}</div>
        <div class="profile-email">CPF: ${usuario.cpf}</div>
        <div class="profile-email">Telefone: ${usuario.telefone}</div>
      </div>
    </div>

    <div class="section-title">⚙️ Configurações</div>
    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">📊</div>
        <div class="config-text">
          <div class="config-title">Cards do Dashboard</div>
          <div class="config-subtitle">Ativar/desativar cards</div>
        </div>
      </div>
      <div>›</div>
    </div>

    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">📈</div>
        <div class="config-text">
          <div class="config-title">Valores Ideais</div>
          <div class="config-subtitle">Configurar faixas de referência</div>
        </div>
      </div>
      <div>›</div>
    </div>

    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">🔔</div>
        <div class="config-text">
          <div class="config-title">Alertas</div>
          <div class="config-subtitle">Gerenciar notificações</div>
        </div>
      </div>
      <div>›</div>
    </div>

    <div class="section-title">📱 Dispositivos</div>
    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">⌚</div>
        <div class="config-text">
          <div class="config-title">Pulseira Inteligente</div>
          <div class="config-subtitle">✅ Conectada</div>
        </div>
      </div>
      <button class="toggle active"></button>
    </div>

    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">🔗</div>
        <div class="config-text">
          <div class="config-title">Google Fit</div>
          <div class="config-subtitle">✅ Conectado</div>
        </div>
      </div>
      <button class="toggle active"></button>
    </div>

    <div class="section-title">🔗 Compartilhamento</div>
    <button class="button button-confirm" id="addCompartilhamentoBtn">+ Compartilhar com Médico</button>

    <div id="compartilhamentoContent" style="margin-top: 16px;"></div>

    <div class="section-title">📋 Exames Realizados</div>
  `;

  if (mockData.examesRealizados.length > 0) {
    html += mockData.examesRealizados.map(e => createExameCard(e, true)).join('');
  } else {
    html += '<div class="empty-state"><div class="empty-text">Nenhum exame realizado</div></div>';
  }

  document.getElementById('perfilContent').innerHTML = html;
  
  document.getElementById('addCompartilhamentoBtn').addEventListener('click', () => {
    document.getElementById('addCompartilhamentoModal').classList.add('active');
  });

  renderCompartilhamentoInPerfil();
}

// ===== NAVEGAÇÃO =====

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const screenId = item.dataset.screen;
      switchScreen(screenId);
      
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  currentScreen = screenId;

  if (screenId === 'homeScreen') renderHome();
  else if (screenId === 'saudeScreen') renderSaude();
  else if (screenId === 'medicacoesScreen') renderMedicacoes();
  else if (screenId === 'agendaScreen') renderAgenda();
  else if (screenId === 'perfilScreen') renderPerfil();
}

// ===== MODAL DE MEDICAÇÃO =====

function setupMedicacaoModal() {
  const addNewMedBtn = document.getElementById('addMedBtn');
  const addModal = document.getElementById('addMedicacaoModal');
  const closeAddModal = document.getElementById('closeAddModal');
  const cancelAddBtn = document.getElementById('cancelAddBtn');
  const addForm = document.getElementById('addMedicacaoForm');

  addNewMedBtn.addEventListener('click', () => {
    addModal.classList.add('active');
  });

  closeAddModal.addEventListener('click', () => {
    addModal.classList.remove('active');
    addForm.reset();
  });

  cancelAddBtn.addEventListener('click', () => {
    addModal.classList.remove('active');
    addForm.reset();
  });

  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
      addModal.classList.remove('active');
      addForm.reset();
    }
  });

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeMedInput').value;
    const dosagem = document.getElementById('dosagemMedInput').value;
    const frequencia = document.getElementById('frequenciaMedInput').value;
    const horario = document.getElementById('horarioMedInput').value;
    const estoque = document.getElementById('estoqueMedInput').value;
    const dataInicio = document.getElementById('dataInicioMedInput').value;
    const dataFim = document.getElementById('dataFimMedInput').value;
    const valor = document.getElementById('valorMedInput').value;
    const estoqueMinimo = document.getElementById('estoqueMinMedInput').value;

    const newId = Math.max(...mockData.medicacoes.map(m => m.id), 0) + 1;
    mockData.medicacoes.push({
      id: newId,
      nome,
      dosagem,
      horario,
      proximo: 'em breve',
      ultimo: 'Nunca',
      estoque,
      aderencia: '0%',
      frequencia,
      dataInicio,
      dataFim,
      valor: parseFloat(valor),
      estoqueMinimo: parseInt(estoqueMinimo),
      categoria: 'medicacao',
      foto: fotoAtualMedicacao,
      historico: []
    });

    alert(`✅ ${nome} ${dosagem} adicionado com sucesso!`);
    addModal.classList.remove('active');
    addForm.reset();
    fotoAtualMedicacao = null;
    if (document.getElementById('photoPreview')) {
      document.getElementById('photoPreview').style.display = 'none';
      document.getElementById('photoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'block';
    }
    renderMedicacoes();
  });
}

// ===== MODAL DE ALARME =====

function setupAlarmModal() {
  const alarmModal = document.getElementById('alarmModal');
  const dismissBtn = document.getElementById('dismissAlarmBtn');
  const takeBtn = document.getElementById('takeAlarmBtn');

  dismissBtn.addEventListener('click', () => {
    alarmModal.classList.remove('active');
  });

  takeBtn.addEventListener('click', () => {
    const medName = document.getElementById('alarmMedName').textContent;
    alert(`✅ ${medName} marcado como tomado!`);
    alarmModal.classList.remove('active');
  });
}

function showAlarmExample(medicacaoId) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (medicacao) {
    document.getElementById('alarmMedName').textContent = `${medicacao.nome} ${medicacao.dosagem}`;
    document.getElementById('alarmTime').textContent = medicacao.horario;
    document.getElementById('alarmModal').classList.add('active');
  }
}

// ===== MODAL DE COMPARTILHAMENTO =====

function setupCompartilhamentoModal() {
  const modal = document.getElementById('addCompartilhamentoModal');
  const closeBtn = document.getElementById('closeCompartilhamentoModal');
  const cancelBtn = document.getElementById('cancelCompartilhamentoBtn');
  const form = document.getElementById('addCompartilhamentoForm');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const medico = document.getElementById('medicoCompartilhamentoInput').value;
    const especialidade = document.getElementById('especialidadeCompartilhamentoInput').value;
    const dados = Array.from(document.querySelectorAll('input[name="dados"]:checked')).map(el => el.value);

    if (dados.length === 0) {
      alert('Selecione pelo menos um tipo de dado para compartilhar');
      return;
    }

    const newId = Math.max(...mockData.compartilhamentos.map(c => c.id), 0) + 1;
    mockData.compartilhamentos.push({
      id: newId,
      medico,
      especialidade,
      dadosCompartilhados: dados,
      dataAutorizacao: new Date().toLocaleDateString('pt-BR'),
      ativo: true
    });

    alert(`✅ Dados compartilhados com ${medico}!`);
    modal.classList.remove('active');
    form.reset();
    renderCompartilhamentoInPerfil();
  });
}

// ===== MODAL DE SINAL VITAL =====

let currentVitalType = '';

function setupVitalModals() {
  const addVitalModal = document.getElementById('addVitalModal');
  const closeAddVitalBtn = document.getElementById('closeAddVitalModal');
  const cancelAddVitalBtn = document.getElementById('cancelAddVitalBtn');
  const addVitalForm = document.getElementById('addVitalForm');

  const historyModal = document.getElementById('vitalHistoryModal');
  const closeHistoryBtn = document.getElementById('closeHistoryModal');

  closeAddVitalBtn.addEventListener('click', () => {
    addVitalModal.classList.remove('active');
    addVitalForm.reset();
  });

  cancelAddVitalBtn.addEventListener('click', () => {
    addVitalModal.classList.remove('active');
    addVitalForm.reset();
  });

  addVitalModal.addEventListener('click', (e) => {
    if (e.target === addVitalModal) {
      addVitalModal.classList.remove('active');
      addVitalForm.reset();
    }
  });

  addVitalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = document.getElementById('valorVitalInput').value;
    const unidade = document.getElementById('unidadeVitalInput').value;
    const fonte = document.getElementById('fonteVitalInput').value;

    const vital = mockData.sinaisVitais.find(v => v.tipo === currentVitalType);
    if (vital) {
      vital.valor = valor;
      vital.unidade = unidade;
      vital.fonte = fonte;
      vital.tempo = 'Agora';
    }

    alert(`✅ ${currentVitalType} adicionado com sucesso!`);
    addVitalModal.classList.remove('active');
    addVitalForm.reset();
    renderSaude();
  });

  closeHistoryBtn.addEventListener('click', () => {
    historyModal.classList.remove('active');
  });

  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
      historyModal.classList.remove('active');
    }
  });
}

function openAddVitalModal(tipoVital) {
  currentVitalType = tipoVital;
  document.getElementById('tipoVitalInput').value = tipoVital;
  document.getElementById('addVitalModal').classList.add('active');
}

function openVitalHistoryModal(tipoVital) {
  currentVitalType = tipoVital;
  document.getElementById('historyTitle').textContent = `Histórico de ${tipoVital}`;
  document.getElementById('filterFonteInput').value = '';
  document.getElementById('filterDataInicio').value = '';
  document.getElementById('filterDataFim').value = '';
  
  const historico = [
    { data: '2024-01-25', hora: '14:30', valor: '125/82', fonte: 'Manual' },
    { data: '2024-01-24', hora: '10:15', valor: '120/80', fonte: 'Pulseira' },
    { data: '2024-01-23', hora: '09:00', valor: '122/81', fonte: 'Manual' },
    { data: '2024-01-22', hora: '14:45', valor: '128/85', fonte: 'Manual' },
    { data: '2024-01-21', hora: '08:30', valor: '119/79', fonte: 'Pulseira' },
    { data: '2024-01-20', hora: '15:00', valor: '121/80', fonte: 'Google Fit' },
    { data: '2024-01-19', hora: '09:30', valor: '123/82', fonte: 'Manual' },
    { data: '2024-01-18', hora: '11:00', valor: '120/79', fonte: 'Pulseira' },
    { data: '2024-01-17', hora: '14:15', valor: '126/84', fonte: 'Manual' },
    { data: '2024-01-16', hora: '08:45', valor: '118/78', fonte: 'Google Fit' }
  ];

  renderHistoryContent(historico);
  document.getElementById('vitalHistoryModal').classList.add('active');
}

function renderHistoryContent(historico) {
  if (historico.length === 0) {
    document.getElementById('historyContent').innerHTML = '<div class="empty-state"><div class="empty-text">Nenhum registro encontrado</div></div>';
    return;
  }

  const html = historico.map(h => {
    const [ano, mes, dia] = h.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    return `
      <div class="card card-saude" style="margin-bottom: 8px;">
        <div class="card-info"><strong>${dataFormatada} às ${h.hora}</strong></div>
        <div class="card-value" style="color: #7e91cd; font-size: 16px;">${h.valor}</div>
        <div class="card-info">Fonte: ${h.fonte}</div>
      </div>
    `;
  }).join('');
  document.getElementById('historyContent').innerHTML = html;
}

function filterVitalHistory() {
  const filtroFonte = document.getElementById('filterFonteInput').value;
  const dataInicio = document.getElementById('filterDataInicio').value;
  const dataFim = document.getElementById('filterDataFim').value;

  const historico = [
    { data: '2024-01-25', hora: '14:30', valor: '125/82', fonte: 'Manual' },
    { data: '2024-01-24', hora: '10:15', valor: '120/80', fonte: 'Pulseira' },
    { data: '2024-01-23', hora: '09:00', valor: '122/81', fonte: 'Manual' },
    { data: '2024-01-22', hora: '14:45', valor: '128/85', fonte: 'Manual' },
    { data: '2024-01-21', hora: '08:30', valor: '119/79', fonte: 'Pulseira' },
    { data: '2024-01-20', hora: '15:00', valor: '121/80', fonte: 'Google Fit' },
    { data: '2024-01-19', hora: '09:30', valor: '123/82', fonte: 'Manual' },
    { data: '2024-01-18', hora: '11:00', valor: '120/79', fonte: 'Pulseira' },
    { data: '2024-01-17', hora: '14:15', valor: '126/84', fonte: 'Manual' },
    { data: '2024-01-16', hora: '08:45', valor: '118/78', fonte: 'Google Fit' }
  ];

  let filtrado = historico;

  if (filtroFonte) {
    filtrado = filtrado.filter(h => h.fonte === filtroFonte);
  }

  if (dataInicio) {
    filtrado = filtrado.filter(h => h.data >= dataInicio);
  }

  if (dataFim) {
    filtrado = filtrado.filter(h => h.data <= dataFim);
  }

  renderHistoryContent(filtrado);
}

// ===== AÇÕES DE MEDICAÇÃO =====

function markAsTaken(medicacaoId) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (medicacao) {
    const now = new Date();
    const hora = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    medicacao.ultimo = `${hora} ✅`;
    medicacao.historico.push({
      data: now.toLocaleDateString('pt-BR'),
      hora: hora,
      status: 'tomado'
    });
    renderMedicacoes();
    alert(`✅ ${medicacao.nome} marcado como tomado às ${hora}`);
  }
}

function editMedicacao(medicacaoId) {
  alert('Funcionalidade de edição em desenvolvimento');
}

// ===== FUNÇÕES AUXILIARES =====

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function testAlarm() {
  if (mockData.medicacoes.length > 0) {
    showAlarmExample(mockData.medicacoes[0].id);
  }
}

// ===== EDITAR MEDICAÇÃO =====

let currentEditMedId = null;

function setupEditMedicacaoModal() {
  const modal = document.getElementById('editMedicacaoModal');
  const closeBtn = document.getElementById('closeEditModal');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('editMedicacaoForm');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('editNomeMedInput').value;
    const dosagem = document.getElementById('editDosagemMedInput').value;
    const frequencia = document.getElementById('editFrequenciaMedInput').value;
    const horario = document.getElementById('editHorarioMedInput').value;
    const dataFim = document.getElementById('editDataFimMedInput').value;
    const valor = document.getElementById('editValorMedInput').value;
    const estoqueMinimo = document.getElementById('editEstoqueMinMedInput').value;

    const med = mockData.medicacoes.find(m => m.id === currentEditMedId);
    if (med) {
      med.nome = nome;
      med.dosagem = dosagem;
      med.frequencia = frequencia;
      med.horario = horario;
      med.dataFim = dataFim;
      med.valor = parseFloat(valor);
      med.estoqueMinimo = parseInt(estoqueMinimo);
      if (fotoAtualMedicacaoEdit) {
        med.foto = fotoAtualMedicacaoEdit;
      }
    }

    alert(`✅ ${nome} atualizado com sucesso!`);
    modal.classList.remove('active');
    form.reset();
    fotoAtualMedicacaoEdit = null;
    renderMedicacoes();
  });
}

function openEditMedicacaoModal(medicacaoId) {
  const med = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (med) {
    currentEditMedId = medicacaoId;
    document.getElementById('editNomeMedInput').value = med.nome;
    document.getElementById('editDosagemMedInput').value = med.dosagem;
    document.getElementById('editFrequenciaMedInput').value = med.frequencia;
    document.getElementById('editHorarioMedInput').value = med.horario;
    document.getElementById('editDataFimMedInput').value = med.dataFim;
    document.getElementById('editValorMedInput').value = med.valor;
    document.getElementById('editEstoqueMinMedInput').value = med.estoqueMinimo || 7;
    document.getElementById('editMedicacaoModal').classList.add('active');
  }
}

// ===== ALERTAS DE HORÁRIO =====

function checkMedicationAlerts() {
  const agora = new Date();
  const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');

  mockData.medicacoes.forEach(med => {
    if (med.horario === horaAtual) {
      showAlarmExample(med.id);
    }
  });
}

setInterval(checkMedicationAlerts, 60000);
window.addEventListener('load', checkMedicationAlerts);

// ===== GERENCIAR FOTO DE MEDICACAO =====

function setupFotoUpload() {
  const fotoInput = document.getElementById('fotoMedInput');
  const editFotoInput = document.getElementById('editFotoMedInput');
  
  if (fotoInput) {
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fotoAtualMedicacao = event.target.result;
          document.getElementById('photoPreview').style.display = 'block';
          document.getElementById('photoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'none';
          document.getElementById('photoPreviewImg').src = fotoAtualMedicacao;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  if (editFotoInput) {
    editFotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fotoAtualMedicacaoEdit = event.target.result;
          document.getElementById('editPhotoPreview').style.display = 'block';
          document.getElementById('editPhotoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'none';
          document.getElementById('editPhotoPreviewImg').src = fotoAtualMedicacaoEdit;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function removerFoto() {
  fotoAtualMedicacao = null;
  document.getElementById('fotoMedInput').value = '';
  document.getElementById('photoPreview').style.display = 'none';
  document.getElementById('photoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'block';
}

function removerFotoEdit() {
  fotoAtualMedicacaoEdit = null;
  document.getElementById('editFotoMedInput').value = '';
  document.getElementById('editPhotoPreview').style.display = 'none';
  document.getElementById('editPhotoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'block';
}


// ===== MODAL DE AGENDAMENTO =====

function setupAgendaModal() {
  const addAgendaBtn = document.getElementById('addAgendaBtn');
  const addAgendaModal = document.getElementById('addAgendaModal');
  const closeAddAgendaModal = document.getElementById('closeAddAgendaModal');
  const cancelAddAgendaBtn = document.getElementById('cancelAddAgendaBtn');
  const addAgendaForm = document.getElementById('addAgendaForm');

  addAgendaBtn.addEventListener('click', () => {
    addAgendaModal.classList.add('active');
  });

  closeAddAgendaModal.addEventListener('click', () => {
    addAgendaModal.classList.remove('active');
    addAgendaForm.reset();
  });

  cancelAddAgendaBtn.addEventListener('click', () => {
    addAgendaModal.classList.remove('active');
    addAgendaForm.reset();
  });

  addAgendaModal.addEventListener('click', (e) => {
    if (e.target === addAgendaModal) {
      addAgendaModal.classList.remove('active');
      addAgendaForm.reset();
    }
  });

  addAgendaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipoAgendaInput').value;
    const nome = document.getElementById('nomeAgendaInput').value;
    const medico = document.getElementById('medicoAgendaInput').value;
    const especialidade = document.getElementById('especialidadeAgendaInput').value;
    const data = document.getElementById('dataAgendaInput').value;
    const horario = document.getElementById('horarioAgendaInput').value;
    const local = document.getElementById('localAgendaInput').value;
    const tipoAtendimento = document.getElementById('tipoAtendimentoInput').value;
    const motivo = document.getElementById('motivoAgendaInput').value;

    if (tipo === 'consulta') {
      const newId = Math.max(...mockData.consultas.map(c => c.id), 0) + 1;
      mockData.consultas.push({
        id: newId,
        medico,
        especialidade,
        data,
        hora: horario,
        tipo: tipoAtendimento,
        status: 'Agendado',
        local,
        motivo: motivo || 'Consulta',
        categoria: 'agenda'
      });
    } else if (tipo === 'exame') {
      const newId = Math.max(...mockData.examesAgendados.map(e => e.id), 0) + 1;
      mockData.examesAgendados.push({
        id: newId,
        nome,
        data,
        local,
        medico,
        status: 'Agendado',
        categoria: 'agenda'
      });
    }

    alert(`✅ ${nome || 'Agendamento'} adicionado com sucesso!`);
    addAgendaModal.classList.remove('active');
    addAgendaForm.reset();
    renderAgenda();
  });
}
