// Componentes Reutilizáveis

// Card de Sinal Vital
function createVitalCard(vital) {
  const colors = categoryColors.saude;
  const dataHoraUltima = vital.dataHora || new Date().toLocaleString('pt-BR');
  const icon = vital.icon || colors.icon;
  return `
    <div class="card card-saude" style="border-left-color: ${colors.border}">
      <div class="card-header">
        <div class="card-icon">${icon}</div>
        <div class="card-title">${vital.tipo}</div>
      </div>
      <div class="card-value" style="color: ${colors.primary}">${vital.valor} ${vital.unidade}</div>
      <div class="card-info">Ideal: ${vital.ideal}</div>
      <div class="card-info">Fonte: ${vital.fonte}</div>
      <div class="card-info" style="color: #7e91cd; font-weight: 600; margin-top: 8px;">Última coleta: ${dataHoraUltima}</div>
      <div class="vital-action-buttons">
        <button class="vital-action-btn" onclick="openAddVitalModal('${vital.tipo}')">+ Adicionar</button>
        <button class="vital-action-btn" onclick="openVitalHistoryModal('${vital.tipo}')">Histórico</button>
      </div>
    </div>
  `;
}

// Card de Medicação - Padrão Único e Limpo
function createMedicacaoCard(med) {
  const colors = categoryColors.medicacao;
  const comprimidosRestantes = calcularComprimidosRestantes(med);
  const estoqueMinimo = med.estoqueMinimo || 7;
  const tomadiHoje = verificarSeTomadiHoje(med);
  const btnTakenClass = tomadiHoje ? 'taken' : '';
  const temAviso = comprimidosRestantes <= estoqueMinimo;
  
  // Layout com foto
  if (med.foto) {
    return `
      <div class="card card-medicacao card-medicacao-com-foto" style="border-left-color: ${colors.border}">
        <div class="med-foto-container">
          <img src="${med.foto}" alt="${med.nome}" onerror="this.src='assets/icon.png'">
        </div>
        <div class="med-info-container">
          <div class="med-header">
            <div class="med-title">
              <div class="med-name">${med.nome}</div>
              <div class="med-dosage">${med.dosagem}</div>
            </div>
            <div class="med-actions">
              <button class="med-action-btn ${btnTakenClass}" onclick="markAsTaken(${med.id})" title="Já Tomei">✅</button>
              <button class="med-action-btn" onclick="openEditMedicacaoModal(${med.id})" title="Editar">✏️</button>
              <button class="med-action-btn" onclick="deleteMedicacao(${med.id})" title="Deletar">🗑️</button>
            </div>
          </div>
          <div class="med-details">
            <span class="med-detail">🕐 ${med.horario}</span>
            <span class="med-detail">📅 ${med.frequencia}</span>
            <span class="med-detail">📦 ${comprimidosRestantes}/${med.estoque.split(' ')[0]}</span>
          </div>
          ${temAviso ? `<div class="med-warning">⚠️ Estoque baixo</div>` : ''}
        </div>
      </div>
    `;
  }
  
  // Layout sem foto
  return `
    <div class="card card-medicacao" style="border-left-color: ${colors.border}">
      <div class="med-header">
        <div class="med-title">
          <div class="med-name">${med.nome}</div>
          <div class="med-dosage">${med.dosagem}</div>
        </div>
        <div class="med-actions">
          <button class="med-action-btn ${btnTakenClass}" onclick="markAsTaken(${med.id})" title="Já Tomei">✅</button>
          <button class="med-action-btn" onclick="openEditMedicacaoModal(${med.id})" title="Editar">✏️</button>
          <button class="med-action-btn" onclick="deleteMedicacao(${med.id})" title="Deletar">🗑️</button>
        </div>
      </div>
      <div class="med-details">
        <span class="med-detail">🕐 ${med.horario}</span>
        <span class="med-detail">📅 ${med.frequencia}</span>
        <span class="med-detail">📦 ${comprimidosRestantes}/${med.estoque.split(' ')[0]}</span>
      </div>
      ${temAviso ? `<div class="med-warning">⚠️ Estoque baixo</div>` : ''}
    </div>
  `;
}

