let currentScreen = 'homeScreen';
let fotoAtualMedicacao = null;
let fotoAtualMedicacaoEdit = null;
let currentVitalType = '';
let currentVitalDetail = null;
let lastMedicationAlertKey = null;
let lastVitalAlertKey = null;
let lastRescheduleAlertKey = null;

function getTodayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function formatDateForUI(isoDate) {
  return typeof formatISODateBR === 'function' ? formatISODateBR(isoDate) : isoDate;
}

function formatDateTimeForUI(isoDateTime) {
  return typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(isoDateTime) : isoDateTime;
}

function getIdealLabel(value) {
  return typeof formatIdealLabel === 'function' ? formatIdealLabel(value) : value;
}

function toIdealObjectFromInput(value) {
  return typeof parseIdealObject === 'function' ? parseIdealObject(value) : value;
}

function showSystemToast(message, type = 'success') {
  let toast = document.getElementById('systemToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'systemToast';
    toast.className = 'system-toast';
    document.body.appendChild(toast);
  }

  toast.classList.remove('success', 'warning', 'show');
  toast.classList.add(type);
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('show'));

  if (toast._hideTimer) clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function showFeedbackModal(message, type = 'info', title = '') {
  const modal = document.getElementById('feedbackModal');
  const iconEl = document.getElementById('feedbackModalIcon');
  const titleEl = document.getElementById('feedbackModalTitle');
  const messageEl = document.getElementById('feedbackModalMessage');
  const contentEl = modal ? modal.querySelector('.feedback-modal-content') : null;
  if (!modal || !iconEl || !titleEl || !messageEl || !contentEl) {
    showSystemToast(message, type === 'error' ? 'warning' : 'success');
    return;
  }

  const config = {
    success: { icon: '✅', title: 'Concluido' },
    warning: { icon: '⚠️', title: 'Aviso' },
    error: { icon: '❌', title: 'Erro' },
    info: { icon: 'ℹ️', title: 'Informacao' }
  };
  const current = config[type] || config.info;

  contentEl.classList.remove('type-success', 'type-warning', 'type-error');
  if (type === 'success') contentEl.classList.add('type-success');
  if (type === 'warning') contentEl.classList.add('type-warning');
  if (type === 'error') contentEl.classList.add('type-error');

  iconEl.textContent = current.icon;
  titleEl.textContent = title || current.title;
  messageEl.textContent = message;
  modal.classList.add('active');
}

// Fallback global: qualquer alert nativo vira modal padrão.
if (typeof window !== 'undefined') {
  window.alert = function(message) {
    showFeedbackModal(String(message || ''), 'info');
  };
}

function getMedicationStatusForDate(med, dateISO, horario, nowHHMM = null) {
  const registro = med.historico.find(h => h.data === dateISO && h.hora === horario);
  if (registro && registro.status === 'tomado') return 'tomado';

  if (dateISO < getTodayISODate()) return 'atrasado';
  if (dateISO === getTodayISODate()) {
    const currentTime = nowHHMM || getCurrentHHMM();
    if (horario < currentTime) return 'atrasado';
  }
  return 'pendente';
}

function getMedicationDayEntries(dateISO) {
  const nowHHMM = getCurrentHHMM();
  const entries = [];

  mockData.medicacoes.forEach(med => {
    med.horarios.forEach(horario => {
      entries.push({
        medId: med.id,
        nome: med.nome,
        dosagem: med.dosagem,
        horario,
        status: getMedicationStatusForDate(med, dateISO, horario, nowHHMM)
      });
    });
  });

  entries.sort((a, b) => a.horario.localeCompare(b.horario));
  return entries;
}

function ensureBottomNavConfig() {
  if (!mockData.configBottomNav) {
    mockData.configBottomNav = {};
  }

  const defaults = {
    saudeScreen: true,
    composicaoScreen: true,
    medicacoesScreen: true,
    agendaScreen: true
  };

  Object.keys(defaults).forEach((screenId) => {
    if (typeof mockData.configBottomNav[screenId] !== 'boolean') {
      mockData.configBottomNav[screenId] = defaults[screenId];
    }
  });
}

function applyBottomNavVisibility() {
  ensureBottomNavConfig();

  const config = mockData.configBottomNav;
  const controlledScreens = ['saudeScreen', 'composicaoScreen', 'medicacoesScreen', 'agendaScreen'];

  controlledScreens.forEach((screenId) => {
    const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
    if (!navItem) return;
    navItem.style.display = config[screenId] ? '' : 'none';
  });

  if (currentScreen && controlledScreens.includes(currentScreen) && !config[currentScreen]) {
    switchScreen('homeScreen');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const homeNavItem = document.querySelector('.nav-item[data-screen="homeScreen"]');
    if (homeNavItem) homeNavItem.classList.add('active');
  }
}

function toggleBottomNavItem(screenId, toggleEl) {
  ensureBottomNavConfig();
  const isEnabled = !!mockData.configBottomNav[screenId];
  mockData.configBottomNav[screenId] = !isEnabled;

  if (toggleEl) {
    toggleEl.classList.toggle('active', mockData.configBottomNav[screenId]);
  }

  applyBottomNavVisibility();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  ensureBottomNavConfig();
  updateDate();
  renderHome();
  setupNavigation();
  applyBottomNavVisibility();
  setupEcgDetailModal();
  setupMedicacaoModal();
  setupEditMedicacaoModal();
  setupAlarmModal();
  setupVitalAlarmModal();
  setupCompartilhamentoModal();
  setupVitalModals();
  setupFotoUpload();
  checkMedicationAlerts();
  checkRescheduledMeasurementAlerts();
});

// Atualizar data
function updateDate() {
  const today = new Date();
  const dateStr = formatDateForUI(today.toISOString().slice(0, 10));
  document.getElementById('date').textContent = dateStr;
  document.getElementById('greeting').textContent = `Olá, ${mockData.usuario.nome.split(' ')[0]}! 👋`;
}

// ===== RENDERIZAÇÃO DE TELAS =====

function renderHome() {
  const hoje = getTodayISODate();
  const agoraHHMM = getCurrentHHMM();
  const dayEntries = getMedicationDayEntries(hoje);
  const atrasadas = dayEntries.filter(e => e.status === 'atrasado');
  const proximas = dayEntries.filter(e => e.status === 'pendente').slice(0, 2);

  const nowHtml = `
    <div class="home-priority-grid">
      <div class="home-priority-card ${atrasadas.length ? 'warning' : 'ok'}" onclick="switchScreen('medicacoesScreen')">
        <div class="home-priority-label">Atrasadas</div>
        <div class="home-priority-value">${atrasadas.length}</div>
      </div>
      <div class="home-priority-card" onclick="switchScreen('medicacoesScreen')">
        <div class="home-priority-label">Proxima dose</div>
        <div class="home-priority-value">${proximas[0] ? proximas[0].horario : '--:--'}</div>
        <div class="home-priority-sub">${proximas[0] ? `${proximas[0].nome} ${proximas[0].dosagem}` : 'Sem pendencias'}</div>
      </div>
    </div>
  `;
  document.getElementById('homeNow').innerHTML = nowHtml;

  const tomadasHoje = dayEntries.filter(e => e.status === 'tomado').length;
  const pendentesHoje = dayEntries.filter(e => e.status !== 'tomado').length;
  const todayHtml = `
    <div class="home-today-row">
      <div class="home-today-chip">Tomadas: ${tomadasHoje}</div>
      <div class="home-today-chip">Pendentes: ${pendentesHoje}</div>
      <div class="home-today-chip">Hora atual: ${agoraHHMM}</div>
    </div>
  `;
  document.getElementById('homeToday').innerHTML = todayHtml;

  const vitalsHtml = mockData.sinaisVitais
    .filter(v => (mockData.configSinaisVitais[v.tipo] || {}).exibirDashboard)
    .slice(0, 3)
    .map(createVitalCard).join('');
  document.getElementById('homeVitals').innerHTML = vitalsHtml || '<div class="card-info" style="padding:8px;">Nenhum sinal configurado para o Dashboard.</div>';

  const consultaHtml = mockData.consultas.length > 0
    ? createConsultaCard(mockData.consultas[0])
    : '<div class="empty-state"><div class="empty-text">Nenhuma consulta agendada</div></div>';
  document.getElementById('homeConsulta').innerHTML = consultaHtml;
}

function renderSaude() {
  const ativos = mockData.sinaisVitais
    .filter(v => (mockData.configSinaisVitais[v.tipo] || {}).exibirSaude !== false);

  const isOutOfIdeal = (v) => {
    if (!v || v.valor == null || !v.ideal) return false;
    const ideal = v.ideal;
    const getNum = (val) => {
      if (v.tipo === 'Pressão Arterial') {
        if (val && typeof val === 'object' && val.sistolica != null) return parseFloat(val.sistolica);
        if (typeof val === 'string' && val.includes('/')) return parseFloat(val.split('/')[0]);
      }
      const n = parseFloat(val);
      return Number.isNaN(n) ? null : n;
    };
    const current = getNum(v.valor);
    if (current == null) return false;

    if (ideal.type === 'range' && ideal.min != null && ideal.max != null) return current < ideal.min || current > ideal.max;
    if (ideal.type === 'max' && ideal.max != null) return current > ideal.max;
    if (ideal.type === 'min' && ideal.min != null) return current < ideal.min;
    if (ideal.type === 'target' && ideal.target != null) return current !== ideal.target;
    if (ideal.type === 'pressure' && ideal.systolic != null) return current > ideal.systolic;
    return false;
  };

  const foraDoIdeal = ativos.filter(isOutOfIdeal);
  const principaisTipos = new Set(['Pressão Arterial', 'Batimento Cardíaco', 'Oxigenação', 'Glicemia', 'Sono']);
  const principais = ativos.filter(v => !foraDoIdeal.includes(v) && principaisTipos.has(v.tipo));
  const outros = ativos.filter(v => !foraDoIdeal.includes(v) && !principaisTipos.has(v.tipo));

  let html = '';

  if (foraDoIdeal.length) {
    html += `<div class="subsection-title">Fora do ideal</div>`;
    html += foraDoIdeal.map(createVitalCard).join('');
  }

  if (principais.length) {
    html += `<div class="subsection-title">Principais</div>`;
    html += principais.map(createVitalCard).join('');
  }

  if (outros.length) {
    html += `<div class="subsection-title">Outros</div>`;
    html += outros.map(createVitalCard).join('');
  }

  if (mockData.ecgs.length > 0) {
    html += '<div class="subsection-title">Eletrocardiograma</div>';
    html += mockData.ecgs.map(createEcgCard).join('');
  }

  document.getElementById('saudeContent').innerHTML = html ||
    '<div class="empty-state"><div class="empty-text">Nenhum sinal ativo</div></div>';
}

function renderMedicacoes() {
  const today = getTodayISODate();
  const nowHHMM = getCurrentHHMM();

  const ordered = [...mockData.medicacoes].sort((a, b) => {
    const nextA = a.horarios.find(h => getMedicationStatusForDate(a, today, h, nowHHMM) !== 'tomado');
    const nextB = b.horarios.find(h => getMedicationStatusForDate(b, today, h, nowHHMM) !== 'tomado');
    if (!nextA && !nextB) return a.nome.localeCompare(b.nome);
    if (!nextA) return 1;
    if (!nextB) return -1;
    return nextA.localeCompare(nextB);
  });

  const dayEntries = getMedicationDayEntries(today);
  const overdueCount = dayEntries.filter(e => e.status === 'atrasado').length;
  const pendingCount = dayEntries.filter(e => e.status === 'pendente').length;
  const activeTodayIds = new Set(dayEntries.filter(e => e.status !== 'tomado').map(e => e.medId));

  const hojeList = ordered.filter(m => activeTodayIds.has(m.id));
  const hojeHtml = hojeList.map(createMedicacaoCard).join('');
  document.getElementById('medicacoesHoje').innerHTML = hojeHtml ||
    '<div class="empty-state"><div class="empty-text">Nenhuma dose pendente para hoje.</div></div>';

  const helperEl = document.getElementById('medTodayHelper');
  if (helperEl) {
    helperEl.textContent = `Toque no horario para marcar como tomado. Para incluir um novo remedio, use "+ Adicionar". ${overdueCount} atrasada(s) e ${pendingCount} pendente(s).`;
  }

  const cadastros = [...mockData.medicacoes].sort((a, b) => a.nome.localeCompare(b.nome));
  const cadHtml = cadastros.map(createMedicacaoManageRow).join('');
  document.getElementById('medicacoesCadastros').innerHTML = cadHtml ||
    '<div class="empty-state"><div class="empty-text">Nenhuma medicação cadastrada</div></div>';

  renderMedicationOverdueSection();
  updateMedicationCalendarHeader();
}

function createMedicacaoManageRow(med) {
  const catalog = (typeof mockData !== 'undefined' && mockData.catalogoMedicamentos)
    ? mockData.catalogoMedicamentos.find(m => m.nome === med.nome)
    : null;
  const photoValue = med.foto || (catalog && catalog.foto) || '💊';
  const isPhotoImage = typeof photoValue === 'string' && photoValue.startsWith('data:');
  const photoHtml = typeof photoValue === 'string' && photoValue.startsWith('data:')
    ? `<img src="${photoValue}" alt="Foto do medicamento ${med.nome}">`
    : `<span class="med-photo-emoji" aria-hidden="true">${photoValue}</span>`;

  return `
    <div class="med-manage-row">
      <div class="med-manage-left">
        <button class="med-manage-photo ${isPhotoImage ? 'is-clickable' : ''}" type="button" ${isPhotoImage ? `onclick="openMedicationPhotoModalById(${med.id}); event.stopPropagation();"` : ''} title="${isPhotoImage ? 'Ver foto do medicamento' : 'Sem foto cadastrada'}">
          ${photoHtml}
        </button>
        <div class="med-manage-text">
          <div class="med-manage-name">${med.nome}</div>
          <div class="med-manage-sub">${med.dosagem}</div>
        </div>
      </div>
      <div class="med-manage-actions">
        <button class="med-action-btn-enhanced" onclick="openEditMedicacaoModal(${med.id})" title="Editar">✏️</button>
        <button class="med-action-btn-enhanced" onclick="deleteMedicacao(${med.id})" title="Deletar">🗑️</button>
      </div>
    </div>
  `;
}

