'use client';

import React, { useRef } from 'react';
import { X, Plus, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { SAMPLE_PHOTOS } from '@/lib/filters';

export interface StudioPhoto {
  id: string;
  name: string;
  url: string;
}

export const BLEND_MODES = [
  { id: 'screen', name: 'Screen' },
  { id: 'overlay', name: 'Overlay' },
  { id: 'multiply', name: 'Multiply' },
  { id: 'difference', name: 'Diff' },
  { id: 'color-dodge', name: 'Dodge' },
  { id: 'soft-light', name: 'Soft' },
] as const;

interface PhotoBlendPanelProps {
  photos: StudioPhoto[];
  onAddPhoto: (photo: StudioPhoto) => void;
  onRemovePhoto: (id: string) => void;
  blendMode: string;
  onBlendModeChange: (mode: string) => void;
  blendOpacity: number;
  onBlendOpacityChange: (opacity: number) => void;
  multiPhotoStyle: 'blend' | 'alternate';
  onMultiPhotoStyleChange: (style: 'blend' | 'alternate') => void;
  onClose: () => void;
  isDark: boolean;
}

export default function PhotoBlendPanel({
  photos,
  onAddPhoto,
  onRemovePhoto,
  blendMode,
  onBlendModeChange,
  blendOpacity,
  onBlendOpacityChange,
  multiPhotoStyle,
  onMultiPhotoStyleChange,
  onClose,
  isDark,
}: PhotoBlendPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onAddPhoto({
            id: `upload-${Date.now()}-${index}`,
            name: file.name.slice(0, 14) || `Photo ${photos.length + 1}`,
            url: result,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-sm rounded-2xl p-4 shadow-2xl border transition-all z-10 flex flex-col gap-3 ${
          isDark
            ? 'bg-zinc-950/95 border-zinc-800 text-white shadow-black/60'
            : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-300/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-500/10">
          <div>
            <h3 className="text-xs font-semibold tracking-wide">Photo Layers & Blending</h3>
            <p className="text-[10px] text-zinc-400">
              Stack photos to blend or distribute across frames
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close photo panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thumbnail Layer Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-900 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-0.5 text-[8px] text-white truncate text-center">
                {idx === 0 ? 'Base' : `L${idx + 1}`}
              </div>
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemovePhoto(photo.id)}
                  title="Remove layer"
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-2 h-2" />
                </button>
              )}
            </div>
          ))}

          {/* Add Layer Card */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-16 h-16 shrink-0 rounded-lg border border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'border-zinc-700 hover:border-zinc-500 hover:bg-white/5 text-zinc-400 hover:text-white'
                : 'border-zinc-300 hover:border-zinc-400 hover:bg-black/5 text-zinc-500 hover:text-black'
            }`}
          >
            <Plus className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-medium">Add</span>
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1 flex-wrap text-[10px]">
          <span className="text-zinc-500 mr-0.5">Preset:</span>
          {SAMPLE_PHOTOS.map((sample) => {
            const exists = photos.some((p) => p.url === sample.url);
            return (
              <button
                key={sample.id}
                type="button"
                disabled={exists}
                onClick={() =>
                  onAddPhoto({
                    id: `sample-${sample.id}-${Date.now()}`,
                    name: sample.name,
                    url: sample.url,
                  })
                }
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-0.5 ${
                  exists
                    ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                    : isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {exists && <Check className="w-2 h-2" />}
                <span>{sample.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Blending Controls (when 2+ photos) */}
        {photos.length > 1 && (
          <div className="pt-2 border-t border-zinc-500/10 flex flex-col gap-2">
            {/* Style Toggle */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">Mode</span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[10px]">
                <button
                  type="button"
                  onClick={() => onMultiPhotoStyleChange('blend')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium ${
                    multiPhotoStyle === 'blend'
                      ? isDark
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Blend Exposure
                </button>
                <button
                  type="button"
                  onClick={() => onMultiPhotoStyleChange('alternate')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium ${
                    multiPhotoStyle === 'alternate'
                      ? isDark
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Mosaic Tiles
                </button>
              </div>
            </div>

            {/* Blend Mode Pills */}
            {multiPhotoStyle === 'blend' && (
              <>
                <div className="grid grid-cols-6 gap-1">
                  {BLEND_MODES.map((b) => {
                    const isActive = blendMode === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => onBlendModeChange(b.id)}
                        className={`py-1 rounded-md text-[10px] font-medium transition-all text-center cursor-pointer ${
                          isActive
                            ? isDark
                              ? 'bg-white text-black font-semibold'
                              : 'bg-zinc-900 text-white font-semibold'
                            : isDark
                            ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>

                {/* Opacity Slider */}
                <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400 pt-1">
                  <span>Opacity</span>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={blendOpacity}
                    onChange={(e) => onBlendOpacityChange(parseFloat(e.target.value))}
                    className="flex-1 cursor-pointer"
                    style={{
                      accentColor: isDark ? '#ffffff' : '#18181b',
                    }}
                  />
                  <span className="font-mono w-7 text-right">
                    {Math.round(blendOpacity * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Done Button */}
        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all text-center ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
