import { useState, useEffect } from 'react';
import { ClockFace } from './components/ClockFace';
import { SettingsPage } from './components/SettingsPage';
import { CountdownModal } from './components/CountdownModal';
import { SwiftCodeModal } from './components/SwiftCodeModal';
import { HtmlSiteModal } from './components/HtmlSiteModal';
import { ClockSettings, ThemeMode, TimerMode } from './types/clock';
import { playTickSound, playAlarmSound } from './utils/audio';
import {
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Code2,
  Globe,
  Timer,
  TrendingUp,
  Hourglass
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isSwiftModalOpen, setIsSwiftModalOpen] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modo Atual: 'clock' (Relógio comum) | 'countdown' (Regressiva) | 'countup' (Progressiva)
  const [timerMode, setTimerMode] = useState<TimerMode>('clock');

  // Estados da Contagem Regressiva
  const [countdownTotalSeconds, setCountdownTotalSeconds] = useState(0);
  const [countdownRemainingSeconds, setCountdownRemainingSeconds] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  // Estados da Contagem Progressiva
  const [countupSeconds, setCountupSeconds] = useState(0);
  const [countupTargetSeconds, setCountupTargetSeconds] = useState(0);
  const [isCountupRunning, setIsCountupRunning] = useState(false);

  // Dica de primeira abertura: "Toque no centro para configurar"
  const [showFirstTimeHint, setShowFirstTimeHint] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hasSeenCenterConfigHint') !== 'true';
    } catch {
      return true;
    }
  });
  const [isHintFading, setIsHintFading] = useState(false);

  useEffect(() => {
    if (!showFirstTimeHint) return;

    try {
      localStorage.setItem('hasSeenCenterConfigHint', 'true');
    } catch {
      // ignore
    }

    const fadeTimer = setTimeout(() => {
      setIsHintFading(true);
    }, 10000);

    const removeTimer = setTimeout(() => {
      setShowFirstTimeHint(false);
    }, 11000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const [settings, setSettings] = useState<ClockSettings>({
    circleColor: '#007AFF', // Azul Elétrico estilo iOS
    strokeWidth: 10,
    showHours: false,
    showMilliseconds: false,
    smoothSweep: true,
    showTickMarks: true,
    soundEnabled: false,
    enableGlow: true,
    showNumbers: true,
    showCircle: true,
    onlySeconds: false,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateSettings = (updates: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Loop da Contagem Regressiva
  useEffect(() => {
    if (timerMode !== 'countdown' || !isCountdownRunning) return;

    const timer = setInterval(() => {
      setCountdownRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountdownRunning(false);
          setIsCountdownFinished(true);
          playAlarmSound();
          return 0;
        }

        if (settings.soundEnabled) {
          playTickSound(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMode, isCountdownRunning, settings.soundEnabled]);

  // Loop da Contagem Progressiva
  useEffect(() => {
    if (timerMode !== 'countup' || !isCountupRunning) return;

    const timer = setInterval(() => {
      setCountupSeconds((prev) => {
        const next = prev + 1;
        if (settings.soundEnabled) {
          playTickSound(next % 60 === 0);
        }
        if (countupTargetSeconds > 0 && next >= countupTargetSeconds) {
          playAlarmSound();
          setIsCountupRunning(false);
          return countupTargetSeconds;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMode, isCountupRunning, countupTargetSeconds, settings.soundEnabled]);

  // Ações de Contagem Regressiva
  const handleStartCountdown = (seconds: number) => {
    setTimerMode('countdown');
    setCountdownTotalSeconds(seconds);
    setCountdownRemainingSeconds(seconds);
    setIsCountdownRunning(true);
    setIsCountdownFinished(false);
    setIsCountupRunning(false);
  };

  // Ações de Contagem Progressiva
  const handleStartCountup = (targetSeconds = 0) => {
    setTimerMode('countup');
    setCountupSeconds(0);
    setCountupTargetSeconds(targetSeconds);
    setIsCountupRunning(true);
    setIsCountdownRunning(false);
  };

  // Pausar / Continuar
  const handleTogglePauseResume = () => {
    if (timerMode === 'countdown') {
      if (isCountdownFinished) {
        setCountdownRemainingSeconds(countdownTotalSeconds);
        setIsCountdownFinished(false);
        setIsCountdownRunning(true);
      } else {
        setIsCountdownRunning((prev) => !prev);
      }
    } else if (timerMode === 'countup') {
      setIsCountupRunning((prev) => !prev);
    }
  };

  // Reiniciar / Zerar temporizador ativo
  const handleResetTimer = () => {
    if (timerMode === 'countdown') {
      setCountdownRemainingSeconds(countdownTotalSeconds);
      setIsCountdownFinished(false);
      setIsCountdownRunning(false);
    } else if (timerMode === 'countup') {
      setCountupSeconds(0);
      setIsCountupRunning(false);
    }
  };

  // Retornar ao Relógio Comum em Tempo Real
  const handleResetToClock = () => {
    setTimerMode('clock');
    setIsCountdownRunning(false);
    setIsCountdownFinished(false);
    setCountdownRemainingSeconds(0);
    setCountdownTotalSeconds(0);
    setIsCountupRunning(false);
    setCountupSeconds(0);
    setCountupTargetSeconds(0);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-500 overflow-hidden relative select-none ${
        isDark ? 'bg-black text-white' : 'bg-white text-slate-900'
      }`}
    >
      {/* Canto Superior Esquerdo: Informações sutis e Atalho Swift */}
      <header className="absolute top-5 left-5 z-30 flex items-center gap-2">
        {/* Atalho Site HTML */}
        <button
          type="button"
          onClick={() => setIsHtmlModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer border backdrop-blur-md shadow-xs ${
            isDark
              ? 'bg-neutral-900/70 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:text-white'
              : 'bg-white/80 hover:bg-neutral-100 text-neutral-700 border-neutral-200 hover:text-black'
          }`}
          title="Ver e Baixar Site HTML Standalone (index.html)"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Site HTML</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSwiftModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer border backdrop-blur-md shadow-xs ${
            isDark
              ? 'bg-neutral-900/70 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:text-white'
              : 'bg-white/80 hover:bg-neutral-100 text-neutral-700 border-neutral-200 hover:text-black'
          }`}
          title="Ver e Copiar Código Swift para Xcode"
        >
          <Code2 className="w-3.5 h-3.5 text-orange-500" />
          <span className="hidden sm:inline">Código Swift</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer border backdrop-blur-md shadow-xs ${
            isDark
              ? 'bg-neutral-900/70 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800'
              : 'bg-white/80 hover:bg-neutral-100 text-neutral-600 hover:text-black border-neutral-200'
          }`}
          title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Badge superior indicando se Contagem Regressiva ou Progressiva está ativa */}
        {timerMode !== 'clock' && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md animate-in fade-in"
            style={{
              borderColor: settings.circleColor,
              color: settings.circleColor,
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
          >
            {timerMode === 'countdown' ? (
              <>
                <Hourglass className="w-3.5 h-3.5" />
                <span>Contagem Regressiva</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Contagem Progressiva</span>
              </>
            )}
          </div>
        )}
      </header>

      {/* REQUISITO: BOTÃO REDONDO NO CANTO SUPERIOR DIREITO COM TRÊS PONTOS NO CENTRO */}
      <div className="absolute top-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-lg backdrop-blur-md border ${
            isDark
              ? 'bg-neutral-900/80 hover:bg-neutral-800 text-white border-neutral-700/80 hover:border-neutral-500 hover:shadow-neutral-700/20'
              : 'bg-white/90 hover:bg-neutral-100 text-neutral-900 border-neutral-300 hover:border-neutral-400 hover:shadow-neutral-300/30'
          }`}
          title="Configurações"
          aria-label="Abrir Configurações"
        >
          {/* Três pontos no centro */}
          <MoreHorizontal className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Relógio Central com o Círculo de Segundos */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full h-full relative">
        <div className="transform transition-transform duration-300 hover:scale-[1.01]">
          {/* REQUISITO: AO CLICAR NO CENTRO DO CÍRCULO, ABRE A CONFIGURAÇÃO DE TEMPO (PROGRESSIVA OU REGRESSIVA) */}
          <ClockFace
            theme={theme}
            settings={settings}
            timerMode={timerMode}
            countdownRemainingSeconds={countdownRemainingSeconds}
            countdownTotalSeconds={countdownTotalSeconds}
            isCountdownRunning={isCountdownRunning}
            isCountdownFinished={isCountdownFinished}
            countupSeconds={countupSeconds}
            countupTargetSeconds={countupTargetSeconds}
            isCountupRunning={isCountupRunning}
            onCenterClick={() => setIsCountdownModalOpen(true)}
          />
        </div>

        {/* Dica da primeira abertura: "Toque no centro para configurar" (desaparece em fade após 10s e não volta nas próximas vezes) */}
        {timerMode === 'clock' && showFirstTimeHint && (
          <div
            className={`mt-6 flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-1000 ease-out backdrop-blur-md ${
              isHintFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-85 scale-100'
            } ${
              isDark
                ? 'text-neutral-300 border-neutral-800 bg-neutral-900/60'
                : 'text-neutral-600 border-neutral-200 bg-neutral-100/80 shadow-xs'
            }`}
          >
            <Timer className="w-3.5 h-3.5 opacity-70" style={{ color: settings.circleColor }} />
            <span>Toque no centro para configurar</span>
          </div>
        )}
      </main>

      {/* Modal de Configuração de Tempo (Contagem Progressiva ou Regressiva) */}
      <CountdownModal
        isOpen={isCountdownModalOpen}
        onClose={() => setIsCountdownModalOpen(false)}
        theme={theme}
        circleColor={settings.circleColor}
        timerMode={timerMode}
        countdownRemainingSeconds={countdownRemainingSeconds}
        countdownTotalSeconds={countdownTotalSeconds}
        isCountdownRunning={isCountdownRunning}
        countupSeconds={countupSeconds}
        countupTargetSeconds={countupTargetSeconds}
        isCountupRunning={isCountupRunning}
        onStartCountdown={handleStartCountdown}
        onStartCountup={handleStartCountup}
        onTogglePauseResume={handleTogglePauseResume}
        onResetTimer={handleResetTimer}
        onResetToClock={handleResetToClock}
      />

      {/* Página de Configurações com todas as opções */}
      <SettingsPage
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenSwiftModal={() => setIsSwiftModalOpen(true)}
        onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
      />

      {/* Modal de Código Nativo Swift / SwiftUI */}
      <SwiftCodeModal
        isOpen={isSwiftModalOpen}
        onClose={() => setIsSwiftModalOpen(false)}
        settings={settings}
        theme={theme}
      />

      {/* Modal de Site HTML Standalone (index.html) */}
      <HtmlSiteModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        settings={settings}
        theme={theme}
      />
    </div>
  );
}