function renderAgenda() {
  let html = '';

  const consultasOrdenadas = [...mockData.consultas].sort((a, b) => (a.data + ' ' + (a.hora || '00:00')).localeCompare(b.data + ' ' + (b.hora || '00:00')));
  const examesAgendadosOrdenados = [...mockData.examesAgendados].sort((a, b) => (a.data || '').localeCompare(b.data || ''));
  const proximos = [...consultasOrdenadas.map(c => ({ tipo: 'consulta', item: c })), ...examesAgendadosOrdenados.map(e => ({ tipo: 'exame', item: e }))]
    .sort((a, b) => {
      const aKey = a.tipo === 'consulta' ? `${a.item.data} ${(a.item.hora || '00:00')}` : `${a.item.data} 00:00`;
      const bKey = b.tipo === 'consulta' ? `${b.item.data} ${(b.item.hora || '00:00')}` : `${b.item.data} 00:00`;
      return aKey.localeCompare(bKey);
    });

  if (proximos.length > 0) {
    const primeiro = proximos[0];
    html += '<div class="agenda-section">';
    html += '<div class="subsection-title">Próximo compromisso</div>';
    html += primeiro.tipo === 'consulta'
      ? createConsultaCard(primeiro.item)
      : createExameCard(primeiro.item, false);
    html += '</div>';
  }

  if (consultasOrdenadas.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="subsection-title">Consultas agendadas</div>';
    html += consultasOrdenadas.map(createConsultaCard).join('');
    html += '</div>';
  }

  if (examesAgendadosOrdenados.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="subsection-title">Exames agendados</div>';
    html += examesAgendadosOrdenados.map(e => createExameCard(e, false)).join('');
    html += '</div>';
  }

  if (mockData.examesRealizados.length > 0) {
    html += '<div class="agenda-section">';
    html += '<div class="subsection-title">Exames realizados</div>';
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
  ensureBottomNavConfig();

  const navControlItems = [
    { screenId: 'saudeScreen', icon: '❤️', title: 'Saúde', subtitle: 'Mostrar no menu inferior' },
    { screenId: 'composicaoScreen', icon: '📊', title: 'Corpo', subtitle: 'Mostrar no menu inferior' },
    { screenId: 'medicacoesScreen', icon: '💊', title: 'Medicações', subtitle: 'Mostrar no menu inferior' },
    { screenId: 'agendaScreen', icon: '📅', title: 'Agenda', subtitle: 'Mostrar no menu inferior' }
  ];
  const navControlsHtml = navControlItems.map(item => `
    <div class="config-item">
      <div class="config-item-content">
        <div class="config-icon">${item.icon}</div>
        <div class="config-text">
          <div class="config-title">${item.title}</div>
          <div class="config-subtitle">${item.subtitle}</div>
        </div>
      </div>
      <button
        class="toggle ${mockData.configBottomNav[item.screenId] ? 'active' : ''}"
        onclick="toggleBottomNavItem('${item.screenId}', this)"
        aria-label="Alternar exibição de ${item.title} no menu"
      ></button>
    </div>
  `).join('');
  
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
    <div class="config-item" onclick="openMeusIndicadoresModal()" style="cursor:pointer;">
      <div class="config-item-content">
        <div class="config-icon">📋</div>
        <div class="config-text">
          <div class="config-title">Meus Indicadores</div>
          <div class="config-subtitle">Gerenciar sinais vitais e composição</div>
        </div>
      </div>
      <div>›</div>
    </div>

    <div class="config-item" onclick="openAlertasModal()" style="cursor:pointer;">
      <div class="config-item-content">
        <div class="config-icon">🔔</div>
        <div class="config-text">
          <div class="config-title">Alertas</div>
          <div class="config-subtitle">Central de alertas configurados</div>
        </div>
      </div>
      <div>›</div>
    </div>

    <div class="section-title">🧭 Itens do Menu</div>
    ${navControlsHtml}

    <div class="section-title">📱 Dispositivos</div>
    <button class="button button-confirm" id="addDispositivoBtn" style="margin-bottom: 12px;">+ Cadastrar Dispositivo</button>
    <div id="dispositivosContent"></div>

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

  document.getElementById('addDispositivoBtn').addEventListener('click', openAddDispositivoModal);

  renderCompartilhamentoInPerfil();
  renderDispositivos();
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
  else if (screenId === 'composicaoScreen') renderComposicao();
  else if (screenId === 'medicacoesScreen') renderMedicacoes();
  else if (screenId === 'agendaScreen') renderAgenda();
  else if (screenId === 'perfilScreen') renderPerfil();
}

// ===== MODAL DE MEDICAÇÃO =====

function setSemDataFimMedicacaoUI(mode, semFimOn) {
  const btn = document.getElementById(mode === 'add' ? 'toggleSemDataFimMed' : 'toggleSemDataFimMedEdit');
  const grp = document.getElementById(mode === 'add' ? 'dataFimMedGroup' : 'editDataFimMedGroup');
  const inp = document.getElementById(mode === 'add' ? 'dataFimMedInput' : 'editDataFimMedInput');
  if (!btn || !grp) return;
  btn.classList.toggle('active', !!semFimOn);
  grp.style.display = semFimOn ? 'none' : 'block';
  if (inp && semFimOn) inp.value = '';
}

function toggleSemDataFimMedicacao(mode) {
  const btn = document.getElementById(mode === 'add' ? 'toggleSemDataFimMed' : 'toggleSemDataFimMedEdit');
  if (!btn) return;
  const next = !btn.classList.contains('active');
  setSemDataFimMedicacaoUI(mode, next);
}

/** Campos que `form.reset()` não restaura (toggles, select dinâmico, lista de busca). */
function resetAddMedicacaoModalState() {
  const dosagemSelect = document.getElementById('dosagemMedInput');
  if (dosagemSelect) {
    dosagemSelect.innerHTML = '<option value="">Selecione a dosagem</option>';
  }
  ['toggleDashboardMed', 'toggleLembreteMed', 'toggleAtrasadaMed', 'toggleEstoqueMed'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  });
  setSemDataFimMedicacaoUI('add', false);
  const searchResults = document.getElementById('searchResults');
  if (searchResults) {
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
  const searchInput = document.getElementById('searchMedInput');
  if (searchInput) searchInput.value = '';
  setAddMedicacaoMedPickPhase(true);
}

function cleanupAddMedicacaoForm() {
  const addForm = document.getElementById('addMedicacaoForm');
  if (addForm) addForm.reset();
  const horarios = document.getElementById('horariosContainer');
  if (horarios) horarios.innerHTML = '';
  const selected = document.getElementById('selectedMedName');
  if (selected) selected.value = '';
  removerFoto();
  resetAddMedicacaoModalState();
}

function setupMedicacaoModal() {
  const addNewMedBtn = document.getElementById('addMedBtn');
  const addModal = document.getElementById('addMedicacaoModal');
  const cancelAddBtn = document.getElementById('cancelAddBtn');
  const addForm = document.getElementById('addMedicacaoForm');

  const closeModal = () => {
    addModal.classList.remove('active');
    cleanupAddMedicacaoForm();
  };

  if (addNewMedBtn) addNewMedBtn.addEventListener('click', () => addModal.classList.add('active'));
  if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeModal);
  if (addModal) addModal.addEventListener('click', (e) => { if (e.target === addModal) closeModal(); });

  if (!addForm) return;

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('selectedMedName').value;
    const dosagem = document.getElementById('dosagemMedInput').value;
    const frequencia = document.getElementById('frequenciaMedInput').value;
    const dataInicio = document.getElementById('dataInicioMedInput').value;
    const semDataFim = document.getElementById('toggleSemDataFimMed')?.classList.contains('active');
    const dataFim = semDataFim ? '' : document.getElementById('dataFimMedInput').value;
    const estoqueAtual = document.getElementById('estoqueAtualMedInput').value;
    const estoqueMinimo = document.getElementById('estoqueMinMedInput').value;

    const horarios = Array.from(document.querySelectorAll('.horario-input')).map(i => i.value).filter(Boolean);

    if (!nome) { showFeedbackModal('Selecione um medicamento para continuar.', 'warning'); return; }
    if (!dosagem) { showFeedbackModal('Selecione a dosagem para continuar.', 'warning'); return; }
    if (!estoqueAtual) { showFeedbackModal('Informe o estoque atual.', 'warning'); return; }
    if (!estoqueMinimo) { showFeedbackModal('Informe o estoque mínimo para aviso.', 'warning'); return; }
    if (parseInt(estoqueAtual, 10) < parseInt(estoqueMinimo, 10)) {
      showFeedbackModal('O estoque atual deve ser maior ou igual ao estoque mínimo.', 'warning');
      return;
    }
    if (!semDataFim && dataInicio && dataFim && dataFim < dataInicio) {
      showFeedbackModal('A data fim deve ser igual ou posterior à data de início.', 'warning');
      return;
    }
    if (horarios.length === 0) { showFeedbackModal('Informe pelo menos um horario.', 'warning'); return; }

    const exibirDashboard = document.getElementById('toggleDashboardMed').classList.contains('active');
    const alertas = {
      lembrete: document.getElementById('toggleLembreteMed').classList.contains('active'),
      antecedencia: parseInt(document.getElementById('antecedenciaMedInput').value),
      atrasada: document.getElementById('toggleAtrasadaMed').classList.contains('active'),
      estoqueBaixo: document.getElementById('toggleEstoqueMed').classList.contains('active')
    };

    const newId = Math.max(...mockData.medicacoes.map(m => m.id), 0) + 1;
    mockData.medicacoes.push({
      id: newId, nome, dosagem, horarios, frequencia, dataInicio, dataFim,
      estoqueAtual: parseInt(estoqueAtual, 10) || 30, estoqueMinimo: parseInt(estoqueMinimo, 10) || 7,
      exibirDashboard, alertas, categoria: 'medicacao', foto: fotoAtualMedicacao, historico: []
    });

    showFeedbackModal(`${nome} ${dosagem} adicionado com sucesso.`, 'success');
    addModal.classList.remove('active');
    cleanupAddMedicacaoForm();
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
    showFeedbackModal(`${medName} marcado como tomado.`, 'success');
    alarmModal.classList.remove('active');
  });
}

function showMedicationAlarm(medicacaoId, horario) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (medicacao) {
    document.getElementById('alarmMedName').textContent = `${medicacao.nome} ${medicacao.dosagem}`;
    document.getElementById('alarmTime').textContent = horario || '--:--';
    document.getElementById('alarmModal').classList.add('active');
  }
}

function showVitalAlarm(vital, valorAtual, tipoAlerta) {
  const modal = document.getElementById('vitalAlarmModal');
  if (!modal) return;

  const titleEl = document.getElementById('vitalAlarmTitle');
  const descEl = document.getElementById('vitalAlarmDescription');
  const valueEl = document.getElementById('vitalAlarmValue');

  if (titleEl) titleEl.textContent = `Alerta de ${vital.tipo}`;
  if (valueEl) valueEl.textContent = `${valorAtual} ${vital.unidade || ''}`;
  if (descEl) {
    const direction = tipoAlerta === 'acima' ? 'acima do limite' : 'abaixo do limite';
    descEl.textContent = `Valor ${direction} configurado para este sinal.`;
  }

  modal.classList.add('active');
}

function getVitalComparableValue(vital, value) {
  if (vital.tipo === 'Pressão Arterial') {
    if (value && typeof value === 'object' && value.sistolica != null) return parseFloat(value.sistolica);
    if (typeof value === 'string' && value.includes('/')) return parseFloat(value.split('/')[0]);
  }
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

function checkVitalAlert(vital) {
  if (!vital || !vital.alerta || !vital.alerta.ativo) return;

  const current = getVitalComparableValue(vital, vital.valor);
  if (current == null) return;

  const acima = vital.alerta.acima != null ? parseFloat(vital.alerta.acima) : null;
  const abaixo = vital.alerta.abaixo != null ? parseFloat(vital.alerta.abaixo) : null;

  let tipoAlerta = null;
  if (acima != null && current > acima) tipoAlerta = 'acima';
  if (!tipoAlerta && abaixo != null && current < abaixo) tipoAlerta = 'abaixo';
  if (!tipoAlerta) return;

  const key = `${vital.id}-${tipoAlerta}-${current}`;
  if (key === lastVitalAlertKey) return;
  lastVitalAlertKey = key;
  showVitalAlarm(vital, current, tipoAlerta);
}

// ===== MODAL DE COMPARTILHAMENTO =====

function setupCompartilhamentoModal() {
  const modal = document.getElementById('addCompartilhamentoModal');
  const cancelBtn = document.getElementById('cancelCompartilhamentoBtn');
  const form = document.getElementById('addCompartilhamentoForm');

  const closeModal = () => { modal.classList.remove('active'); form.reset(); };

  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const medico = document.getElementById('medicoCompartilhamentoInput').value;
    const especialidade = document.getElementById('especialidadeCompartilhamentoInput').value;
    const dados = Array.from(document.querySelectorAll('input[name="dados"]:checked')).map(el => el.value);

    if (dados.length === 0) {
      showFeedbackModal('Selecione pelo menos um tipo de dado para compartilhar.', 'warning');
      return;
    }

    const newId = Math.max(...mockData.compartilhamentos.map(c => c.id), 0) + 1;
    mockData.compartilhamentos.push({
      id: newId,
      medico,
      especialidade,
      dadosCompartilhados: dados,
      dataAutorizacao: getTodayISODate(),
      ativo: true
    });

    showFeedbackModal(`Dados compartilhados com ${medico}.`, 'success');
    modal.classList.remove('active');
    form.reset();
    renderCompartilhamentoInPerfil();
  });
}

// ===== AÇÕES DE MEDICAÇÃO =====

function markAsTaken(medicacaoId) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (medicacao) {
    const now = new Date();
    const hora = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    medicacao.ultimo = `${hora} ✅`;
    medicacao.historico.push({
      data: now.toISOString().slice(0, 10),
      hora: hora,
      status: 'tomado'
    });
    renderMedicacoes();
    showFeedbackModal(`${medicacao.nome} marcado como tomado as ${hora}.`, 'success');
  }
}

function editMedicacao(medicacaoId) {
  showFeedbackModal('Funcionalidade de edicao em desenvolvimento.', 'info');
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
    showMedicationAlarm(mockData.medicacoes[0].id, mockData.medicacoes[0].horarios?.[0]);
  }
}

// ===== EDITAR MEDICAÇÃO =====

let currentEditMedId = null;

