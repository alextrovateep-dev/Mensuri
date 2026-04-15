// Componentes Reutilizáveis

/**
 * Miniatura do medicamento: só aceita foto real em base64 (data:image/...).
 * Outros valores (emoji, nome de arquivo, vazio) usam placeholder com rótulo "Imagem".
 */
function getMedicationPhotoHtml(med, catalog) {
  const raw =
    med.foto != null && String(med.foto).trim() !== ''
      ? med.foto
      : catalog && catalog.foto != null
        ? catalog.foto
        : null;
  if (typeof raw === 'string' && raw.startsWith('data:image')) {
    return {
      isPhotoImage: true,
      html: `<img src="${raw}" alt="Foto do medicamento ${med.nome}">`
    };
  }
  return {
    isPhotoImage: false,
    html: `<span class="med-photo-placeholder">
      <svg class="med-photo-placeholder-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
      <span class="med-photo-placeholder-label">Imagem</span>
    </span>`
  };
}

/**
 * Miniatura: na lista (card) só a foto — sem “Detalhe”/“Visualizar” embaixo; toque abre foto ou edição.
 * Em manage mantém legenda Visualizar / Detalhe.
 */
function getMedicationPhotoColumnHtml(med, catalog, variant) {
  const { isPhotoImage, html: photoHtml } = getMedicationPhotoHtml(med, catalog);
  const btnClass = variant === 'manage' ? 'med-manage-photo' : 'med-photo';

  if (variant === 'card') {
    const clickAttr = isPhotoImage
      ? `onclick="openMedicationPhotoModalById(${med.id}); event.stopPropagation();"`
      : `onclick="openEditMedicacaoModal(${med.id}); event.stopPropagation();"`;
    return `
    <div class="med-photo-column med-photo-column--card-clean">
      <button type="button" class="${btnClass} is-clickable" ${clickAttr} title="${isPhotoImage ? 'Ver foto' : 'Editar medicação'}">
        ${photoHtml}
      </button>
    </div>`;
  }

  const hint = isPhotoImage
    ? `<button type="button" class="med-photo-hint-btn" onclick="openMedicationPhotoModalById(${med.id}); event.stopPropagation();">Visualizar</button>`
    : `<button type="button" class="med-photo-hint-btn med-photo-hint-btn--muted" onclick="openEditMedicacaoModal(${med.id}); event.stopPropagation();">Detalhe</button>`;
  return `
    <div class="med-photo-column">
      <button class="${btnClass} ${isPhotoImage ? 'is-clickable' : ''}" type="button" ${isPhotoImage ? `onclick="openMedicationPhotoModalById(${med.id}); event.stopPropagation();"` : ''} title="${isPhotoImage ? 'Ver foto em tamanho maior' : 'Sem foto cadastrada'}">
        ${photoHtml}
      </button>
      ${hint}
    </div>
  `;
}

