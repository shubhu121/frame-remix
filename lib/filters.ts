export type FilterId =
  | 'mix'
  | 'pop'
  | 'thermal'
  | 'glitch'
  | 'duotone'
  | 'cinema'
  | 'chrome'
  | 'ink'
  | 'neon'
  | 'infrared'
  | 'solar'
  | 'xray'
  | 'halftone'
  | 'vaporwave'
  | 'amber'
  | 'original';

export type FilterCategory = 'all' | 'vivid' | 'vintage' | 'experimental';

export interface FilterDefinition {
  id: FilterId;
  name: string;
  description: string;
  category: FilterCategory;
  swatchGradient: string;
  cssFilter?: string;
  svgFilterId?: string;
}

export const FILTERS: FilterDefinition[] = [
  {
    id: 'mix',
    name: 'Mix',
    description: 'Dynamic collage with intelligent adjacent contrast',
    category: 'all',
    swatchGradient:
      'conic-gradient(from 180deg at 50% 50%, #ff0055 0deg, #ff9900 60deg, #ffee00 120deg, #00ff88 180deg, #00bbff 240deg, #9900ff 300deg, #ff0055 360deg)',
  },
  {
    id: 'pop',
    name: 'Pop',
    description: 'True posterized color quantization & neon pop-art',
    category: 'vivid',
    swatchGradient: 'linear-gradient(135deg, #f43f5e, #f59e0b, #10b981, #06b6d4)',
    svgFilterId: 'filter-pop',
    cssFilter: 'contrast(185%) saturate(300%) brightness(105%)',
  },
  {
    id: 'thermal',
    name: 'Thermal',
    description: 'FLIR infrared heat vision colormap',
    category: 'experimental',
    swatchGradient: 'linear-gradient(135deg, #3b82f6, #a855f7, #ef4444, #facc15)',
    svgFilterId: 'filter-thermal',
    cssFilter: 'invert(100%) hue-rotate(180deg) saturate(350%) contrast(180%)',
  },
  {
    id: 'glitch',
    name: 'Glitch',
    description: 'RGB chromatic split & horizontal slice displacement',
    category: 'experimental',
    swatchGradient: 'linear-gradient(90deg, #ff0055 33%, #00ffff 66%, #ffffff 100%)',
    cssFilter: 'contrast(135%) saturate(145%)',
  },
  {
    id: 'duotone',
    name: 'Duotone',
    description: 'Electric magenta & cyan dual-tone spectrum',
    category: 'vivid',
    swatchGradient: 'linear-gradient(135deg, #ec4899, #06b6d4)',
    svgFilterId: 'filter-duotone',
    cssFilter: 'contrast(160%) saturate(220%) hue-rotate(290deg) brightness(105%)',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk laser violet, cyan & emerald luminescence',
    category: 'vivid',
    swatchGradient: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)',
    svgFilterId: 'filter-neon',
    cssFilter: 'contrast(150%) saturate(260%) brightness(110%) hue-rotate(20deg)',
  },
  {
    id: 'infrared',
    name: 'Infrared',
    description: 'Aerochrome infrared film: crimson foliage & teal skies',
    category: 'experimental',
    swatchGradient: 'linear-gradient(135deg, #e11d48, #0ea5e9)',
    svgFilterId: 'filter-infrared',
    cssFilter: 'hue-rotate(90deg) saturate(220%) contrast(130%)',
  },
  {
    id: 'cinema',
    name: 'Cinema',
    description: 'Warm 35mm film tones with deep teal shadows',
    category: 'vintage',
    swatchGradient: 'linear-gradient(135deg, #1e3a8a, #d97706)',
    cssFilter: 'contrast(125%) saturate(90%) sepia(25%) brightness(95%) hue-rotate(-10deg)',
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Solarized liquid mercury metallic curves',
    category: 'experimental',
    swatchGradient: 'linear-gradient(135deg, #ffffff, #64748b, #0f172a, #94a3b8)',
    svgFilterId: 'filter-chrome',
    cssFilter: 'invert(85%) contrast(250%) grayscale(60%) brightness(110%)',
  },
  {
    id: 'solar',
    name: 'Solar',
    description: 'Sabattier solarization with glowing contour edges',
    category: 'experimental',
    swatchGradient: 'linear-gradient(135deg, #fbbf24, #1e293b, #f43f5e)',
    svgFilterId: 'filter-solar',
    cssFilter: 'invert(50%) contrast(200%) saturate(180%)',
  },
  {
    id: 'xray',
    name: 'X-Ray',
    description: 'Negative medical radiograph with cyan bone glow',
    category: 'experimental',
    swatchGradient: 'linear-gradient(135deg, #0284c7, #ffffff, #0f172a)',
    svgFilterId: 'filter-xray',
    cssFilter: 'invert(100%) grayscale(100%) contrast(250%) hue-rotate(180deg)',
  },
  {
    id: 'ink',
    name: 'Ink',
    description: 'High-contrast graphic manga threshold print',
    category: 'vintage',
    swatchGradient: 'linear-gradient(135deg, #ffffff 50%, #000000 50%)',
    svgFilterId: 'filter-ink',
    cssFilter: 'grayscale(100%) contrast(400%) brightness(85%)',
  },
  {
    id: 'halftone',
    name: 'Halftone',
    description: 'Retro newsprint & comic book screen raster',
    category: 'vintage',
    swatchGradient: 'radial-gradient(circle, #000000 30%, #ffffff 35%)',
    svgFilterId: 'filter-halftone',
    cssFilter: 'contrast(300%) grayscale(100%) brightness(95%)',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: '1980s synthwave pastel lavender & mint dream',
    category: 'vivid',
    swatchGradient: 'linear-gradient(135deg, #f472b6, #c084fc, #67e8f9)',
    svgFilterId: 'filter-vaporwave',
    cssFilter: 'contrast(120%) saturate(180%) hue-rotate(315deg) brightness(115%)',
  },
  {
    id: 'amber',
    name: 'Amber',
    description: 'Golden hour tungsten warmth with rich copper shadows',
    category: 'vintage',
    swatchGradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    cssFilter: 'sepia(80%) saturate(160%) contrast(115%) brightness(102%) hue-rotate(-15deg)',
  },
  {
    id: 'original',
    name: 'Original',
    description: 'Natural unfiltered camera shot',
    category: 'vintage',
    swatchGradient: 'linear-gradient(135deg, #a1a1aa, #71717a)',
    cssFilter: 'none',
  },
];