function setupEditMedicacaoModal() {
  const modal = document.getElementById('editMedicacaoModal');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const form = document.getElementById('editMedicacaoForm');

  const closeModal = () => {
    modal.classList.remove('active');
    form.reset();
    setSemDataFimMedicacaoUI('edit', false);
    removerFotoEdit();
  };

  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('editNomeMedInput').value;
    const dosagem = document.getElementById('editDosagemMedInput').value;
    const frequencia = document.getElementById('editFrequenciaMedInput').value;
    const semDataFim = document.getElementById('toggleSemDataFimMedEdit')?.classList.contains('active');
    const dataFim = semDataFim ? '' : document.getElementById('editDataFimMedInput').value;
    const estoqueAtual = document.getElementById('editEstoqueAtualMedInput').value;
    const estoqueMinimo = document.getElementById('editEstoqueMinMedInput').value;

    const horarios = Array.from(document.querySelectorAll('.edit-horario-input')).map(i => i.value).filter(Boolean);

    if (!estoqueAtual) { showFeedbackModal('Informe o estoque atual.', 'warning'); return; }
    if (!estoqueMinimo) { showFeedbackModal('Informe o estoque mínimo para aviso.', 'warning'); return; }
    if (parseInt(estoqueAtual, 10) < parseInt(estoqueMinimo, 10)) {
      showFeedbackModal('O estoque atual deve ser maior ou igual ao estoque mínimo.', 'warning');
      return;
    }

    const med = mockData.medicacoes.find(m => m.id === currentEditMedId);
    if (med) {
      med.nome = nome;
      med.dosagem = dosagem;
      med.frequencia = frequencia;
      med.horarios = horarios.length > 0 ? horarios : med.horarios;
      med.dataFim = dataFim || '';
      med.estoqueAtual = parseInt(estoqueAtual, 10) || med.estoqueAtual || 30;
      med.estoqueMinimo = parseInt(estoqueMinimo, 10) || 7;
      if (fotoAtualMedicacaoEdit) med.foto = fotoAtualMedicacaoEdit;
    }

    showFeedbackModal(`${nome} atualizado com sucesso.`, 'success');
    modal.classList.remove('active');
    form.reset();
    setSemDataFimMedicacaoUI('edit', false);
    removerFotoEdit();
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
    const temDataFim = !!(med.dataFim && String(med.dataFim).trim() !== '');
    setSemDataFimMedicacaoUI('edit', !temDataFim);
    document.getElementById('editDataFimMedInput').value = temDataFim ? med.dataFim : '';
    document.getElementById('editEstoqueAtualMedInput').value = med.estoqueAtual || 30;
    document.getElementById('editEstoqueMinMedInput').value = med.estoqueMinimo || 7;
    updateEditHorariosFields();
    // Preencher horários existentes após renderizar os campos
    setTimeout(() => {
      const inputs = document.querySelectorAll('.edit-horario-input');
      inputs.forEach((input, i) => {
        if (med.horarios[i]) input.value = med.horarios[i];
      });
    }, 50);

    if (med.foto && typeof med.foto === 'string' && med.foto.startsWith('data:')) {
      fotoAtualMedicacaoEdit = med.foto;
      document.getElementById('editPhotoPreview').style.display = 'block';
      document.getElementById('editPhotoUploadArea').querySelector('.photo-upload-placeholder').style.display = 'none';
      document.getElementById('editPhotoPreviewImg').src = med.foto;
    } else {
      removerFotoEdit();
    }

    document.getElementById('editMedicacaoModal').classList.add('active');
  }
}

function openMedicationPhotoModalById(medId) {
  const med = mockData.medicacoes.find(m => m.id === medId);
  if (!med || !med.foto || !(typeof med.foto === 'string') || !med.foto.startsWith('data:')) return;

  const modal = document.getElementById('medicationPhotoModal');
  const img = document.getElementById('medicationPhotoModalImg');
  const title = document.getElementById('medicationPhotoModalTitle');
  if (!modal || !img || !title) return;

  img.src = med.foto;
  title.textContent = `Foto - ${med.nome} ${med.dosagem}`;
  modal.classList.add('active');
}

// ===== ALERTAS DE HORÁRIO =====

function checkMedicationAlerts() {
  const agora = new Date();
  const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
  const hoje = getTodayISODate();

  mockData.medicacoes.forEach(med => {
    if (!med.alertas || !med.alertas.lembrete) return;
    if (!med.horarios || !med.horarios.includes(horaAtual)) return;

    const jaTomado = med.historico.some(h => h.data === hoje && h.hora === horaAtual && h.status === 'tomado');
    if (jaTomado) return;

    const key = `${med.id}-${hoje}-${horaAtual}`;
    if (key === lastMedicationAlertKey) return;
    lastMedicationAlertKey = key;
    showMedicationAlarm(med.id, horaAtual);
  });
}

function setupVitalAlarmModal() {
  const modal = document.getElementById('vitalAlarmModal');
  const closeBtn = document.getElementById('closeVitalAlarmBtn');
  const okBtn = document.getElementById('ackVitalAlarmBtn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (okBtn) okBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function buildVitalAlertFromForm() {
  const toggle = document.getElementById('toggleAlertaVital');
  if (!toggle || !toggle.classList.contains('active')) return null;

  const acimaRaw = document.getElementById('alertaAcimaInput').value;
  const abaixoRaw = document.getElementById('alertaAbaixoInput').value;
  const acima = acimaRaw !== '' ? parseFloat(acimaRaw) : null;
  const abaixo = abaixoRaw !== '' ? parseFloat(abaixoRaw) : null;

  if (acima == null && abaixo == null) return null;
  return { ativo: true, acima, abaixo };
}

function checkAllVitalsAlertsOnce() {
  mockData.sinaisVitais.forEach(v => checkVitalAlert(v));
}

function trySendBrowserNotification(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body });
    } catch (_) {}
  }
}

function checkRescheduledMeasurementAlerts() {
  if (!mockData.measurementReschedules || !mockData.measurementReschedules.length) return;

  const now = new Date();
  mockData.measurementReschedules.forEach((item, idx) => {
    if (!item || !item.proximaMedicao || item.alertedAt) return;
    const when = new Date(item.proximaMedicao);
    if (Number.isNaN(when.getTime())) return;
    if (when > now) return;

    const key = `${item.proximaMedicao}-${idx}`;
    if (key === lastRescheduleAlertKey) return;
    lastRescheduleAlertKey = key;

    item.alertedAt = `${getTodayISODate()}T${getCurrentHHMM()}:00`;
    const dateTxt = formatDateForUI(item.proximaMedicao.slice(0, 10));
    const timeTxt = item.proximaMedicao.slice(11, 16);
    const msg = `Hora da proxima medicao (${dateTxt} as ${timeTxt}).`;
    showFeedbackModal(msg, 'warning', 'Lembrete de medicao');
    if (item.notificar) {
      trySendBrowserNotification('Lembrete de medicao', msg);
    }
  });
}

setInterval(() => {
  checkMedicationAlerts();
  checkAllVitalsAlertsOnce();
  checkRescheduledMeasurementAlerts();
}, 60000);

window.addEventListener('load', () => {
  checkMedicationAlerts();
  checkAllVitalsAlertsOnce();
  checkRescheduledMeasurementAlerts();
});

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
  const cancelAddAgendaBtn = document.getElementById('cancelAddAgendaBtn');
  const addAgendaForm = document.getElementById('addAgendaForm');

  const closeModal = () => { addAgendaModal.classList.remove('active'); addAgendaForm.reset(); };

  addAgendaBtn.addEventListener('click', () => addAgendaModal.classList.add('active'));
  cancelAddAgendaBtn.addEventListener('click', closeModal);
  addAgendaModal.addEventListener('click', (e) => { if (e.target === addAgendaModal) closeModal(); });

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
        id: newId, medico, especialidade, data, hora: horario, tipo: tipoAtendimento,
        status: 'Agendado', local, motivo: motivo || 'Consulta', categoria: 'agenda',
        alerta: { ativo: document.getElementById('toggleLembreteAgenda').classList.contains('active'), antecedencia: parseInt(document.getElementById('antecedenciaAgendaInput').value) }
      });
    } else if (tipo === 'exame') {
      const newId = Math.max(...mockData.examesAgendados.map(e => e.id), 0) + 1;
      mockData.examesAgendados.push({
        id: newId, nome, data, local, medico, status: 'Agendado', categoria: 'agenda',
        alerta: { ativo: document.getElementById('toggleLembreteAgenda').classList.contains('active'), antecedencia: parseInt(document.getElementById('antecedenciaAgendaInput').value) }
      });
    }

    showFeedbackModal(`${nome || 'Agendamento'} adicionado com sucesso.`, 'success');
    addAgendaModal.classList.remove('active');
    addAgendaForm.reset();
    renderAgenda();
  });
}


// ===== RENDERIZAÇÃO DE COMPOSIÇÃO CORPORAL =====

function renderComposicao() {
  const ativos = mockData.composicaoCorporal
    .filter(c => (mockData.configComposicao[c.tipo] || {}).exibirCorpo !== false);

  const isOutOfIdeal = (c) => {
    if (!c || c.valor == null || !c.ideal) return false;
    const ideal = c.ideal;
    const current = parseFloat(c.valor);
    if (Number.isNaN(current)) return false;

    if (ideal.type === 'range' && ideal.min != null && ideal.max != null) return current < ideal.min || current > ideal.max;
    if (ideal.type === 'max' && ideal.max != null) return current > ideal.max;
    if (ideal.type === 'min' && ideal.min != null) return current < ideal.min;
    if (ideal.type === 'target' && ideal.target != null) return current !== ideal.target;
    return false;
  };

  const foraDoIdeal = ativos.filter(isOutOfIdeal);
  const principaisTipos = new Set(['Peso', 'IMC', 'Circunferência Cintura', 'Percentual de Gordura', 'Massa Muscular', 'Hidratação']);
  const principais = ativos.filter(c => !foraDoIdeal.includes(c) && principaisTipos.has(c.tipo));
  const outros = ativos.filter(c => !foraDoIdeal.includes(c) && !principaisTipos.has(c.tipo));

  let html = '';

  if (foraDoIdeal.length) {
    html += `<div class="subsection-title">Fora do ideal</div>`;
    html += foraDoIdeal.map(createComposicaoCard).join('');
  }

  if (principais.length) {
    html += `<div class="subsection-title">Principais</div>`;
    html += principais.map(createComposicaoCard).join('');
  }

  if (outros.length) {
    html += `<div class="subsection-title">Outros</div>`;
    html += outros.map(createComposicaoCard).join('');
  }

  document.getElementById('composicaoContent').innerHTML = html ||
    '<div class="empty-state"><div class="empty-text">Nenhum dado de composição corporal</div></div>';
}


// ===== MODAL DE ECG =====

