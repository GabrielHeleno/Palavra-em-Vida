import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, Printer, FileDown, Bot, FileCode, HelpCircle } from 'lucide-react';
import { UserGuideModal } from './UserGuideModal';
import { JsonImportModal } from './JsonImportModal';

interface ThemeSelectorProps {
  themeInput: string;
  onChangeThemeInput: (value: string) => void;
  onSubmit: () => void;
  onOpenAdvanced: () => void;
  onImportJSONFile?: (file: File) => void;
  onImportJSONContent?: (content: string, sourceName?: string) => boolean | void;
  isLoading: boolean;
  loadingStepText: string;
  hasAdvancedConfig?: boolean;
  onPrint?: () => void;
  onDownloadPDF?: () => void;
  canPrint?: boolean;
  canDownloadPDF?: boolean;
  hasAnyOverflow?: boolean;
}

const DYNAMIC_SUGGESTIONS = [
  'Conversão e mudança de vida',
  'Perdão e reconciliação',
  'Família e matrimônio',
  'Esperança nas dificuldades',
  'Paz e serenidade',
  'Eucaristia e comunhão',
  'Gratidão e louvor',
  'Serviço e caridade ao próximo',
  'Confiança na Providência divina',
  'Misericórdia e acolhimento',
  'Vocação e seguimento',
  'Oração e intimidade com Deus',
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themeInput,
  onChangeThemeInput,
  onSubmit,
  onOpenAdvanced,
  onImportJSONFile,
  onImportJSONContent,
  isLoading,
  loadingStepText,
  hasAdvancedConfig,
  onPrint,
  onDownloadPDF,
  canPrint = true,
  canDownloadPDF = true,
  hasAnyOverflow = false,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Efeito de máquina de escrever (digitação e apagamento contínuo do placeholder)
  useEffect(() => {
    if (themeInput.length > 0) return;

    const currentFullText = DYNAMIC_SUGGESTIONS[suggestionIdx];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, 28);
      } else {
        setIsDeleting(false);
        setSuggestionIdx(prev => (prev + 1) % DYNAMIC_SUGGESTIONS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, suggestionIdx, themeInput]);

  const currentTerms = themeInput
    .split(/[,;\n]+/)
    .map(t => t.trim())
    .filter(Boolean);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportJSONFile) {
      onImportJSONFile(file);
    }
    // Limpa o valor para permitir selecionar o mesmo arquivo novamente se desejar
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Campo único com estilo Glass e contorno neon brilhante em verde litúrgico */}
      <div className="relative">
        <input
          id="theme-input-field"
          type="text"
          value={themeInput}
          onChange={e => onChangeThemeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={displayText || ' '}
          disabled={isLoading}
          className="input-gemini-neon w-full text-sm sm:text-base px-11 py-3.5 rounded-2xl placeholder-stone-600/70 text-stone-950 font-medium text-center placeholder:text-center"
        />
        {themeInput.trim() && (
          <button
            type="button"
            onClick={() => onChangeThemeInput('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-stone-800 hover:bg-white/40 rounded-full transition cursor-pointer backdrop-blur-xs"
            title="Limpar campo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ação principal: Botão Amém! centralizado */}
      <div className="flex flex-col items-center justify-center space-y-2.5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl text-base font-bold text-white transition flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-emerald-900/60 backdrop-blur-md border border-white/30 cursor-wait'
              : 'btn-neon-liturgical cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>
                {loadingStepText ? `Amém! ${loadingStepText}` : 'Amém! Selecionando versículos...'}
              </span>
            </>
          ) : (
            <span>Amém!</span>
          )}
        </button>

        {/* Linha auxiliar: Indicador de IA e botões de ação com wrap responsivo para mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2.5 px-0.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {/* Switch desabilitado por padrão para seleção por IA Gemini */}
            <div
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-300/70 bg-white/55 backdrop-blur-md shadow-2xs opacity-90 select-none cursor-not-allowed"
              title="Seleção determinística ativa (Catálogo com 300 temas pastorais offline)"
            >
              <div className="relative inline-flex h-4.5 w-8 shrink-0 cursor-not-allowed items-center rounded-full bg-stone-300/90 transition-colors">
                <span className="translate-x-0.5 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-700">Seleção por IA Gemini</span>
            </div>

            {currentTerms.length > 0 && (
              <span className="bg-white/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/60 text-[11px] text-stone-700 shadow-2xs">
                {currentTerms.length} tema(s):{' '}
                <strong className="text-emerald-950 font-bold">{currentTerms.join(' • ')}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            {/* 1. Botão Como uso? (Discreto) */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="text-xs text-stone-700 hover:text-emerald-950 bg-white/50 hover:bg-white/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/70 hover:border-emerald-500/50 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs active:scale-[0.98]"
              title="Abrir guia rápido de como usar o sistema (Como uso?)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="font-medium whitespace-nowrap">Como uso?</span>
            </button>

            {/* 2. Botão Robô (Link do Gemini) */}
            <a
              href="https://share.gemini.google/hWvKtqOnLAPP"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 text-emerald-100 hover:text-white bg-emerald-900/85 hover:bg-emerald-800/95 backdrop-blur-md rounded-xl border border-emerald-600/50 hover:border-emerald-400/80 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98] shrink-0"
              title="Abrir chat de referência do Gemini (https://share.gemini.google/hWvKtqOnLAPP)"
              aria-label="Abrir referência no Gemini"
            >
              <Bot className="w-4 h-4 text-emerald-100" />
            </a>

            {/* 3. Botão Inserir JSON (Anexar arquivo ou Colar código) */}
            <button
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              className="p-2 sm:p-2.5 text-emerald-100 hover:text-white bg-emerald-900/85 hover:bg-emerald-800/95 backdrop-blur-md rounded-xl border border-emerald-600/50 hover:border-emerald-400/80 transition flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98] shrink-0"
              title="Importar JSON com frases prontas (anexar arquivo .json ou colar código)"
              aria-label="Importar frases em JSON"
            >
              <FileCode className="w-4 h-4 text-emerald-100" />
            </button>

            {/* 4. Botão Imprimir */}
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                disabled={!canPrint}
                className="p-2 sm:p-2.5 text-emerald-100 hover:text-white bg-emerald-900/85 hover:bg-emerald-800/95 backdrop-blur-md rounded-xl border border-emerald-600/50 hover:border-emerald-400/80 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98] shrink-0"
                title="Imprimir folha A4 com diálogo de impressão nativo"
                aria-label="Imprimir folha A4"
              >
                <Printer className="w-4 h-4 text-emerald-100" />
              </button>
            )}

            {/* 5. Botão Download (Baixar PDF - Estilo Glass Branco) */}
            {onDownloadPDF && (
              <button
                type="button"
                onClick={onDownloadPDF}
                disabled={!canDownloadPDF || hasAnyOverflow}
                className={`p-2 sm:p-2.5 backdrop-blur-md rounded-xl border transition flex items-center justify-center shadow-2xs active:scale-[0.98] shrink-0 ${
                  hasAnyOverflow
                    ? 'bg-red-500/20 border-red-300 text-red-900 cursor-not-allowed'
                    : !canDownloadPDF
                    ? 'bg-white/30 border-white/40 text-stone-400 opacity-30 cursor-not-allowed'
                    : 'text-stone-800 hover:text-emerald-950 bg-white/60 hover:bg-white/85 border-white/80 hover:border-emerald-500/50 cursor-pointer'
                }`}
                title={
                  hasAnyOverflow
                    ? 'Texto ultrapassa a altura do cartão em alguns itens. Ajuste antes de baixar o PDF.'
                    : 'Baixar arquivo PDF com os 12 cartões prontos para impressão A4'
                }
                aria-label="Baixar arquivo PDF"
              >
                <FileDown className="w-4 h-4 text-emerald-950" />
              </button>
            )}

            {/* 6. Botão Avançado */}
            <button
              type="button"
              onClick={onOpenAdvanced}
              className="text-xs text-stone-800 hover:text-emerald-950 bg-white/40 hover:bg-white/65 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/70 hover:border-emerald-500/50 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs active:scale-[0.98] shrink-0"
              title="Abrir configurações avançadas (orientação pastoral, logotipo e paróquia)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-900" />
              <span className="font-semibold whitespace-nowrap">Avançado</span>
              {hasAdvancedConfig && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
                  title="Configurações ativas"
                ></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal com Manual/Guia de Uso para Usuário Final */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Modal para Importar Frases em JSON (Anexar Arquivo ou Colar Código) */}
      <JsonImportModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onImport={(content, sourceName) => {
          if (onImportJSONContent) {
            return onImportJSONContent(content, sourceName);
          }
          if (onImportJSONFile) {
            const file = new File([content], sourceName || 'import.json', { type: 'application/json' });
            onImportJSONFile(file);
          }
        }}
      />
    </div>
  );
};
