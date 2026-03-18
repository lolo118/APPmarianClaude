/* ── PRICING DATA ───────────────────────────────────────────── */

const BASE_PRICES = {
  individual: { price: 20000, dur: '60 min', icon: '👤', label: 'Individual', clases_mes_1: 4, clases_mes_2: 8 },
  dupla:      { price: 28000, dur: '90 min', icon: '👥', label: 'Dupla',       clases_mes_1: 4, clases_mes_2: 8 },
  trio:       { price: 38000, dur: '90 min', icon: '👪', label: 'Trío',        clases_mes_1: 4, clases_mes_2: 8 },
  clinica:    { price: 48000, dur: '90 min', icon: '🎾', label: 'Clínica ×4',  clases_mes_1: 4, clases_mes_2: 8 },
};

const PACKS = [
  { id: 'inicio',    name: 'Pack Inicio',       clases: 4,  discount: 0.05, badge: null },
  { id: 'pro',       name: 'Progreso Pro',       clases: 8,  discount: 0.10, badge: 'MÁS POPULAR' },
  { id: 'elite',     name: 'Elite Performance',  clases: 12, discount: 0.15, badge: null },
];

const PAYMENT_OPTIONS = [
  { id: 'transferencia', label: 'Transferencia bancaria', desc: 'CBU / Alias al momento de confirmar' },
  { id: 'efectivo',      label: 'Efectivo',               desc: 'En el primer encuentro' },
  { id: 'mp',            label: 'Mercado Pago',           desc: 'Link de pago enviado por WhatsApp' },
];

const WEEKLY_OPTIONS = [
  { id: '1', label: '1 clase por semana', desc: 'Ritmo constante y progresivo' },
  { id: '2', label: '2 clases por semana', desc: 'Mejora acelerada — máx. disponible' },
];

let currentMode = 'individual';

/* ── PLAN GRID RENDER ───────────────────────────────────────── */

function setMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPlans();
}