function openEcgDetail(ecgId) {
  const ecg = mockData.ecgs.find(e => e.id === ecgId);
  if (!ecg) return;

  document.getElementById('ecgDetailTitle').textContent = `Eletrocardiograma - ${formatDateTimeForUI(ecg.dataHora)}`;
  
  let html = `
    <div class="card card-ecg" style="margin-bottom: 16px;">
      <div class="ecg-header">
        <div class="ecg-icon">${ecg.icon}</div>
        <div class="ecg-info">
          <div class="ecg-title">Exame Atual</div>
          <div class="ecg-date">📅 ${formatDateTimeForUI(ecg.dataHora)}</div>
        </div>
      </div>
      <div class="ecg-details">
        <div class="ecg-detail-item">
          <span class="ecg-label">Frequência Cardíaca:</span>
          <span class="ecg-value">${ecg.frequenciaCardiaca} bpm</span>
        </div>
        <div class="ecg-detail-item">
          <span class="ecg-label">Ritmo:</span>
          <span class="ecg-value">${ecg.ritmo}</span>
        </div>
      </div>
      <div class="ecg-interpretation"><strong>Interpretação:</strong> ${ecg.interpretacao}</div>
    </div>
  `;

  if (ecg.historico && ecg.historico.length > 0) {
    html += '<div class="section-title" style="margin-top: 16px; margin-bottom: 12px;">Histórico</div>';
    html += ecg.historico.map(h => {
      const dataFormatada = h.data;
      const hora = h.hora ? ` às ${h.hora}` : '';
      return `
        <div class="card card-saude" style="margin-bottom: 8px;">
          <div class="card-info"><strong>${dataFormatada}${hora}</strong></div>
          <div class="card-info">FC: ${h.frequencia} bpm | Ritmo: ${h.ritmo}</div>
          <div class="card-info">Interpretação: ${h.interpretacao}</div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('ecgDetailContent').innerHTML = html;
  document.getElementById('ecgDetailModal').classList.add('active');
}

function setupEcgDetailModal() {
  const modal = document.getElementById('ecgDetailModal');
  const closeBtn = document.getElementById('closeEcgDetailModal');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// ===== FECHAR MODAL DE HISTÓRICO =====

document.addEventListener('DOMContentLoaded', () => {
  const closeVitalDetailModal = document.getElementById('closeVitalDetailModal');
  if (closeVitalDetailModal) {
    closeVitalDetailModal.addEventListener('click', () => {
      document.getElementById('vitalDetailModal').classList.remove('active');
    });
  }

  const vitalDetailModal = document.getElementById('vitalDetailModal');
  if (vitalDetailModal) {
    vitalDetailModal.addEventListener('click', (e) => {
      if (e.target === vitalDetailModal) {
        vitalDetailModal.classList.remove('active');
      }
    });
  }

  setupAgendaModal();
  setupComposicaoModal();
});


// ===== MODAL DE COMPOSIÇÃO CORPORAL =====

let currentComposicaoId = null;

function setupComposicaoModal() {
  const modal = document.getElementById('composicaoModal');
  const cancelBtn = document.getElementById('cancelComposicaoBtn');
  const form = document.getElementById('composicaoForm');

  const closeModal = () => { modal.classList.remove('active'); form.reset(); };

  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = parseFloat(document.getElementById('composicaoValorInput').value);
    const fonte = document.getElementById('composicaoFonteInput').value;
    const data = document.getElementById('composicaoDataInput').value;

    const composicao = mockData.composicaoCorporal.find(c => c.id === currentComposicaoId);
    if (composicao) {
      composicao.valor = valor;
      composicao.fonte = fonte;
      composicao.dataHora = data;
      
      if (!composicao.historico) {
        composicao.historico = [];
      }
      
      composicao.historico.unshift({
        data: data,
        valor: valor,
        variacao: composicao.variacao,
        fonte: fonte
      });

      showFeedbackModal(`${composicao.tipo} atualizado com sucesso.`, 'success');
      modal.classList.remove('active');
      form.reset();
      renderComposicao();
    }
  });
}

function openComposicaoModal(composicaoId, tipo) {
  currentComposicaoId = composicaoId;
  const composicao = mockData.composicaoCorporal.find(c => c.id === composicaoId);
  
  if (!composicao) return;

  document.getElementById('composicaoModalTitle').textContent = `Adicionar ${tipo}`;
  document.getElementById('composicaoValorInput').value = '';
  document.getElementById('composicaoFonteInput').value = composicao.fonte || 'Manual';
  document.getElementById('composicaoDataInput').value = new Date().toISOString().split('T')[0];

  renderComposicaoHistorico(composicao.historico || []);
  document.getElementById('composicaoModal').classList.add('active');
}

function renderComposicaoHistorico(historico) {
  if (historico.length === 0) {
    document.getElementById('composicaoHistoricoContent').innerHTML = '<div class="empty-state"><div class="empty-text">Nenhum registro encontrado</div></div>';
    return;
  }

  const html = historico.map(h => {
    const variacaoIcon = h.variacao === 'normal' ? '🟢' : '🔴';
    return `
      <div class="card card-saude" style="margin-bottom: 8px;">
        <div class="card-info"><strong>${formatDateForUI(h.data)}</strong> ${variacaoIcon}</div>
        <div class="card-value" style="color: #7e91cd; font-size: 16px;">${h.valor}</div>
        <div class="card-info">Fonte: ${h.fonte}</div>
      </div>
    `;
  }).join('');
  document.getElementById('composicaoHistoricoContent').innerHTML = html;
}




// ===== CLOCK WIDGET =====

function initClockWidget() {
  updateClockDisplay();
  setInterval(updateClockDisplay, 1000);
}

function updateClockDisplay() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  const clockTimeEl = document.getElementById('clockTime');
  if (clockTimeEl) {
    clockTimeEl.textContent = timeString;
  }
  
  updateMedicationSummary();
}

function updateMedicationSummary() {
  const hoje = getTodayISODate();
  let tomadas = 0;
  let pendentes = 0;
  
  mockData.medicacoes.forEach(med => {
    med.horarios.forEach(horario => {
      const registro = med.historico.find(h => h.data === hoje && h.hora === horario);
      if (registro && registro.status === 'tomado') {
        tomadas++;
      } else {
        pendentes++;
      }
    });
  });
  
  const tomadosEl = document.getElementById('medTomadas');
  const pendentesEl = document.getElementById('medPendentes');
  
  if (tomadosEl) tomadosEl.textContent = tomadas;
  if (pendentesEl) pendentesEl.textContent = pendentes;
}

function updateMedicationCalendarHeader() {
  const label = document.getElementById('medCalendarTodayLabel');
  if (label) label.textContent = formatDateForUI(getTodayISODate());
}

function renderMedicationOverdueSection() {
  const container = document.getElementById('medicationsOverdueNow');
  if (!container) return;

  const today = getTodayISODate();
  const overdueEntries = getMedicationDayEntries(today).filter(e => e.status === 'atrasado');

  if (!overdueEntries.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="med-overdue-section">
      <div class="med-overdue-title">Atrasadas agora (${overdueEntries.length})</div>
      ${overdueEntries.map(entry => `
        <div class="med-overdue-item">
          <div class="med-overdue-label">
            <span class="med-overdue-time">${entry.horario}</span>
            ${entry.nome} ${entry.dosagem}
          </div>
          <button class="med-overdue-btn" onclick="markMedicationByIdAndTime(${entry.medId}, '${entry.horario}', '${today}')">Tomar</button>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== DAILY SCHEDULE MODAL =====

function openDailyScheduleModal() {
  const hoje = getTodayISODate();
  document.getElementById('dailyScheduleTitle').textContent = `Agenda de Medicações - ${formatDateForUI(hoje)}`;
  renderDailySchedule('todos');
  document.getElementById('dailyScheduleModal').classList.add('active');
}

function renderDailySchedule(filtro = 'todos', dateISO = getTodayISODate()) {
  const hoje = dateISO;
  const agora = new Date();
  const horaAtual = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
  
  let html = '';
  
  mockData.medicacoes.forEach(med => {
    med.horarios.forEach(horario => {
      const status = getMedicationStatusForDate(med, hoje, horario, horaAtual);
      
      if (filtro !== 'todos' && status !== filtro) return;
      
      const statusIcon = status === 'tomado' ? '✅' : status === 'atrasado' ? '🔴' : '⏳';
      const statusColor = status === 'tomado' ? '#00AA00' : status === 'atrasado' ? '#FF0000' : '#FFA500';
      
      html += `
        <div class="schedule-item" style="border-left: 4px solid ${statusColor}; padding: 12px; margin-bottom: 8px; background: #f9f9f9; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 16px;">${med.nome} ${med.dosagem}</div>
              <div style="color: #666; font-size: 14px;">Horário: ${horario}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; margin-bottom: 4px;">${statusIcon}</div>
              <button class="schedule-btn" onclick="markMedicationByIdAndTime(${med.id}, '${horario}', '${hoje}')" style="font-size: 12px; padding: 4px 8px;">Tomar</button>
            </div>
          </div>
        </div>
      `;
    });
  });
  
  if (!html) {
    html = '<div class="empty-state"><div class="empty-text">Nenhuma medicação para este filtro</div></div>';
  }
  
  document.getElementById('dailyScheduleContent').innerHTML = html;
}

function filterScheduleByStatus(status) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderDailySchedule(status);
}

function markMedicationAsTaken(nome, dosagem, horario) {
  const med = mockData.medicacoes.find(m => m.nome === nome && m.dosagem === dosagem);
  if (!med) return;
  markMedicationByIdAndTime(med.id, horario, getTodayISODate());
}

function markMedicationByIdAndTime(medId, horario, dateISO = getTodayISODate(), shouldAlert = true) {
  const med = mockData.medicacoes.find(m => m.id === medId);
  if (!med) return false;

  const indiceHorario = med.historico.findIndex(h => h.data === dateISO && h.hora === horario);
  if (indiceHorario >= 0) {
    med.historico[indiceHorario].status = 'tomado';
  } else {
    med.historico.push({
      data: dateISO,
      hora: horario,
      status: 'tomado'
    });
  }

  updateMedicationSummary();
  renderMedicationOverdueSection();
  if (document.getElementById('dailyScheduleModal')?.classList.contains('active')) {
    renderDailySchedule('todos');
  }
  if (document.getElementById('medicationCalendarModal')?.classList.contains('active')) {
    renderMedicationCalendarDay();
  }
  if (shouldAlert) {
    showSystemToast(`${med.nome} ${med.dosagem} tomado as ${horario}.`, 'success');
  }
  return true;
}

function openMedicationCalendarModal() {
  const input = document.getElementById('medicationCalendarDateInput');
  if (input) input.value = getTodayISODate();
  renderMedicationCalendarDay();
  document.getElementById('medicationCalendarModal').classList.add('active');
}

function renderMedicationCalendarDay() {
  const input = document.getElementById('medicationCalendarDateInput');
  const selectedDate = (input && input.value) ? input.value : getTodayISODate();
  const entries = getMedicationDayEntries(selectedDate);
  const grouped = new Map();

  entries.forEach(entry => {
    const key = `${entry.medId}-${entry.nome}-${entry.dosagem}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        medId: entry.medId,
        nome: entry.nome,
        dosagem: entry.dosagem,
        slots: []
      });
    }
    grouped.get(key).slots.push({ horario: entry.horario, status: entry.status });
  });

  const totalTaken = entries.filter(e => e.status === 'tomado').length;
  const totalPending = entries.filter(e => e.status === 'pendente').length;
  const totalMissed = entries.filter(e => e.status === 'atrasado').length;

  const summaryEl = document.getElementById('medicationCalendarSummary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <span class="calendar-day-pill ok">✅ ${totalTaken} tomadas</span>
      <span class="calendar-day-pill pending">⏳ ${totalPending} pendentes</span>
      <span class="calendar-day-pill missed">🔴 ${totalMissed} atrasadas</span>
    `;
  }

  const titleEl = document.getElementById('medicationCalendarTitle');
  if (titleEl) {
    titleEl.textContent = `Calendário de Medicações - ${formatDateForUI(selectedDate)}`;
  }

  const content = document.getElementById('medicationCalendarContent');
  if (!content) return;

  if (!grouped.size) {
    content.innerHTML = '<div class="empty-state"><div class="empty-text">Nenhuma medicação para este dia</div></div>';
    return;
  }

  content.innerHTML = Array.from(grouped.values()).map(group => `
    <div class="calendar-med-item">
      <div class="calendar-med-header">
        <div class="calendar-med-name">${group.nome}</div>
        <div class="calendar-med-dose">${group.dosagem}</div>
      </div>
      <div class="calendar-med-slots">
        ${group.slots.map(slot => `
          <span class="calendar-slot ${slot.status}">
            ${slot.horario} ${slot.status === 'tomado' ? '✓' : slot.status === 'atrasado' ? '!' : '•'}
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ===== MEDICATION SEARCH =====

function searchMedicamentos(termo) {
  const searchResults = document.getElementById('searchResults');
  
  if (!termo.trim()) {
    searchResults.style.display = 'none';
    return;
  }
  
  const resultados = mockData.catalogoMedicamentos.filter(med => 
    med.nome.toLowerCase().includes(termo.toLowerCase())
  );
  
  if (resultados.length === 0) {
    searchResults.innerHTML = '<div style="padding: 8px; color: #999;">Nenhum medicamento encontrado</div>';
    searchResults.style.display = 'block';
    return;
  }
  
  const labelForForma = (key) => {
    const map = {
      comprimido: 'Comprimidos',
      capsula: 'Cápsulas',
      gotas: 'Gotas',
      xarope: 'Xaropes',
      solucao: 'Solução (ml)',
      colher: 'Colher (chá/sopa)',
      injetavel: 'Injetáveis',
      spray: 'Spray/Inalador',
      unidade: 'Unidade'
    };
    return map[key] || 'Outros';
  };

  const keyForMed = (med) => {
    const first = (med.formas && med.formas.length) ? med.formas[0] : 'outros';
    return first;
  };

  const grouped = new Map();
  resultados.forEach((med) => {
    const key = keyForMed(med);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(med);
  });

  const orderedKeys = Array.from(grouped.keys()).sort((a, b) => labelForForma(a).localeCompare(labelForForma(b)));

  let html = '';
  orderedKeys.forEach((key) => {
    const items = grouped.get(key).sort((a, b) => a.nome.localeCompare(b.nome));
    html += `<div style="padding: 6px 8px; font-size: 11px; color: #666; font-weight: 700; background: #fafafa; border-bottom: 1px solid #eee;">${labelForForma(key)}</div>`;
    items.forEach(med => {
      const formasTxt = (med.formas && med.formas.length) ? med.formas.join(' • ') : '';
      html += `
        <div class="search-result-item" onclick="selectMedicamento(${med.id})">
          <div class="search-result-name">${med.nome}</div>
          ${formasTxt ? `<div class="search-result-meta">${formasTxt}</div>` : ''}
        </div>
      `;
    });
  });
  
  searchResults.innerHTML = html;
  searchResults.style.display = 'block';
}

/** Um remédio por vez: mostra busca ou o nome escolhido + “Trocar”. */
function setAddMedicacaoMedPickPhase(showSearch) {
  const searchRow = document.getElementById('medSearchRow');
  const selectedRow = document.getElementById('medSelectedRow');
  const searchInput = document.getElementById('searchMedInput');
  if (searchRow) searchRow.style.display = showSearch ? 'block' : 'none';
  if (selectedRow) selectedRow.style.display = showSearch ? 'none' : 'flex';
  if (showSearch) {
    const label = document.getElementById('medSelectedDisplayName');
    if (label) label.textContent = '';
  }
  if (showSearch && searchInput) setTimeout(() => searchInput.focus(), 80);
}

function trocarMedicamentoSelecionado() {
  const hidden = document.getElementById('selectedMedName');
  if (hidden) hidden.value = '';
  const label = document.getElementById('medSelectedDisplayName');
  if (label) label.textContent = '';
  const dosagemSelect = document.getElementById('dosagemMedInput');
  if (dosagemSelect) dosagemSelect.innerHTML = '<option value="">Selecione a dosagem</option>';
  const searchResults = document.getElementById('searchResults');
  if (searchResults) {
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
  }
  const searchInput = document.getElementById('searchMedInput');
  if (searchInput) searchInput.value = '';
  setAddMedicacaoMedPickPhase(true);
}

function selectMedicamento(medId) {
  const med = mockData.catalogoMedicamentos.find(m => m.id === medId);
  if (!med) return;

  document.getElementById('selectedMedName').value = med.nome;
  const displayName = document.getElementById('medSelectedDisplayName');
  if (displayName) displayName.textContent = med.nome;
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('searchMedInput').value = '';

  const dosagemSelect = document.getElementById('dosagemMedInput');
  dosagemSelect.innerHTML = '<option value="">Selecione a dosagem</option>';

  med.dosagens.forEach(dosagem => {
    const option = document.createElement('option');
    option.value = dosagem;
    option.textContent = dosagem;
    dosagemSelect.appendChild(option);
  });

  setAddMedicacaoMedPickPhase(false);
}

// ===== FREQUENCY TIME PICKER =====

function updateHorariosFields() {
  const frequencia = document.getElementById('frequenciaMedInput').value;
  const container = document.getElementById('horariosContainer');
  
  container.innerHTML = '';
  
  if (!frequencia) return;
  
  let numHorarios = 0;
  if (frequencia === '1x ao dia') numHorarios = 1;
  else if (frequencia === '2x ao dia') numHorarios = 2;
  else if (frequencia === '3x ao dia') numHorarios = 3;
  else if (frequencia === '4x ao dia') numHorarios = 4;
  else if (frequencia === 'Conforme necessário') numHorarios = 1;
  
  for (let i = 0; i < numHorarios; i++) {
    const label = numHorarios === 1 ? 'Horário' : `Horário ${i + 1}`;
    const html = `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="time" class="form-input horario-input" data-index="${i}" required>
      </div>
    `;
    container.innerHTML += html;
  }
}

function updateEditHorariosFields() {
  const frequencia = document.getElementById('editFrequenciaMedInput').value;
  const container = document.getElementById('editHorariosContainer');
  
  container.innerHTML = '';
  
  if (!frequencia) return;
  
  let numHorarios = 0;
  if (frequencia === '1x ao dia') numHorarios = 1;
  else if (frequencia === '2x ao dia') numHorarios = 2;
  else if (frequencia === '3x ao dia') numHorarios = 3;
  else if (frequencia === '4x ao dia') numHorarios = 4;
  else if (frequencia === 'Conforme necessário') numHorarios = 1;
  
  for (let i = 0; i < numHorarios; i++) {
    const label = numHorarios === 1 ? 'Horário' : `Horário ${i + 1}`;
    const html = `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="time" class="form-input edit-horario-input" data-index="${i}" required>
      </div>
    `;
    container.innerHTML += html;
  }
}

// ===== SETUP DAILY SCHEDULE MODAL =====

document.addEventListener('DOMContentLoaded', () => {
  const closeDailyScheduleModal = document.getElementById('closeDailyScheduleModal');
  if (closeDailyScheduleModal) {
    closeDailyScheduleModal.addEventListener('click', () => {
      document.getElementById('dailyScheduleModal').classList.remove('active');
    });
  }
  
  const dailyScheduleModal = document.getElementById('dailyScheduleModal');
  if (dailyScheduleModal) {
    dailyScheduleModal.addEventListener('click', (e) => {
      if (e.target === dailyScheduleModal) {
        dailyScheduleModal.classList.remove('active');
      }
    });
  }

  const closeMedicationCalendarModal = document.getElementById('closeMedicationCalendarModal');
  const medicationCalendarModal = document.getElementById('medicationCalendarModal');
  if (closeMedicationCalendarModal) {
    closeMedicationCalendarModal.addEventListener('click', () => {
      medicationCalendarModal.classList.remove('active');
    });
  }
  if (medicationCalendarModal) {
    medicationCalendarModal.addEventListener('click', (e) => {
      if (e.target === medicationCalendarModal) {
        medicationCalendarModal.classList.remove('active');
      }
    });
  }
  
  initClockWidget();
  updateMedicationCalendarHeader();
});


// ===== TAKE MEDICATION MODAL =====

let currentTakeMedication = {
  nome: '',
  dosagem: '',
  horario: '',
  medId: null
};

function openTakeModal(nome, dosagem, horario, medId) {
  currentTakeMedication = { nome, dosagem, horario, medId };
  
  const agora = new Date();
  const horaAtual = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
  
  document.getElementById('takeMedName').textContent = `${nome} ${dosagem}`;
  document.getElementById('takeMedScheduledTime').textContent = horario;
  document.getElementById('takeMedCurrentTime').textContent = horaAtual;
  document.getElementById('takeMedTimeInput').value = horaAtual;
  
  document.getElementById('takeMedicationModal').classList.add('active');
}

function confirmTakeMedication(useCurrentTime) {
  const { nome, dosagem, horario, medId } = currentTakeMedication;
  const med = mockData.medicacoes.find(m => m.id === medId);
  if (!med) return;
  
  const hoje = getTodayISODate();
  let horaRegistro = horario;
  
  if (useCurrentTime) {
    const agora = new Date();
    horaRegistro = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
  } else {
    horaRegistro = document.getElementById('takeMedTimeInput').value;
  }
  
  markMedicationByIdAndTime(medId, horario, hoje, false);
  
  document.getElementById('takeMedicationModal').classList.remove('active');
  renderMedicacoes();
  showSystemToast(`${nome} ${dosagem} tomado as ${horaRegistro}.`, 'success');
}

// Setup Take Medication Modal
document.addEventListener('DOMContentLoaded', () => {
  const takeMedModal = document.getElementById('takeMedicationModal');
  const closeTakeMedBtn = document.getElementById('closeTakeMedicationModal');
  const cancelTakeMedBtn = document.getElementById('cancelTakeMedicationBtn');
  
  if (closeTakeMedBtn) {
    closeTakeMedBtn.addEventListener('click', () => {
      takeMedModal.classList.remove('active');
    });
  }
  
  if (cancelTakeMedBtn) {
    cancelTakeMedBtn.addEventListener('click', () => {
      takeMedModal.classList.remove('active');
    });
  }
  
  if (takeMedModal) {
    takeMedModal.addEventListener('click', (e) => {
      if (e.target === takeMedModal) {
        takeMedModal.classList.remove('active');
      }
    });
  }
});


// ===== PERIOD FILTER =====

let currentPeriodFilter = '7d';
let customPeriodStart = null;
let customPeriodEnd = null;

function openPeriodFilterModal() {
  document.getElementById('periodFilterModal').classList.add('active');
}

function setPeriodFilter(period) {
  document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  const customContainer = document.getElementById('customPeriodContainer');
  if (period === 'custom') {
    customContainer.style.display = 'block';
  } else {
    customContainer.style.display = 'none';
    currentPeriodFilter = period;
  }
}

function applyPeriodFilter() {
  const period = document.querySelector('.period-btn.active').getAttribute('onclick').match(/'([^']+)'/)[1];
  
  if (period === 'custom') {
    const startDate = document.getElementById('periodStartDate').value;
    const endDate = document.getElementById('periodEndDate').value;
    
    if (!startDate || !endDate) {
      showFeedbackModal('Selecione data de inicio e fim.', 'warning');
      return;
    }
    
    customPeriodStart = startDate;
    customPeriodEnd = endDate;
  }
  
  currentPeriodFilter = period;
  document.getElementById('periodFilterModal').classList.remove('active');
  renderAdherenceReport();
}

// ===== ADHERENCE REPORT =====

function openAdherenceReport() {
  renderAdherenceReport();
  document.getElementById('adherenceReportModal').classList.add('active');
}

function renderAdherenceReport() {
  const { startDate, endDate } = getPeriodDates();
  const stats = calculateAdherenceStats(startDate, endDate);
  
  document.getElementById('adherencePercentage').textContent = stats.percentage + '%';
  document.getElementById('medicationsTaken').textContent = stats.taken;
  document.getElementById('medicationsMissed').textContent = stats.missed;
  document.getElementById('adherencePeriodText').textContent = getPeriodLabel();
  
  renderAdherenceByMedication(startDate, endDate);
  renderDailyAdherence(startDate, endDate);
}

function getPeriodDates() {
  const today = new Date();
  let startDate, endDate = new Date();
  
  if (currentPeriodFilter === '7d') {
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (currentPeriodFilter === '30d') {
    startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (currentPeriodFilter === '90d') {
    startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (currentPeriodFilter === 'custom') {
    startDate = new Date(customPeriodStart);
    endDate = new Date(customPeriodEnd);
  }
  
  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10)
  };
}

function getPeriodLabel() {
  if (currentPeriodFilter === '7d') return 'Últimos 7 dias';
  if (currentPeriodFilter === '30d') return 'Últimos 30 dias';
  if (currentPeriodFilter === '90d') return 'Últimos 90 dias';
  if (currentPeriodFilter === 'custom') return `${formatDateForUI(customPeriodStart)} a ${formatDateForUI(customPeriodEnd)}`;
}

function calculateAdherenceStats(startDate, endDate) {
  let totalExpected = 0;
  let totalTaken = 0;
  
  mockData.medicacoes.forEach(med => {
    med.horarios.forEach(horario => {
      const dataRange = getDateRange(startDate, endDate);
      dataRange.forEach(data => {
        totalExpected++;
        const registro = med.historico.find(h => h.data === data && h.hora === horario);
        if (registro && registro.status === 'tomado') {
          totalTaken++;
        }
      });
    });
  });
  
  const percentage = totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : 0;
  
  return {
    percentage,
    taken: totalTaken,
    missed: totalExpected - totalTaken
  };
}

function getDateRange(startDateStr, endDateStr) {
  const dates = [];
  let current = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

function renderAdherenceByMedication(startDate, endDate) {
  const dataRange = getDateRange(startDate, endDate);
  let html = '';
  
  mockData.medicacoes.forEach(med => {
    let taken = 0;
    let expected = 0;
    
    med.horarios.forEach(horario => {
      dataRange.forEach(data => {
        expected++;
        const registro = med.historico.find(h => h.data === data && h.hora === horario);
        if (registro && registro.status === 'tomado') {
          taken++;
        }
      });
    });
    
    const percentage = expected > 0 ? Math.round((taken / expected) * 100) : 0;
    const color = percentage >= 80 ? '#2E7D32' : percentage >= 50 ? '#FFA500' : '#FF6B6B';
    
    html += `
      <div class=\"adherence-med-card\">\n        <div class=\"adherence-med-header\">\n          <div class=\"adherence-med-name\">${med.nome} ${med.dosagem}</div>\n          <div class=\"adherence-med-percentage\" style=\"color: ${color};\">${percentage}%</div>\n        </div>\n        <div class=\"adherence-med-bar\">\n          <div class=\"adherence-med-fill\" style=\"width: ${percentage}%; background-color: ${color};\"></div>\n        </div>\n        <div class=\"adherence-med-stats\">\n          <span>${taken}/${expected} tomadas</span>\n        </div>\n      </div>\n    `;
  });
  
  document.getElementById('adherenceByMedicationContent').innerHTML = html;
}

function renderDailyAdherence(startDate, endDate) {
  const dataRange = getDateRange(startDate, endDate);
  let html = '';
  
  dataRange.reverse().forEach(data => {
    let dayTaken = 0;
    let dayExpected = 0;
    
    mockData.medicacoes.forEach(med => {
      med.horarios.forEach(horario => {
        dayExpected++;
        const registro = med.historico.find(h => h.data === data && h.hora === horario);
        if (registro && registro.status === 'tomado') {
          dayTaken++;
        }
      });
    });
    
    const percentage = dayExpected > 0 ? Math.round((dayTaken / dayExpected) * 100) : 0;
    const icon = percentage === 100 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
    
    html += `
      <div class=\"daily-adherence-item\">\n        <div class=\"daily-date\">${formatDateForUI(data)}</div>\n        <div class=\"daily-stats\">\n          <span>${dayTaken}/${dayExpected}</span>\n          <span class=\"daily-icon\">${icon}</span>\n        </div>\n      </div>\n    `;
  });
  
  document.getElementById('dailyAdherenceContent').innerHTML = html;
}

// Setup Period Filter Modal
document.addEventListener('DOMContentLoaded', () => {
  const periodFilterModal = document.getElementById('periodFilterModal');
  const closePeriodFilterModal = document.getElementById('closePeriodFilterModal');
  const cancelPeriodFilterBtn = document.getElementById('cancelPeriodFilterBtn');
  const applyPeriodFilterBtn = document.getElementById('applyPeriodFilterBtn');
  
  if (closePeriodFilterModal) {
    closePeriodFilterModal.addEventListener('click', () => {
      periodFilterModal.classList.remove('active');
    });
  }
  
  if (cancelPeriodFilterBtn) {
    cancelPeriodFilterBtn.addEventListener('click', () => {
      periodFilterModal.classList.remove('active');
    });
  }
  
  if (applyPeriodFilterBtn) {
    applyPeriodFilterBtn.addEventListener('click', applyPeriodFilter);
  }
  
  if (periodFilterModal) {
    periodFilterModal.addEventListener('click', (e) => {
      if (e.target === periodFilterModal) {
        periodFilterModal.classList.remove('active');
      }
    });
  }
});

// Setup Adherence Report Modal
document.addEventListener('DOMContentLoaded', () => {
  const adherenceReportModal = document.getElementById('adherenceReportModal');
  const closeAdherenceReportModal = document.getElementById('closeAdherenceReportModal');
  const reportBtn = document.getElementById('reportBtn');
  
  if (reportBtn) {
    reportBtn.addEventListener('click', openAdherenceReport);
  }
  
  if (closeAdherenceReportModal) {
    closeAdherenceReportModal.addEventListener('click', () => {
      adherenceReportModal.classList.remove('active');
    });
  }
  
  if (adherenceReportModal) {
    adherenceReportModal.addEventListener('click', (e) => {
      if (e.target === adherenceReportModal) {
        adherenceReportModal.classList.remove('active');
      }
    });
  }
});

// Setup Medication Photo Modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('medicationPhotoModal');
  const closeBtn = document.getElementById('closeMedicationPhotoModal');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('feedbackModal');
  const okBtn = document.getElementById('feedbackModalOkBtn');
  if (okBtn) {
    okBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});


// ===== ALERTAS =====

function toggleAlertaVitalFields() {
  const ativo = document.getElementById('toggleAlertaVital').classList.contains('active');
  document.getElementById('alertaVitalFields').style.display = ativo ? 'block' : 'none';
}

function openAlertasModal() {
  renderAlertasVitais();
  renderAlertasMeds();
  renderAlertasAgenda();
  // Reset abas
  const modal = document.getElementById('alertasModal');
  modal.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  modal.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === 0));
  modal.classList.add('active');
}

function renderAlertasVitais() {
  const comAlerta = mockData.sinaisVitais.filter(v => v.alerta && v.alerta.ativo);
  if (!comAlerta.length) {
    document.getElementById('alertasVitaisContent').innerHTML = '<div class="card-info" style="padding:12px;color:#999;">Nenhum alerta de sinal vital configurado.<br>Configure em Perfil → Meus Indicadores.</div>';
    return;
  }
  document.getElementById('alertasVitaisContent').innerHTML = comAlerta.map(v => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${v.icon}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${v.tipo}</div>
        <div style="font-size:11px;color:#aaa;">
          ${v.alerta.acima != null ? `↑ Acima de ${v.alerta.acima} ${v.unidade}` : ''}
          ${v.alerta.acima != null && v.alerta.abaixo != null ? ' • ' : ''}
          ${v.alerta.abaixo != null ? `↓ Abaixo de ${v.alerta.abaixo} ${v.unidade}` : ''}
        </div>
      </div>
      <button class="toggle active" onclick="toggleAlertaVitalAtivo(${v.id}, this)"></button>
      <button onclick="editAlertaVital(${v.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#9058A7;padding:4px 2px;">✏️</button>
    </div>
  `).join('');
}

function toggleAlertaVitalAtivo(id, btn) {
  const v = mockData.sinaisVitais.find(v => v.id === id);
  if (v && v.alerta) { v.alerta.ativo = !v.alerta.ativo; btn.classList.toggle('active'); }
}

function editAlertaVital(id) {
  editIndicador('vitais', id);
  document.getElementById('alertasModal').classList.remove('active');
}

function renderAlertasMeds() {
  const html = mockData.medicacoes.filter(m => m.alertas).map(m => {
    const a = m.alertas;
    const tags = [];
    if (a.lembrete) tags.push(`⏰ ${a.antecedencia}min antes`);
    if (a.atrasada) tags.push('⚠️ Dose atrasada');
    if (a.estoqueBaixo) tags.push('📦 Estoque baixo');
    return `
      <div class="vital-config-row">
        <span class="vital-config-icon">💊</span>
        <div style="flex:1;">
          <div class="vital-config-name">${m.nome} ${m.dosagem}</div>
          <div style="font-size:11px;color:#aaa;">${tags.join(' • ') || 'Sem alertas'}</div>
        </div>
        <button class="toggle ${a.lembrete || a.atrasada || a.estoqueBaixo ? 'active' : ''}" onclick="toggleAlertaMed(${m.id}, this)"></button>
      </div>
    `;
  }).join('');
  document.getElementById('alertasMedsContent').innerHTML = html || '<div class="card-info" style="padding:12px;color:#999;">Nenhum alerta de medicação configurado.</div>';
}

function toggleAlertaMed(id, btn) {
  const m = mockData.medicacoes.find(m => m.id === id);
  if (!m || !m.alertas) return;
  const ativo = btn.classList.contains('active');
  m.alertas.lembrete = !ativo;
  m.alertas.atrasada = !ativo;
  m.alertas.estoqueBaixo = !ativo;
  btn.classList.toggle('active');
  renderAlertasMeds();
}

function renderAlertasAgenda() {
  const todas = [...mockData.consultas, ...mockData.examesAgendados].filter(a => a.alerta);
  if (!todas.length) {
    document.getElementById('alertasAgendaContent').innerHTML = '<div class="card-info" style="padding:12px;color:#999;">Nenhum lembrete de agenda configurado.</div>';
    return;
  }
  const antLabel = min => min >= 1440 ? `${min/1440} dia(s) antes` : `${min/60}h antes`;
  document.getElementById('alertasAgendaContent').innerHTML = todas.map(a => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${a.medico ? '📅' : '🔬'}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${a.medico || a.nome}</div>
        <div style="font-size:11px;color:#aaa;">${formatDateForUI(a.data)} • ${a.alerta.ativo ? antLabel(a.alerta.antecedencia) : 'Desativado'}</div>
      </div>
      <button class="toggle ${a.alerta.ativo ? 'active' : ''}" onclick="toggleAlertaAgenda(${a.id}, '${a.medico ? 'consulta' : 'exame'}', this)"></button>
    </div>
  `).join('');
}

function toggleAlertaAgenda(id, tipo, btn) {
  const lista = tipo === 'consulta' ? mockData.consultas : mockData.examesAgendados;
  const item = lista.find(a => a.id === id);
  if (item && item.alerta) { item.alerta.ativo = !item.alerta.ativo; btn.classList.toggle('active'); }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeAlertas = document.getElementById('closeAlertasModal');
  const alertasModal = document.getElementById('alertasModal');
  if (closeAlertas) closeAlertas.addEventListener('click', () => alertasModal.classList.remove('active'));
  if (alertasModal) alertasModal.addEventListener('click', e => { if (e.target === alertasModal) alertasModal.classList.remove('active'); });
});

// ===== INDICADORES UNIFICADOS (VITAIS + CORPO) =====

let _indicadoresAba = 'vitais'; // aba ativa atual

function switchTab(modalPrefix, aba, btn) {
  // Atualizar botoes
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Mostrar conteudo correto
  document.getElementById(modalPrefix + 'VitaisContent').classList.toggle('active', aba === 'vitais');
  document.getElementById(modalPrefix + 'CorpoContent').classList.toggle('active', aba === 'corpo');
  _indicadoresAba = aba;
}

// ----- VALORES IDEAIS -----

function openValoresIdeaisModal() {
  renderValoresIdeaisVitais();
  renderValoresIdeaisCorpo();
  document.getElementById('valoresIdeaisModal').classList.add('active');
}

function renderValoresIdeaisVitais() {
  const html = mockData.sinaisVitais.map(v => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${v.icon}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${v.tipo}</div>
        <div style="font-size:11px;color:#aaa;">${v.unidade}</div>
      </div>
      <input type="text" class="form-input" style="width:110px;text-align:center;font-size:13px;padding:6px 8px;"
        value="${getIdealLabel(v.ideal)}" placeholder="ex: 60-100"
        onchange="salvarValorIdealVital(${v.id}, this.value)">
    </div>
  `).join('');
  document.getElementById('valoresIdeaisVitaisContent').innerHTML = html;
}

function renderValoresIdeaisCorpo() {
  const html = mockData.composicaoCorporal.map(c => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${c.icon}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${c.tipo}</div>
        <div style="font-size:11px;color:#aaa;">${c.unidade}</div>
      </div>
      <input type="text" class="form-input" style="width:110px;text-align:center;font-size:13px;padding:6px 8px;"
        value="${getIdealLabel(c.ideal)}" placeholder="ex: 18.5-24.9"
        onchange="salvarValorIdealCorpo(${c.id}, this.value)">
    </div>
  `).join('');
  document.getElementById('valoresIdeaisCorpoContent').innerHTML = html;
}

function salvarValorIdealVital(id, valor) {
  const v = mockData.sinaisVitais.find(v => v.id === id);
  if (v) { v.ideal = toIdealObjectFromInput(valor); renderSaude(); }
}

function salvarValorIdealCorpo(id, valor) {
  const c = mockData.composicaoCorporal.find(c => c.id === id);
  if (c) { c.ideal = toIdealObjectFromInput(valor); renderComposicao(); }
}

// ----- MEUS INDICADORES -----

function openMeusIndicadoresModal() {
  _indicadoresAba = 'vitais';
  // Reset abas
  const modal = document.getElementById('meusIndicadoresModal');
  modal.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  modal.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === 0));
  renderMeusIndicadoresVitais();
  renderMeusIndicadoresCorpo();
  modal.classList.add('active');
}

function renderMeusIndicadoresVitais() {
  const html = mockData.sinaisVitais.map(v => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${v.icon}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${v.tipo}</div>
        <div style="font-size:11px;color:#aaa;">${v.unidade} • Ideal: ${getIdealLabel(v.ideal)}</div>
      </div>
      <span class="vital-alert-indicator ${v.alerta && v.alerta.ativo ? 'active' : 'inactive'}"
        title="${v.alerta && v.alerta.ativo ? 'Alerta configurado' : 'Sem alerta configurado'}">
        ${v.alerta && v.alerta.ativo ? '🔔' : '🔕'}
      </span>
      <button onclick="editIndicador('vitais',${v.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#9058A7;padding:4px;">✏️</button>
      <button onclick="removeIndicador('vitais',${v.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#ddd;padding:4px;">🗑️</button>
    </div>
  `).join('');
  document.getElementById('meusIndicadoresVitaisContent').innerHTML = html || '<div class="card-info" style="padding:8px;">Nenhum indicador.</div>';
}

function renderMeusIndicadoresCorpo() {
  const html = mockData.composicaoCorporal.map(c => `
    <div class="vital-config-row">
      <span class="vital-config-icon">${c.icon}</span>
      <div style="flex:1;">
        <div class="vital-config-name">${c.tipo}</div>
        <div style="font-size:11px;color:#aaa;">${c.unidade} • Ideal: ${getIdealLabel(c.ideal)}</div>
      </div>
      <button onclick="editIndicador('corpo',${c.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#9058A7;padding:4px;">✏️</button>
      <button onclick="removeIndicador('corpo',${c.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#ddd;padding:4px;">🗑️</button>
    </div>
  `).join('');
  document.getElementById('meusIndicadoresCorpoContent').innerHTML = html || '<div class="card-info" style="padding:8px;">Nenhum indicador.</div>';
}

function removeIndicador(categoria, id) {
  if (categoria === 'vitais') {
    const v = mockData.sinaisVitais.find(v => v.id === id);
    if (!v || !confirm(`Remover "${v.tipo}"?`)) return;
    mockData.sinaisVitais = mockData.sinaisVitais.filter(v => v.id !== id);
    delete mockData.configSinaisVitais[v.tipo];
    renderMeusIndicadoresVitais();
    renderSaude();
  } else {
    const c = mockData.composicaoCorporal.find(c => c.id === id);
    if (!c || !confirm(`Remover "${c.tipo}"?`)) return;
    mockData.composicaoCorporal = mockData.composicaoCorporal.filter(c => c.id !== id);
    delete mockData.configComposicao[c.tipo];
    renderMeusIndicadoresCorpo();
    renderComposicao();
  }
}

function editIndicador(categoria, id) {
  const item = categoria === 'vitais'
    ? mockData.sinaisVitais.find(v => v.id === id)
    : mockData.composicaoCorporal.find(c => c.id === id);
  if (!item) return;

  document.getElementById('novoIndicadorModalTitle').textContent = `Editar: ${item.tipo}`;
  document.getElementById('novoIndicadorCategoria').value = categoria;
  document.getElementById('editIndicadorId').value = id;
  document.getElementById('novoIndicadorNome').value = item.tipo;
  document.getElementById('novoIndicadorNome').readOnly = true;
  document.getElementById('novoIndicadorUnidade').value = item.unidade;
  document.getElementById('novoIndicadorIdeal').value = getIdealLabel(item.ideal);
  document.getElementById('novoIndicadorIcon').value = item.icon;
  document.getElementById('novoIndicadorFonte').value = item.fonte || 'Manual';
  document.getElementById('salvarIndicadorBtn').textContent = 'Salvar';

  // Alertas — só para vitais
  const alertaContainer = document.getElementById('alertaVitalContainer');
  if (categoria === 'vitais') {
    alertaContainer.style.display = 'block';
    const alerta = item.alerta || { ativo: false, acima: '', abaixo: '' };
    const toggleBtn = document.getElementById('toggleAlertaVital');
    toggleBtn.classList.toggle('active', !!alerta.ativo);
    document.getElementById('alertaVitalFields').style.display = alerta.ativo ? 'block' : 'none';
    document.getElementById('alertaAcimaInput').value = alerta.acima != null ? alerta.acima : '';
    document.getElementById('alertaAbaixoInput').value = alerta.abaixo != null ? alerta.abaixo : '';
    document.getElementById('alertaUnidadeLabel').textContent = item.unidade;
    document.getElementById('alertaUnidadeLabel2').textContent = item.unidade;
  } else {
    alertaContainer.style.display = 'none';
  }

  document.getElementById('novoIndicadorModal').classList.add('active');
}

function openNovoIndicadorModal() {
  document.getElementById('novoIndicadorModalTitle').textContent = 'Novo Indicador';
  document.getElementById('novoIndicadorCategoria').value = _indicadoresAba;
  document.getElementById('editIndicadorId').value = '';
  document.getElementById('novoIndicadorNome').readOnly = false;
  document.getElementById('novoIndicadorForm').reset();
  document.getElementById('salvarIndicadorBtn').textContent = 'Adicionar';
  const alertaContainer = document.getElementById('alertaVitalContainer');
  const toggleBtn = document.getElementById('toggleAlertaVital');
  const fields = document.getElementById('alertaVitalFields');
  if (_indicadoresAba === 'vitais') {
    alertaContainer.style.display = 'block';
    toggleBtn.classList.remove('active');
    fields.style.display = 'none';
    document.getElementById('alertaAcimaInput').value = '';
    document.getElementById('alertaAbaixoInput').value = '';
  } else {
    alertaContainer.style.display = 'none';
  }
  document.getElementById('novoIndicadorModal').classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // Valores Ideais
  const closeVI = document.getElementById('closeValoresIdeaisModal');
  const viModal = document.getElementById('valoresIdeaisModal');
  if (closeVI) closeVI.addEventListener('click', () => viModal.classList.remove('active'));
  if (viModal) viModal.addEventListener('click', e => { if (e.target === viModal) viModal.classList.remove('active'); });

  // Meus Indicadores
  const closeMI = document.getElementById('closeMeusIndicadoresModal');
  const miModal = document.getElementById('meusIndicadoresModal');
  if (closeMI) closeMI.addEventListener('click', () => miModal.classList.remove('active'));
  if (miModal) miModal.addEventListener('click', e => { if (e.target === miModal) miModal.classList.remove('active'); });

  // Novo/Editar Indicador
  const niModal = document.getElementById('novoIndicadorModal');
  const cancelNI = document.getElementById('cancelNovoIndicadorBtn');
  const niForm = document.getElementById('novoIndicadorForm');

  const closeNI = () => {
    niModal.classList.remove('active');
    niForm.reset();
    document.getElementById('novoIndicadorNome').readOnly = false;
  };

  if (cancelNI) cancelNI.addEventListener('click', closeNI);
  if (niModal) niModal.addEventListener('click', e => { if (e.target === niModal) closeNI(); });

  if (niForm) niForm.addEventListener('submit', e => {
    e.preventDefault();
    const categoria = document.getElementById('novoIndicadorCategoria').value;
    const editId = document.getElementById('editIndicadorId').value;
    const nome = document.getElementById('novoIndicadorNome').value.trim();
    const unidade = document.getElementById('novoIndicadorUnidade').value.trim();
    const ideal = document.getElementById('novoIndicadorIdeal').value.trim() || '-';
    const icon = document.getElementById('novoIndicadorIcon').value.trim() || '📊';
    const fonte = document.getElementById('novoIndicadorFonte').value;
    const alertaVital = categoria === 'vitais' ? buildVitalAlertFromForm() : null;

    if (editId) {
      // Editar existente
      const id = parseInt(editId);
      if (categoria === 'vitais') {
        const v = mockData.sinaisVitais.find(v => v.id === id);
        if (v) {
          v.unidade = unidade;
          v.ideal = toIdealObjectFromInput(ideal);
          v.icon = icon;
          v.fonte = fonte;
          v.alerta = alertaVital;
        }
        renderMeusIndicadoresVitais();
        renderValoresIdeaisVitais();
        renderSaude();
      } else {
        const c = mockData.composicaoCorporal.find(c => c.id === id);
        if (c) { c.unidade = unidade; c.ideal = toIdealObjectFromInput(ideal); c.icon = icon; c.fonte = fonte; }
        renderMeusIndicadoresCorpo();
        renderValoresIdeaisCorpo();
        renderComposicao();
      }
    } else {
      // Novo
      if (categoria === 'vitais') {
        if (mockData.sinaisVitais.find(v => v.tipo.toLowerCase() === nome.toLowerCase())) { showFeedbackModal('Este indicador ja existe.', 'warning'); return; }
        const newId = Math.max(...mockData.sinaisVitais.map(v => v.id), 0) + 1;
        mockData.sinaisVitais.push({
          id: newId, tipo: nome, valor: '-', unidade, ideal: toIdealObjectFromInput(ideal), fonte, tempo: 'Nunca medido',
          categoria: 'saude', status: 'normal', dataHora: '', icon, variacao: 'normal', tendencia: 'up',
          percentualVariacao: 0, historico: [], alerta: alertaVital
        });
        mockData.configSinaisVitais[nome] = { exibirSaude: true, exibirDashboard: false };
        renderMeusIndicadoresVitais();
        renderSaude();
      } else {
        if (mockData.composicaoCorporal.find(c => c.tipo.toLowerCase() === nome.toLowerCase())) { showFeedbackModal('Este indicador ja existe.', 'warning'); return; }
        const newId = Math.max(...mockData.composicaoCorporal.map(c => c.id), 0) + 1;
        mockData.composicaoCorporal.push({ id: newId, tipo: nome, valor: '-', unidade, ideal: toIdealObjectFromInput(ideal), dataHora: '', variacao: 'normal', icon, fonte, historico: [] });
        mockData.configComposicao[nome] = { exibirCorpo: true, exibirDashboard: false };
        renderMeusIndicadoresCorpo();
        renderComposicao();
      }
    }
    closeNI();
  });
});

// ===== COMPOSIÇÃO CORPORAL - CONFIG =====

function openComposicaoConfigModal() {
  renderComposicaoConfig();
  document.getElementById('composicaoConfigModal').classList.add('active');
}

// ===== VALORES IDEAIS =====

// (unificado em openValoresIdeaisModal acima)

// ===== DISPOSITIVOS =====

function renderDispositivos() {
  const el = document.getElementById('dispositivosContent');
  if (!el) return;

  if (mockData.dispositivos.length === 0) {
    el.innerHTML = '<div class="card-info" style="padding: 8px; color: #999;">Nenhum dispositivo cadastrado.</div>';
    return;
  }

  el.innerHTML = mockData.dispositivos.map(d => `
    <div class="config-item" style="margin-bottom: 8px;">
      <div class="config-item-content">
        <div class="config-icon">${d.icon}</div>
        <div class="config-text">
          <div class="config-title">${d.nome}</div>
          <div class="config-subtitle">${d.tipo} • ${d.sinaisColetados.length} sinais</div>
          <div class="config-subtitle" style="font-size: 10px; margin-top: 2px; color: #bbb;">${d.sinaisColetados.join(', ')}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <button class="toggle ${d.conectado ? 'active' : ''}" onclick="toggleDispositivo(${d.id}, this)"></button>
        <button onclick="removeDispositivo(${d.id})" style="background:none;border:none;font-size:14px;cursor:pointer;color:#ccc;">🗑️</button>
      </div>
    </div>
  `).join('');
}

function toggleDispositivo(id, btn) {
  const d = mockData.dispositivos.find(d => d.id === id);
  if (d) { d.conectado = !d.conectado; btn.classList.toggle('active'); }
}

function removeDispositivo(id) {
  mockData.dispositivos = mockData.dispositivos.filter(d => d.id !== id);
  renderDispositivos();
}

let currentTipoDispositivo = null;

function openAddDispositivoModal() {
  document.getElementById('dispositivoNomeInput').value = '';
  document.getElementById('dispositivoTipoSelect').value = '';
  document.getElementById('dispositivoSinaisContainer').innerHTML = '';
  document.getElementById('addDispositivoModal').classList.add('active');
}

function onTipoDispositivoChange() {
  const tipo = document.getElementById('dispositivoTipoSelect').value;
  const catalogo = mockData.catalogoDispositivos.find(c => c.tipo === tipo);
  const container = document.getElementById('dispositivoSinaisContainer');

  if (!catalogo) { container.innerHTML = ''; return; }

  container.innerHTML = `
    <div class="form-label" style="margin-bottom: 8px;">Sinais coletados por este dispositivo:</div>
    <div class="form-checkbox-group">
      ${catalogo.sinaisDisponiveis.map(s => `
        <div class="form-checkbox-item">
          <input type="checkbox" class="form-checkbox dispositivo-sinal-check" value="${s}" id="dsinal_${s.replace(/\s/g,'_')}" checked>
          <label for="dsinal_${s.replace(/\s/g,'_')}">${s}</label>
        </div>
      `).join('')}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('addDispositivoModal');
  const cancelBtn = document.getElementById('cancelDispositivoBtn');
  const form = document.getElementById('addDispositivoForm');

  const closeModal = () => { modal.classList.remove('active'); form.reset(); document.getElementById('dispositivoSinaisContainer').innerHTML = ''; };

  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('dispositivoNomeInput').value.trim();
    const tipo = document.getElementById('dispositivoTipoSelect').value;
    if (!nome || !tipo) { showFeedbackModal('Preencha nome e tipo.', 'warning'); return; }

    const sinais = Array.from(document.querySelectorAll('.dispositivo-sinal-check:checked')).map(c => c.value);
    const catalogo = mockData.catalogoDispositivos.find(c => c.tipo === tipo);

    const newId = Math.max(...mockData.dispositivos.map(d => d.id), 0) + 1;
    mockData.dispositivos.push({
      id: newId,
      nome,
      tipo,
      icon: catalogo ? catalogo.icon : '📱',
      conectado: true,
      sinaisColetados: sinais
    });

    closeModal();
    renderDispositivos();
  });
});

