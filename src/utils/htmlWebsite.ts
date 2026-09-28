import { ClockSettings, ThemeMode } from '../types/clock';

interface GenerateHtmlOptions {
  theme?: ThemeMode;
  settings?: ClockSettings;
}

export function generateStandaloneHtml(options?: GenerateHtmlOptions): string {
  const currentCircleColor = options?.settings?.circleColor || '#3B82F6';
  const defaultTheme = options?.theme || 'dark';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Relógio com Círculo de Segundos</title>
  <meta name="description" content="Aplicativo de relógio minimalista com minutos, segundos, contagem progressiva e regressiva com anel circular personalizável.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #000000;
      --text: #FFFFFF;
      --text-muted: #888888;
      --card-bg: rgba(20, 20, 24, 0.95);
      --card-border: rgba(255, 255, 255, 0.1);
      --track-color: rgba(255, 255, 255, 0.08);
      --accent: ${currentCircleColor};
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --bg: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --card-bg: rgba(255, 255, 255, 0.96);
      --card-border: rgba(0, 0, 0, 0.1);
      --track-color: rgba(0, 0, 0, 0.08);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      user-select: none;
      transition: background-color 0.4s ease, color 0.4s ease;
    }

    /* Header Controls */
    header {
      position: absolute;
      top: 1.25rem;
      left: 1.25rem;
      right: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 30;
      pointer-events: none;
    }

    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: auto;
    }

    .icon-btn {
      background: rgba(120, 120, 128, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--card-border);
      color: var(--text);
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .icon-btn:hover {
      background: rgba(120, 120, 128, 0.25);
      transform: scale(1.05);
    }

    .icon-btn:active {
      transform: scale(0.92);
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      border: 1px solid var(--accent);
      color: var(--accent);
      background: rgba(120, 120, 128, 0.1);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      gap: 0.4rem;
    }

    /* Main Clock Area */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
    }

    .clock-container {
      position: relative;
      width: min(84vw, 360px);
      height: min(84vw, 360px);
      max-width: 400px;
      max-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clock-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      overflow: visible;
    }

    .clock-center-btn {
      position: absolute;
      inset: 1.5rem;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: inherit;
      outline: none;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .clock-center-btn:hover {
      background: rgba(120, 120, 128, 0.06);
    }

    .clock-center-btn:active {
      transform: scale(0.96);
    }

    .digits-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      font-family: var(--font-mono);
      line-height: 1;
    }

    .digits-primary {
      font-size: clamp(3.2rem, 14vw, 4.6rem);
      font-weight: 300;
      letter-spacing: -0.04em;
    }

    .digits-separator {
      font-size: clamp(2.8rem, 12vw, 4.2rem);
      font-weight: 200;
      opacity: 0.7;
      margin: 0 0.1rem;
    }

    .digits-ms {
      font-size: clamp(1rem, 4vw, 1.25rem);
      font-weight: 400;
      margin-left: 0.35rem;
      color: var(--accent);
      opacity: 0.8;
    }

    /* Sub-badge inside circle */
    .center-substatus {
      margin-top: 0.5rem;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      border: 1px solid rgba(120, 120, 128, 0.2);
      color: var(--accent);
      background: rgba(120, 120, 128, 0.08);
      display: none;
    }

    /* First-time hint below circle */
    .hint-toast {
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: opacity 1s ease;
      opacity: 1;
    }

    .hint-toast.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    /* Modals & Dialogs */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-backdrop.open {
      display: flex;
    }

    .modal-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      width: 100%;
      max-width: 440px;
      max-height: 85vh;
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.3rem;
      border-radius: 50%;
      display: flex;
    }

    .modal-close-btn:hover {
      color: var(--text);
    }

    .modal-body {
      padding: 1.25rem 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* Tabs */
    .tabs-nav {
      display: flex;
      background: rgba(120, 120, 128, 0.12);
      border-radius: 1rem;
      padding: 0.25rem;
      gap: 0.25rem;
    }

    .tab-btn {
      flex: 1;
      padding: 0.6rem 0.75rem;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--card-bg);
      color: var(--text);
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }

    /* Form & Buttons */
    .btn-primary {
      background: var(--accent);
      color: #FFFFFF;
      border: none;
      padding: 0.85rem 1.25rem;
      border-radius: 1rem;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: filter 0.2s, transform 0.1s;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    }

    .btn-primary:hover {
      filter: brightness(1.1);
    }

    .btn-primary:active {
      transform: scale(0.97);
    }

    .btn-secondary {
      background: rgba(120, 120, 128, 0.12);
      color: var(--text);
      border: 1px solid var(--card-border);
      padding: 0.75rem 1rem;
      border-radius: 0.85rem;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.25);
    }

    /* Time adjusters */
    .time-stepper-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      text-align: center;
    }

    .stepper-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stepper-val {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 600;
      background: rgba(120, 120, 128, 0.1);
      border: 1px solid var(--card-border);
      border-radius: 0.75rem;
      width: 100%;
      padding: 0.5rem 0;
    }

    .stepper-btn {
      background: rgba(120, 120, 128, 0.12);
      border: none;
      color: var(--text);
      width: 100%;
      padding: 0.35rem 0;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: bold;
    }

    .stepper-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .presets-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .preset-pill {
      background: rgba(120, 120, 128, 0.1);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 0.75rem;
      cursor: pointer;
      text-align: center;
    }

    .preset-pill:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Settings options */
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--card-border);
    }

    .setting-label {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .setting-desc {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .color-swatches {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .color-swatch {
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.15s;
    }

    .color-swatch.active {
      transform: scale(1.15);
      border-color: #FFFFFF;
      box-shadow: 0 0 10px rgba(255,255,255,0.4);
    }

    /* Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: rgba(120, 120, 128, 0.3);
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--accent);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }
  </style>
</head>
<body data-theme="${defaultTheme}">

  <!-- Header -->
  <header>
    <div class="header-left">
      <!-- Fullscreen Button -->
      <button class="icon-btn" id="btn-fullscreen" title="Alternar Tela Cheia">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>

      <!-- Mode Badge Indicator -->
      <div class="status-badge" id="mode-badge">
        <span id="badge-icon">⏱️</span>
        <span id="badge-text">Contagem Ativa</span>
      </div>
    </div>

    <div class="header-right">
      <!-- Settings Button (3 dots) -->
      <button class="icon-btn" id="btn-settings" title="Configurações">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Main Clock Display -->
  <main>
    <div class="clock-container">
      <svg class="clock-svg" viewBox="0 0 320 320">
        <defs>
          <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Dynamic Ticks Group -->
        <g id="ticks-group"></g>

        <!-- Track Background Circle -->
        <circle id="track-ring" cx="160" cy="160" r="140" fill="none" stroke="var(--track-color)" stroke-width="8"></circle>

        <!-- Progress Indicator Ring -->
        <circle id="progress-ring" cx="160" cy="160" r="140" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" filter="url(#ring-glow)"></circle>
      </svg>

      <!-- Center Clickable Area -->
      <button class="clock-center-btn" id="btn-clock-center" aria-label="Toque no centro para configurar">
        <div class="digits-row">
          <span class="digits-primary" id="time-primary">12:00</span>
          <span class="digits-ms" id="time-ms" style="display: none;">.00</span>
        </div>
        <div class="center-substatus" id="center-substatus">Contagem Ativa</div>
      </button>
    </div>

    <!-- First-time hint below circle -->
    <div class="hint-toast" id="hint-toast">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>Toque no centro para configurar</span>
    </div>
  </main>

  <!-- Modal Configurar Tempo (Progressiva / Regressiva) -->
  <div class="modal-backdrop" id="modal-time">
    <div class="modal-panel">
      <div class="modal-header">
        <h3>Configurar Tempo</h3>
        <button class="modal-close-btn" id="close-modal-time">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Tabs -->
        <div class="tabs-nav">
          <button class="tab-btn active" id="tab-btn-progress">⏱️ Progressiva</button>
          <button class="tab-btn" id="tab-btn-countdown">⏳ Regressiva</button>
        </div>

        <!-- Tab 1: Contagem Progressiva -->
        <div id="tab-content-progress">
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
            Conta o tempo a partir de zero em direção à meta ou de forma contínua.
          </p>

          <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">
            Metas de Tempo (Opcional)
          </label>
          <div class="presets-grid" id="progress-presets">
            <button class="preset-pill" data-sec="0">Sem meta (Livre)</button>
            <button class="preset-pill" data-sec="60">1 minuto</button>
            <button class="preset-pill" data-sec="300">5 minutos</button>
            <button class="preset-pill" data-sec="600">10 minutos</button>
            <button class="preset-pill" data-sec="900">15 minutos</button>
            <button class="preset-pill" data-sec="1800">30 minutos</button>
            <button class="preset-pill" data-sec="3600">1 hora</button>
          </div>

          <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn-primary" id="btn-start-progress">
              <span>Iniciar Contagem Progressiva</span>
            </button>
            <button class="btn-secondary btn-danger" id="btn-reset-to-clock-1" style="display: none;">
              <span>Voltar ao Relógio Comum</span>
            </button>
          </div>
        </div>

        <!-- Tab 2: Contagem Regressiva -->
        <div id="tab-content-countdown" style="display: none;">
          <div class="time-stepper-grid">
            <div class="stepper-box">
              <button class="stepper-btn" id="h-up">+</button>
              <div class="stepper-val" id="val-hours">00</div>
              <button class="stepper-btn" id="h-down">-</button>
              <span class="stepper-label">Horas</span>
            </div>
            <div class="stepper-box">
              <button class="stepper-btn" id="m-up">+</button>
              <div class="stepper-val" id="val-mins">05</div>
              <button class="stepper-btn" id="m-down">-</button>
              <span class="stepper-label">Minutos</span>
            </div>
            <div class="stepper-box">
              <button class="stepper-btn" id="s-up">+</button>
              <div class="stepper-val" id="val-secs">00</div>
              <button class="stepper-btn" id="s-down">-</button>
              <span class="stepper-label">Segundos</span>
            </div>
          </div>

          <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin: 1rem 0 0.5rem;">
            Tempos Rápidos
          </label>
          <div class="presets-grid" id="countdown-presets">
            <button class="preset-pill" data-sec="30">30s</button>
            <button class="preset-pill" data-sec="60">1 min</button>
            <button class="preset-pill" data-sec="180">3 min</button>
            <button class="preset-pill" data-sec="300">5 min</button>
            <button class="preset-pill" data-sec="600">10 min</button>
            <button class="preset-pill" data-sec="900">15 min</button>
            <button class="preset-pill" data-sec="1500">25 min</button>
            <button class="preset-pill" data-sec="1800">30 min</button>
            <button class="preset-pill" data-sec="3600">60 min</button>
          </div>

          <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn-primary" id="btn-start-countdown">
              <span>Iniciar Contagem Regressiva</span>
            </button>
            <button class="btn-secondary btn-danger" id="btn-reset-to-clock-2" style="display: none;">
              <span>Voltar ao Relógio Comum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Configurações -->
  <div class="modal-backdrop" id="modal-settings">
    <div class="modal-panel">
      <div class="modal-header">
        <h3>Configurações</h3>
        <button class="modal-close-btn" id="close-modal-settings">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Tema -->
        <div class="setting-row">
          <div>
            <div class="setting-label">Tema Visual</div>
            <div class="setting-desc">Modo Escuro ou Claro</div>
          </div>
          <button class="btn-secondary" id="btn-toggle-theme">Alternar Tema</button>
        </div>

        <!-- Cores do Círculo -->
        <div>
          <div class="setting-label" style="margin-bottom: 0.5rem;">Cor do Círculo</div>
          <div class="color-swatches" id="swatches-container"></div>
        </div>

        <!-- Espessura do Anel -->
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span class="setting-label">Espessura do Anel</span>
            <span class="setting-desc" id="stroke-val">8px</span>
          </div>
          <input type="range" id="input-stroke" min="2" max="24" value="8" style="width: 100%; accent-color: var(--accent);">
        </div>

        <!-- Som Tic-Tac -->
        <div class="setting-row">
          <div>
            <div class="setting-label">Som do Tic-Tac</div>
            <div class="setting-desc">Emite som suave a cada segundo</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="switch-sound">
            <span class="slider"></span>
          </label>
        </div>

        <!-- Mostrar Horas -->
        <div class="setting-row">
          <div>
            <div class="setting-label">Exibir Horas</div>
            <div class="setting-desc">Formato HH:MM:SS ou apenas MM:SS</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="switch-hours" checked>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Traços de Marcação -->
        <div class="setting-row">
          <div>
            <div class="setting-label">Marcadores dos Segundos</div>
            <div class="setting-desc">60 traços delicados ao redor do círculo</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="switch-ticks" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      // Estado da Aplicação
      const state = {
        theme: '${defaultTheme}',
        mode: 'clock', // 'clock' | 'progress' | 'countdown'
        circleColor: '${currentCircleColor}',
        strokeWidth: 8,
        soundEnabled: false,
        showHours: true,
        showTicks: true,
        
        // Contagem Progressiva
        progressSecs: 0,
        progressTarget: 0,
        
        // Contagem Regressiva
        countdownSecs: 300,
        countdownTotal: 300,

        // Modal inputs
        timerHours: 0,
        timerMins: 5,
        timerSecs: 0,
        selectedProgressTarget: 0,
      };

      // Áudio Web Audio API Synthesizer
      let audioCtx = null;
      function playTickSound() {
        if (!state.soundEnabled) return;
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.025);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.03);
        } catch (e) {}
      }

      function playAlarmChime() {
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + i * 0.12);
            osc.stop(audioCtx.currentTime + i * 0.12 + 0.65);
          });
        } catch (e) {}
      }

      // Elementos do DOM
      const progressRing = document.getElementById('progress-ring');
      const trackRing = document.getElementById('track-ring');
      const timePrimary = document.getElementById('time-primary');
      const centerSubstatus = document.getElementById('center-substatus');
      const modeBadge = document.getElementById('mode-badge');
      const badgeText = document.getElementById('badge-text');
      const ticksGroup = document.getElementById('ticks-group');
      const hintToast = document.getElementById('hint-toast');

      // Geometria do Círculo
      const radius = 140;
      const circumference = 2 * Math.PI * radius;
      progressRing.style.strokeDasharray = circumference;

      // Desenhar Ticks
      function drawTicks() {
        ticksGroup.innerHTML = '';
        if (!state.showTicks) return;
        for (let i = 0; i < 60; i++) {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const tickLen = isMajor ? 8 : 4;
          const r1 = radius + 11;
          const r2 = r1 + tickLen;
          const x1 = 160 + r1 * Math.cos(angle);
          const y1 = 160 + r1 * Math.sin(angle);
          const x2 = 160 + r2 * Math.cos(angle);
          const y2 = 160 + r2 * Math.sin(angle);
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1);
          line.setAttribute('y1', y1);
          line.setAttribute('x2', x2);
          line.setAttribute('y2', y2);
          line.setAttribute('stroke', isMajor ? 'rgba(120, 120, 128, 0.4)' : 'rgba(120, 120, 128, 0.2)');
          line.setAttribute('stroke-width', isMajor ? '2' : '1');
          line.setAttribute('stroke-linecap', 'round');
          ticksGroup.appendChild(line);
        }
      }

      function formatDigits(n) {
        return String(n).padStart(2, '0');
      }

      // Loop do Relógio
      let lastSecond = -1;
      function tick() {
        const now = new Date();
        const currentSec = now.getSeconds();

        if (state.mode === 'clock') {
          const h = now.getHours();
          const m = now.getMinutes();
          const s = currentSec;

          if (state.showHours) {
            timePrimary.textContent = \`\${formatDigits(h)}:\${formatDigits(m)}:\${formatDigits(s)}\`;
          } else {
            timePrimary.textContent = \`\${formatDigits(m)}:\${formatDigits(s)}\`;
          }

          const ratio = (s + now.getMilliseconds() / 1000) / 60;
          const offset = circumference - ratio * circumference;
          progressRing.style.strokeDashoffset = offset;

          if (currentSec !== lastSecond) {
            playTickSound();
            lastSecond = currentSec;
          }
        } else if (state.mode === 'progress') {
          // Exibir contagem progressiva
          const h = Math.floor(state.progressSecs / 3600);
          const m = Math.floor((state.progressSecs % 3600) / 60);
          const s = state.progressSecs % 60;

          if (h > 0) {
            timePrimary.textContent = \`\${formatDigits(h)}:\${formatDigits(m)}:\${formatDigits(s)}\`;
          } else {
            timePrimary.textContent = \`\${formatDigits(m)}:\${formatDigits(s)}\`;
          }

          let ratio = (s / 60);
          if (state.progressTarget > 0) {
            ratio = Math.min(1, state.progressSecs / state.progressTarget);
          }
          const offset = circumference - ratio * circumference;
          progressRing.style.strokeDashoffset = offset;
        } else if (state.mode === 'countdown') {
          // Exibir contagem regressiva
          const h = Math.floor(state.countdownSecs / 3600);
          const m = Math.floor((state.countdownSecs % 3600) / 60);
          const s = state.countdownSecs % 60;

          if (h > 0) {
            timePrimary.textContent = \`\${formatDigits(h)}:\${formatDigits(m)}:\${formatDigits(s)}\`;
          } else {
            timePrimary.textContent = \`\${formatDigits(m)}:\${formatDigits(s)}\`;
          }

          const ratio = state.countdownTotal > 0 ? (state.countdownSecs / state.countdownTotal) : 0;
          const offset = circumference - ratio * circumference;
          progressRing.style.strokeDashoffset = offset;
        }

        requestAnimationFrame(tick);
      }

      // Intervalos de 1s para Progressiva / Regressiva
      setInterval(() => {
        if (state.mode === 'progress') {
          state.progressSecs++;
          playTickSound();
        } else if (state.mode === 'countdown') {
          if (state.countdownSecs > 0) {
            state.countdownSecs--;
            playTickSound();
            if (state.countdownSecs === 0) {
              playAlarmChime();
              centerSubstatus.textContent = 'Tempo Concluído!';
              centerSubstatus.style.display = 'block';
            }
          }
        }
      }, 1000);

      // Controle do Hint de primeira vez (10s fade e persistência em localStorage)
      const HINT_KEY = 'hasSeenCenterConfigHint';
      if (!localStorage.getItem(HINT_KEY)) {
        setTimeout(() => {
          hintToast.classList.add('fade-out');
          localStorage.setItem(HINT_KEY, 'true');
        }, 10000);
      } else {
        hintToast.style.display = 'none';
      }

      // Modais
      const modalTime = document.getElementById('modal-time');
      const modalSettings = document.getElementById('modal-settings');

      document.getElementById('btn-clock-center').addEventListener('click', () => {
        const resetBtn1 = document.getElementById('btn-reset-to-clock-1');
        const resetBtn2 = document.getElementById('btn-reset-to-clock-2');
        const showReset = state.mode !== 'clock';
        resetBtn1.style.display = showReset ? 'block' : 'none';
        resetBtn2.style.display = showReset ? 'block' : 'none';
        modalTime.classList.add('open');
      });

      document.getElementById('close-modal-time').addEventListener('click', () => modalTime.classList.remove('open'));
      document.getElementById('close-modal-settings').addEventListener('click', () => modalSettings.classList.remove('open'));
      document.getElementById('btn-settings').addEventListener('click', () => modalSettings.classList.add('open'));

      // Tabs
      const tabBtnProgress = document.getElementById('tab-btn-progress');
      const tabBtnCountdown = document.getElementById('tab-btn-countdown');
      const tabContentProgress = document.getElementById('tab-content-progress');
      const tabContentCountdown = document.getElementById('tab-content-countdown');

      tabBtnProgress.addEventListener('click', () => {
        tabBtnProgress.classList.add('active');
        tabBtnCountdown.classList.remove('active');
        tabContentProgress.style.display = 'block';
        tabContentCountdown.style.display = 'none';
      });

      tabBtnCountdown.addEventListener('click', () => {
        tabBtnCountdown.classList.add('active');
        tabBtnProgress.classList.remove('active');
        tabContentProgress.style.display = 'none';
        tabContentCountdown.style.display = 'block';
      });

      // Presets Progressiva
      document.querySelectorAll('#progress-presets .preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#progress-presets .preset-pill').forEach(p => p.style.borderColor = '');
          btn.style.borderColor = 'var(--accent)';
          state.selectedProgressTarget = parseInt(btn.dataset.sec, 10);
        });
      });

      document.getElementById('btn-start-progress').addEventListener('click', () => {
        state.mode = 'progress';
        state.progressSecs = 0;
        state.progressTarget = state.selectedProgressTarget;
        centerSubstatus.textContent = 'Contagem Progressiva';
        centerSubstatus.style.display = 'block';
        badgeText.textContent = 'Contagem Progressiva Ativa';
        modeBadge.style.display = 'flex';
        modalTime.classList.remove('open');
      });

      // Steppers Regressiva
      function updateStepperLabels() {
        document.getElementById('val-hours').textContent = formatDigits(state.timerHours);
        document.getElementById('val-mins').textContent = formatDigits(state.timerMins);
        document.getElementById('val-secs').textContent = formatDigits(state.timerSecs);
      }

      document.getElementById('h-up').addEventListener('click', () => { state.timerHours = (state.timerHours + 1) % 24; updateStepperLabels(); });
      document.getElementById('h-down').addEventListener('click', () => { state.timerHours = (state.timerHours + 23) % 24; updateStepperLabels(); });
      document.getElementById('m-up').addEventListener('click', () => { state.timerMins = (state.timerMins + 1) % 60; updateStepperLabels(); });
      document.getElementById('m-down').addEventListener('click', () => { state.timerMins = (state.timerMins + 59) % 60; updateStepperLabels(); });
      document.getElementById('s-up').addEventListener('click', () => { state.timerSecs = (state.timerSecs + 5) % 60; updateStepperLabels(); });
      document.getElementById('s-down').addEventListener('click', () => { state.timerSecs = (state.timerSecs + 55) % 60; updateStepperLabels(); });

      document.querySelectorAll('#countdown-presets .preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = parseInt(btn.dataset.sec, 10);
          state.timerHours = Math.floor(s / 3600);
          state.timerMins = Math.floor((s % 3600) / 60);
          state.timerSecs = s % 60;
          updateStepperLabels();
        });
      });

      document.getElementById('btn-start-countdown').addEventListener('click', () => {
        const total = state.timerHours * 3600 + state.timerMins * 60 + state.timerSecs;
        if (total > 0) {
          state.mode = 'countdown';
          state.countdownSecs = total;
          state.countdownTotal = total;
          centerSubstatus.textContent = 'Contagem Regressiva';
          centerSubstatus.style.display = 'block';
          badgeText.textContent = 'Contagem Regressiva Ativa';
          modeBadge.style.display = 'flex';
          modalTime.classList.remove('open');
        }
      });

      function resetToClock() {
        state.mode = 'clock';
        centerSubstatus.style.display = 'none';
        modeBadge.style.display = 'none';
        modalTime.classList.remove('open');
      }

      document.getElementById('btn-reset-to-clock-1').addEventListener('click', resetToClock);
      document.getElementById('btn-reset-to-clock-2').addEventListener('click', resetToClock);

      // Alternar Tema
      document.getElementById('btn-toggle-theme').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', state.theme);
      });

      // Paleta de Cores
      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B', '#06B6D4', '#F97316', '#EC4899'];
      const swatchesBox = document.getElementById('swatches-container');
      colors.forEach(col => {
        const sw = document.createElement('div');
        sw.className = 'color-swatch' + (col.toLowerCase() === state.circleColor.toLowerCase() ? ' active' : '');
        sw.style.backgroundColor = col;
        sw.addEventListener('click', () => {
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');
          state.circleColor = col;
          document.documentElement.style.setProperty('--accent', col);
        });
        swatchesBox.appendChild(sw);
      });

      // Espessura
      document.getElementById('input-stroke').addEventListener('input', (e) => {
        const w = e.target.value;
        state.strokeWidth = w;
        document.getElementById('stroke-val').textContent = w + 'px';
        progressRing.setAttribute('stroke-width', w);
        trackRing.setAttribute('stroke-width', w);
      });

      // Som
      document.getElementById('switch-sound').addEventListener('change', (e) => {
        state.soundEnabled = e.target.checked;
        if (state.soundEnabled && !audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
      });

      // Formato de Horas
      document.getElementById('switch-hours').addEventListener('change', (e) => {
        state.showHours = e.target.checked;
      });

      // Ticks
      document.getElementById('switch-ticks').addEventListener('change', (e) => {
        state.showTicks = e.target.checked;
        drawTicks();
      });

      // Fullscreen
      document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      // Inicialização
      drawTicks();
      tick();
    })();
  </script>
</body>
</html>`;
}
