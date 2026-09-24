'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Layers } from 'lucide-react';
import { TreatmentGrid } from '@/components/TreatmentGrid';
import { SAMPLE_PHOTOS } from '@/lib/filters';

export default function TreatmentGridPage() {
  const [isDark, setIsDark] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(SAMPLE_PHOTOS[0].url);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 flex flex-col justify-between p-4 sm:p-6 ${
        isDark ? 'bg-[#0a0a0c] text-zinc-100 dark' : 'bg-zinc-100 text-zinc-900'
      }`}
    >
      {/* Header Navigation Bar */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-xs ${
            isDark
              ? 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-200 border border-zinc-200'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Studio</span>
        </Link>

        {/* Quick Photo Switcher Chips */}
        <div className="flex items-center gap-1">
          {SAMPLE_PHOTOS.slice(0, 3).map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCurrentPhoto(p.url)}
              title={p.name}
              className={`text-[10px] px-2 py-1 rounded-full transition-all cursor-pointer font-medium ${
                currentPhoto === p.url
                  ? isDark
                    ? 'bg-white text-black font-semibold'
                    : 'bg-zinc-900 text-white font-semibold'
                  : isDark
                  ? 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              Photo {idx + 1}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container rendering TreatmentGrid */}
      <main className="flex-1 flex flex-col items-center justify-center w-full my-auto">
        <TreatmentGrid
          src={currentPhoto}
          alt="Sample portrait photograph"
          cols={4}
          minCols={2}
          maxCols={8}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          persistKey="treatment-demo"
        />
      </main>

      {/* Footer minimal info */}
      <footer className="w-full max-w-sm mx-auto text-center pt-4">
        <p className="text-[11px] text-zinc-500">
          TreatmentGrid component · Framer Motion spring physics & discrete SVG color maps
        </p>
      </footer>
    </div>
  );
}