// Card de Consulta
function createConsultaCard(consulta) {
  const colors = categoryColors.agenda;
  const tipoIcon = consulta.tipo === 'Presencial' ? '🏥' : '💻';
  
  return `
    <div class="card card-agenda" style="border-left-color: ${colors.border}">
      <div class="card-header">
        <div class="card-icon">${colors.icon}</div>
        <div class="card-title">${consulta.medico}</div>
      </div>
      <div class="card-info">${consulta.especialidade}</div>
      <div class="card-info">${consulta.data} às ${consulta.hora}</div>
      <div class="card-info">${tipoIcon} ${consulta.tipo} • ${consulta.local}</div>
      <div class="card-info">Motivo: ${consulta.motivo}</div>
    </div>
  `;
}

// Card de Exame
function createExameCard(exame, isRealizado = false) {
  const colors = categoryColors.agenda;
  const statusColor = isRealizado ? '#2E7D32' : '#FFA500';
  const statusText = isRealizado ? '✅ Realizado' : '⏳ Agendado';
  
  return `
    <div class="exame-card" style="border-left-color: ${colors.border}">
      <div class="exame-header">
        <div>
          <div class="exame-title">${exame.nome}</div>
          <div class="card-info" style="margin-top: 4px;">${exame.data} • ${exame.local}</div>
        </div>
        <div class="exame-status" style="background-color: ${statusColor}20; color: ${statusColor}">
          ${statusText}
        </div>
      </div>
      ${isRealizado ? `
        <div class="resultado-box">
          <div class="resultado-title">Resultado:</div>
          <div class="resultado-text">${exame.resultado}</div>
        </div>
      ` : `
        <div class="card-info">Solicitado por: ${exame.medico}</div>
      `}
    </div>
  `;
}

// Card de Compartilhamento
function createCompartilhamentoCard(compartilhamento) {
  const colors = categoryColors.saude;
  const dados = compartilhamento.dadosCompartilhados.join(', ');
  
  return `
    <div class="card card-saude" style="border-left-color: ${colors.border}">
      <div class="card-header">
        <div class="card-icon">👨⚕️</div>
        <div class="card-title">${compartilhamento.medico}</div>
      </div>
      <div class="card-info">${compartilhamento.especialidade}</div>
      <div class="card-info">Dados: ${dados}</div>
      <div class="card-info">Desde: ${compartilhamento.dataAutorizacao}</div>
      <div class="card-info">Status: ${compartilhamento.ativo ? '✅ Ativo' : '❌ Inativo'}</div>
    </div>
  `;
}

// Funções auxiliares
function calcularDiasRestantes(medicacao) {
  const dataFim = new Date(medicacao.dataFim);
  const hoje = new Date();
  const diferenca = dataFim - hoje;
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

function calcularComprimidosRestantes(medicacao) {
  const tomados = medicacao.historico.filter(h => h.status === 'tomado').length;
  return parseInt(medicacao.estoque) - tomados;
}

function verificarSeTomadiHoje(medicacao) {
  const hoje = new Date().toLocaleDateString('pt-BR');
  return medicacao.historico.some(h => h.data === hoje && h.status === 'tomado');
}

function getStatusColor(status) {
  return statusColors[status] || statusColors.normal;
}

function getStatusIcon(status) {
  const icons = {
    'tomado': '✅',
    'pendente': '⏳',
    'nao_tomado': '❌'
  };
  return icons[status] || '❓';
}

// Deletar medicação
function deleteMedicacao(medicacaoId) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (medicacao && confirm(`Tem certeza que deseja deletar ${medicacao.nome}?`)) {
    mockData.medicacoes = mockData.medicacoes.filter(m => m.id !== medicacaoId);
    renderMedicacoes();
    alert(`✅ ${medicacao.nome} deletado com sucesso!`);
  }
}
