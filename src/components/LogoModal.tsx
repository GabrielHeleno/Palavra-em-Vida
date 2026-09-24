import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Trash2,
  Check,
  Sparkles,
  Cross,
  RotateCcw,
  HardDrive,
  Clock,
  CheckCircle2,
  FileImage,
  Loader2,
} from 'lucide-react';
import { PRESET_LOGOS, PresetLogo, svgToPngDataUrl } from '../client/presetLogos';
import { LogoCorner } from '../client/cardMeasurement';
import {
  resolveAssetUrl,
  getStoredLogosHistory,
  addStoredLogoHistory,
  urlToDataUrl,
} from '../client/defaultAssets';

export interface AppSavedLogo {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  uploadedAt: string;
  fileSizeBytes: number;
  mimeType: string;
  isDefault: boolean;
}

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoDataUrl?: string;
  logoPosition?: LogoCorner;
  logoSizeMm?: number;
  onSelectLogo: (dataUrl: string | undefined, aspectRatio: number) => void;
  onChangePosition?: (position: LogoCorner) => void;
  onChangeSize?: (sizeMm: number) => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({
  isOpen,
  onClose,
  logoDataUrl,
  onSelectLogo,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'upload' | 'presets'>('history');
  const [savedLogos, setSavedLogos] = useState<AppSavedLogo[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega o histórico de logos salvos nos arquivos do aplicativo (servidor ou localStorage)
  const fetchLogoHistory = async () => {
    try {
      const res = await fetch('/api/logos');
      if (res.ok) {
        const data = await res.json();
        if (data.logos && data.logos.length > 0) {
          setSavedLogos(data.logos);
          return;
        }
      }
    } catch (err) {
      console.warn('Falha ao carregar histórico de logos do servidor:', err);
    }
    const local = getStoredLogosHistory();
    setSavedLogos(local);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogoHistory();
      setUploadFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Upload direto do arquivo para salvar nos arquivos do app
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadFeedback(null);

    const reader = new FileReader();
    reader.onload = async event => {
      const result = event.target?.result as string;
      try {
        try {
          await fetch('/api/logos/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataUrl: result,
              name: file.name,
              setAsDefault: true,
            }),
          });
        } catch {
          // Servidor estático
        }

        const newLogo: AppSavedLogo = {
          id: `logo_${Date.now()}`,
          originalName: file.name,
          filename: file.name,
          url: result,
          uploadedAt: new Date().toISOString(),
          fileSizeBytes: file.size,
          mimeType: file.type || 'image/jpeg',
          isDefault: true,
        };
        addStoredLogoHistory(newLogo);

        // Calcula proporção real da imagem carregada
        const img = new Image();
        img.onload = () => {
          const aspect = img.width / img.height;
          onSelectLogo(result, aspect);
        };
        img.src = result;

        setFeedbackType('success');
        setUploadFeedback(`Arquivo "${file.name}" salvo com sucesso e definido como padrão!`);
        await fetchLogoHistory();
        setActiveTab('history');
      } catch (err: any) {
        console.error('Erro no upload:', err);
        setFeedbackType('error');
        setUploadFeedback(err.message || 'Erro ao processar imagem.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setFeedbackType('error');
      setUploadFeedback('Erro ao ler arquivo do computador.');
    };

    reader.readAsDataURL(file);
  };

  // Define um logo do histórico como padrão do app
  const handleSetDefault = async (logo: AppSavedLogo) => {
    setIsProcessing(true);
    try {
      try {
        await fetch('/api/logos/set-default', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: logo.id }),
        });
      } catch {
        // Fallback
      }

      const resolvedUrl = resolveAssetUrl(logo.url);
      const dataUrl = await urlToDataUrl(resolvedUrl);

      const img = new Image();
      img.onload = () => {
        onSelectLogo(dataUrl, img.width / img.height);
      };
      img.src = dataUrl;

      setUploadFeedback(`Logotipo "${logo.originalName}" ativado como padrão!`);
      setFeedbackType('success');
      await fetchLogoHistory();
    } catch (err: any) {
      setFeedbackType('error');
      setUploadFeedback('Falha ao ativar logotipo: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Exclui um logo salvo nos arquivos do app
  const handleDeleteLogo = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir permanentemente "${name}" dos arquivos do aplicativo?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/logos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao excluir arquivo');
      }

      await fetchLogoHistory();
      if (data.newDefaultUrl) {
        onSelectLogo(data.newDefaultUrl, 1);
      } else {
        onSelectLogo(undefined, 1);
      }

      setFeedbackType('success');
      setUploadFeedback(`Logotipo "${name}" removido com sucesso.`);
    } catch (err: any) {
      console.error('Erro ao excluir:', err);
      setFeedbackType('error');
      setUploadFeedback(err.message || 'Erro ao excluir logotipo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPreset = async (preset: PresetLogo) => {
    setIsProcessing(true);
    setSelectedPresetId(preset.id);
    try {
      const pngUrl = await svgToPngDataUrl(preset.svg, 300);
      onSelectLogo(pngUrl, 1);
    } catch (err) {
      console.error('Erro ao processar logotipo sacro:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setSelectedPresetId(null);
    onSelectLogo(undefined, 1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/90 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/80 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/60 flex items-center justify-between bg-white/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-amber-300 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-600/50">
              <Cross className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-nexa">
                Logotipo da Paróquia nos Cartões
              </h3>
              <p className="text-xs text-stone-500">
                Armazenado no arquivo do app no servidor • Alinhado à direita
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Feedback de status */}
          {uploadFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between transition-all ${
                feedbackType === 'success'
                  ? 'bg-emerald-50/90 text-emerald-900 border border-emerald-300/80 shadow-2xs'
                  : 'bg-red-50/90 text-red-900 border border-red-300/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackType === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{uploadFeedback}</span>
              </div>
              <button
                onClick={() => setUploadFeedback(null)}
                className="text-stone-400 hover:text-stone-700 ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="bg-white/60 border border-stone-200/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Pré-visualização do Cartão (91 x 46,5 mm)
              </span>
              <div className="flex items-center gap-2">
                {logoDataUrl && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1 px-2 py-0.5 rounded hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Desativar no momento
                  </button>
                )}
              </div>
            </div>

            {/* Simulação em escala do Cartão com logo de 17mm centralizado verticalmente à direita */}
            <div className="relative bg-white/90 border border-stone-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between min-h-[110px]">
              {/* Topo do cartão */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#064E3B] font-nexa">
                    1Cor 13, 4-7
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">#1</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 my-1.5 rounded-full"></div>
              </div>

              {/* Corpo com texto bíblico e logo de 17mm à direita centralizado verticalmente */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1">
                  <p className="text-[11px] text-stone-800 italic leading-snug font-nexa">
                    "O amor é paciente, é prestativo; não é invejoso, não se orgulha. Tudo desculpa, tudo crê, tudo espera..."
                  </p>
                </div>

                {logoDataUrl ? (
                  <div
                    className="shrink-0 flex items-center justify-center p-1 bg-stone-50 border border-stone-200 rounded-md self-center"
                    style={{ width: '48px', height: '48px' }}
                    title="Logo centralizada à direita"
                  >
                    <img src={logoDataUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="shrink-0 w-12 h-12 border border-dashed border-stone-300 rounded-md flex items-center justify-center text-[9px] text-stone-400 text-center p-1">
                    Sem logo
                  </div>
                )}
              </div>

              {/* Rodapé do cartão sem Bíblia de Jerusalém */}
              <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-500">
                <span className="italic">Paróquia São Caetano - Cipotânea/MG</span>
                <span className="text-[9px] text-emerald-800 font-medium">Alinhada à direita</span>
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="space-y-3">
            <div className="flex border-b border-stone-200/60 gap-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`pb-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-emerald-700 text-emerald-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
                Histórico do App ({savedLogos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-emerald-700 text-emerald-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                Fazer Novo Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`pb-2 text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'border-emerald-700 text-emerald-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Cross className="w-3.5 h-3.5 text-emerald-700" />
                Modelos Sacros ({PRESET_LOGOS.length})
              </button>
            </div>

            {/* ABA 1: HISTÓRICO DE LOGOS SALVOS NOS ARQUIVOS DO APP */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {savedLogos.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-stone-300 rounded-xl bg-white/50 p-4">
                    <FileImage className="w-10 h-10 mx-auto text-emerald-700/60 mb-2" />
                    <p className="font-bold text-stone-700 text-xs">Nenhum logo salvo nos arquivos do aplicativo ainda</p>
                    <p className="text-[11px] text-stone-500 max-w-md mx-auto mt-1">
                      Envie a imagem oficial da paróquia na aba de upload para que ela fique armazenada no servidor e salva nos arquivos da aplicação.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="btn-neon-liturgical mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-lg transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Enviar Logo Agora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                    {savedLogos.map(logo => {
                      const isCurrent = logoDataUrl === logo.url || logo.isDefault;
                      return (
                        <div
                          key={logo.id}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all bg-white/80 ${
                            isCurrent
                              ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                              : 'border-white/80 hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 shrink-0 p-1 bg-white border border-stone-200 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={resolveAssetUrl(logo.url)}
                                alt={logo.originalName}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-stone-900 truncate font-nexa" title={logo.originalName}>
                                  {logo.originalName}
                                </p>
                              </div>
                              <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                {formatDate(logo.uploadedAt)}
                              </p>
                              <p className="text-[10px] text-stone-400 mt-0.5">
                                Tamanho: {formatFileSize(logo.fileSizeBytes)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" /> Padrão Ativo
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleSetDefault(logo)}
                                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline transition"
                              >
                                Usar como Padrão
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleDeleteLogo(logo.id, logo.originalName)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                              title="Excluir arquivo do servidor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ABA 2: UPLOAD DE NOVO ARQUIVO */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition group ${
                    isUploading
                      ? 'border-emerald-400 bg-emerald-50/40 cursor-wait'
                      : 'border-stone-300 hover:border-emerald-700 bg-stone-50 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-900 font-nexa">
                    {isUploading ? 'Gravando arquivo no servidor...' : 'Clique para selecionar a imagem da paróquia'}
                  </p>
                  <p className="text-xs text-stone-600 mt-1.5 font-medium">
                    O arquivo selecionado (ex: <strong>Cópia de paroquia (3).jpg</strong>) é gravado diretamente no diretório do servidor sem qualquer alteração gráfica ou compactação destrutiva, ficando salvo no histórico oficial.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Formatos aceitos: JPG, PNG, WebP ou SVG (sem limites artificiais)
                  </p>
                </div>
              </div>
            )}

            {/* ABA 3: SÍMBOLOS SACROS PRONTOS */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {PRESET_LOGOS.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-between transition group cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                          : 'border-white/80 bg-white/80 hover:border-emerald-500/50 hover:bg-emerald-50/40'
                      }`}
                    >
                      <div
                        className="w-12 h-12 mb-2 p-1.5 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:scale-105 transition-transform"
                        dangerouslySetInnerHTML={{ __html: preset.svg }}
                      />
                      <div className="text-center">
                        <p className="text-xs font-bold text-stone-900 font-nexa">
                          {preset.name}
                        </p>
                        <p className="text-[10px] text-stone-500 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                      <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-white border border-stone-200/80 text-stone-700 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        Aplicar
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200/60 flex items-center justify-between bg-white/50 rounded-b-2xl">
          <p className="text-xs text-stone-500">
            {logoDataUrl
              ? 'Logo ativa em todos os 12 cartões (centralizada verticalmente à direita).'
              : 'Nenhum logo ativo no momento.'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-neon-liturgical px-6 py-2 text-xs font-bold text-white rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Concluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
