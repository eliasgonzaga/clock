import React, { useState } from 'react';
import { generateStandaloneHtml } from '../utils/htmlWebsite';
import { ClockSettings, ThemeMode } from '../types/clock';
import { X, Copy, Check, Download, Globe, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface HtmlSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  theme: ThemeMode;
}

export const HtmlSiteModal: React.FC<HtmlSiteModalProps> = ({
  isOpen,
  onClose,
  settings,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'howTo'>('code');

  if (!isOpen) return null;

  const htmlCode = generateStandaloneHtml({ settings, theme });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = htmlCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                Site HTML Standalone
                <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Arquivo Único (Zero Dependências)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                HTML5 + CSS + JavaScript puro. Funciona direto em qualquer navegador.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Baixar arquivo index.html pronto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar index.html</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer border ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
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
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código HTML Completo ({htmlCode.split('\n').length} linhas)</span>
          </button>

          <button
            onClick={() => setActiveTab('howTo')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'howTo'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Como Usar & Hospedar</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300">
          {activeTab === 'code' ? (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 leading-relaxed overflow-x-auto whitespace-pre selection:bg-blue-600 selection:text-white">
              <code>{htmlCode}</code>
            </pre>
          ) : (
            <div className="font-sans space-y-5 p-2 text-slate-200">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Totalmente Independente e Auto-Contido
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Todo o estilo CSS, animações SVG de anel, sintetizador de som Web Audio,
                  contagem progressiva, regressiva, modais e persistência em localStorage
                  estão em um único arquivo HTML. Você não precisa instalar Node.js, npm ou nenhum servidor!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 mb-1.5">Opção 1: Execução Local</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                    <li>Clique no botão <strong>"Baixar index.html"</strong> no topo.</li>
                    <li>Dê dois cliques no arquivo baixado no seu computador.</li>
                    <li>Ele abrirá instantaneamente em tela cheia no Chrome, Safari, Edge ou Firefox.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 mb-1.5">Opção 2: Hospedagem Grátis</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                    <li>Suba o arquivo para o <strong>GitHub Pages</strong>, <strong>Netlify</strong> ou <strong>Vercel</strong>.</li>
                    <li>Ou envie diretamente para qualquer servidor web (Apache, Nginx, Cloudflare Pages).</li>
                    <li>Seu site de relógio estará no ar para qualquer dispositivo ou smart TV!</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300">
                <span className="font-semibold text-blue-300">Recursos incluídos no HTML:</span>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>Relógio com anel animado de segundos e 60 marcadores</li>
                  <li>Clique no centro para Contagem Progressiva ou Regressiva</li>
                  <li>Aviso de 10s "Toque no centro para configurar" na primeira abertura com fade out</li>
                  <li>Sons acústicos de tic-tac e alarme melódico de conclusão</li>
                  <li>Configurações de temas, cores vibrantes e espessura do anel</li>
                  <li>Modo Tela Cheia integrado</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Arquivo <code>index.html</code> pronto para produção
          </div>
          <button
            onClick={handleDownload}
            className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salvar no meu computador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
