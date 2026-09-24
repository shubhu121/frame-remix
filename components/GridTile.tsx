'use client';

import React from 'react';
import { FilterId } from '@/lib/filters';

interface GridTileProps {
  imgUrl: string;
  secondaryImgUrls?: string[];
  blendMode?: string;
  blendOpacity?: number;
  col: number;
  row: number;
  cols: number;
  rows: number;
  filter: FilterId;
  isSelected: boolean;
  isPaintingMode: boolean;
  onClick: () => void;
  isDark: boolean;
}

export default function GridTile({
  imgUrl,
  secondaryImgUrls,
  blendMode = 'screen',
  blendOpacity = 0.65,
  col,
  row,
  cols,
  rows,
  filter,
  isSelected,
  isPaintingMode,
  onClick,
  isDark,
}: GridTileProps) {
  // Determine filter style
  const getFilterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'pop':
        return { filter: 'url(#filter-pop)' };
      case 'thermal':
        return { filter: 'url(#filter-thermal) contrast(110%)' };
      case 'duotone':
        return { filter: 'url(#filter-duotone)' };
      case 'neon':
        return { filter: 'url(#filter-neon)' };
      case 'infrared':
        return { filter: 'url(#filter-infrared)' };
      case 'chrome':
        return { filter: 'url(#filter-chrome)' };
      case 'solar':
        return { filter: 'url(#filter-solar)' };
      case 'xray':
        return { filter: 'url(#filter-xray)' };
      case 'ink':
        return { filter: 'url(#filter-ink)' };
      case 'vaporwave':
        return { filter: 'url(#filter-vaporwave)' };
      case 'amber':
        return { filter: 'sepia(85%) saturate(170%) contrast(115%) brightness(102%) hue-rotate(-15deg)' };
      case 'halftone':
        return { filter: 'grayscale(100%) contrast(350%) brightness(95%)' };
      case 'cinema':
        return { filter: 'contrast(125%) saturate(90%) sepia(25%) brightness(95%) hue-rotate(-10deg)' };
      case 'glitch':
        return { filter: 'contrast(135%) saturate(140%)' };
      case 'original':
      default:
        return { filter: 'none' };
    }
  };

  const isGlitch = filter === 'glitch';
  const isHalftone = filter === 'halftone';

  // Slicing calculations
  const leftPercent = -(col * 100);
  const topPercent = -(row * 100);
  const widthPercent = cols * 100;
  const heightPercent = rows * 100;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Frame row ${row + 1}, column ${col + 1}, filter ${filter}`}
      className={`group relative h-full w-full overflow-hidden p-0 text-left outline-none transition-all duration-150 select-none ${
        isSelected
          ? 'z-30 ring-2 ring-white ring-offset-2 ring-offset-black shadow-2xl scale-[1.01]'
          : 'z-0 hover:z-10 hover:brightness-105'
      }`}
      style={{
        cursor: isPaintingMode ? 'crosshair' : 'pointer',
      }}
    >
      {/* Filtered Composite Container */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={getFilterStyle()}
      >
        {/* Primary Image Slice */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt=""
          className="absolute max-w-none transition-transform duration-200"
          style={{
            left: `${leftPercent}%`,
            top: `${topPercent}%`,
            width: `${widthPercent}%`,
            height: `${heightPercent}%`,
            objectFit: 'cover',
          }}
          loading="eager"
        />

        {/* Secondary Blended Images (Multi-Photo Double Exposure) */}
        {secondaryImgUrls &&
          secondaryImgUrls.map((secUrl, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={secUrl}
              alt=""
              aria-hidden="true"
              className="absolute max-w-none transition-opacity duration-200 pointer-events-none"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                objectFit: 'cover',
                mixBlendMode: (blendMode as any) || 'screen',
                opacity: blendOpacity,
              }}
              loading="eager"
            />
          ))}

        {/* Glitch Channel Offsets & Scanline Overlays */}
        {isGlitch && (
          <>
            {/* Red offset channel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden="true"
              className="absolute max-w-none opacity-80 mix-blend-screen pointer-events-none"
              style={{
                left: `calc(${leftPercent}% - 5px)`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                objectFit: 'cover',
                filter: 'drop-shadow(0 0 1px #ff0055) brightness(1.2) contrast(1.4) hue-rotate(-50deg)',
              }}
            />
            {/* Cyan/Blue offset channel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt=""
              aria-hidden="true"
              className="absolute max-w-none opacity-80 mix-blend-screen pointer-events-none"
              style={{
                left: `calc(${leftPercent}% + 5px)`,
                top: `${topPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                objectFit: 'cover',
                filter: 'drop-shadow(0 0 1px #00ffff) brightness(1.2) contrast(1.4) hue-rotate(140deg)',
              }}
            />
            {/* Subtle horizontal scanline stripes */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.9) 3px, rgba(0,0,0,0.9) 4px)',
              }}
            />
          </>
        )}

        {/* Halftone Dot Raster Overlay */}
        {isHalftone && (
          <div
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-multiply"
            style={{
              backgroundImage:
                'radial-gradient(circle, #000 1.5px, transparent 1.6px)',
              backgroundSize: '6px 6px',
            }}
          />
        )}
      </div>

      {/* Selected Indicator Badge / Corner Accents */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none border-2 border-white">
          <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider text-white uppercase flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Active</span>
          </div>
        </div>
      )}

      {/* Hover Guide Outline */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${
          isSelected
            ? 'opacity-0'
            : 'opacity-0 group-hover:opacity-100 border border-white/40'
        }`}
      />
    </button>
  );
}
