'use client';

import React from 'react';

export default function SvgFilters() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed -top-[9999px] -left-[9999px] h-0 w-0 opacity-0"
    >
      <defs>
        {/* TRUE POSTERIZED POP-ART FILTER (Matches user reference image) */}
        <filter id="filter-pop" colorInterpolationFilters="sRGB">
          {/* Step 1: Boost initial contrast and punch */}
          <feColorMatrix
            type="matrix"
            values="
              1.35 0    0    0 -0.12
              0    1.35 0    0 -0.12
              0    0    1.35 0 -0.12
              0    0    0    1  0
            "
            result="contrast"
          />
          {/* Step 2: Hyper-saturate color tones */}
          <feColorMatrix type="saturate" values="2.6" in="contrast" result="saturated" />
          {/* Step 3: Discrete color quantization bands (True Andy Warhol / Pop Art posterization) */}
          <feComponentTransfer in="saturated" result="posterized">
            <feFuncR type="discrete" tableValues="0.04 0.24 0.48 0.72 0.92 1.0" />
            <feFuncG type="discrete" tableValues="0.04 0.22 0.45 0.70 0.88 1.0" />
            <feFuncB type="discrete" tableValues="0.06 0.26 0.52 0.75 0.95 1.0" />
          </feComponentTransfer>
        </filter>

        {/* Thermal FLIR Heatmap Filter */}
        <filter id="filter-thermal" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="thermal">
            <feFuncR type="table" tableValues="0.04 0.15 0.55 0.94 1.0 1.0" />
            <feFuncG type="table" tableValues="0.02 0.05 0.10 0.20 0.86 1.0" />
            <feFuncB type="table" tableValues="0.31 0.63 0.63 0.10 0.0 1.0" />
          </feComponentTransfer>
        </filter>

        {/* Duotone Electric Magenta & Cyan Filter */}
        <filter id="filter-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="duotone">
            <feFuncR type="table" tableValues="0.98 0.0" />
            <feFuncG type="table" tableValues="0.0 0.95" />
            <feFuncB type="table" tableValues="0.45 1.0" />
          </feComponentTransfer>
        </filter>

        {/* Cyberpunk Neon Glow Filter */}
        <filter id="filter-neon" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              1.45 0    0    0 -0.15
              0    1.25 0    0 -0.08
              0    0    1.75 0  0.05
              0    0    0    1  0
            "
            result="boost"
          />
          <feColorMatrix type="saturate" values="2.8" in="boost" result="neon" />
        </filter>

        {/* Kodak Aerochrome Infrared Filter */}
        <filter id="filter-infrared" colorInterpolationFilters="sRGB">
          {/* Swaps green channel to red (crimson foliage), preserves skies as cyan */}
          <feColorMatrix
            type="matrix"
            values="
              0.10 1.35 0.05 0  0.08
              0.05 0.20 0.85 0  0.00
              1.10 0.05 0.10 0 -0.05
              0    0    0    1  0
            "
            result="aerochrome"
          />
          <feColorMatrix type="saturate" values="2.2" in="aerochrome" />
        </filter>

        {/* Solarized Liquid Mercury Chrome Filter */}
        <filter id="filter-chrome" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="solar">
            <feFuncR type="table" tableValues="0.0 0.9 0.1 1.0 0.2 0.95" />
            <feFuncG type="table" tableValues="0.05 0.95 0.15 1.0 0.25 0.98" />
            <feFuncB type="table" tableValues="0.1 1.0 0.2 1.0 0.35 1.0" />
          </feComponentTransfer>
        </filter>

        {/* Sabattier Solarization with Glowing Contour Edges */}
        <filter id="filter-solar" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="sabattier">
            <feFuncR type="table" tableValues="0.05 0.95 0.2 0.85 1.0" />
            <feFuncG type="table" tableValues="0.1 0.7 0.05 0.9 0.3" />
            <feFuncB type="table" tableValues="0.3 0.2 0.9 0.3 0.95" />
          </feComponentTransfer>
        </filter>

        {/* Negative Medical X-Ray Filter */}
        <filter id="filter-xray" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray" result="inverted">
            <feFuncR type="table" tableValues="0.9 0.0" />
            <feFuncG type="table" tableValues="0.95 0.05" />
            <feFuncB type="table" tableValues="1.0 0.2" />
          </feComponentTransfer>
        </filter>

        {/* High-Contrast Manga Ink Threshold Filter */}
        <filter id="filter-ink" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0     0     0     1 0
            "
            result="gray"
          />
          <feComponentTransfer in="gray">
            <feFuncR type="discrete" tableValues="0 0 0 1 1" />
            <feFuncG type="discrete" tableValues="0 0 0 1 1" />
            <feFuncB type="discrete" tableValues="0 0 0 1 1" />
          </feComponentTransfer>
        </filter>

        {/* 1980s Vaporwave Pastel Filter */}
        <filter id="filter-vaporwave" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              1.15 0    0.2  0  0.08
              0    1.05 0.1  0  0.05
              0.2  0.1  1.35 0  0.10
              0    0    0    1  0
            "
            result="vapor"
          />
          <feColorMatrix type="saturate" values="1.8" in="vapor" />
        </filter>
      </defs>
    </svg>
  );
}
