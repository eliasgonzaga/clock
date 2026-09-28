import React from 'react';
import { COLOR_PRESETS, ClockSettings, ThemeMode } from '../types/clock';
import {
  X,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Pipette,
  Check,
  Sparkles,
  Circle,
  Hash,
  Layers,
  Clock,
  Sliders,
  Code2,
  Activity,
  Play,
  Globe
} from 'lucide-react';
import { playTickSound } from '../utils/audio';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  settings: ClockSettings;
  onUpdateSettings: (updates: Partial<ClockSettings>) => void;
  onOpenSwiftModal: () => void;
  onOpenHtmlModal: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  settings,
  onUpdateSettings,
  onOpenSwiftModal,
  onOpenHtmlModal,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Current visibility mode calculation
  const currentVisibility =
    settings.showCircle && settings.showNumbers
      ? 'both'
      : settings.showCircle && !settings.showNumbers
      ? 'circle-only'
      : !settings.showCircle && settings.showNumbers
      ? 'numbers-only'
      : 'both';

  const handleVisibilityChange = (mode: 'both' | 'circle-only' | 'numbers-only') => {
    if (mode === 'both') {
      onUpdateSettings({ showCircle: true, showNumbers: true });
    } else if (mode === 'circle-only') {
      onUpdateSettings({ showCircle: true, showNumbers: false });
    } else if (mode === 'numbers-only') {
      onUpdateSettings({ showCircle: false, showNumbers: true });
    }
  };

  const handleFormatChange = (format: 'seconds' | 'minutes' | 'hours') => {
    if (format === 'seconds') {
      onUpdateSettings({ onlySeconds: true, showHours: false });
    } else if (format === 'minutes') {
      onUpdateSettings({ onlySeconds: false, showHours: false });
    } else if (format === 'hours') {
      onUpdateSettings({ onlySeconds: false, showHours: true });
    }
  };

  const currentFormat = settings.onlySeconds
    ? 'seconds'
    : settings.showHours
    ? 'hours'
    : 'minutes';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex justify-center animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl border shadow-2xl transition-colors duration-300 flex flex-col ${
          isDark
            ? 'bg-neutral-950 border-neutral-800 text-white'
            : 'bg-neutral-50 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header da Página de Configurações */}
        <div
          className={`sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b backdrop-blur-xl ${
            isDark
              ? 'bg-neutral-950/90 border-neutral-800/80'
              : 'bg-white/90 border-neutral-200/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{
                borderColor: settings.circleColor,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Sliders className="w-4 h-4" style={{ color: settings.circleColor }} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Configurações</h2>
              <p className="text-xs text-neutral-400">Personalize a aparência e funcionamento</p>
            </div>
          </div>

          {/* Botão de Fechar / Concluir */}
          <button
            type="button"
            onClick={onClose}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer border ${
              isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'
                : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 shadow-xs'
            }`}
          >
            <span>Concluir</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Conteúdo com Todas as Opções */}
        <div className="p-6 space-y-6">

          {/* 1. MODOS CLARO OU ESCURO */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  Tema de Cores
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Alternar entre fundo branco com texto preto ou fundo preto com texto branco
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-medium text-xs transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-black border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : isDark
                    ? 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Modo Claro (Fundo Branco)</span>
                {theme === 'light' && <Check className="w-4 h-4 text-amber-600 ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-medium text-xs transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-neutral-900 text-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Modo Escuro (Fundo Preto)</span>
                {theme === 'dark' && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
              </button>
            </div>
          </section>

          {/* 2. COR DO CÍRCULO E CORES RÁPIDAS */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: settings.circleColor }}
                  />
                  Cor do Círculo
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Escolha uma cor da paleta ou defina qualquer tonalidade personalizada
                </p>
              </div>

              <span
                className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md uppercase border"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: settings.circleColor,
                }}
              >
                {settings.circleColor}
              </span>
            </div>

            {/* Paleta de Cores Rápidas */}
            <div className="mt-4">
              <label className="text-xs font-medium text-neutral-400 block mb-2">
                Cores Rápidas
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    settings.circleColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onUpdateSettings({ circleColor: preset.color })}
                      title={preset.name}
                      aria-label={`Selecionar cor ${preset.name}`}
                      className="group relative w-9 h-9 rounded-full transition-transform active:scale-90 flex items-center justify-center cursor-pointer shadow-sm hover:scale-110"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 stroke-[3] ${
                            preset.id === 'yellow' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Seletor Customizado / Pipeta */}
                <div className="relative">
                  <label
                    htmlFor="custom-color-picker-page"
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-dashed cursor-pointer transition-all hover:scale-110 ${
                      isDark
                        ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-800'
                        : 'border-neutral-300 hover:border-neutral-400 bg-neutral-100'
                    }`}
                    title="Escolher qualquer cor hexadecimal"
                  >
                    <Pipette className="w-4 h-4 text-neutral-400" />
                  </label>
                  <input
                    id="custom-color-picker-page"
                    type="color"
                    value={settings.circleColor}
                    onChange={(e) => onUpdateSettings({ circleColor: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. ALTERNAR VISIBILIDADE (ESCONDER NÚMEROS OU CÍRCULO) */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Alternar Visibilidade dos Elementos
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Escolha se deseja ver o círculo com os números, apenas o círculo ou apenas os números
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                type="button"
                onClick={() => handleVisibilityChange('both')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 border cursor-pointer ${
                  currentVisibility === 'both'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Circle className="w-4 h-4" />
                  <Hash className="w-4 h-4" />
                </div>
                <span>Ambos</span>
              </button>

              <button
                type="button"
                onClick={() => handleVisibilityChange('circle-only')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 border cursor-pointer ${
                  currentVisibility === 'circle-only'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
                title="Esconder os números e manter o círculo"
              >
                <Circle className="w-4 h-4" />
                <span>Apenas Círculo</span>
              </button>

              <button
                type="button"
                onClick={() => handleVisibilityChange('numbers-only')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 border cursor-pointer ${
                  currentVisibility === 'numbers-only'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
                title="Esconder o círculo e manter os números"
              >
                <Hash className="w-4 h-4" />
                <span>Apenas Números</span>
              </button>
            </div>
          </section>

          {/* 4. ALTERNAR FORMATO */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Alternar Formato dos Números
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Escolha se o mostrador exibirá apenas os segundos, minutos e segundos ou horas completas
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                type="button"
                onClick={() => handleFormatChange('seconds')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                  currentFormat === 'seconds'
                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
              >
                <span className="text-sm font-mono font-bold">45</span>
                <span>Apenas Segundos</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormatChange('minutes')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                  currentFormat === 'minutes'
                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
              >
                <span className="text-sm font-mono font-bold">12:45</span>
                <span>Minutos e Seg</span>
              </button>

              <button
                type="button"
                onClick={() => handleFormatChange('hours')}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 border cursor-pointer ${
                  currentFormat === 'hours'
                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                }`}
              >
                <span className="text-sm font-mono font-bold">10:12:45</span>
                <span>Horas, Min, Seg</span>
              </button>
            </div>
          </section>

          {/* 5. ATIVAR TIC-TAC ACÚSTICO */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    settings.soundEnabled
                      ? 'bg-blue-500/20 text-blue-400'
                      : isDark
                      ? 'bg-neutral-800 text-neutral-400'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Ativar Tic-Tac Acústico</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Som sutil sintetizado com afinação precisa a cada segundo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Botão de teste rápido de som */}
                <button
                  type="button"
                  onClick={() => playTickSound(true)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border transition-colors ${
                    isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300'
                  }`}
                  title="Ouvir amostra do som de tic-tac"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Testar</span>
                </button>

                {/* Switch de Ativação */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.soundEnabled}
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    settings.soundEnabled ? 'bg-blue-600' : isDark ? 'bg-neutral-800' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* 6. AJUSTES ADICIONAIS DO CÍRCULO (Espessura, Movimento e Brilho) */}
          <section
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200/90 shadow-xs'
            }`}
          >
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Ajustes do Anel de Segundos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1.5 font-medium">Espessura do Anel</label>
                <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {[
                    { label: 'Fino', val: 6 },
                    { label: 'Médio', val: 10 },
                    { label: 'Grosso', val: 16 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => onUpdateSettings({ strokeWidth: item.val })}
                      className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
                        settings.strokeWidth === item.val
                          ? 'bg-white dark:bg-neutral-700 shadow-xs font-semibold text-neutral-900 dark:text-white'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1.5 font-medium">Animação dos Segundos</label>
                <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ smoothSweep: true })}
                    className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
                      settings.smoothSweep
                        ? 'bg-white dark:bg-neutral-700 shadow-xs font-semibold text-neutral-900 dark:text-white'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Fluido (60fps)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ smoothSweep: false })}
                    className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
                      !settings.smoothSweep
                        ? 'bg-white dark:bg-neutral-700 shadow-xs font-semibold text-neutral-900 dark:text-white'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Passo a Passo (1s)
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={settings.enableGlow}
                  onChange={(e) => onUpdateSettings({ enableGlow: e.target.checked })}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Brilho Neon ao Redor
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={settings.showTickMarks}
                  onChange={(e) => onUpdateSettings({ showTickMarks: e.target.checked })}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Marcadores de Segundos (Ticks)</span>
              </label>
            </div>
          </section>

          {/* 7. EXPORTADOR SITE HTML STANDALONE */}
          <section
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              isDark ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50/70 border-blue-200/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-blue-500 dark:text-blue-400">
                  Site HTML Standalone (index.html)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Arquivo único com HTML5, CSS e JS puro para rodar em qualquer navegador
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHtmlModal();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Ver Site HTML
            </button>
          </section>

          {/* 8. EXPORTADOR SWIFT / SWIFTUI */}
          <section
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              isDark ? 'bg-orange-950/20 border-orange-900/40' : 'bg-orange-50/70 border-orange-200/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-orange-500 dark:text-orange-400">
                  Código Nativo Swift / SwiftUI
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Exporte o código fonte completo para Xcode (iOS 16, 17, 18)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSwiftModal();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Ver Código Swift
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};
