import React, { useEffect } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  FileCode,
  SlidersHorizontal,
  Printer,
  FileDown,
  Edit3,
  CheckCircle2,
  BookOpen,
  Church,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-white/80 bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-stone-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-guide-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="user-guide-title" className="text-lg sm:text-xl font-bold text-emerald-950 font-serif-sacred">
                Guia Rápido: Como Usar
              </h2>
              <p className="text-xs text-stone-600">
                Instruções simples para gerar e imprimir seus cartões da Palavra de Deus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Passos */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {/* Passo 1 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="w-7 h-7 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Digite um tema e clique em "Amém!"
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-700">
                Escreva o tema desejado (ex: <em>Esperança, Cura, Catequese, Jovens, Matrimônio, Salmos</em>) no campo de texto e clique no botão verde <strong>Amém!</strong>. O sistema selecionará e formatará automaticamente os 12 cartões.
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
            <div className="w-7 h-7 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                <FileCode className="w-4 h-4 text-emerald-700" />
                Importar arquivo JSON pronto (Opcional)
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-700">
                Se você já possui suas próprias frases ou versículos salvos em um arquivo <code>.json</code>, clique no botão <strong>Inserir JSON</strong> (ao lado de Avançado). Se o resultado do passo anterior não foi bom o suficiente utilize o botão do robô para gerar um arquivo com passagens bíblicas melhores...
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
            <div className="w-7 h-7 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                Personalizar Movimento Pastoral, Logo e Letra no botão "Avançado"
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-700">
                No menu <strong>Avançado</strong>, você deve informar o nome do seu <strong>Movimento Pastoral</strong> dentro da paróquia (ex: <em>Pastoral Familiar, Catequese, Jovens, ECC, RCC, Dízimo, Vicentinos</em>), carregar a imagem do seu <strong>Logotipo</strong> (centralizado verticalmente em 17mm) e ajustar o tamanho da fonte.
              </p>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
            <div className="w-7 h-7 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                <Printer className="w-4 h-4 text-emerald-700" />
                Imprimir ou Baixar em PDF (Folha A4)
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-700">
                Utilize o botão verde de <strong>Impressão</strong> para imprimir diretamente, ou o botão <strong>Baixar PDF</strong> (estilo glass branco) para gerar o documento A4 paisagem com 12 cartões prontos para corte.
              </p>
            </div>
          </div>

          {/* Dica de ouro */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              <strong>Dica:</strong> Cada folha A4 impressa contém exatamente 12 cartões em 3 colunas e 4 linhas com traços de corte discretos para facilitar o recorte pastoral.
            </span>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-stone-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer shadow-sm active:scale-[0.98]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
