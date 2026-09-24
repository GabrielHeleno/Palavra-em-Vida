import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  metadata?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="no-print border-b border-white/40 bg-white/20 backdrop-blur-xl sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-3 text-center">
          <div className="w-9 h-9 rounded-xl bg-emerald-900/80 text-amber-300 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.35)] border border-white/50 shrink-0 backdrop-blur-md">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif-sacred leading-none drop-shadow-xs">
              Palavra em Vida
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
