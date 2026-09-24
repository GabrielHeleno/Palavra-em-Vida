import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { ScripturePassage } from '../types/bible';
import { measurePassageInCard, LogoCorner } from '../client/cardMeasurement';

interface CardItemProps {
  index: number;
  passage: ScripturePassage;
  fontSizePt: number;
  hasLogo: boolean;
  logoDataUrl?: string;
  logoPosition?: LogoCorner;
  logoSizeMm?: number;
}

export const CardItem: React.FC<CardItemProps> = ({
  index,
  passage,
  fontSizePt,
  hasLogo,
  logoDataUrl,
}) => {
  const metrics = measurePassageInCard(passage, {
    fontSizePt,
    hasLogo,
    logoSizeMm: 17,
  });

  return (
    <div
      className={`relative glass-card rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between ${
        metrics.overflows
          ? 'border-red-400/90 ring-2 ring-red-500/30 bg-red-500/20 backdrop-blur-xl'
          : 'border-white/70 hover:border-emerald-400/80'
      }`}
    >
      {/* Top Header: Number, Reference, Canonical tags */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-emerald-950/70 w-5">
              #{index + 1}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#064E3B] font-serif-sacred tracking-tight drop-shadow-2xs">
              {passage.displayRef}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/50 backdrop-blur-xs text-stone-800 font-medium border border-white/70">
              {passage.book}
            </span>
            {passage.isDeuterocanonical && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-200/60 backdrop-blur-xs text-amber-950 font-semibold border border-amber-300/70 shadow-2xs">
                Deuterocanônico
              </span>
            )}
          </div>
        </div>

        {/* Separador sutil dourado */}
        <div className="w-10 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 mb-2.5 rounded-full"></div>

        {/* Passage literal text with 17mm logo vertically centered on the right */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1">
            <p
              className="text-xs sm:text-[13px] text-stone-900 leading-relaxed font-serif-sacred italic font-medium drop-shadow-2xs"
              style={{ fontSize: `${fontSizePt * 0.95}pt` }}
            >
              "{passage.text}"
            </p>
          </div>

          {hasLogo && logoDataUrl && (
            <div
              className="shrink-0 flex items-center justify-center p-1 bg-white/70 backdrop-blur-xs border border-white/80 rounded-xl shadow-2xs self-center"
              style={{ width: '48px', height: '48px' }}
              title="Logo da Paróquia (centralizada à direita)"
            >
              <img
                src={logoDataUrl}
                alt="Logo Paróquia"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Details: Fit badge, Translation badge, Themes */}
      <div className="mt-4 pt-3 border-t border-white/40">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center space-x-1.5 text-stone-600">
            <span className="font-mono bg-white/50 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/60 text-stone-800 font-semibold">
              {passage.text.length}/180 carac.
            </span>
            <span>•</span>
            <span>
              {passage.verseEnd ? `${passage.verseEnd - passage.verseStart + 1} versículos` : '1 versículo'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {metrics.overflows ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-semibold bg-red-200/70 backdrop-blur-xs text-red-950 border border-red-300/80 shadow-2xs">
                <AlertTriangle className="w-3 h-3 text-red-700" />
                <span>Extrapola altura (46,5 mm)</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-semibold bg-emerald-100/70 backdrop-blur-xs text-emerald-950 border border-emerald-300/70 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>{metrics.lines.length} linhas ({fontSizePt}pt)</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
