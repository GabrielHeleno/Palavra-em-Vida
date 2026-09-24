import React, { useState, useRef } from 'react';
import {
  X,
  SlidersHorizontal,
  Compass,
  Upload,
  Trash2,
  Image as ImageIcon,
  Building2,
} from 'lucide-react';
import { PRESET_LOGOS, PresetLogo, svgToPngDataUrl } from '../client/presetLogos';

interface AdvancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastoralGuidance: string;
  onChangeGuidance: (guidance: string) => void;
  parishName: string;
  onChangeParishName: (name: string) => void;
  logoDataUrl?: string;
  onSelectLogo: (dataUrl: string | undefined, aspectRatio: number) => void;
}

export const AdvancedModal: React.FC<AdvancedModalProps> = ({
  isOpen,
  onClose,
  pastoralGuidance,
  onChangeGuidance,
  parishName,
  onChangeParishName,
  logoDataUrl,
  onSelectLogo,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectPreset = async (preset: PresetLogo) => {
    setIsProcessingLogo(true);
    setSelectedPresetId(preset.id);
    try {
      const pngData = await svgToPngDataUrl(preset.svg, 300);
      onSelectLogo(pngData, 1.0);
    } catch (err) {
      console.error('Erro ao processar preset:', err);
    } finally {
      setIsProcessingLogo(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (PNG, JPG ou SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
        onSelectLogo(result, aspect);
        setSelectedPresetId(null);
      };
      img.onerror = () => {
        setUploadError('Não foi possível ler a imagem selecionada.');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    onSelectLogo(undefined, 1);
    setSelectedPresetId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/30 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/75 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/80 overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="p-4 sm:p-5 border-b border-white/50 flex items-center justify-between bg-white/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)] border border-white/40">
              <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif-sacred">
                Configurações Avançadas
              </h2>
              <p className="text-xs text-stone-600">
                Orientação pastoral, identificação e logotipo dos cartões
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-white/50 rounded-lg transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Seção 1: Orientação pastoral complementar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="pastoral-guidance-field"
                className="text-xs font-semibold text-stone-900 flex items-center space-x-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-800" />
                <span>Orientação pastoral complementar (opcional)</span>
              </label>
              <span className="text-[11px] text-stone-500 font-medium">
                {pastoralGuidance.length}/300 caracteres
              </span>
            </div>
            <textarea
              id="pastoral-guidance-field"
              rows={3}
              maxLength={300}
              value={pastoralGuidance}
              onChange={e => onChangeGuidance(e.target.value)}
              placeholder="Exemplo: Para encontro com jovens crismandos; destacar o acolhimento fraterno e a confiança em Deus."
              className="input-gemini-neon w-full text-xs sm:text-sm p-3.5 rounded-2xl placeholder-stone-500/70 text-stone-950 font-medium resize-none"
            />
            <p className="text-[11px] text-stone-600">
              Instruções específicas para direcionar a curadoria bíblica conforme o público ou momento da comunidade.
            </p>
          </div>

          <div className="border-t border-white/40" />

          {/* Seção 2: Movimento Pastoral */}
          <div className="space-y-2">
            <label
              htmlFor="parish-name-field"
              className="text-xs font-semibold text-stone-900 flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Nome do Movimento Pastoral (opcional)</span>
            </label>
            <input
              id="parish-name-field"
              type="text"
              placeholder="Ex: Pastoral Familiar, Catequese, Jovens, ECC, RCC, Dízimo"
              value={parishName}
              onChange={e => onChangeParishName(e.target.value)}
              maxLength={40}
              className="input-gemini-neon w-full text-xs sm:text-sm px-3.5 py-3 rounded-2xl placeholder-stone-500/70 text-stone-950 font-medium"
            />
            <p className="text-[11px] text-stone-600">
              Nome do movimento ou pastoral dentro da paróquia que será impresso no rodapé de cada cartão.
            </p>
          </div>

          <div className="border-t border-white/40" />

          {/* Seção 3: Logotipo do Cartão */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-900 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Logotipo do cartão</span>
              </label>

              {logoDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover logotipo</span>
                </button>
              )}
            </div>

            {/* Pré-visualização do logotipo atual */}
            {logoDataUrl ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-300/80 backdrop-blur-md rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/80 rounded-xl p-1 border border-white/80 flex items-center justify-center shrink-0">
                    <img
                      src={logoDataUrl}
                      alt="Logotipo ativo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      Logotipo ativo nos cartões
                    </span>
                    <span className="text-[11px] text-emerald-900 font-medium">
                      Alinhado à direita no rodapé de cada quadrante
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/40 border border-white/70 backdrop-blur-md rounded-2xl text-stone-600 text-xs flex items-center space-x-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Nenhum logotipo selecionado (os cartões terão mais espaço para texto).</span>
              </div>
            )}

            {/* Presets católicos prontos */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-stone-800 block">
                Escolha um brasão ou símbolo sacro:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_LOGOS.map(preset => {
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      disabled={isProcessingLogo}
                      className="p-2.5 rounded-xl border border-white/70 hover:border-emerald-500 bg-white/45 hover:bg-white/75 backdrop-blur-md text-left transition flex items-center space-x-2.5 cursor-pointer shadow-2xs group"
                    >
                      <div
                        className="w-8 h-8 shrink-0 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: preset.svg }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-stone-800 group-hover:text-emerald-950 truncate block">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enviar arquivo próprio */}
            <div className="pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-600/50 hover:border-emerald-600 bg-white/40 hover:bg-white/60 backdrop-blur-md text-stone-800 hover:text-emerald-950 transition flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 text-emerald-800" />
                <span>Enviar imagem própria do logotipo (PNG ou JPG)</span>
              </button>
              {uploadError && (
                <p className="text-[11px] text-red-600 mt-1.5 font-medium">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé com ação de conclusão */}
        <div className="p-4 border-t border-white/50 bg-white/40 flex items-center justify-between">
          <span className="text-xs text-stone-600 font-medium">
            {parishName || logoDataUrl || pastoralGuidance ? 'Configurações ativas' : 'Padrão pastoral'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-neon-liturgical px-6 py-2 text-white rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