// Card de Sinal Vital: ícone + valores (sem nome do indicador no cartão — o ícone identifica)
function createVitalCard(vital) {
  const variacaoIcon = vital.variacao === 'normal' ? '🟢' : '🔴';
  const unit = vital.unidade ? ` ${vital.unidade}` : '';
  let valueHtml;
  if (vital.tipo === 'Pressão Arterial' && vital.valor && typeof vital.valor === 'object') {
    const s = vital.valor.sistolica;
    const d = vital.valor.diastolica;
    valueHtml = `<span class="vital-pressure-abbr">SIS</span> ${s} / <span class="vital-pressure-abbr">DIA</span> ${d}${unit}`;
  } else {
    const vitalValue = typeof formatVitalValue === 'function' ? formatVitalValue(vital) : vital.valor;
    valueHtml = `${vitalValue}${unit}`;
  }

  let dataHoraFormatada = '';
  if (vital.dataHora) {
    dataHoraFormatada = typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(vital.dataHora) : vital.dataHora;
  }

  const tipoSafe = String(vital.tipo).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const tipoAttr = String(vital.tipo).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  if (vital.tipo === 'Batimento Cardíaco') {
    const toneClass =
      typeof getBatimentoCardTone === 'function' ? getBatimentoCardTone(vital) : 'vital-batimento-tone--none';
    const mm =
      typeof getBatimentoMinMaxForCard === 'function' ? getBatimentoMinMaxForCard(vital) : null;
    const mmText =
      mm && mm.minStr != null && mm.maxStr != null
        ? `${mm.minStr} - ${mm.maxStr}bpm`
        : '';
    const mmBlock = mmText
      ? `<span class="vital-batimento-badge ${toneClass}">${mmText}</span>`
      : `<span class="vital-batimento-badge vital-batimento-badge--empty vital-batimento-tone--none" aria-hidden="true">—</span>`;
    const rawVal = typeof formatVitalValue === 'function' ? formatVitalValue(vital) : vital.valor;
    const n = parseFloat(rawVal);
    const numHtml = Number.isNaN(n) ? '—' : String(Math.round(n));
    const heartSvg = `<svg class="vital-batimento-heart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" aria-hidden="true" focusable="false"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`;
    return `
    <div class="card card-saude vital-card vital-card--batimento card-has-action" role="article" aria-label="${tipoAttr}" style="cursor: pointer;" onclick="openVitalDetailModal('${tipoSafe}', ${vital.id})">
      <div class="vital-batimento-stack">
        <div class="vital-batimento-top">
          <div class="vital-batimento-top-left">
            <span class="vital-icon vital-icon--batimento" aria-hidden="true">${heartSvg}</span>
            <span class="vital-batimento-title">Batimentos</span>
          </div>
          ${mmBlock}
        </div>
        <div class="vital-batimento-value-row">
          <span class="vital-batimento-num">${numHtml}</span><span class="vital-batimento-unit">bpm</span>
        </div>
      </div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
  }

  const rangeLine =
    typeof formatVital24hRangeLine === 'function'
      ? formatVital24hRangeLine(vital)
      : '<div class="vital-24h-line"><span class="vital-24h-clock" aria-hidden="true">🕐</span><span class="vital-24h-empty">—</span></div>';

  const valueMainClass =
    vital.tipo === 'Pressão Arterial' ? 'vital-value-main vital-value-main--pressure' : 'vital-value-main';
  return `
    <div class="card card-saude vital-card card-has-action" role="article" aria-label="${tipoAttr}" style="cursor: pointer;" onclick="openVitalDetailModal('${tipoSafe}', ${vital.id})">
      <div class="vital-header-compact vital-header--icon-value">
        <span class="vital-icon" aria-hidden="true">${vital.icon}</span>
        <span class="${valueMainClass}">${valueHtml}</span>
        <span class="vital-status-icon" aria-hidden="true">${variacaoIcon}</span>
      </div>
      <div class="vital-meta-line">
        <span class="vital-datetime">${dataHoraFormatada}</span>
      </div>
      ${rangeLine}
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card de Composição Corporal: ícone + nome do indicador + valores
function createComposicaoCard(item) {
  const variacaoClass = item.variacao === 'normal' ? 'variacao-normal' : 'variacao-alerta';
  const variacaoIcon = item.variacao === 'normal' ? '🟢' : '🔴';
  const fontePadrao = item.fonte || 'Manual';
  const dataHora = item.dataHora
    ? (typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(item.dataHora) : item.dataHora)
    : '';
  const tipoArg = JSON.stringify(item.tipo);
  const tipoAttr = String(item.tipo).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const tipoHtml = String(item.tipo)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
    <div class="card card-composicao card-has-action" role="article" aria-label="${tipoAttr}" style="cursor: pointer;" onclick="openComposicaoModal(${item.id}, ${tipoArg})">
      <div class="composicao-header composicao-header--with-title">
        <div class="composicao-icon" aria-hidden="true">${item.icon}</div>
        <div class="composicao-info">
          <div class="composicao-title">${tipoHtml}</div>
          <div class="composicao-value-row">
            <div class="composicao-value">${item.valor} ${item.unidade}</div>
            <div class="composicao-variacao ${variacaoClass}" aria-hidden="true">${variacaoIcon}</div>
          </div>
        </div>
      </div>
      <div class="composicao-footer composicao-footer--compact">
        <span class="composicao-date">${dataHora}</span>
        <span class="composicao-source-icon" title="${fontePadrao}">📍</span>
      </div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card ECG (mesma lógica: ícone + números, sem rótulos de texto)
function createEcgCard(ecg) {
  const dataHora = typeof formatISODateTimeBR === 'function' ? formatISODateTimeBR(ecg.dataHora) : ecg.dataHora;
  return `
    <div class="card card-ecg card-has-action" role="article" aria-label="Eletrocardiograma" onclick="openEcgDetail(${ecg.id})">
      <div class="ecg-header ecg-header--compact">
        <div class="ecg-icon" aria-hidden="true">${ecg.icon}</div>
        <div class="ecg-value-stack">
          <div class="ecg-value-line"><span class="ecg-value-num">${ecg.frequenciaCardiaca}</span><span class="ecg-value-unit"> bpm</span></div>
          <div class="ecg-rhythm-line">${ecg.ritmo}</div>
        </div>
      </div>
      <div class="ecg-meta"><span class="ecg-date">📅 ${dataHora}</span></div>
      <div class="ecg-interpretation">${ecg.interpretacao}</div>
      <span class="card-action-plus" aria-hidden="true">+</span>
    </div>
  `;
}

// Card de Medicação — layout alinhado ao protótipo (lista de horários em grelha, estoque numa linha)
function createMedicacaoCard(med) {
  const catalog = (typeof mockData !== 'undefined' && mockData.catalogoMedicamentos)
    ? mockData.catalogoMedicamentos.find(m => m.nome === med.nome)
    : null;
  const photoColumnHtml = getMedicationPhotoColumnHtml(med, catalog, 'card');

  const hoje = typeof getTodayISODate === 'function'
    ? getTodayISODate()
    : new Date().toISOString().slice(0, 10);

  const horaAtual = typeof getCurrentHHMM === 'function'
    ? getCurrentHHMM()
    : `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

  const estoqueAtual = med.estoqueAtual || 0;
  const estoqueMinimo = med.estoqueMinimo || 7;
  const dosesPorDia = Math.max(1, (med.horarios || []).length);
  const diasRestantes = estoqueAtual > 0 ? Math.ceil(estoqueAtual / dosesPorDia) : 0;
  const temAviso = estoqueAtual <= estoqueMinimo;

  const horariosHtml = med.horarios.map((horario) => {
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
        : 'A\u00A0tomar';

    const clickHandler = status === 'tomado'
      ? `handleMedicationScheduleClick(${med.id}, '${horario}', 'tomado', '${med.nome}', '${med.dosagem}', '${hoje}')`
      : `handleMedicationScheduleClick(${med.id}, '${horario}', '${status}', '${med.nome}', '${med.dosagem}', '${hoje}')`;

    return `
      <div class="horario-item ${statusClass}" onclick="${clickHandler}">
        <span class="horario-time">${horario}</span>
        <span class="horario-status">${statusLabel}</span>
      </div>
    `;
  }).join('');

  const estoqueHtml = `
    <div class="med-estoque compact">
      <span class="estoque-text estoque-line-main">
        Restam <strong>${estoqueAtual}</strong> un.
        ${estoqueAtual > 0 ? `· ~${diasRestantes} dia${diasRestantes === 1 ? '' : 's'}` : '· sem estoque'}
        ${temAviso ? '<span class="med-estoque-aviso" title="Estoque abaixo do mínimo configurado">⚠️</span>' : ''}
      </span>
    </div>
  `;

  return `
    <div class="card card-medicacao-enhanced">
      <div class="med-header-enhanced">
        <div class="med-header-inner">
          <div class="med-card-name-block">
            <div class="med-title-enhanced">
              ${photoColumnHtml}
              <div class="med-title-text">
                <div class="med-name">${med.nome} <span class="med-title-feature">${med.dosagem}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="med-actions-enhanced">
          <button type="button" class="med-action-btn-enhanced" onclick="openEditMedicacaoModal(${med.id})" title="Editar">✏️</button>
        </div>
      </div>

      <div class="med-horarios-interactive">
        <div class="horarios-list-interactive">
          ${horariosHtml}
        </div>
      </div>

      ${estoqueHtml}
    </div>
  `;
}

// Card de Consulta
function createConsultaCard(consulta) {
  const colors = categoryColors.agenda;
  const tipoIcon = consulta.tipo === 'Presencial' ? '🏥' : '💻';
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(consulta.data) : consulta.data;
  
  return `
    <div class="card card-agenda">
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
  const statusText = isRealizado ? '✅ Realizado' : '⏳ Agendado';
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(exame.data) : exame.data;
  
  return `
    <div class="exame-card">
      <div class="exame-header">
        <div>
          <div class="exame-title">${exame.nome}</div>
          <div class="card-info" style="margin-top: 4px;">${dataBR} • ${exame.local}</div>
        </div>
        <div class="exame-status">
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
  const dados = compartilhamento.dadosCompartilhados.join(', ');
  const dataBR = typeof formatISODateBR === 'function' ? formatISODateBR(compartilhamento.dataAutorizacao) : compartilhamento.dataAutorizacao;
  
  return `
    <div class="card card-saude">
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
  const base = medicacao.estoqueAtual != null ? medicacao.estoqueAtual : medicacao.estoque;
  const est = parseInt(String(base), 10);
  const tomados = medicacao.historico.filter(h => h.status === 'tomado').length;
  return (Number.isNaN(est) ? 0 : est) - tomados;
}

function verificarSeTomadiHoje(medicacao) {
  const hoje = typeof getTodayISODate === 'function'
    ? getTodayISODate()
    : new Date().toISOString().slice(0, 10);
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

// Deletar medicação (ex.: a partir do modal Editar)
function deleteMedicacao(medicacaoId) {
  const medicacao = mockData.medicacoes.find(m => m.id === medicacaoId);
  if (!medicacao) return false;
  if (!confirm(`Tem certeza que deseja excluir ${medicacao.nome}?`)) return false;
  mockData.medicacoes = mockData.medicacoes.filter(m => m.id !== medicacaoId);
  renderMedicacoes();

  const em = document.getElementById('editMedicacaoModal');
  if (em) {
    em.classList.remove('active');
    const ef = document.getElementById('editMedicacaoForm');
    if (ef) ef.reset();
  }
  if (typeof setSemDataFimMedicacaoUI === 'function') {
    try {
      setSemDataFimMedicacaoUI('edit', false);
    } catch (e) { /* app ainda não carregou */ }
  }
  if (typeof removerFotoEdit === 'function') {
    try {
      removerFotoEdit();
    } catch (e) { /* */ }
  }

  if (typeof showFeedbackModal === 'function') {
    showFeedbackModal(`${medicacao.nome} excluído.`, 'success');
  } else {
    alert(`${medicacao.nome} excluído.`);
  }
  return true;
}
