import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileCode, CheckCircle, ArrowRight } from 'lucide-react';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonString: string, sourceName?: string) => boolean | void;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        setJsonText(text);
        setFileName(file.name);
      } catch (err) {
        console.error('Erro ao ler arquivo:', err);
      }
    }
  };

  const handleImportClick = () => {
    if (!jsonText.trim()) return;
    const ok = onImport(jsonText, fileName || 'Código JSON');
    if (ok !== false) {
      onClose();
    }
  };

  const hasContent = jsonText.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/45 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl border border-white/80 shadow-2xl flex flex-col overflow-hidden text-stone-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho Glass */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between bg-white/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-md">
              <FileCode className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-950 font-serif-sacred tracking-wide">
              Importar JSON
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-white/60 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Glass */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Botão de Anexar Arquivo */}
          <div className="flex items-center justify-between gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl transition cursor-pointer shadow-md shadow-emerald-950/20 border border-emerald-500/40 hover:border-emerald-400 active:scale-[0.98]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Anexar Arquivo JSON</span>
            </button>

            {fileName && (
              <span className="text-xs font-semibold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-xl truncate max-w-[240px] shadow-xs">
                {fileName}
              </span>
            )}
          </div>

          {/* Campo para colar o código JSON */}
          <textarea
            rows={10}
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            placeholder="Cole o código JSON aqui..."
            className="input-gemini-neon w-full font-mono text-xs p-4 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none transition resize-y bg-white/60 focus:bg-white/90"
            spellCheck={false}
            autoFocus
          />
        </div>

        {/* Rodapé Glass com Botão Vívido e Destacado */}
        <div className="p-4 sm:p-5 border-t border-white/60 flex items-center justify-end gap-3 bg-white/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-white/60 transition cursor-pointer border border-transparent hover:border-stone-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            disabled={!hasContent}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition duration-200 ${
              hasContent
                ? 'bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 text-white shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-400/60 hover:ring-emerald-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-stone-200/80 text-stone-400 border border-stone-300/60 cursor-not-allowed opacity-75'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${hasContent ? 'text-emerald-300' : 'text-stone-400'}`} />
            <span>Carregar Cartões</span>
          </button>
        </div>
      </div>
    </div>
  );
};
