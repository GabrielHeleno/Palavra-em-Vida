import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileCode, Check, Sparkles } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/40 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl border border-white/70 shadow-2xl flex flex-col overflow-hidden text-stone-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho Glass */}
        <div className="p-4 sm:p-5 border-b border-white/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 text-emerald-100 flex items-center justify-center shadow-xs">
              <FileCode className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-950 font-serif-sacred">
              Importar JSON
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-white/50 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Glass */}
        <div className="p-4 sm:p-6 space-y-3.5">
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
              className="btn-neon-liturgical inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl transition cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Anexar Arquivo JSON</span>
            </button>

            {fileName && (
              <span className="text-xs font-medium text-emerald-950 bg-emerald-100/70 border border-emerald-300/60 px-3 py-1 rounded-xl truncate max-w-[240px]">
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
            className="input-gemini-neon w-full font-mono text-xs p-4 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none transition resize-y"
            spellCheck={false}
            autoFocus
          />
        </div>

        {/* Rodapé Glass */}
        <div className="p-4 sm:p-5 border-t border-white/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-white/50 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            disabled={!jsonText.trim()}
            className={`btn-neon-liturgical px-5 py-2 rounded-xl text-xs font-bold text-white transition ${
              jsonText.trim()
                ? 'cursor-pointer shadow-md active:scale-[0.98]'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Carregar Cartões
          </button>
        </div>
      </div>
    </div>
  );
};
