import React, { useState, useEffect } from 'react';
import { IMPACTFUL_QUOTES, ImpactfulQuote } from '../data/impactfulQuotes';

export const ArtisticQuote: React.FC = () => {
  const [quote, setQuote] = useState<ImpactfulQuote | null>(null);

  useEffect(() => {
    // Escolhe aleatoriamente ao carregar a página
    const randomIndex = Math.floor(Math.random() * IMPACTFUL_QUOTES.passagens.length);
    setQuote(IMPACTFUL_QUOTES.passagens[randomIndex]);
  }, []);

  if (!quote) return null;

  return (
    <div className="w-full max-w-[310px] sm:max-w-[360px] md:max-w-[390px] lg:max-w-[420px] text-left select-none pointer-events-auto bg-transparent">
      {/* Bloco totalmente invisível e transparente (sem efeito glass, sem bordas nem fundo) */}
      <div className="relative p-1 sm:p-2 bg-transparent">
        {/* Trecho Bíblico em Caligrafia Artística Nobre (Pinyon Script) com fluxo de texto contínuo natural */}
        <blockquote className="relative z-10">
          <p
            className="font-pinyon text-2xl sm:text-3xl md:text-[34px] text-[#064E3B] font-normal leading-[1.35] tracking-normal drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]"
            style={{ fontFamily: "'Pinyon Script', 'Italianno', cursive" }}
          >
            “{quote.trecho}”
          </p>
        </blockquote>

        {/* Referência Bíblica com traço dourado elegante */}
        <div className="mt-3.5 flex items-center space-x-2.5">
          <span className="w-6 h-[1.5px] bg-gradient-to-r from-amber-600 to-amber-400/60 rounded-full inline-block shadow-[0_0_6px_rgba(217,119,6,0.3)]"></span>
          <cite className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-[#064E3B] not-italic uppercase drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
            {quote.referencia}
          </cite>
        </div>
      </div>
    </div>
  );
};


