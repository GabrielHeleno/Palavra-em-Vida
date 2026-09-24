import React from 'react';
import { X, RefreshCw, Check, ArrowRight, BookOpen } from 'lucide-react';
import { ScripturePassage } from '../types/bible';
import { measurePassageInCard } from '../client/cardMeasurement';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCardIndex: number | null;
  currentPassage: ScripturePassage | null;
  alternates: ScripturePassage[];
  onSwap: (targetIndex: number, newPassage: ScripturePassage) => void;
  fontSizePt: number;
  hasLogo: boolean;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  targetCardIndex,
  currentPassage,
  alternates,
  onSwap,
  fontSizePt,
  hasLogo,
}) => {
  if (!isOpen || targetCardIndex === null || !currentPassage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/70 backdrop-blur-2xl rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/80 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/50 flex items-center justify-between bg-white/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 text-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)] border border-white/40">
              <RefreshCw className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-sacred">
                Substituir Cartão #{targetCardIndex + 1}
              </h3>
              <p className="text-xs text-stone-600">
                Selecione uma das passagens alternativas recuperadas para esta sessão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-white/50 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Passage Summary */}
        <div className="p-4 bg-emerald-500/15 backdrop-blur-md border-b border-white/40 text-xs">
          <span className="font-bold text-emerald-950 block mb-1">Passagem atual no cartão:</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-[#064E3B] font-serif-sacred text-sm">{currentPassage.displayRef}</span>
            <span className="text-stone-600 font-medium">({currentPassage.text.length} caracteres)</span>
          </div>
          <p className="text-stone-800 italic mt-0.5 line-clamp-2 font-medium font-serif-sacred">"{currentPassage.text}"</p>
        </div>

        {/* Alternates List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {alternates.length === 0 ? (
            <div className="text-center py-8 text-stone-600 text-sm">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="font-medium">Nenhuma passagem alternativa restante nesta rodada.</p>
              <p className="text-xs text-stone-500 mt-1">
                Você pode executar uma nova seleção ou fixar os cartões que deseja manter.
              </p>
            </div>
          ) : (
            alternates.map(alt => {
              const isShorter = alt.text.length < currentPassage.text.length;

              return (
                <div
                  key={alt.id}
                  className="p-4 rounded-xl border border-white/70 hover:border-emerald-500/60 bg-white/45 hover:bg-white/75 transition backdrop-blur-md shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#064E3B] font-serif-sacred">
                        {alt.displayRef}
                      </span>
                      <span className="text-[10px] bg-white/60 border border-white/80 text-stone-700 px-1.5 py-0.5 rounded font-medium">
                        {alt.book}
                      </span>
                      {alt.isDeuterocanonical && (
                        <span className="text-[9px] bg-amber-200/60 text-amber-950 border border-amber-300/70 px-1.5 py-0.5 rounded font-semibold">
                          Deuterocanônico
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs">
                      {isShorter ? (
                        <span className="text-emerald-950 font-semibold text-[11px] bg-emerald-100/70 border border-emerald-300/70 px-1.5 py-0.5 rounded">
                          Mais concisa ({alt.text.length} carac.)
                        </span>
                      ) : (
                        <span className="text-stone-600 text-[11px] font-medium">
                          {alt.text.length} carac.
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-900 font-serif-sacred italic leading-relaxed font-medium">
                    "{alt.text}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/40">
                    <div className="flex flex-wrap gap-1">
                      {alt.themes.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] text-stone-700 bg-white/60 border border-white/70 px-1.5 py-0.5 rounded font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSwap(targetCardIndex, alt);
                        onClose();
                      }}
                      className="btn-neon-liturgical text-xs px-3.5 py-1.5 text-white rounded-xl font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Usar este texto</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/50 bg-white/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-white/50 rounded-xl transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