export const NON_MIX_FILTERS = FILTERS.filter((f) => f.id !== 'mix');

export interface MixMood {
  id: string;
  name: string;
  icon: string;
  filterIds: FilterId[];
}

export const MIX_MOODS: MixMood[] = [
  {
    id: 'wild',
    name: 'Wild All',
    icon: '🎲',
    filterIds: [
      'pop',
      'thermal',
      'glitch',
      'duotone',
      'cinema',
      'chrome',
      'ink',
      'neon',
      'infrared',
      'solar',
      'vaporwave',
    ],
  },
  {
    id: 'pop-burst',
    name: 'Pop Burst',
    icon: '💥',
    filterIds: ['pop', 'thermal', 'duotone', 'neon', 'infrared', 'glitch'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '⚡',
    filterIds: ['glitch', 'neon', 'chrome', 'solar', 'thermal', 'pop'],
  },
  {
    id: 'monochrome',
    name: 'Noir & Metal',
    icon: '🖤',
    filterIds: ['ink', 'halftone', 'chrome', 'xray', 'cinema'],
  },
  {
    id: 'retro-pastel',
    name: 'Retro Wave',
    icon: '🌸',
    filterIds: ['vaporwave', 'duotone', 'amber', 'cinema', 'pop'],
  },
];

// Deterministic initial 4x5 filter distribution highlighting Pop, Thermal, Glitch & rich contrast
export const INITIAL_DEFAULT_FILTERS: FilterId[] = [
  'pop',
  'thermal',
  'ink',
  'glitch',
  'duotone',
  'pop',
  'cinema',
  'chrome',
  'thermal',
  'infrared',
  'pop',
  'neon',
  'solar',
  'glitch',
  'vaporwave',
  'pop',
  'ink',
  'thermal',
  'duotone',
  'cinema',
];

/**
 * Generates an intelligent grid mix where adjacent tiles (horizontal and vertical neighbors)
 * are guaranteed to have different filters, maximizing visual collage pop!
 */
export function generateSmartMixArray(
  cols: number,
  rows: number,
  poolFilterIds: FilterId[] = MIX_MOODS[0].filterIds
): FilterId[] {
  const total = cols * rows;
  const result: FilterId[] = [];
  const pool = poolFilterIds.length > 0 ? poolFilterIds : NON_MIX_FILTERS.map((f) => f.id);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const excluded: FilterId[] = [];

      // Exclude left neighbor
      if (c > 0) {
        excluded.push(result[r * cols + (c - 1)]);
      }
      // Exclude top neighbor
      if (r > 0) {
        excluded.push(result[(r - 1) * cols + c]);
      }

      // Filter available choices
      const candidates = pool.filter((id) => !excluded.includes(id));
      const chosenPool = candidates.length > 0 ? candidates : pool;

      const pick = chosenPool[Math.floor(Math.random() * chosenPool.length)];
      result.push(pick);
    }
  }

  return result;
}

export function getDeterministicMixArray(count: number): FilterId[] {
  return Array.from({ length: count }, (_, i) => {
    if (i < INITIAL_DEFAULT_FILTERS.length) {
      return INITIAL_DEFAULT_FILTERS[i];
    }
    return NON_MIX_FILTERS[(i * 3 + 1) % NON_MIX_FILTERS.length].id;
  });
}

export function generateRandomMixArray(count: number): FilterId[] {
  return Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * NON_MIX_FILTERS.length);
    return NON_MIX_FILTERS[randomIndex].id;
  });
}

export interface GridPreset {
  cols: number;
  rows: number;
  label: string;
}

export const GRID_PRESETS: GridPreset[] = [
  { cols: 2, rows: 2, label: '2×2' },
  { cols: 2, rows: 3, label: '2×3' },
  { cols: 3, rows: 3, label: '3×3' },
  { cols: 3, rows: 4, label: '3×4' },
  { cols: 4, rows: 4, label: '4×4' },
  { cols: 4, rows: 5, label: '4×5' }, // Matching video!
  { cols: 4, rows: 6, label: '4×6' },
  { cols: 5, rows: 6, label: '5×6' },
  { cols: 6, rows: 7, label: '6×7' },
];

export const DEFAULT_GRID_PRESET_INDEX = 5; // 4x5

export const SAMPLE_PHOTOS = [
  {
    id: 'mirror-selfie',
    name: 'Mirror Selfie',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    alt: 'Portrait mirror selfie',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    alt: 'Neon city aesthetic',
  },
  {
    id: 'street-fashion',
    name: 'Urban Portrait',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    alt: 'Street fashion portrait',
  },
  {
    id: 'cinematic-retro',
    name: 'Retro Film',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
    alt: 'Vintage aesthetic model',
  },
];
