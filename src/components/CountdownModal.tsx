import React, { useState } from 'react';
import { ThemeMode, TimerMode } from '../types/clock';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Timer,
  TrendingUp,
  Hourglass,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  circleColor: string;
  timerMode: TimerMode;
  countdownRemainingSeconds: number;
  countdownTotalSeconds: number;
  isCountdownRunning: boolean;
  countupSeconds: number;
  countupTargetSeconds: number;
  isCountupRunning: boolean;
  onStartCountdown: (seconds: number) => void;
  onStartCountup: (targetSeconds: number) => void;
  onTogglePauseResume: () => void;
  onResetTimer: () => void;
  onResetToClock: () => void;
}

export const CountdownModal: React.FC<CountdownModalProps> = ({
  isOpen,
  onClose,
  theme,
  circleColor,
  timerMode,
  countdownRemainingSeconds,
  isCountdownRunning,
  countupSeconds,
  isCountupRunning,
  onStartCountdown,
  onStartCountup,
  onTogglePauseResume,
  onResetTimer,
  onResetToClock,
}) => {
  // Tab selecionada: 'countup' (Contagem Progressiva) ou 'countdown' (Contagem Regressiva)
  const [activeTab, setActiveTab] = useState<'countup' | 'countdown'>(
    timerMode === 'countdown' ? 'countdown' : 'countup'
  );

  // Estados da Contagem Regressiva
  const [cdHours, setCdHours] = useState(0);
  const [cdMinutes, setCdMinutes] = useState(5);
  const [cdSeconds, setCdSeconds] = useState(0);

  // Estados da Contagem Progressiva (meta opcional)
  const [countupTarget, setCountupTarget] = useState<number>(0); // 0 = contínua sem limite

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const countdownPresets = [
    { label: '30s', secs: 30 },
    { label: '1 min', secs: 60 },
    { label: '3 min', secs: 180 },
    { label: '5 min', secs: 300 },
    { label: '10 min', secs: 600 },
    { label: '15 min', secs: 900 },
    { label: '25 min (Pomodoro)', secs: 1500 },
    { label: '30 min', secs: 1800 },
    { label: '45 min', secs: 2700 },
    { label: '60 min', secs: 3600 },
  ];

  const countupGoalPresets = [
    { label: 'Livre (Sem Limite)', secs: 0 },
    { label: 'Meta: 1 min', secs: 60 },
    { label: 'Meta: 5 min', secs: 300 },
    { label: 'Meta: 10 min', secs: 600 },
    { label: 'Meta: 15 min', secs: 900 },
    { label: 'Meta: 30 min', secs: 1800 },
    { label: 'Meta: 45 min', secs: 2700 },
    { label: 'Meta: 1 hora', secs: 3600 },
  ];

  const handleCountdownPresetSelect = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    setCdHours(h);
    setCdMinutes(m);
    setCdSeconds(s);
  };

  const handleStartCountdown = () => {
    const total = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
    if (total > 0) {
      onStartCountdown(total);
      onClose();
    }
  };

  const handleStartCountup = () => {
    onStartCountup(countupTarget);
    onClose();
  };

  const formatSecondsToDisplay = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl transition-all duration-300 overflow-hidden ${
          isDark
            ? 'bg-neutral-950 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Cabeçalho do Modal */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isDark ? 'border-neutral-800/80 bg-neutral-900/30' : 'border-neutral-100 bg-neutral-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{
                borderColor: circleColor,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }}
            >
              {activeTab === 'countup' ? (
                <TrendingUp className="w-4 h-4" style={{ color: circleColor }} />
              ) : (
                <Hourglass className="w-4 h-4" style={{ color: circleColor }} />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Configurar Tempo</h3>
              <p className="text-xs text-neutral-400">Escolha contagem progressiva ou regressiva</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer border ${
              isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800'
                : 'bg-white hover:bg-neutral-100 text-neutral-600 hover:text-black border-neutral-200 shadow-xs'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas Superiores: CONTAGEM PROGRESSIVA vs CONTAGEM REGRESSIVA */}
        <div className="p-6 pb-2">
          <div
            className={`p-1.5 rounded-2xl flex border gap-1 ${
              isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('countup')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'countup'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Contagem Progressiva</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('countdown')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'countdown'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Hourglass className="w-4 h-4 text-blue-500" />
              <span>Contagem Regressiva</span>
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico por Aba */}
        <div className="p-6 pt-3 space-y-5">
          {/* ================= ABA 1: CONTAGEM PROGRESSIVA ================= */}
          {activeTab === 'countup' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Se Contagem Progressiva estiver atualmente ativa */}
              {timerMode === 'countup' && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block uppercase">
                      Tempo Decorrido
                    </span>
                    <span className="text-2xl font-mono font-bold" style={{ color: circleColor }}>
                      {formatSecondsToDisplay(countupSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onTogglePauseResume}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-200'
                      }`}
                    >
                      {isCountupRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Continuar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onResetTimer}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 hover:opacity-80 text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Reiniciar do zero"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Zerar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Informações da Contagem Progressiva */}
              <div
                className={`p-4 rounded-2xl border text-xs ${
                  isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-neutral-50/70 border-neutral-200 text-neutral-700'
                }`}
              >
                <p className="font-medium">
                  A contagem progressiva inicia em <strong>00:00</strong> e avança a cada segundo. O anel do círculo gira em sincronia marcando o tempo.
                </p>
              </div>

              {/* Opções de Meta Opcional */}
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-2">
                  Meta Opcional para Alarme / Conclusão
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {countupGoalPresets.map((preset) => {
                    const isSelected = countupTarget === preset.secs;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCountupTarget(preset.secs)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão Principal Iniciar Contagem Progressiva */}
              <button
                type="button"
                onClick={handleStartCountup}
                className="w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-white"
                style={{ backgroundColor: circleColor }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Contagem Progressiva</span>
              </button>
            </div>
          )}

          {/* ================= ABA 2: CONTAGEM REGRESSIVA ================= */}
          {activeTab === 'countdown' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Se Contagem Regressiva estiver atualmente ativa */}
              {timerMode === 'countdown' && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block uppercase">
                      Tempo Restante
                    </span>
                    <span className="text-2xl font-mono font-bold" style={{ color: circleColor }}>
                      {formatSecondsToDisplay(countdownRemainingSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onTogglePauseResume}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-200'
                      }`}
                    >
                      {isCountdownRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Continuar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onResetTimer}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 hover:opacity-80 text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Reiniciar tempo inicial"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Seletor Manual de Tempo */}
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-2">
                  Tempo Decrescente
                </label>
                <div className="flex items-center justify-center gap-4 py-2">
                  {/* Horas */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setCdHours((h) => (h + 1 >= 24 ? 0 : h + 1))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div
                      className={`w-16 h-14 rounded-2xl flex items-center justify-center border font-mono text-2xl font-semibold ${
                        isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                      }`}
                    >
                      {String(cdHours).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCdHours((h) => (h - 1 < 0 ? 23 : h - 1))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-neutral-500 uppercase mt-1">Horas</span>
                  </div>

                  <span className="text-2xl font-bold text-neutral-500 -mt-5">:</span>

                  {/* Minutos */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setCdMinutes((m) => (m + 1 >= 60 ? 0 : m + 1))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div
                      className={`w-16 h-14 rounded-2xl flex items-center justify-center border font-mono text-2xl font-semibold ${
                        isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                      }`}
                    >
                      {String(cdMinutes).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCdMinutes((m) => (m - 1 < 0 ? 59 : m - 1))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-neutral-500 uppercase mt-1">Minutos</span>
                  </div>

                  <span className="text-2xl font-bold text-neutral-500 -mt-5">:</span>

                  {/* Segundos */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setCdSeconds((s) => (s + 5 >= 60 ? 0 : s + 5))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div
                      className={`w-16 h-14 rounded-2xl flex items-center justify-center border font-mono text-2xl font-semibold ${
                        isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                      }`}
                    >
                      {String(cdSeconds).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCdSeconds((s) => (s - 5 < 0 ? 55 : s - 5))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-neutral-500 uppercase mt-1">Segundos</span>
                  </div>
                </div>
              </div>

              {/* Tempos Rápidos */}
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-2">
                  Tempos Rápidos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {countdownPresets.map((preset) => {
                    const isSelected =
                      cdHours * 3600 + cdMinutes * 60 + cdSeconds === preset.secs;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleCountdownPresetSelect(preset.secs)}
                        className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão Principal Iniciar Contagem Regressiva */}
              <button
                type="button"
                onClick={handleStartCountdown}
                disabled={cdHours === 0 && cdMinutes === 0 && cdSeconds === 0}
                className="w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: circleColor }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Contagem Regressiva</span>
              </button>
            </div>
          )}

          {/* Botão para Retornar ao Relógio em Tempo Real (se qualquer contagem estiver ativa) */}
          {timerMode !== 'clock' && (
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  onResetToClock();
                  onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Cancelar e Voltar ao Relógio em Tempo Real</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