function renderPlans() {
  const base = BASE_PRICES[currentMode];
  const grid = document.getElementById('plansGrid');
  grid.innerHTML = '';

  PACKS.forEach((pack, i) => {
    const fullPrice  = base.price * pack.clases;
    const finalPrice = Math.round(fullPrice * (1 - pack.discount));
    const saving     = fullPrice - finalPrice;

    const card = document.createElement('div');
    card.className = 'plan-card' + (pack.badge ? ' featured' : '');
    card.style.animationDelay = (i * 0.08) + 's';

    card.innerHTML = `
      ${pack.badge ? `<div class="plan-badge">${pack.badge}</div>` : ''}
      <div class="plan-info">
        <div class="plan-name">${pack.name}</div>
        <div class="plan-detail">${pack.clases} clases · ${base.dur} · ${base.icon} ${base.label}</div>
        <div class="plan-discount-tag">${(pack.discount * 100).toFixed(0)}% OFF al abonar el mes</div>
      </div>
      <div class="plan-price-col">
        <div class="plan-old">$${fullPrice.toLocaleString('es-AR')}</div>
        <div class="plan-new">$${finalPrice.toLocaleString('es-AR')}<span>/mes</span></div>
        <div class="plan-saving">Ahorrás $${saving.toLocaleString('es-AR')}</div>
        <button class="plan-cta" onclick="openWizard('${pack.id}', '${currentMode}')">¡Lo quiero!</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── WIZARD STATE ───────────────────────────────────────────── */

let wz = {
  step: 0,
  packId: null,
  mode: null,
  isTorneo: false,
  data: {
    nombre: '',
    telefono: '',
    nivel: '',
    objetivo: '',
    semanal: '',
    horario: '',
    pago: '',
  }
};

const NIVELES = [
  { id: 'principiante', label: 'Principiante', desc: 'Recién empiezo o llevo poco tiempo' },
  { id: 'intermedio',   label: 'Intermedio',   desc: 'Juego habitualmente, quiero mejorar' },
  { id: 'avanzado',     label: 'Avanzado',     desc: 'Juego torneos o nivel competitivo' },
];

const OBJETIVOS = [
  { id: 'tecnica',   label: 'Mejorar técnica',    desc: 'Fundamentos, postura y golpes' },
  { id: 'tactica',   label: 'Mejorar táctica',    desc: 'Juego en pareja y situaciones reales' },
  { id: 'torneo',    label: 'Competir en torneos', desc: 'Preparación competitiva seria' },
  { id: 'diversion', label: 'Disfrutar más',       desc: 'Mejorar y pasarla bien' },
];

function openWizard(packId, mode) {
  wz.step = 0;
  wz.packId = packId;
  wz.mode = mode || 'individual';
  wz.isTorneo = (packId === 'torneo');
  wz.data = { nombre:'', telefono:'', nivel:'', objetivo:'', semanal:'', horario:'', pago:'' };

  document.getElementById('wizardOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderStep();
}

function closeWizard() {
  document.getElementById('wizardOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeWizardOutside(e) {
  if (e.target === document.getElementById('wizardOverlay')) closeWizard();
}

function setProgress(step, total) {
  document.getElementById('wizardProgressBar').style.width = ((step / total) * 100) + '%';
}

/* ── STEP RENDERER ──────────────────────────────────────────── */

const STEPS = ['nombre', 'nivel', 'objetivo', 'semanal', 'horario', 'pago', 'resumen'];
// torneo skips semanal
const TORNEO_STEPS = ['nombre', 'nivel', 'objetivo', 'horario', 'pago', 'resumen'];

function getSteps() { return wz.isTorneo ? TORNEO_STEPS : STEPS; }

function renderStep() {
  const steps = getSteps();
  const key   = steps[wz.step];
  setProgress(wz.step, steps.length - 1);

  const content = document.getElementById('wizardContent');

  switch (key) {
    case 'nombre':    content.innerHTML = stepNombre();    break;
    case 'nivel':     content.innerHTML = stepNivel();     break;
    case 'objetivo':  content.innerHTML = stepObjetivo();  break;
    case 'semanal':   content.innerHTML = stepSemanal();   break;
    case 'horario':   content.innerHTML = stepHorario();   break;
    case 'pago':      content.innerHTML = stepPago();      break;
    case 'resumen':   content.innerHTML = stepResumen();   break;
  }

  attachInputHandlers(key);
}

/* ── STEP HTML BUILDERS ─────────────────────────────────────── */

function nav(backLabel, nextLabel, nextDisabled) {
  const steps = getSteps();
  const isFirst = wz.step === 0;
  const isLast  = wz.step === steps.length - 1;
  return `
    <div class="wz-nav">
      ${!isFirst ? `<button class="wz-btn-back" onclick="goBack()">${backLabel || '← Atrás'}</button>` : ''}
      ${!isLast
        ? `<button class="wz-btn-next" id="btnNext" ${nextDisabled ? 'disabled' : ''} onclick="goNext()">${nextLabel || 'Continuar →'}</button>`
        : `<button class="wz-btn-wa" id="btnWa" onclick="sendWhatsApp()">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             Enviar a Mariano por WhatsApp
           </button>`
      }
    </div>`;
}

function optionsHtml(list, selected, key) {
  return list.map(o => `
    <div class="wz-opt ${selected === o.id ? 'selected' : ''}" onclick="select('${key}','${o.id}',this)">
      <div class="wz-check">${selected === o.id ? '✓' : ''}</div>
      <div class="wz-opt-info">
        <div class="wz-opt-name">${o.label}</div>
        ${o.desc ? `<div class="wz-opt-desc">${o.desc}</div>` : ''}
      </div>
      ${o.right || ''}
    </div>`).join('');
}

function stepNombre() {
  const pack = getPack();
  return `
    <div class="wz-step">
      <div class="wz-num">Paso 1 de ${getSteps().length}</div>
      <div class="wz-title">¡Hola! ¿Cómo te llamás?</div>
      <div class="wz-sub">Vas a contratar: <strong>${pack.displayName}</strong></div>
      <input class="wz-input" id="inputNombre" type="text" placeholder="Tu nombre completo" value="${wz.data.nombre}" oninput="wz.data.nombre=this.value;updateNext()" />
      <input class="wz-input" id="inputTelefono" type="tel" placeholder="Tu WhatsApp (con código de área)" value="${wz.data.telefono}" oninput="wz.data.telefono=this.value;updateNext()" />
    </div>
    ${nav(null, 'Continuar →', !(wz.data.nombre.trim() && wz.data.telefono.trim()))}`;
}

function stepNivel() {
  return `
    <div class="wz-step">
      <div class="wz-num">Paso ${wz.step + 1} de ${getSteps().length}</div>
      <div class="wz-title">¿Cuál es tu nivel?</div>
      <div class="wz-sub">Así Mariano prepara la clase ideal para vos.</div>
      <div class="wz-options">${optionsHtml(NIVELES, wz.data.nivel, 'nivel')}</div>
    </div>
    ${nav('← Atrás', 'Continuar →', !wz.data.nivel)}`;
}

function stepObjetivo() {
  return `
    <div class="wz-step">
      <div class="wz-num">Paso ${wz.step + 1} de ${getSteps().length}</div>
      <div class="wz-title">¿Qué querés lograr?</div>
      <div class="wz-sub">Podés ser honesto, cada objetivo es válido.</div>
      <div class="wz-options">${optionsHtml(OBJETIVOS, wz.data.objetivo, 'objetivo')}</div>
    </div>
    ${nav('← Atrás', 'Continuar →', !wz.data.objetivo)}`;
}

function stepSemanal() {
  return `
    <div class="wz-step">
      <div class="wz-num">Paso ${wz.step + 1} de ${getSteps().length}</div>
      <div class="wz-title">¿Cuántas veces<br>por semana?</div>
      <div class="wz-sub">Máximo 2 clases semanales disponibles.</div>
      <div class="wz-options">${optionsHtml(WEEKLY_OPTIONS, wz.data.semanal, 'semanal')}</div>
    </div>
    ${nav('← Atrás', 'Continuar →', !wz.data.semanal)}`;
}

function stepHorario() {
  return `
    <div class="wz-step">
      <div class="wz-num">Paso ${wz.step + 1} de ${getSteps().length}</div>
      <div class="wz-title">¿Qué horario<br>te viene mejor?</div>
      <div class="wz-sub">Mariano trabaja de 7:00 a 15:00 hs en Padelmanía. También se puede coordinar otro lugar.</div>
      <input class="wz-input" id="inputHorario" type="text" placeholder="Ej: martes y jueves a las 9am" value="${wz.data.horario}" oninput="wz.data.horario=this.value;updateNext()" />
      <p style="font-size:12px;color:var(--text-lt);margin-top:-8px">Si necesitás otro horario o lugar, indicalo y Mariano te confirma disponibilidad.</p>
    </div>
    ${nav('← Atrás', 'Continuar →', !wz.data.horario.trim())}`;
}

function stepPago() {
  const opts = PAYMENT_OPTIONS.map(o => ({...o, desc: o.desc}));
  return `
    <div class="wz-step">
      <div class="wz-num">Paso ${wz.step + 1} de ${getSteps().length}</div>
      <div class="wz-title">¿Cómo preferís<br>abonar?</div>
      <div class="wz-sub">El pago mensual se confirma al inicio del período.</div>
      <div class="wz-options">${optionsHtml(opts, wz.data.pago, 'pago')}</div>
    </div>
    ${nav('← Atrás', 'Continuar →', !wz.data.pago)}`;
}

function stepResumen() {
  const pack = getPack();
  const nivelLabel    = NIVELES.find(n => n.id === wz.data.nivel)?.label || wz.data.nivel;
  const objetivoLabel = OBJETIVOS.find(o => o.id === wz.data.objetivo)?.label || wz.data.objetivo;
  const pagoLabel     = PAYMENT_OPTIONS.find(p => p.id === wz.data.pago)?.label || wz.data.pago;
  const semanalLabel  = wz.isTorneo ? '2 clases/semana (incluido)' : (WEEKLY_OPTIONS.find(s => s.id === wz.data.semanal)?.label || wz.data.semanal);

  return `
    <div class="wz-step">
      <div class="wz-num">Resumen final</div>
      <div class="wz-title">Todo listo,<br>${wz.data.nombre.split(' ')[0]} 🎾</div>
      <div class="wz-sub">Revisá tu consulta antes de enviarla a Mariano.</div>
      <div class="summary-box">
        <div class="summary-row"><span class="summary-label">Nombre</span><span class="summary-value">${wz.data.nombre}</span></div>
        <div class="summary-row"><span class="summary-label">WhatsApp</span><span class="summary-value">${wz.data.telefono}</span></div>
        <div class="summary-row"><span class="summary-label">Plan</span><span class="summary-value">${pack.displayName}</span></div>
        <div class="summary-row"><span class="summary-label">Clases</span><span class="summary-value">${pack.clases} clases/mes</span></div>
        <div class="summary-row"><span class="summary-label">Frecuencia</span><span class="summary-value">${semanalLabel}</span></div>
        <div class="summary-row"><span class="summary-label">Nivel</span><span class="summary-value">${nivelLabel}</span></div>
        <div class="summary-row"><span class="summary-label">Objetivo</span><span class="summary-value">${objetivoLabel}</span></div>
        <div class="summary-row"><span class="summary-label">Horario preferido</span><span class="summary-value">${wz.data.horario}</span></div>
        <div class="summary-row"><span class="summary-label">Forma de pago</span><span class="summary-value">${pagoLabel}</span></div>
        <div class="summary-total">
          <span class="summary-total-label">Total mensual</span>
          <span class="summary-total-price">$${pack.finalPrice.toLocaleString('es-AR')}</span>
        </div>
        ${pack.saving > 0 ? `<div style="text-align:center;margin-top:10px"><span class="summary-saving-tag">Ahorrás $${pack.saving.toLocaleString('es-AR')} por mes vs. pago por clase</span></div>` : ''}
      </div>
      <p style="font-size:12px;color:var(--text-lt);text-align:center;padding:0 8px 8px">Al tocar el botón se abrirá WhatsApp con un mensaje armado para Mariano.</p>
    </div>
    ${nav('← Revisar')}`;
}

/* ── PACK RESOLVER ──────────────────────────────────────────── */

function getPack() {
  if (wz.isTorneo) {
    return {
      displayName: 'Entrenamiento Intensivo · Torneos',
      clases: 8,
      finalPrice: 139000,
      fullPrice: 160000,
      saving: 21000,
      discount: 13,
      mode: 'Individual',
      dur: '60 min',
    };
  }
  const base = BASE_PRICES[wz.mode];
  const pack = PACKS.find(p => p.id === wz.packId);
  if (!base || !pack) return {};
  const fullPrice  = base.price * pack.clases;
  const finalPrice = Math.round(fullPrice * (1 - pack.discount));
  const saving     = fullPrice - finalPrice;
  return {
    displayName: `${pack.name} · ${base.label}`,
    clases: pack.clases,
    finalPrice,
    fullPrice,
    saving,
    discount: Math.round(pack.discount * 100),
    mode: base.label,
    dur: base.dur,
  };
}

/* ── NAVIGATION ─────────────────────────────────────────────── */

function goNext() {
  wz.step++;
  renderStep();
}

function goBack() {
  if (wz.step > 0) { wz.step--; renderStep(); }
}

function select(key, val, el) {
  wz.data[key] = val;
  document.querySelectorAll('.wz-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  el.querySelector('.wz-check').textContent = '✓';
  updateNext();
  setTimeout(goNext, 280);
}

function updateNext() {
  const btn = document.getElementById('btnNext');
  if (!btn) return;
  const steps = getSteps();
  const key   = steps[wz.step];
  let ok = false;
  if (key === 'nombre')  ok = wz.data.nombre.trim() && wz.data.telefono.trim();
  if (key === 'nivel')   ok = !!wz.data.nivel;
  if (key === 'objetivo')ok = !!wz.data.objetivo;
  if (key === 'semanal') ok = !!wz.data.semanal;
  if (key === 'horario') ok = !!wz.data.horario.trim();
  if (key === 'pago')    ok = !!wz.data.pago;
  btn.disabled = !ok;
}

function attachInputHandlers(key) {
  if (key === 'nombre') {
    const n = document.getElementById('inputNombre');
    const t = document.getElementById('inputTelefono');
    if (n) n.addEventListener('input', updateNext);
    if (t) t.addEventListener('input', updateNext);
  }
  if (key === 'horario') {
    const h = document.getElementById('inputHorario');
    if (h) h.addEventListener('input', updateNext);
  }
}

/* ── WHATSAPP MESSAGE ───────────────────────────────────────── */

function sendWhatsApp() {
  const pack        = getPack();
  const nivelLabel  = NIVELES.find(n => n.id === wz.data.nivel)?.label || wz.data.nivel;
  const objLabel    = OBJETIVOS.find(o => o.id === wz.data.objetivo)?.label || wz.data.objetivo;
  const pagoLabel   = PAYMENT_OPTIONS.find(p => p.id === wz.data.pago)?.label || wz.data.pago;
  const semLabel    = wz.isTorneo ? '2 clases por semana' : (WEEKLY_OPTIONS.find(s => s.id === wz.data.semanal)?.label || wz.data.semanal);

  const msg = [
    `¡Hola Mariano! 👋`,
    ``,
    `Me interesa empezar con el *${pack.displayName}*. Te mando mis datos:`,
    ``,
    `👤 *Nombre:* ${wz.data.nombre}`,
    `📱 *Mi WhatsApp:* ${wz.data.telefono}`,
    ``,
    `🎾 *Plan elegido:* ${pack.displayName}`,
    `📦 *Clases por mes:* ${pack.clases}`,
    `📅 *Frecuencia:* ${semLabel}`,
    `⏱ *Duración de cada clase:* ${pack.dur}`,
    ``,
    `📊 *Mi nivel:* ${nivelLabel}`,
    `🎯 *Mi objetivo:* ${objLabel}`,
    ``,
    `🕐 *Horario preferido:* ${wz.data.horario}`,
    `💳 *Forma de pago:* ${pagoLabel}`,
    ``,
    `💰 *Precio mensual acordado:* $${pack.finalPrice.toLocaleString('es-AR')}`,
    pack.saving > 0 ? `✅ *Ahorro vs. clase suelta:* $${pack.saving.toLocaleString('es-AR')} (${pack.discount}% OFF)` : '',
    ``,
    `Quedo a la espera de tu confirmación. ¡Muchas gracias! 🙌`,
  ].filter(l => l !== null && l !== undefined).join('\n');

  const tel = '543855864210';
  const url = `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ── INIT ───────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  renderPlans();
});