// ===== CONFIGURAÇÃO DE SINAIS VITAIS =====

function openVitaisConfigModal() {
  renderVitaisConfig();
  document.getElementById('vitaisConfigModal').classList.add('active');
}

function renderVitaisConfig() {
  const html = mockData.sinaisVitais.map(v => {
    const cfg = mockData.configSinaisVitais[v.tipo] || { exibirSaude: true, exibirDashboard: false };
    return `
      <div class="vital-config-row">
        <span class="vital-config-icon">${v.icon}</span>
        <span class="vital-config-name">${v.tipo}</span>
        <div class="vital-config-toggles">
          <div class="toggle-col">
            <span class="toggle-col-label">Saúde</span>
            <button type="button" class="toggle ${cfg.exibirSaude ? 'active' : ''}"
              onclick="toggleVitalConfig('${v.tipo}', 'exibirSaude', this)"></button>
          </div>
          <div class="toggle-col">
            <span class="toggle-col-label">Dashboard</span>
            <button type="button" class="toggle ${cfg.exibirDashboard ? 'active' : ''}"
              onclick="toggleVitalConfig('${v.tipo}', 'exibirDashboard', this)"></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  document.getElementById('vitaisConfigContent').innerHTML = html;
}

function toggleVitalConfig(tipo, campo, btn) {
  if (!mockData.configSinaisVitais[tipo]) {
    mockData.configSinaisVitais[tipo] = { exibirSaude: true, exibirDashboard: false };
  }
  mockData.configSinaisVitais[tipo][campo] = !mockData.configSinaisVitais[tipo][campo];
  btn.classList.toggle('active');
  renderSaude();
  renderHome();
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeVitaisConfigModal');
  const modal = document.getElementById('vitaisConfigModal');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
});


let lastPressureValue = null;
let lastManualMeasurementMeta = { isSporadic: true, dateISO: null, timeHHMM: null };
let currentMoodValue = 0;
let capturedPressureFromSource = null;

/** Simula leitura de PA conforme a fonte (mock para protótipo). */
function simulatePressureCaptureForFonte(fonte) {
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const profiles = {
    Pulseira: () => ({
      sistolica: r(108, 126),
      diastolica: r(68, 84),
      linha: 'Sensor da pulseira — leitura estável'
    }),
    'Google Fit': () => ({
      sistolica: r(114, 132),
      diastolica: r(72, 88),
      linha: 'Última sincronização do Google Fit'
    }),
    'Apple Health': () => ({
      sistolica: r(112, 128),
      diastolica: r(70, 86),
      linha: 'Registro importado do Apple Health'
    })
  };
  const gen = profiles[fonte] || profiles.Pulseira;
  return gen();
}

function clearVitalCaptureResultEl() {
  const el = document.getElementById('pressureCaptureResult');
  if (el) {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

function clearVitalCaptureState() {
  capturedPressureFromSource = null;
  clearVitalCaptureResultEl();
}

function resetPulseiraStepButtons() {
  document.querySelectorAll('.pulseira-step-btn').forEach((btn) => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
}

function togglePulseiraStep(btn) {
  const on = btn.classList.toggle('selected');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function completePulseiraGuide() {
  document.querySelectorAll('.pulseira-step-btn').forEach((btn) => {
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
  });
}

function isPulseiraChecklistComplete() {
  const steps = document.querySelectorAll('.pulseira-step-btn');
  if (steps.length === 0) return true;
  return [...steps].every((s) => s.classList.contains('selected'));
}

function setAutoCaptureHint(fonte) {
  const hint = document.getElementById('captureHintText');
  if (!hint) return;
  const copy = {
    Pulseira: 'Depois do preparo, sincronize a leitura enviada pela pulseira.',
    'Google Fit': 'Simula buscar a última medição sincronizada no Google Fit.',
    'Apple Health': 'Simula importar o último registro do Apple Health.'
  };
  hint.textContent = copy[fonte] || copy.Pulseira;
}

function openVitalDetailModal(tipoVital, vitalId) {
  currentVitalDetail = mockData.sinaisVitais.find(v => v.id === vitalId);
  
  if (!currentVitalDetail) return;

  document.getElementById('vitalDetailTitle').textContent = `Histórico de ${tipoVital}`;
  document.getElementById('filterVitalDataInicio').value = '';
  document.getElementById('filterVitalDataFim').value = '';
  
  renderVitalDetailContent(currentVitalDetail.historico);
  renderSparklineChart(currentVitalDetail.historico);
  document.getElementById('vitalDetailModal').classList.add('active');

  document.getElementById('addVitalMedicaoBtn').onclick = () => {
    openAddVitalModal(tipoVital);
  };
}

function renderSparklineChart(historico) {
  const canvas = document.getElementById('sparklineChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const values = historico.slice(0, 10).reverse().map(h => {
    if (typeof h.valor === 'object' && h.valor.sistolica != null) return parseInt(h.valor.sistolica, 10);
    if (typeof h.valor === 'string' && h.valor.includes('/')) return parseInt(h.valor.split('/')[0], 10);
    return parseFloat(h.valor);
  }).filter(v => !isNaN(v));

  if (values.length === 0) return;

  // Calcular faixa ideal do sinal atual
  let idealMin = null, idealMax = null;
  if (currentVitalDetail && currentVitalDetail.ideal) {
    const ideal = currentVitalDetail.ideal;
    if (ideal.type === 'range' && ideal.min != null && ideal.max != null) {
      idealMin = parseFloat(ideal.min);
      idealMax = parseFloat(ideal.max);
    } else if (ideal.type === 'pressure' && ideal.systolic != null) {
      idealMin = parseFloat(ideal.systolic) - 10;
      idealMax = parseFloat(ideal.systolic) + 10;
    } else if (ideal.type === 'target' && ideal.target != null) {
      idealMin = parseFloat(ideal.target) - 10;
      idealMax = parseFloat(ideal.target) + 10;
    }
  }

  // Range inclui valores ideais para escala correta
  const allValues = [...values];
  if (idealMin !== null) allValues.push(idealMin, idealMax);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const padding = 14;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const pointSpacing = graphWidth / (values.length - 1 || 1);

  const toY = v => height - padding - ((v - minValue) / range) * graphHeight;

  // Fundo
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, 0, width, height);

  // Faixa ideal (banda verde clara)
  if (idealMin !== null) {
    const yMax = toY(idealMax);
    const yMin = toY(idealMin);
    ctx.fillStyle = 'rgba(46, 125, 50, 0.10)';
    ctx.fillRect(padding, yMax, graphWidth, yMin - yMax);

    // Linha ideal min
    ctx.strokeStyle = 'rgba(46, 125, 50, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding, toY(idealMin));
    ctx.lineTo(padding + graphWidth, toY(idealMin));
    ctx.stroke();

    // Linha ideal max
    ctx.beginPath();
    ctx.moveTo(padding, toY(idealMax));
    ctx.lineTo(padding + graphWidth, toY(idealMax));
    ctx.stroke();
    ctx.setLineDash([]);

    // Label "Ideal"
    ctx.fillStyle = 'rgba(46, 125, 50, 0.7)';
    ctx.font = '9px sans-serif';
    ctx.fillText('ideal', padding + 2, toY(idealMax) - 2);
  }

  // Linha dos valores
  ctx.strokeStyle = '#7e91cd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + index * pointSpacing;
    const y = toY(value);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Pontos
  values.forEach((value, index) => {
    const x = padding + index * pointSpacing;
    const y = toY(value);
    const isIdeal = idealMin !== null && value >= idealMin && value <= idealMax;
    ctx.fillStyle = isIdeal ? '#2E7D32' : '#E53935';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderVitalDetailContent(historico) {
  if (historico.length === 0) {
    document.getElementById('vitalDetailContent').innerHTML = '<div class=\"empty-state\"><div class=\"empty-text\">Nenhum registro encontrado</div></div>';
    return;
  }

  const html = historico.map(h => {
    const dataFormatada = formatDateForUI(h.data);
    const hora = h.hora ? ` ${h.hora}` : '';
    const statusIcon = h.status === 'normal' ? '🟢' : '🔴';
    const valorFormatado = typeof formatHistoricValue === 'function'
      ? formatHistoricValue(currentVitalDetail?.tipo, h)
      : h.valor;
    
    return `
      <div class=\"vital-list-item\">\n        <div class=\"vital-list-date\">${dataFormatada}${hora}</div>\n        <div class=\"vital-list-value\">${valorFormatado}</div>\n        <div class=\"vital-list-status\">${statusIcon}</div>\n      </div>\n    `;
  }).join('');
  
  document.getElementById('vitalDetailContent').innerHTML = html;
}

