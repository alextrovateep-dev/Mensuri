// Componentes Reutilizáveis

// Card de Sinal Vital Melhorado - Condensado com Tendência
function createVitalCard(vital) {
  const colors = categoryColors.saude;
  const variacaoIcon = vital.variacao === 'normal' ? '🟢' : '🔴';
  const idealLabel = typeof formatIdealLabel === 'function' ? formatIdealLabel(vital.ideal) : vital.ideal;
  const vitalValue = typeof formatVitalValue === 'function' ? formatVitalValue(vital) : vital.valor;
  
  const tendenciaArrow = vital.tendencia === 'up' ? '↑' : '↓';
  const tendenciaClass = vital.tendencia === 'up' ? 'up' : 'down';
  
  // Formatar data/hora
  let dataHoraFormatada = '';
  if (vital.dataHora) {
    dataHoraFormatada = typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(vital.dataHora) : vital.dataHora;
  }
  
  // Últimas 3 medições
  const ultimas3 = vital.historico
    .slice(0, 3)
    .reverse()
    .map(h => (typeof formatHistoricValue === 'function' ? formatHistoricValue(vital.tipo, h) : h.valor))
    .join('→');
  
  return `
    <div class="card card-saude vital-card card-has-action" style="border-left-color: ${colors.border}; cursor: pointer;" onclick="openVitalDetailModal('${vital.tipo}', ${vital.id})">
      <div class="vital-header-compact">
        <div class="vital-title-with-ideal">
          <span class="vital-icon">${vital.icon}</span>
          <span class="vital-title-text">${vital.tipo} | ${idealLabel}</span>
        </div>
        <div class="vital-status-icon">${variacaoIcon}</div>
      </div>
      
      <div class="vital-main-line">
        <span class="vital-value-main">${vitalValue} ${vital.unidade}</span>
        <span class="vital-separator">•</span>
        <span class="vital-datetime">${dataHoraFormatada}</span>
      </div>

      <div class="vital-tendencia-line">
        <span class="vital-historico">${ultimas3}</span>
        <span class="vital-separator">|</span>
        <span class="vital-tendencia-text">
          Tendência
          <span class="vital-tendencia-arrow ${tendenciaClass}" aria-hidden="true">${tendenciaArrow}</span>
        </span>
      </div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card de Composição Corporal
function createComposicaoCard(item) {
  const variacaoClass = item.variacao === 'normal' ? 'variacao-normal' : 'variacao-alerta';
  const variacaoIcon = item.variacao === 'normal' ? '🟢' : '🔴';
  const fontePadrao = item.fonte || 'Manual';
  const idealLabel = typeof formatIdealLabel === 'function' ? formatIdealLabel(item.ideal) : item.ideal;
  const dataHora = item.dataHora
    ? (typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(item.dataHora) : item.dataHora)
    : '';
  
  return `
    <div class="card card-composicao card-has-action" style="cursor: pointer;" onclick="openComposicaoModal(${item.id}, '${item.tipo}')">
      <div class="composicao-header">
        <div class="composicao-icon">${item.icon}</div>
        <div class="composicao-info">
          <div class="composicao-title">${item.tipo}</div>
          <div class="composicao-ideal">Ideal: ${idealLabel}</div>
        </div>
        <div class="composicao-variacao ${variacaoClass}">${variacaoIcon}</div>
      </div>
      <div class="composicao-value">${item.valor} ${item.unidade}</div>
      <div class="composicao-footer">
        <span class="composicao-date">📅 ${dataHora}</span>
        <span class="composicao-source">📍 ${fontePadrao}</span>
      </div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card ECG
function createEcgCard(ecg) {
  const dataHora = typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(ecg.dataHora) : ecg.dataHora;
  return `
    <div class="card card-ecg card-has-action" onclick="openEcgDetail(${ecg.id})">
      <div class="ecg-header">
        <div class="ecg-icon">${ecg.icon}</div>
        <div class="ecg-info">
          <div class="ecg-title">Eletrocardiograma</div>
          <div class="ecg-date">📅 ${dataHora}</div>
        </div>
      </div>
      <div class="ecg-details">
        <div class="ecg-detail-item">
          <span class="ecg-label">FC:</span>
          <span class="ecg-value">${ecg.frequenciaCardiaca} bpm</span>
        </div>
        <div class="ecg-detail-item">
          <span class="ecg-label">Ritmo:</span>
          <span class="ecg-value">${ecg.ritmo}</span>
        </div>
      </div>
      <div class="ecg-interpretation">${ecg.interpretacao}</div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card de Medicação - Enhanced com Horários Clicáveis
function createMedicacaoCard(med) {
  const colors = categoryColors.medicacao;
  const ultimasDoses = getUltimasDoses(med, 3);
  const catalog = (typeof mockData !== 'undefined' && mockData.catalogoMedicamentos)
    ? mockData.catalogoMedicamentos.find(m => m.nome === med.nome)
    : null;
  const photoValue = med.foto || (catalog && catalog.foto) || '💊';
  const isPhotoImage = typeof photoValue === 'string' && photoValue.startsWith('data:');
  const photoHtml = typeof photoValue === 'string' && photoValue.startsWith('data:')
    ? `<img src="${photoValue}" alt="Foto do medicamento ${med.nome}">`
    : `<span class="med-photo-emoji" aria-hidden="true">${photoValue}</span>`;
  const estoqueAtual = med.estoqueAtual || 0;
  const estoqueMinimo = med.estoqueMinimo || 7;
  const temAviso = estoqueAtual <= estoqueMinimo;
  const totalTomados = med.historico.filter(h => h.status === 'tomado').length;
  const dosesPorDia = Math.max(1, (med.horarios || []).length);
  const diasRestantes = estoqueAtual > 0 ? Math.ceil(estoqueAtual / dosesPorDia) : 0;
  const faltaParaAcabar = Math.max(0, estoqueAtual);

  const hoje = typeof getTodayISODate === 'function'
    ? getTodayISODate()
    : new Date().toISOString().slice(0, 10);

  const horaAtual = typeof getCurrentHHMM === 'function'
    ? getCurrentHHMM()
    : `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

  const horariosHtml = med.horarios.map(horario => {
    const status = typeof getMedicationStatusForDate === 'function'
      ? getMedicationStatusForDate(med, hoje, horario, horaAtual)
      : 'pendente';

    const statusClass = status === 'tomado'
      ? 'status-tomado'
      : status === 'atrasado'
      ? 'status-atrasado'
      : 'status-a-tomar';

    const statusLabel = status === 'tomado'
      ? 'Tomado'
      : status === 'atrasado'
      ? 'Atrasado'
      : 'A tomar';

    return `
      <div class="horario-item ${statusClass}" onclick="openTakeModal('${med.nome}', '${med.dosagem}', '${horario}', ${med.id})">
        <span class="horario-time">${horario}</span>
        <span class="horario-status">${statusLabel}</span>
      </div>
    `;
  }).join('');

  const historicoHtml = ultimasDoses.length > 0 ? `
    <div class="med-historico">
      <div class="historico-title">Últimas doses:</div>
      <div class="historico-items">
        ${ultimasDoses.map(dose => `
          <div class="historico-item" title="${dose.data} ${dose.hora}">
            <span class="historico-hora">${dose.hora}</span>
            <span class="historico-status">${dose.status === 'tomado' ? '✅' : '❌'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="card card-medicacao-enhanced" style="border-left-color: ${colors.border}">
      <div class="med-header-enhanced">
        <div class="med-title-enhanced">
          <button class="med-photo ${isPhotoImage ? 'is-clickable' : ''}" type="button" ${isPhotoImage ? `onclick="openMedicationPhotoModalById(${med.id}); event.stopPropagation();"` : ''} title="${isPhotoImage ? 'Ver foto do medicamento' : 'Sem foto cadastrada'}">
            ${photoHtml}
          </button>
          <div class="med-title-text">
            <div class="med-name">${med.nome} <span class="med-title-feature">${med.dosagem}</span></div>
          </div>
        </div>
        <div class="med-actions-enhanced">
          <button class="med-action-btn-enhanced" onclick="openEditMedicacaoModal(${med.id})" title="Editar">✏️</button>
          <button class="med-action-btn-enhanced" onclick="deleteMedicacao(${med.id})" title="Deletar">🗑️</button>
        </div>
      </div>

      <div class="med-horarios-interactive">
        <div class="horarios-label">Toque no horário para marcar:</div>
        <div class="horarios-list-interactive">
          ${horariosHtml}
        </div>
      </div>

      ${historicoHtml}

      <div class="med-estoque compact">
        <div class="estoque-label">Tomados: ${totalTomados}</div>
        <div class="estoque-text">Estoque: ${estoqueAtual}</div>
        <div class="estoque-text">Faltam: ${faltaParaAcabar}</div>
      </div>

      ${temAviso ? `<div class="med-warning">⚠️ Estoque baixo: faltam ${faltaParaAcabar} comprimidos (aprox. ${diasRestantes} dia${diasRestantes === 1 ? '' : 's'})</div>` : ''}
    </div>
  `;
}

// Funções auxiliares para o card enhanced
function getUltimasDoses(med, limite = 3) {
  const hoje = typeof getTodayISODate === 'function'
    ? getTodayISODate()
    : new Date().toISOString().slice(0, 10);
  return med.historico
    .filter(h => h.data === hoje)
    .sort((a, b) => b.hora.localeCompare(a.hora))
    .slice(0, limite);
}

// Card de Consulta
function createConsultaCard(consulta) {
  const colors = categoryColors.agenda;
  const tipoIcon = consulta.tipo === 'Presencial' ? '🏥' : '💻';
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(consulta.data) : consulta.data;
  
  return `
    <div class="card card-agenda" style="border-left-color: ${colors.border}">
      <div class="card-header">
        <div class="card-icon">${colors.icon}</div>
        <div class="card-title">${consulta.medico}</div>
      </div>
      <div class="card-info">${consulta.especialidade}</div>
      <div class="card-info">${dataBR} às ${consulta.hora}</div>
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
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(exame.data) : exame.data;
  
  return `
    <div class="exame-card" style="border-left-color: ${colors.border}">
      <div class="exame-header">
        <div>
          <div class="exame-title">${exame.nome}</div>
          <div class="card-info" style="margin-top: 4px;">${dataBR} • ${exame.local}</div>
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
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(compartilhamento.dataAutorizacao) : compartilhamento.dataAutorizacao;
  
  return `
    <div class="card card-saude" style="border-left-color: ${colors.border}">
      <div class="card-header">
        <div class="card-icon">👨⚕️</div>
        <div class="card-title">${compartilhamento.medico}</div>
      </div>
      <div class="card-info">${compartilhamento.especialidade}</div>
      <div class="card-info">Dados: ${dados}</div>
      <div class="card-info">Desde: ${dataBR}</div>
      <div class="card-info">Status: ${compartilhamento.ativo ? '✅ Ativo' : '❌ Inativo'}</div>
    </div>
  `;
}

// Funções auxiliares
function calcularDiasRestantes(medicacao) {
  if (!medicacao.dataFim || String(medicacao.dataFim).trim() === '') return null;
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
    if (typeof showFeedbackModal === 'function') {
      showFeedbackModal(`${medicacao.nome} deletado com sucesso.`, 'success');
    } else {
      alert(`${medicacao.nome} deletado com sucesso.`);
    }
  }
}
