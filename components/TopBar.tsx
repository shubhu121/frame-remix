'use client';

import React, { useState } from 'react';
import {
  Shuffle,
  Download,
  Sun,
  Moon,
  Check,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { GRID_PRESETS } from '@/lib/filters';
import { StudioPhoto } from './PhotoBlendPanel';

interface TopBarProps {
  gridPresetIndex: number;
  onGridPresetChange: (index: number) => void;
  onShuffle: () => void;
  onDownload: () => Promise<void>;
  isDark: boolean;
  onToggleTheme: () => void;
  photos: StudioPhoto[];
  onOpenBlendPanel: () => void;
}

export default function TopBar({
  gridPresetIndex,
  onGridPresetChange,
  onShuffle,
  onDownload,
  isDark,
  onToggleTheme,
  photos,
  onOpenBlendPanel,
}: TopBarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentPreset = GRID_PRESETS[gridPresetIndex] || GRID_PRESETS[5];

  const handleDownloadClick = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await onDownload();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const hasMultiplePhotos = photos.length > 1;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col gap-2.5">
      {/* Primary Action Bar */}
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Shuffle Button */}
        <button
          type="button"
          onClick={onShuffle}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
            isDark
              ? 'bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 shadow-xs'
              : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200/80 shadow-xs'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5 opacity-80" />
          <span>Shuffle</span>
        </button>

        {/* Photos & Layers Button */}
        <button
          type="button"
          onClick={onOpenBlendPanel}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
            hasMultiplePhotos
              ? isDark
                ? 'bg-zinc-900 text-white border border-emerald-500/50 shadow-xs'
                : 'bg-white text-zinc-900 border border-emerald-500/50 shadow-xs'
              : isDark
              ? 'bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 shadow-xs'
              : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200/80 shadow-xs'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 opacity-80" />
          <span>{hasMultiplePhotos ? `${photos.length} photos` : 'Add photo'}</span>
          {hasMultiplePhotos && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
            isDark
              ? 'bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 shadow-xs'
              : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200/80 shadow-xs'
          }`}
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin opacity-80" />
          ) : downloadSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Download className="w-3.5 h-3.5 opacity-80" />
          )}
          <span>{isDownloading ? 'Saving...' : downloadSuccess ? 'Saved' : 'Download'}</span>
        </button>

        {/* Theme Toggle (Sun / Moon) */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className={`p-2 rounded-full text-xs transition-all duration-150 cursor-pointer ${
            isDark
              ? 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 shadow-xs'
              : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200/80 shadow-xs'
          }`}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-zinc-700" />
          )}
        </button>
      </div>

      {/* Frame Density Slider Bar */}
      <div className="flex items-center justify-between gap-3 px-1 w-full">
        <span
          className={`text-[11px] font-medium tracking-wide ${
            isDark ? 'text-zinc-500' : 'text-zinc-500'
          }`}
        >
          Frames
        </span>

        {/* Minimal Custom Slider */}
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={0}
            max={GRID_PRESETS.length - 1}
            step={1}
            value={gridPresetIndex}
            onChange={(e) => onGridPresetChange(parseInt(e.target.value, 10))}
            className={`w-full cursor-pointer ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
            style={{
              accentColor: isDark ? '#ffffff' : '#18181b',
            }}
            aria-label="Frame grid density"
          />
          {/* Subtle background track line */}
          <div
            className={`absolute inset-x-0 h-[2px] rounded-full pointer-events-none -z-10 ${
              isDark ? 'bg-zinc-800' : 'bg-zinc-300'
            }`}
          />
        </div>

        {/* Dimension Badge (e.g. 4x5) */}
        <span
          className={`font-mono text-[11px] font-medium min-w-[28px] text-right ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          {currentPreset.label}
        </span>
      </div>
    </div>
  );
}