function filterVitalDetail() {
  if (!currentVitalDetail) return;

  const dataInicio = document.getElementById('filterVitalDataInicio').value;
  const dataFim = document.getElementById('filterVitalDataFim').value;

  let filtrado = currentVitalDetail.historico;

  if (dataInicio) {
    filtrado = filtrado.filter(h => h.data >= dataInicio);
  }

  if (dataFim) {
    filtrado = filtrado.filter(h => h.data <= dataFim);
  }

  renderVitalDetailContent(filtrado);
  renderSparklineChart(filtrado);
}

function openAddVitalModal(tipoVital) {
  currentVitalType = tipoVital;
  const vital = mockData.sinaisVitais.find(v => v.tipo === tipoVital);

  document.getElementById('tipoVitalInput').value = tipoVital;
  document.getElementById('addVitalModalTitle').textContent = tipoVital;

  const pressureContainer = document.getElementById('pressureInputContainer');
  const pressureCaptureContainer = document.getElementById('pressureCaptureContainer');
  const standardContainer = document.getElementById('standardInputContainer');

  if (tipoVital === 'Pressão Arterial') {
    pressureContainer.style.display = 'none';
    if (pressureCaptureContainer) pressureCaptureContainer.style.display = 'none';
    standardContainer.style.display = 'none';
  } else {
    pressureContainer.style.display = 'none';
    if (pressureCaptureContainer) pressureCaptureContainer.style.display = 'none';
    standardContainer.style.display = 'block';
    // Mostrar unidade ao lado do input
    const unidade = vital ? vital.unidade : '';
    document.getElementById('unidadeVitalDisplay').textContent = unidade;
    document.getElementById('valorVitalLabel').textContent = `Valor (${unidade})`;
    setTimeout(() => document.getElementById('valorVitalInput').focus(), 100);
  }

  document.getElementById('fonteVitalInput').value = '';
  document.querySelectorAll('.vital-fonte-btn').forEach(btn => btn.classList.remove('selected'));
  const checklist = document.getElementById('pulseiraChecklist');
  if (checklist) checklist.style.display = 'none';
  resetPulseiraStepButtons();
  clearVitalCaptureState();
  document.getElementById('addVitalModal').classList.add('active');
}

