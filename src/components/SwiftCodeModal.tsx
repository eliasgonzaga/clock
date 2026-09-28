import React, { useState } from 'react';
import { generateSwiftUICode } from '../utils/swiftCode';
import { ClockSettings, ThemeMode } from '../types/clock';
import { X, Copy, Check, Terminal, ExternalLink, Smartphone, FileCode2 } from 'lucide-react';

interface SwiftCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  theme: ThemeMode;
}

export const SwiftCodeModal: React.FC<SwiftCodeModalProps> = ({
  isOpen,
  onClose,
  settings,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'tutorial'>('code');

  if (!isOpen) return null;

  const swiftCode = generateSwiftUICode({
    currentColorHex: settings.circleColor,
    isDarkMode: theme === 'dark',
    strokeWidth: settings.strokeWidth,
    showHours: settings.showHours,
    smoothSweep: settings.smoothSweep,
    showCircle: settings.showCircle,
    showNumbers: settings.showNumbers,
    onlySeconds: settings.onlySeconds,
    soundEnabled: settings.soundEnabled,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(swiftCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                Código Nativo Swift / SwiftUI
                <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  iOS 16, 17 & 18
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pronto para copiar e colar diretamente no Xcode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800/80 bg-slate-900/50 text-xs">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ContentView.swift
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'tutorial'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            Como Rodar no Xcode
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-300">
          {activeTab === 'code' ? (
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto text-[13px] text-slate-200 font-mono">
                <code>{swiftCode}</code>
              </pre>
            </div>
          ) : (
            <div className="font-sans text-sm space-y-6 text-slate-300 max-w-2xl">
              <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  Passo a Passo para rodar no seu Mac / iPhone
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Este código foi elaborado especificamente em <strong>SwiftUI</strong> moderno,
                  usando a biblioteca padrão da Apple (sem necessidade de instalar nenhum Pod ou pacote externo).
                </p>
              </div>

              <ol className="space-y-4 text-xs leading-relaxed">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-semibold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <strong className="text-white block text-sm mb-1">
                      Abra o Xcode e Crie um Novo Projeto
                    </strong>
                    Selecione <em>File &gt; New &gt; Project</em>. Escolha a plataforma <strong>iOS</strong> e o template <strong>App</strong>. Dê o nome de <code className="text-orange-300 bg-slate-900 px-1 py-0.5 rounded">RelogioCirculo</code> e garanta que a Interface selecionada seja <strong>SwiftUI</strong>.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-semibold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <strong className="text-white block text-sm mb-1">
                      Substitua o arquivo ContentView.swift
                    </strong>
                    Abra o arquivo <code className="text-orange-300 bg-slate-900 px-1 py-0.5 rounded">ContentView.swift</code> gerado pelo Xcode, selecione tudo (Cmd+A), delete e cole o código da aba anterior.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-semibold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <strong className="text-white block text-sm mb-1">
                      Execute no Simulador ou iPhone Real
                    </strong>
                    Pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">Cmd + R</kbd> para rodar no simulador iOS do Xcode, ou ative o Canvas Preview com <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">Option + Cmd + Enter</kbd>.
                  </div>
                </li>
              </ol>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
                <strong>Dica de Customização em Swift:</strong> O código inclui a estrutura <code className="text-blue-300">TimelineView(.animation)</code> que garante uma animação ultra suave de 60 quadros por segundo para o preenchimento do anel ao redor do relógio.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span>Configuração atual exportada: Anel {settings.circleColor} · Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
          <button
            onClick={handleCopy}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            {copied ? 'Código copiado para a área de transferência!' : 'Copiar para a área de transferência'}
          </button>
        </div>
      </div>
    </div>
  );
};
