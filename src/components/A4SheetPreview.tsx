import React from 'react';
import { ScripturePassage } from '../types/bible';
import { measurePassageInCard, LogoCorner, DEFAULT_LOGO_SIZE_MM } from '../client/cardMeasurement';

interface A4SheetPreviewProps {
  passages: ScripturePassage[];
  logoDataUrl?: string;
  logoPosition?: LogoCorner;
  logoSizeMm?: number;
  parishName?: string;
  fontSizePt: number;
}

export const A4SheetPreview: React.FC<A4SheetPreviewProps> = ({
  passages,
  logoDataUrl,
  parishName,
  fontSizePt,
}) => {
  if (passages.length !== 12) {
    return (
      <div className="p-8 text-center text-stone-500">
        Selecione 12 passagens bíblicas para visualizar a folha A4 completa.
      </div>
    );
  }

  const hasLogo = !!logoDataUrl;

  return (
    <div className="overflow-x-auto pb-4 flex justify-center">
      {/* 
        Container simulando proporção exata da folha A4 Paisagem (297 mm x 210 mm)
        Utiliza classes CSS precisas e suporta impressão direta via @media print
      */}
      <div
        id="a4-printable-sheet"
        className="w-[1040px] h-[735px] bg-white text-stone-900 shadow-xl border border-stone-300 p-[42px] box-border relative select-none print:shadow-none print:border-none print:p-0 print:m-0"
        style={{
          // Em proporção exata à folha A4 paisagem (297 x 210 mm com 12 mm de margem)
          aspectRatio: '297 / 210',
        }}
      >
        {/* Grade de 3 colunas por 4 linhas (12 cartões) */}
        <div className="grid grid-cols-3 grid-rows-4 w-full h-full border border-stone-300">
          {passages.map((passage, index) => {
            const metrics = measurePassageInCard(passage, {
              fontSizePt,
              hasLogo,
              logoSizeMm: 17,
            });

            return (
              <div
                key={passage.id + index}
                className="relative border border-stone-300/80 p-2.5 flex flex-col justify-between overflow-hidden bg-white hover:bg-stone-50/20 transition-colors"
              >
                {/* Cabeçalho do cartão */}
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[12px] font-bold text-[#064E3B] font-serif-sacred tracking-tight">
                      {passage.displayRef}
                    </span>
                    <span className="text-[8px] text-stone-400">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Detalhe dourado discreto */}
                  <div className="w-6 h-[1.5px] bg-amber-600/90 mb-1"></div>
                </div>

                {/* Conteúdo: Texto e Logotipo de 17mm centralizados verticalmente */}
                <div className="flex-1 flex items-center gap-2 my-auto py-0.5">
                  <div className="flex-1">
                    <p
                      className="text-stone-900 leading-tight font-serif-sacred italic line-clamp-7"
                      style={{
                        fontSize: `${fontSizePt * 0.88}pt`,
                        lineHeight: '1.22',
                      }}
                    >
                      "{passage.text}"
                    </p>
                  </div>

                  {hasLogo && logoDataUrl && (
                    <div
                      className="shrink-0 flex items-center justify-center p-0.5 self-center"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <img
                        src={logoDataUrl}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Rodapé do cartão: sem Bíblia de Jerusalém, apenas paróquia se houver */}
                <div className="flex items-center justify-between text-[7.5px] text-stone-600 border-t border-stone-200/50 pt-1 mt-1">
                  <span>{parishName && <span className="font-medium text-stone-700">{parishName}</span>}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