function setVitalFonte(value, btnEl) {
  const input = document.getElementById('fonteVitalInput');
  if (input) input.value = value;
  document.querySelectorAll('.vital-fonte-btn').forEach(btn => btn.classList.remove('selected'));
  if (btnEl) btnEl.classList.add('selected');
  const isPressure = currentVitalType === 'Pressão Arterial';
  const pressureContainer = document.getElementById('pressureInputContainer');
  const pressureCaptureContainer = document.getElementById('pressureCaptureContainer');
  const checklist = document.getElementById('pulseiraChecklist');
  if (checklist) checklist.style.display = value === 'Pulseira' ? 'block' : 'none';
  if (value !== 'Pulseira') resetPulseiraStepButtons();
  if (isPressure) {
    if (value === 'Manual') {
      if (pressureContainer) pressureContainer.style.display = 'block';
      if (pressureCaptureContainer) pressureCaptureContainer.style.display = 'none';
      clearVitalCaptureState();
      setTimeout(() => document.getElementById('sistolicaInput')?.focus(), 100);
    } else {
      if (pressureContainer) pressureContainer.style.display = 'none';
      if (pressureCaptureContainer) pressureCaptureContainer.style.display = 'block';
      setAutoCaptureHint(value);
      clearVitalCaptureState();
      if (value === 'Pulseira') resetPulseiraStepButtons();
    }
  }
}

