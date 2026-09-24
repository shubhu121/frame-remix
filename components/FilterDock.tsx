'use client';

import React, { useState } from 'react';
import {
  FILTERS,
  FilterDefinition,
  FilterId,
  MIX_MOODS,
  MixMood,
} from '@/lib/filters';
import { X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface FilterDockProps {
  activeGlobalFilter: FilterId;
  selectedTileIndex: number | null;
  selectedTileFilter?: FilterId;
  onSelectFilter: (filterId: FilterId) => void;
  onSelectMixMood?: (mood: MixMood) => void;
  activeMixMoodId?: string;
  onCancelSelection: () => void;
  isDark: boolean;
}

// 9 Signature Core Filters (exact layout from original video)
const CORE_FILTER_IDS: FilterId[] = [
  'mix',
  'original',
  'cinema',
  'duotone',
  'pop',
  'thermal',
  'glitch',
  'chrome',
  'ink',
];

// 7 Extended Creative Filters
const EXTENDED_FILTER_IDS: FilterId[] = [
  'neon',
  'infrared',
  'solar',
  'xray',
  'vaporwave',
  'amber',
  'halftone',
];

export default function FilterDock({
  activeGlobalFilter,
  selectedTileIndex,
  selectedTileFilter,
  onSelectFilter,
  onSelectMixMood,
  activeMixMoodId = 'wild',
  onCancelSelection,
  isDark,
}: FilterDockProps) {
  const isPaintingOne = selectedTileIndex !== null;
  const currentActive = isPaintingOne ? selectedTileFilter : activeGlobalFilter;

  // View mode: 'core' (default 9 from video) or 'extended' (extra 7)
  const [viewMode, setViewMode] = useState<'core' | 'extended'>('core');

  // Filter map lookup
  const filterMap = new Map(FILTERS.map((f) => [f.id, f]));

  const coreList = CORE_FILTER_IDS.map((id) => filterMap.get(id)!).filter(Boolean);
  const extendedList = EXTENDED_FILTER_IDS.map((id) => filterMap.get(id)!).filter(Boolean);

  const activeMood = MIX_MOODS.find((m) => m.id === activeMixMoodId) || MIX_MOODS[0];

  // Handle clicking filter - if Mix is already active, successive clicks cycle through moods!
  const handleClickFilter = (filterId: FilterId) => {
    if (filterId === 'mix' && currentActive === 'mix' && !isPaintingOne) {
      const currentIdx = MIX_MOODS.findIndex((m) => m.id === activeMixMoodId);
      const nextMood = MIX_MOODS[(currentIdx + 1) % MIX_MOODS.length];
      onSelectMixMood?.(nextMood);
    } else {
      onSelectFilter(filterId);
    }
  };

  const renderFilterButton = (filter: FilterDefinition) => {
    const isSelected = currentActive === filter.id;
    const isMix = filter.id === 'mix';

    return (
      <button
        key={filter.id}
        type="button"
        onClick={() => handleClickFilter(filter.id)}
        className={`relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 select-none cursor-pointer ${
          isSelected
            ? isDark
              ? 'bg-white text-black font-semibold shadow-sm scale-[1.01]'
              : 'bg-zinc-900 text-white font-semibold shadow-sm scale-[1.01]'
            : isDark
            ? 'text-zinc-300 hover:text-white hover:bg-white/5'
            : 'text-zinc-700 hover:text-black hover:bg-black/5'
        }`}
      >
        {/* Color Swatch Dot */}
        <span
          className={`w-3 h-3 rounded-full shrink-0 border transition-transform ${
            isSelected
              ? isDark
                ? 'border-black/20 scale-105'
                : 'border-white/30 scale-105'
              : 'border-white/20'
          }`}
          style={{ background: filter.swatchGradient }}
        />

        {/* Name */}
        <span className="truncate">{filter.name}</span>

        {/* Small Mood indicator if active and is Mix (rendered as valid span) */}
        {isMix && isSelected && !isPaintingOne && (
          <span
            title={`Mix Mood: ${activeMood.name} (click to cycle)`}
            className={`ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 pointer-events-none transition-opacity ${
              isDark ? 'bg-black/10 text-zinc-900' : 'bg-white/20 text-white'
            }`}
          >
            {activeMood.name.split(' ')[0]}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center gap-1.5">
      {/* Painting One Frame Banner (subtle, exactly like video at 00:11) */}
      {isPaintingOne && (
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md shadow-sm animate-in fade-in duration-150 ${
            isDark
              ? 'bg-zinc-900/90 text-zinc-300 border border-zinc-800'
              : 'bg-white/95 text-zinc-700 border border-zinc-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Painting one frame · pick a filter, or Esc to cancel</span>
          <button
            type="button"
            onClick={onCancelSelection}
            className="p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Cancel frame selection"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Filter Capsule */}
      <div
        className={`w-full p-2 rounded-2xl backdrop-blur-xl border transition-all shadow-xl flex flex-col gap-1.5 ${
          isDark
            ? 'bg-zinc-950/80 border-zinc-800/70 text-white shadow-black/40'
            : 'bg-white/85 border-zinc-200/80 text-zinc-900 shadow-zinc-300/40'
        }`}
      >
        {viewMode === 'core' ? (
          <>
            {/* 3x3 Grid Layout Matching the Video */}
            <div className="grid grid-cols-3 gap-1">
              {coreList.slice(0, 3).map(renderFilterButton)}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {coreList.slice(3, 6).map(renderFilterButton)}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {coreList.slice(6, 9).map(renderFilterButton)}
            </div>

            {/* Minimal Discreet Footer Toggle */}
            <div className="pt-1 mt-0.5 border-t border-zinc-500/10 flex items-center justify-between px-2 text-[10px] text-zinc-400">
              <span className="tracking-wide">Core filters</span>
              <button
                type="button"
                onClick={() => setViewMode('extended')}
                className={`flex items-center gap-0.5 transition-colors cursor-pointer font-medium ${
                  isDark ? 'hover:text-white' : 'hover:text-black'
                }`}
              >
                <span>More filters (7)</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Extended 7 Filters Grid */}
            <div className="grid grid-cols-3 gap-1">
              {extendedList.slice(0, 3).map(renderFilterButton)}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {extendedList.slice(3, 6).map(renderFilterButton)}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {extendedList.slice(6, 7).map(renderFilterButton)}
              {/* Back to Core button */}
              <button
                type="button"
                onClick={() => setViewMode('core')}
                className={`col-span-2 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                    : 'text-zinc-600 hover:text-black hover:bg-black/5'
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Back to Core</span>
              </button>
            </div>

            {/* Minimal Discreet Footer Toggle */}
            <div className="pt-1 mt-0.5 border-t border-zinc-500/10 flex items-center justify-between px-2 text-[10px] text-zinc-400">
              <span className="tracking-wide">Extended filters</span>
              <button
                type="button"
                onClick={() => setViewMode('core')}
                className={`flex items-center gap-0.5 transition-colors cursor-pointer font-medium ${
                  isDark ? 'hover:text-white' : 'hover:text-black'
                }`}
              >
                <span>Core (9)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
