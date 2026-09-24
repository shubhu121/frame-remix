'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FilterId,
  NON_MIX_FILTERS,
  GRID_PRESETS,
  DEFAULT_GRID_PRESET_INDEX,
  SAMPLE_PHOTOS,
  INITIAL_DEFAULT_FILTERS,
  MIX_MOODS,
  MixMood,
  generateSmartMixArray,
  getDeterministicMixArray,
  generateRandomMixArray,
} from '@/lib/filters';
import { generateExportCanvas } from '@/lib/canvasExporter';
import TopBar from './TopBar';
import FilterDock from './FilterDock';
import GridTile from './GridTile';
import SvgFilters from './SvgFilters';
import PhotoBlendPanel, { StudioPhoto } from './PhotoBlendPanel';

// Helper to generate a random non-mix filter for individual tile painting
function getRandomFilter(): FilterId {
  const randomIndex = Math.floor(Math.random() * NON_MIX_FILTERS.length);
  return NON_MIX_FILTERS[randomIndex].id;
}

export default function GridFilterStudio() {
  const [isDark, setIsDark] = useState(true);

  // Photos stack for multi-photo and blending
  const [photos, setPhotos] = useState<StudioPhoto[]>([
    {
      id: 'photo-1',
      name: SAMPLE_PHOTOS[0].name,
      url: SAMPLE_PHOTOS[0].url,
    },
  ]);
  const [blendMode, setBlendMode] = useState<string>('screen');
  const [blendOpacity, setBlendOpacity] = useState<number>(0.65);
  const [multiPhotoStyle, setMultiPhotoStyle] = useState<'blend' | 'alternate'>('blend');
  const [isBlendPanelOpen, setIsBlendPanelOpen] = useState(false);

  // Grid preset (default is 4x5 matching video)
  const [gridPresetIndex, setGridPresetIndex] = useState(DEFAULT_GRID_PRESET_INDEX);
  const currentGrid = GRID_PRESETS[gridPresetIndex] || GRID_PRESETS[5];
  const totalTiles = currentGrid.cols * currentGrid.rows;

  // Active filter state ('mix' by default)
  const [activeGlobalFilter, setActiveGlobalFilter] = useState<FilterId>('mix');
  const [activeMixMoodId, setActiveMixMoodId] = useState<string>('wild');

  // Array of filter assigned to each tile, initialized deterministically for SSR/Client match
  const [tileFilters, setTileFilters] = useState<FilterId[]>(INITIAL_DEFAULT_FILTERS);

  // Selected tile for "Painting one frame" mode
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // Drag and drop state
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const getActiveMoodFilters = useCallback((): FilterId[] => {
    const found = MIX_MOODS.find((m) => m.id === activeMixMoodId);
    return found ? found.filterIds : MIX_MOODS[0].filterIds;
  }, [activeMixMoodId]);

  // Handle grid slider change
  const handleGridPresetChange = (newIndex: number) => {
    setGridPresetIndex(newIndex);
    setSelectedTileIndex(null);
    const targetPreset = GRID_PRESETS[newIndex] || GRID_PRESETS[5];
    const newCount = targetPreset.cols * targetPreset.rows;

    setTileFilters(() => {
      if (activeGlobalFilter === 'mix') {
        return generateSmartMixArray(targetPreset.cols, targetPreset.rows, getActiveMoodFilters());
      }
      return Array(newCount).fill(activeGlobalFilter);
    });
  };

  // Handle Shuffle
  const handleShuffle = useCallback(() => {
    setActiveGlobalFilter('mix');
    setTileFilters(
      generateSmartMixArray(currentGrid.cols, currentGrid.rows, getActiveMoodFilters())
    );
  }, [currentGrid.cols, currentGrid.rows, getActiveMoodFilters]);

  // Handle Mix Mood selection (e.g. Pop Burst, Cyberpunk, Noir, etc.)
  const handleSelectMixMood = (mood: MixMood) => {
    setActiveMixMoodId(mood.id);
    setActiveGlobalFilter('mix');
    setTileFilters(
      generateSmartMixArray(currentGrid.cols, currentGrid.rows, mood.filterIds)
    );
  };

  // Handle Filter Selection from Bottom Dock
  const handleSelectFilter = (filterId: FilterId) => {
    if (selectedTileIndex !== null) {
      // "Painting one frame" mode: apply only to selected tile!
      const appliedFilter = filterId === 'mix' ? getRandomFilter() : filterId;
      setTileFilters((prev) => {
        const next = [...prev];
        next[selectedTileIndex] = appliedFilter;
        return next;
      });
    } else {
      // Global filter application
      setActiveGlobalFilter(filterId);
      if (filterId === 'mix') {
        setTileFilters(
          generateSmartMixArray(currentGrid.cols, currentGrid.rows, getActiveMoodFilters())
        );
      } else {
        setTileFilters(Array(totalTiles).fill(filterId));
      }
    }
  };

  // Tile click handler
  const handleTileClick = (index: number) => {
    if (selectedTileIndex === index) {
      setSelectedTileIndex(null);
    } else {
      setSelectedTileIndex(index);
    }
  };

  // Photo Deck Handlers
  const handleAddPhoto = (newPhoto: StudioPhoto) => {
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  };

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTileIndex(null);
        setIsBlendPanelOpen(false);
      } else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleShuffle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShuffle]);

  // Handle Drag & Drop of local images (supports dropping multiple photos at once)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      imageFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setPhotos((prev) => [
              ...prev,
              {
                id: `drop-${Date.now()}-${idx}`,
                name: file.name.slice(0, 16) || `Photo ${prev.length + 1}`,
                url: result,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle Download Export with Multi-Photo Blending
  const handleDownload = async () => {
    const loadedImages = await Promise.all(
      photos.map((p) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => {
            const fallback = new Image();
            fallback.onload = () => resolve(fallback);
            fallback.onerror = () => resolve(img);
            fallback.src = p.url;
          };
          img.src = p.url;
        });
      })
    );

    const exportCanvas = await generateExportCanvas(
      loadedImages,
      currentGrid.cols,
      currentGrid.rows,
      tileFilters,
      {
        multiPhotoStyle,
        blendMode: blendMode as GlobalCompositeOperation,
        blendOpacity,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)',
      }
    );

    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `framemix-${photos.length}photos-${currentGrid.cols}x${currentGrid.rows}-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between select-none relative ${
        isDark ? 'bg-[#09090b] text-white' : 'bg-[#f4f4f5] text-zinc-900'
      }`}
    >
      {/* Hidden SVG Filter Primitives */}
      <SvgFilters />

      {/* Multi-Photo & Blend Modal Panel */}
      {isBlendPanelOpen && (
        <PhotoBlendPanel
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
          blendMode={blendMode}
          onBlendModeChange={setBlendMode}
          blendOpacity={blendOpacity}
          onBlendOpacityChange={setBlendOpacity}
          multiPhotoStyle={multiPhotoStyle}
          onMultiPhotoStyleChange={setMultiPhotoStyle}
          onClose={() => setIsBlendPanelOpen(false)}
          isDark={isDark}
        />
      )}

      {/* Drag & Drop Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-white gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/80 flex items-center justify-center animate-pulse">
            <span className="text-2xl">📸</span>
          </div>
          <p className="font-semibold text-lg">Drop photos here to add and blend</p>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="w-full pt-4 pb-2 px-4 z-20">
        <TopBar
          gridPresetIndex={gridPresetIndex}
          onGridPresetChange={handleGridPresetChange}
          onShuffle={handleShuffle}
          onDownload={handleDownload}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          photos={photos}
          onOpenBlendPanel={() => setIsBlendPanelOpen(true)}
        />
      </header>

      {/* Main Photo Canvas Stage */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 w-full max-w-md mx-auto">
        <div
          className={`relative w-full aspect-[9/14] sm:aspect-[3/4] max-h-[64vh] rounded-lg overflow-hidden shadow-2xl transition-all duration-200 ${
            isDark ? 'bg-zinc-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-zinc-300'
          }`}
        >
          {/* Sliced Photo Grid with 1px razor-sharp dividers */}
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${currentGrid.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${currentGrid.rows}, minmax(0, 1fr))`,
              gap: '1px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {Array.from({ length: totalTiles }).map((_, index) => {
              const row = Math.floor(index / currentGrid.cols);
              const col = index % currentGrid.cols;
              const filter = tileFilters[index] || 'original';
              const isSelected = selectedTileIndex === index;

              // Determine image and blend configuration for this tile
              const primaryPhotoUrl =
                multiPhotoStyle === 'alternate'
                  ? photos[index % photos.length].url
                  : photos[0].url;

              const secondaryPhotoUrls =
                multiPhotoStyle === 'blend' && photos.length > 1
                  ? photos.slice(1).map((p) => p.url)
                  : undefined;

              return (
                <div
                  key={`${index}-${currentGrid.cols}-${currentGrid.rows}`}
                  className="relative h-full w-full bg-zinc-900 overflow-hidden"
                >
                  <GridTile
                    imgUrl={primaryPhotoUrl}
                    secondaryImgUrls={secondaryPhotoUrls}
                    blendMode={blendMode}
                    blendOpacity={blendOpacity}
                    col={col}
                    row={row}
                    cols={currentGrid.cols}
                    rows={currentGrid.rows}
                    filter={filter}
                    isSelected={isSelected}
                    isPaintingMode={selectedTileIndex !== null}
                    onClick={() => handleTileClick(index)}
                    isDark={isDark}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Filter Dock */}
      <footer className="w-full pb-6 pt-2 px-4 z-20">
        <FilterDock
          activeGlobalFilter={activeGlobalFilter}
          selectedTileIndex={selectedTileIndex}
          selectedTileFilter={
            selectedTileIndex !== null ? tileFilters[selectedTileIndex] : undefined
          }
          onSelectFilter={handleSelectFilter}
          onSelectMixMood={handleSelectMixMood}
          activeMixMoodId={activeMixMoodId}
          onCancelSelection={() => setSelectedTileIndex(null)}
          isDark={isDark}
        />
      </footer>
    </div>
  );
}