function collectPressureFromSource() {
  const fonte = document.getElementById('fonteVitalInput')?.value;
  if (!fonte || fonte === 'Manual') {
    showFeedbackModal('Selecione Pulseira, Google Fit ou Apple Health.', 'warning');
    return;
  }
  const mock = simulatePressureCaptureForFonte(fonte);
  capturedPressureFromSource = {
    sistolica: mock.sistolica,
    diastolica: mock.diastolica,
    fonte
  };
  const result = document.getElementById('pressureCaptureResult');
  if (result) {
    result.innerHTML = `<span class="vital-capture-value">${mock.sistolica}/${mock.diastolica} mmHg</span><span class="vital-capture-meta">${mock.linha}</span>`;
    result.style.display = 'block';
  }
}

function setupVitalModals() {
  const addVitalModal = document.getElementById('addVitalModal');
  const cancelAddVitalBtn = document.getElementById('cancelAddVitalBtn');
  const addVitalForm = document.getElementById('addVitalForm');

  const closeModal = () => {
    addVitalModal.classList.remove('active');
    addVitalForm.reset();
    document.getElementById('unidadeVitalDisplay').textContent = '';
    resetPulseiraStepButtons();
    clearVitalCaptureState();
  };

  cancelAddVitalBtn.addEventListener('click', closeModal);

  addVitalModal.addEventListener('click', (e) => {
    if (e.target === addVitalModal) closeModal();
  });

  addVitalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipoVital = document.getElementById('tipoVitalInput').value;
    const fonte = document.getElementById('fonteVitalInput').value;
    const agora = new Date();
    const dataHora = `${agora.toISOString().slice(0, 10)}T${agora.toTimeString().slice(0, 5)}:00`;

    if (!fonte) {
      showFeedbackModal('Selecione a fonte da medicao.', 'warning');
      return;
    }

    if (fonte === 'Pulseira' && !isPulseiraChecklistComplete()) {
      showFeedbackModal('Para medicao por pulseira, conclua o checklist de preparo.', 'warning');
      return;
    }

    if (tipoVital === 'Pressão Arterial') {
      let sistolica;
      let diastolica;
      if (fonte === 'Manual') {
        sistolica = document.getElementById('sistolicaInput').value;
        diastolica = document.getElementById('diastolicaInput').value;
        if (!sistolica || !diastolica) { showFeedbackModal('Preencha sistolica e diastolica.', 'warning'); return; }
      } else {
        if (!capturedPressureFromSource) {
          showFeedbackModal('Toque em "Capturar / Coletar dados" para continuar.', 'warning');
          return;
        }
        sistolica = capturedPressureFromSource.sistolica;
        diastolica = capturedPressureFromSource.diastolica;
      }
      lastPressureValue = `${sistolica}/${diastolica}`;
      lastManualMeasurementMeta = {
        isSporadic: true,
        dateISO: agora.toISOString().slice(0, 10),
        timeHHMM: agora.toTimeString().slice(0, 5)
      };

      const vital = mockData.sinaisVitais.find(v => v.tipo === tipoVital);
      if (vital) {
        vital.valor = { sistolica: parseInt(sistolica, 10), diastolica: parseInt(diastolica, 10) };
        vital.fonte = fonte;
        vital.tempo = 'Agora';
        vital.dataHora = dataHora;
        vital.historico.unshift({
          data: agora.toISOString().slice(0, 10),
          hora: agora.toTimeString().slice(0, 5),
          valor: { sistolica: parseInt(sistolica, 10), diastolica: parseInt(diastolica, 10) },
          status: 'normal'
        });
        checkVitalAlert(vital);
      }

      closeModal();
      document.getElementById('heartRateFollowupModal').classList.add('active');
      setTimeout(() => document.getElementById('heartRateInput').focus(), 100);
    } else {
      const valor = document.getElementById('valorVitalInput').value;
      if (!valor) { showFeedbackModal('Informe o valor.', 'warning'); return; }

      const vital = mockData.sinaisVitais.find(v => v.tipo === tipoVital);
      if (vital) {
        vital.valor = parseFloat(valor);
        vital.fonte = fonte;
        vital.tempo = 'Agora';
        vital.dataHora = dataHora;
        vital.historico.unshift({
          data: agora.toISOString().slice(0, 10),
          hora: agora.toTimeString().slice(0, 5),
          valor: parseFloat(valor),
          status: 'normal'
        });
        checkVitalAlert(vital);
      }

      closeModal();
      renderSaude();
      if (currentVitalDetail && currentVitalDetail.tipo === tipoVital) {
        renderVitalDetailContent(vital.historico);
        renderSparklineChart(vital.historico);
      }
    }
  });
}

function confirmHeartRateFollowup() {
  const heartRate = document.getElementById('heartRateInput').value;
  
  if (!heartRate) {
    showFeedbackModal('Digite o batimento cardiaco.', 'warning');
    return;
  }
  
  const vital = mockData.sinaisVitais.find(v => v.tipo === 'Batimento Cardíaco');
  if (vital) {
    vital.valor = parseInt(heartRate);
    vital.tempo = 'Agora';
    const now = new Date();
    vital.dataHora = `${now.toISOString().slice(0, 10)}T${now.toTimeString().slice(0, 5)}:00`;
    vital.historico.unshift({
      data: now.toISOString().slice(0, 10),
      hora: now.toTimeString().slice(0, 5),
      valor: parseInt(heartRate, 10),
      status: 'normal'
    });
    checkVitalAlert(vital);
  }
  
  document.getElementById('heartRateFollowupModal').classList.remove('active');
  document.getElementById('heartRateInput').value = '';
  renderSaude();
  openMoodCheckinModal();
}

function skipHeartRateFollowup() {
  document.getElementById('heartRateFollowupModal').classList.remove('active');
  document.getElementById('heartRateInput').value = '';
  renderSaude();
  openMoodCheckinModal();
}

function openMoodCheckinModal() {
  const modal = document.getElementById('moodCheckinModal');
  if (!modal) return;

  currentMoodValue = 0;
  document.querySelectorAll('.mood-face').forEach(btn => btn.classList.remove('selected'));
  const confirmBtn = document.getElementById('moodConfirmBtn');
  if (confirmBtn) confirmBtn.disabled = true;

  const noteEl = document.getElementById('moodNoteInput');
  if (noteEl) noteEl.value = '';

  document.querySelectorAll('#symptomsPanel .mood-symptom-btn').forEach(btn => btn.classList.remove('selected'));

  const symptomsPanel = document.getElementById('symptomsPanel');
  const notePanel = document.getElementById('notePanel');
  if (symptomsPanel) symptomsPanel.style.display = 'none';
  if (notePanel) notePanel.style.display = 'none';

  const timeInput = document.getElementById('moodTimeInput');
  const defaultTime = (lastManualMeasurementMeta && lastManualMeasurementMeta.timeHHMM) ? lastManualMeasurementMeta.timeHHMM : getCurrentHHMM();
  if (timeInput) timeInput.value = defaultTime;

  const rescheduleBtn = document.getElementById('moodRescheduleBtn');
  if (rescheduleBtn) {
    rescheduleBtn.style.display = (lastManualMeasurementMeta && lastManualMeasurementMeta.isSporadic) ? '' : 'none';
  }

  renderMoodHistory();
  modal.classList.add('active');
}

function closeMoodCheckinModal() {
  const modal = document.getElementById('moodCheckinModal');
  if (modal) modal.classList.remove('active');
}

function ignoreMoodCheckin() {
  closeMoodCheckinModal();
  showFeedbackModal('Registro concluido. Obrigado!', 'success');
}

function selectMoodFace(value) {
  currentMoodValue = value;
  document.querySelectorAll('.mood-face').forEach(btn => {
    const v = parseInt(btn.getAttribute('data-value') || '0', 10);
    btn.classList.toggle('selected', v === value);
  });
  const confirmBtn = document.getElementById('moodConfirmBtn');
  if (confirmBtn) confirmBtn.disabled = false;
}

function toggleSymptomsPanel() {
  const el = document.getElementById('symptomsPanel');
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleSymptomButton(btn) {
  if (!btn) return;
  btn.classList.toggle('selected');
}

function toggleNotePanel() {
  const el = document.getElementById('notePanel');
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function getSelectedSymptoms() {
  return Array.from(document.querySelectorAll('#symptomsPanel .mood-symptom-btn.selected'))
    .map(btn => btn.getAttribute('data-value'))
    .filter(Boolean);
}

function getLatestPressureAndHeartRate() {
  const p = mockData.sinaisVitais.find(v => v.tipo === 'Pressão Arterial');
  const h = mockData.sinaisVitais.find(v => v.tipo === 'Batimento Cardíaco');
  return { pressure: p ? p.valor : null, heartRate: h ? h.valor : null };
}

function confirmMoodCheckin() {
  if (!currentMoodValue) {
    showFeedbackModal('Selecione como voce esta se sentindo (humor).', 'warning');
    return;
  }

  if (!mockData.moodCheckins) mockData.moodCheckins = [];

  const { pressure, heartRate } = getLatestPressureAndHeartRate();
  const time = document.getElementById('moodTimeInput')?.value || getCurrentHHMM();
  const note = document.getElementById('moodNoteInput')?.value || '';
  const symptoms = getSelectedSymptoms();
  const dateISO = (lastManualMeasurementMeta && lastManualMeasurementMeta.dateISO) ? lastManualMeasurementMeta.dateISO : getTodayISODate();

  mockData.moodCheckins.unshift({
    date: dateISO,
    time,
    mood: currentMoodValue,
    symptoms,
    note,
    pressure,
    heartRate
  });

  closeMoodCheckinModal();
  showFeedbackModal('Check-in registrado. Obrigado!', 'success');
}

function rescheduleMoodCheckin() {
  const modal = document.getElementById('rescheduleMeasurementModal');
  const input = document.getElementById('nextMeasurementDateTimeInput');
  if (!modal || !input) return;

  const baseDate = (lastManualMeasurementMeta && lastManualMeasurementMeta.dateISO) ? lastManualMeasurementMeta.dateISO : getTodayISODate();
  const baseTime = (lastManualMeasurementMeta && lastManualMeasurementMeta.timeHHMM) ? lastManualMeasurementMeta.timeHHMM : getCurrentHHMM();
  const base = new Date(`${baseDate}T${baseTime}:00`);
  base.setHours(base.getHours() + 6);
  const nextISO = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}T${String(base.getHours()).padStart(2, '0')}:${String(base.getMinutes()).padStart(2, '0')}`;
  input.value = nextISO;

  closeMoodCheckinModal();
  modal.classList.add('active');
}

function confirmRescheduleMeasurement() {
  const input = document.getElementById('nextMeasurementDateTimeInput');
  const toggle = document.getElementById('notifyNextMeasurementToggle');
  const modal = document.getElementById('rescheduleMeasurementModal');
  if (!input || !modal) return;

  if (!input.value) {
    showFeedbackModal('Selecione data e hora para a proxima medicao.', 'warning');
    return;
  }

  const notify = toggle ? toggle.classList.contains('active') : true;
  if (!mockData.measurementReschedules) mockData.measurementReschedules = [];

  if (notify && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  mockData.measurementReschedules.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    tipo: 'pressao-batimento-manual',
    proximaMedicao: input.value,
    notificar: notify,
    criadoEm: `${getTodayISODate()}T${getCurrentHHMM()}:00`,
    alertedAt: null
  });

  modal.classList.remove('active');
  const dateObj = new Date(input.value);
  const dateTxt = formatDateForUI(input.value.slice(0, 10));
  const timeTxt = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  showFeedbackModal(`Reagendado para ${dateTxt} às ${timeTxt}. ${notify ? 'Notificacao ativada.' : 'Sem notificacao.'}`, 'success');
}

function formatPressureValueForUI(value) {
  if (!value) return '--/--';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.sistolica != null && value.diastolica != null) return `${value.sistolica}/${value.diastolica}`;
  return String(value);
}

function renderMoodHistory() {
  const list = document.getElementById('moodHistoryList');
  if (!list) return;

  const pressure = mockData.sinaisVitais.find(v => v.tipo === 'Pressão Arterial');
  const heart = mockData.sinaisVitais.find(v => v.tipo === 'Batimento Cardíaco');
  const pHist = (pressure && pressure.historico) ? pressure.historico.slice(0, 5) : [];
  const hHist = (heart && heart.historico) ? heart.historico.slice(0, 5) : [];

  const merged = [];
  for (let i = 0; i < Math.max(pHist.length, hHist.length); i++) {
    const p = pHist[i];
    const h = hHist[i];
    if (!p && !h) break;
    merged.push({
      date: (p && p.data) || (h && h.data) || getTodayISODate(),
      time: (p && p.hora) || (h && h.hora) || '',
      pressure: p ? p.valor : null,
      heartRate: h ? h.valor : null
    });
  }

  if (!merged.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-text">Sem historico recente</div></div>';
    return;
  }

  list.innerHTML = merged.map(item => {
    const dateBR = formatDateForUI(item.date);
    const timeTxt = item.time ? ` • ${item.time}` : '';
    const pTxt = `PA ${formatPressureValueForUI(item.pressure)}`;
    const hTxt = item.heartRate != null ? `FC ${item.heartRate} bpm` : 'FC --';
    return `
      <div class="mood-history-item">
        <div class="mood-history-left">
          <div class="mood-history-date">${dateBR}${timeTxt}</div>
          <div class="mood-history-values">${pTxt} • ${hTxt}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Setup Heart Rate Followup Modal
document.addEventListener('DOMContentLoaded', () => {
  const heartRateFollowupModal = document.getElementById('heartRateFollowupModal');
  if (heartRateFollowupModal) {
    heartRateFollowupModal.addEventListener('click', (e) => {
      if (e.target === heartRateFollowupModal) {
        heartRateFollowupModal.classList.remove('active');
      }
    });
  }
});

// Setup Mood Checkin Modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('moodCheckinModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeMoodCheckinModal();
    });
  }
});

// Setup Reschedule Measurement Modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('rescheduleMeasurementModal');
  const closeBtn = document.getElementById('closeRescheduleMeasurementModal');
  const cancelBtn = document.getElementById('cancelRescheduleMeasurementBtn');

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});
