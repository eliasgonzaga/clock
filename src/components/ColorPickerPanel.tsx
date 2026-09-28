import React from 'react';
import { COLOR_PRESETS, ClockSettings, ThemeMode } from '../types/clock';
import { Pipette, Check, Sparkles, SlidersHorizontal, Eye, EyeOff, Circle, Hash, Layers } from 'lucide-react';

interface ColorPickerPanelProps {
  settings: ClockSettings;
  onUpdateSettings: (updates: Partial<ClockSettings>) => void;
  theme: ThemeMode;
}

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  settings,
  onUpdateSettings,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Current visibility mode
  const currentMode =
    settings.showCircle && settings.showNumbers
      ? 'both'
      : settings.showCircle && !settings.showNumbers
      ? 'circle-only'
      : !settings.showCircle && settings.showNumbers
      ? 'numbers-only'
      : 'both';

  const handleModeChange = (mode: 'both' | 'circle-only' | 'numbers-only') => {
    if (mode === 'both') {
      onUpdateSettings({ showCircle: true, showNumbers: true });
    } else if (mode === 'circle-only') {
      onUpdateSettings({ showCircle: true, showNumbers: false });
    } else if (mode === 'numbers-only') {
      onUpdateSettings({ showCircle: false, showNumbers: true });
    }
  };

  const handleToggleCircle = (checked: boolean) => {
    // Prevent hiding both simultaneously
    if (!checked && !settings.showNumbers) {
      onUpdateSettings({ showCircle: false, showNumbers: true });
    } else {
      onUpdateSettings({ showCircle: checked });
    }
  };

  const handleToggleNumbers = (checked: boolean) => {
    // Prevent hiding both simultaneously
    if (!checked && !settings.showCircle) {
      onUpdateSettings({ showNumbers: false, showCircle: true });
    } else {
      onUpdateSettings({ showNumbers: checked });
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-2xl shadow-black/50'
          : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-2xl shadow-slate-200/60'
      } backdrop-blur-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold tracking-tight">Configurações & Cor do Círculo</h2>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded uppercase tracking-wider font-medium"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
            color: settings.circleColor,
          }}
        >
          {settings.circleColor}
        </span>
      </div>

      {/* REQUISITO: Opção de esconder os números e manter o círculo e vice-versa */}
      <div className="mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            Visibilidade dos Elementos
          </label>
          <span className="text-[10px] text-slate-500">
            {currentMode === 'circle-only'
              ? 'Apenas Círculo ativo'
              : currentMode === 'numbers-only'
              ? 'Apenas Números ativos'
              : 'Círculo + Números'}
          </span>
        </div>

        {/* Segmented Control: Modos Rápidos */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90">
          <button
            type="button"
            onClick={() => handleModeChange('both')}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              currentMode === 'both'
                ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 stroke-[2.5]" />
              <Hash className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Ambos</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('circle-only')}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              currentMode === 'circle-only'
                ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Esconder os números e manter o círculo"
          >
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 stroke-[2.5]" />
              <EyeOff className="w-2.5 h-2.5 opacity-60" />
            </div>
            <span>Apenas Círculo</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('numbers-only')}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              currentMode === 'numbers-only'
                ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Esconder o círculo e manter os números"
          >
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3 stroke-[2.5]" />
              <EyeOff className="w-2.5 h-2.5 opacity-60" />
            </div>
            <span>Apenas Números</span>
          </button>
        </div>

        {/* Toggles Individuais */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <label
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              settings.showCircle
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : isDark
                ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Circle className="w-3.5 h-3.5" />
              Círculo
            </span>
            <input
              type="checkbox"
              checked={settings.showCircle}
              onChange={(e) => handleToggleCircle(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              settings.showNumbers
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : isDark
                ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Hash className="w-3.5 h-3.5" />
              Números
            </span>
            <input
              type="checkbox"
              checked={settings.showNumbers}
              onChange={(e) => handleToggleNumbers(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Formato dos Números (Apenas Segundos, Minutos e Segundos, Horas) */}
        {settings.showNumbers && (
          <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/80">
            <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Formato dos Números Centrais
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => onUpdateSettings({ onlySeconds: true, showHours: false })}
                className={`py-1.5 px-1 rounded text-center text-xs font-medium transition-all ${
                  settings.onlySeconds
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Aparecer apenas em segundos (00 a 59)"
              >
                Apenas Segundos
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ onlySeconds: false, showHours: false })}
                className={`py-1.5 px-1 rounded text-center text-xs font-medium transition-all ${
                  !settings.onlySeconds && !settings.showHours
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Minutos e Segundos (MM:SS)"
              >
                Minutos e Seg
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ onlySeconds: false, showHours: true })}
                className={`py-1.5 px-1 rounded text-center text-xs font-medium transition-all ${
                  !settings.onlySeconds && settings.showHours
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Horas, Minutos e Segundos (HH:MM:SS)"
              >
                Horas, Min, Seg
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Color Swatches */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-slate-400 block">
          Paleta de Cores do Círculo
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = settings.circleColor.toLowerCase() === preset.color.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onUpdateSettings({ circleColor: preset.color })}
                title={preset.name}
                aria-label={`Selecionar cor ${preset.name}`}
                className="group relative w-8 h-8 rounded-full transition-transform active:scale-90 flex items-center justify-center cursor-pointer shadow-sm hover:scale-110"
                style={{ backgroundColor: preset.color }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      preset.id === 'white' || preset.id === 'yellow'
                        ? 'text-slate-900 stroke-[3]'
                        : 'text-white stroke-[3]'
                    }`}
                  />
                )}
                <span className="sr-only">{preset.name}</span>
              </button>
            );
          })}

          {/* Custom Native Color Picker */}
          <div className="relative">
            <label
              htmlFor="custom-color-input"
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-dashed cursor-pointer transition-all hover:scale-110 ${
                isDark
                  ? 'border-slate-700 hover:border-slate-500 bg-slate-800'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-100'
              }`}
              title="Escolher cor personalizada"
            >
              <Pipette className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <input
              id="custom-color-input"
              type="color"
              value={settings.circleColor}
              onChange={(e) => onUpdateSettings({ circleColor: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Thickness & Display Options */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-slate-400 block mb-1.5 font-medium">Espessura do Anel</label>
          <div className="flex gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {[
              { label: 'Fino', val: 6 },
              { label: 'Médio', val: 10 },
              { label: 'Grosso', val: 16 },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => onUpdateSettings({ strokeWidth: item.val })}
                className={`flex-1 py-1 rounded text-center font-medium transition-all ${
                  settings.strokeWidth === item.val
                    ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1.5 font-medium">Movimento do Anel</label>
          <div className="flex gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onUpdateSettings({ smoothSweep: true })}
              className={`flex-1 py-1 rounded text-center font-medium transition-all ${
                settings.smoothSweep
                  ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Fluido (60fps)
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ smoothSweep: false })}
              className={`flex-1 py-1 rounded text-center font-medium transition-all ${
                !settings.smoothSweep
                  ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tick (1s)
            </button>
          </div>
        </div>
      </div>

      {/* Extra Toggles: Glow and Tick Marks */}
      <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-200/50 dark:border-slate-800/80">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={settings.enableGlow}
            onChange={(e) => onUpdateSettings({ enableGlow: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 opacity-70" />
            Brilho Neon
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={settings.showTickMarks}
            onChange={(e) => onUpdateSettings({ showTickMarks: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span>Marcadores (Ticks)</span>
        </label>
      </div>
    </div>
  );
};
