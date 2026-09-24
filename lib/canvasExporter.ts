import { FilterId } from './filters';

/**
 * Applies a filter to an ImageData object in-place on an offscreen canvas.
 */
export function applyFilterToImageData(
  imgData: ImageData,
  filterId: FilterId,
  seed: number = 0
): void {
  const data = imgData.data;
  const len = data.length;
  const width = imgData.width;
  const height = imgData.height;

  if (filterId === 'original') {
    return;
  }

  if (filterId === 'pop') {
    // True Andy Warhol / Posterized Pop-Art with discrete color bands (matching reference image)
    const steps = [10, 62, 128, 192, 238, 255];
    const quantize = (v: number) => {
      const idx = Math.min(steps.length - 1, Math.floor((v / 256) * steps.length));
      return steps[idx];
    };

    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 1. Contrast stretch
      r = (r - 128) * 1.35 + 128;
      g = (g - 128) * 1.35 + 128;
      b = (b - 128) * 1.35 + 128;

      // 2. Heavy saturation boost
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = Math.min(255, Math.max(0, gray + (r - gray) * 2.6));
      g = Math.min(255, Math.max(0, gray + (g - gray) * 2.6));
      b = Math.min(255, Math.max(0, gray + (b - gray) * 2.6));

      // 3. Discrete color quantization bands
      data[i] = quantize(r);
      data[i + 1] = quantize(g);
      data[i + 2] = quantize(b);
    }
    return;
  }

  if (filterId === 'thermal') {
    // FLIR Infrared Heatmap colormap
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const t = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      let nr = 0;
      let ng = 0;
      let nb = 0;

      if (t < 0.25) {
        const p = t / 0.25;
        nr = 10 + (140 - 10) * p;
        ng = 5 + (10 - 5) * p;
        nb = 80 + (160 - 80) * p;
      } else if (t < 0.5) {
        const p = (t - 0.25) / 0.25;
        nr = 140 + (240 - 140) * p;
        ng = 10 + (40 - 10) * p;
        nb = 160 + (20 - 160) * p;
      } else if (t < 0.75) {
        const p = (t - 0.5) / 0.25;
        nr = 240 + (255 - 240) * p;
        ng = 40 + (220 - 40) * p;
        nb = 20 + (0 - 20) * p;
      } else {
        const p = (t - 0.75) / 0.25;
        nr = 255;
        ng = 220 + (255 - 220) * p;
        nb = 0 + 255 * p;
      }

      data[i] = Math.min(255, Math.max(0, nr));
      data[i + 1] = Math.min(255, Math.max(0, ng));
      data[i + 2] = Math.min(255, Math.max(0, nb));
    }
    return;
  }

  if (filterId === 'duotone') {
    // Electric Magenta (#ff0066) & Bright Cyan (#00f0ff)
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const sc = lum < 0.5 ? 2 * lum * lum : 1 - 2 * (1 - lum) * (1 - lum);

      data[i] = Math.min(255, Math.max(0, 255 * (1 - sc)));
      data[i + 1] = Math.min(255, Math.max(0, 240 * sc));
      data[i + 2] = Math.min(255, Math.max(0, 110 * (1 - sc) + 255 * sc));
    }
    return;
  }

  if (filterId === 'neon') {
    // Cyberpunk laser violet & cyan glow
    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      r = Math.min(255, Math.max(0, r * 1.45 - 20));
      g = Math.min(255, Math.max(0, g * 1.25 - 10));
      b = Math.min(255, Math.max(0, b * 1.75 + 15));

      // Neon purple shadows & cyan highlights
      if (lum > 0.6) {
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 1.3);
      } else {
        r = Math.min(255, r * 1.3);
        b = Math.min(255, b * 1.4);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    return;
  }

  if (filterId === 'infrared') {
    // Kodak Aerochrome infrared
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Green turns into cherry crimson, blue turns into cyan/slate
      const nr = g * 1.35 + 20;
      const ng = g * 0.2 + b * 0.85;
      const nb = r * 0.9;

      data[i] = Math.min(255, Math.max(0, nr));
      data[i + 1] = Math.min(255, Math.max(0, ng));
      data[i + 2] = Math.min(255, Math.max(0, nb));
    }
    return;
  }

  if (filterId === 'solar') {
    // Sabattier solarization
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const curve = Math.abs(Math.sin(lum * Math.PI * 1.6)) * 255;
      data[i] = Math.min(255, Math.max(0, curve * 1.1 + r * 0.2));
      data[i + 1] = Math.min(255, Math.max(0, curve * 0.9 + g * 0.2));
      data[i + 2] = Math.min(255, Math.max(0, curve * 1.3 + b * 0.2));
    }
    return;
  }

  if (filterId === 'xray') {
    // Inverted negative with cyan glow
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const inv = 255 - lum;

      data[i] = Math.min(255, Math.max(0, inv * 0.65));
      data[i + 1] = Math.min(255, Math.max(0, inv * 0.95));
      data[i + 2] = Math.min(255, Math.max(0, inv * 1.25));
    }
    return;
  }

  if (filterId === 'vaporwave') {
    // 80s synthwave pastel lavender & mint
    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      r = Math.min(255, r * 1.15 + 25);
      g = Math.min(255, g * 1.05 + 15);
      b = Math.min(255, b * 1.35 + 35);

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    return;
  }

  if (filterId === 'amber') {
    // Golden hour tungsten
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      data[i] = Math.min(255, Math.max(0, lum * 1.2 + 25));
      data[i + 1] = Math.min(255, Math.max(0, lum * 0.95 + 10));
      data[i + 2] = Math.min(255, Math.max(0, lum * 0.65 - 10));
    }
    return;
  }

  if (filterId === 'halftone') {
    // Halftone dot matrix dither
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Dot screen raster
        const dotX = x % 6 - 3;
        const dotY = y % 6 - 3;
        const dist = Math.sqrt(dotX * dotX + dotY * dotY) / 3;
        const threshold = 1.0 - lum;

        const val = dist > threshold ? 255 : 10;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }
    return;
  }

  if (filterId === 'chrome') {
    // Solarized curves / liquid mercury metallic inversion
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const solar = Math.abs(Math.sin(lum * Math.PI * 2.2));
      const val = Math.min(255, Math.max(0, solar * 255 * 1.3));

      data[i] = Math.min(255, val * 0.95 + 10);
      data[i + 1] = Math.min(255, val * 0.98 + 15);
      data[i + 2] = Math.min(255, val * 1.05 + 25);
    }
    return;
  }

  if (filterId === 'ink') {
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const noise = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 20;
      const v = lum + noise > 130 ? 255 : 15;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    return;
  }

  if (filterId === 'cinema') {
    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      r = r * 1.08 + (lum > 0.5 ? (lum - 0.5) * 60 : -(0.5 - lum) * 30);
      g = g * 0.98 + (lum > 0.5 ? (lum - 0.5) * 25 : (0.5 - lum) * 15);
      b = b * 0.92 + (lum < 0.5 ? (0.5 - lum) * 60 : -(lum - 0.5) * 40);

      r = (r - 128) * 1.25 + 128;
      g = (g - 128) * 1.25 + 128;
      b = (b - 128) * 1.25 + 128;

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
    return;
  }

  if (filterId === 'glitch') {
    const copy = new Uint8ClampedArray(data);
    const offset = Math.floor(width * 0.035) + 3;

    const stripY1 = Math.floor(height * 0.25);
    const stripH1 = Math.floor(height * 0.18);
    const stripShift1 = Math.floor(width * 0.08);

    const stripY2 = Math.floor(height * 0.65);
    const stripH2 = Math.floor(height * 0.12);
    const stripShift2 = -Math.floor(width * 0.06);

    for (let y = 0; y < height; y++) {
      let extraXShift = 0;
      if (y >= stripY1 && y <= stripY1 + stripH1) extraXShift = stripShift1;
      if (y >= stripY2 && y <= stripY2 + stripH2) extraXShift = stripShift2;

      for (let x = 0; x < width; x++) {
        const destIdx = (y * width + x) * 4;

        const rx = Math.min(width - 1, Math.max(0, x - offset + extraXShift));
        const rIdx = (y * width + rx) * 4;

        const bx = Math.min(width - 1, Math.max(0, x + offset));
        const bIdx = (y * width + bx) * 4;

        const gx = Math.min(width - 1, Math.max(0, x + extraXShift));
        const gIdx = (y * width + gx) * 4;

        data[destIdx] = copy[rIdx];
        data[destIdx + 1] = copy[gIdx + 1];
        data[destIdx + 2] = copy[bIdx + 2];
      }
    }
    return;
  }
}

export interface ExportCanvasOptions {
  multiPhotoStyle?: 'blend' | 'alternate' | 'mosaic';
  blendMode?: GlobalCompositeOperation;
  blendOpacity?: number;
  tilePhotoIndices?: number[];
  borderColor?: string;
}

/**
 * High-res export renderer that stitches all grid tiles with multiple photo blending
 * and individual filters, and draws the grid dividing lines onto an exported PNG.
 */
export async function generateExportCanvas(
  inputImages: HTMLImageElement | HTMLImageElement[],
  cols: number,
  rows: number,
  tileFilters: FilterId[],
  optionsOrBorderColor: ExportCanvasOptions | string = '#ffffff'
): Promise<HTMLCanvasElement> {
  const images = Array.isArray(inputImages) ? inputImages : [inputImages];
  const primaryImg = images[0];

  const options: ExportCanvasOptions =
    typeof optionsOrBorderColor === 'string'
      ? { borderColor: optionsOrBorderColor }
      : optionsOrBorderColor;

  const borderColor = options.borderColor || '#ffffff';
  const multiPhotoStyle = options.multiPhotoStyle || 'blend';
  const blendMode = options.blendMode || 'screen';
  const blendOpacity = options.blendOpacity ?? 0.65;
  const tilePhotoIndices = options.tilePhotoIndices;

  const exportCanvas = document.createElement('canvas');
  const exportWidth = 1200;
  const aspectRatio = primaryImg.naturalHeight / (primaryImg.naturalWidth || 1);
  const exportHeight = Math.round(exportWidth * aspectRatio);

  exportCanvas.width = exportWidth;
  exportCanvas.height = exportHeight;

  const ctx = exportCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  const tileW = exportWidth / cols;
  const tileH = exportHeight / rows;

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = Math.ceil(tileW);
  tileCanvas.height = Math.ceil(tileH);
  const tileCtx = tileCanvas.getContext('2d', { willReadFrequently: true });
  if (!tileCtx) throw new Error('Could not get tile context');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileIndex = r * cols + c;
      const filter = tileFilters[tileIndex] || 'original';

      tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);

      if (images.length > 1 && multiPhotoStyle === 'alternate') {
        // Alternate photos across tiles
        const img = images[tileIndex % images.length];
        const srcTileW = img.naturalWidth / cols;
        const srcTileH = img.naturalHeight / rows;
        tileCtx.drawImage(
          img,
          c * srcTileW,
          r * srcTileH,
          srcTileW,
          srcTileH,
          0,
          0,
          tileCanvas.width,
          tileCanvas.height
        );
      } else if (images.length > 1 && tilePhotoIndices && multiPhotoStyle === 'mosaic') {
        // Specific photo assigned to tile
        const assignedIdx = tilePhotoIndices[tileIndex] ?? 0;
        const img = images[assignedIdx % images.length];
        const srcTileW = img.naturalWidth / cols;
        const srcTileH = img.naturalHeight / rows;
        tileCtx.drawImage(
          img,
          c * srcTileW,
          r * srcTileH,
          srcTileW,
          srcTileH,
          0,
          0,
          tileCanvas.width,
          tileCanvas.height
        );
      } else {
        // Double exposure / blend mode: composite multiple photos together!
        const srcTileW = primaryImg.naturalWidth / cols;
        const srcTileH = primaryImg.naturalHeight / rows;
        tileCtx.drawImage(
          primaryImg,
          c * srcTileW,
          r * srcTileH,
          srcTileW,
          srcTileH,
          0,
          0,
          tileCanvas.width,
          tileCanvas.height
        );

        // Blend additional photos
        if (images.length > 1) {
          for (let i = 1; i < images.length; i++) {
            const secondImg = images[i];
            const sW = secondImg.naturalWidth / cols;
            const sH = secondImg.naturalHeight / rows;

            tileCtx.save();
            tileCtx.globalCompositeOperation = blendMode;
            tileCtx.globalAlpha = blendOpacity;
            tileCtx.drawImage(
              secondImg,
              c * sW,
              r * sH,
              sW,
              sH,
              0,
              0,
              tileCanvas.width,
              tileCanvas.height
            );
            tileCtx.restore();
          }
        }
      }

      // Apply filter
      if (filter !== 'original') {
        const imgData = tileCtx.getImageData(0, 0, tileCanvas.width, tileCanvas.height);
        applyFilterToImageData(imgData, filter, tileIndex);
        tileCtx.putImageData(imgData, 0, 0);
      }

      ctx.drawImage(tileCanvas, c * tileW, r * tileH, tileW, tileH);
    }
  }

  // Draw grid lines
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;

  for (let c = 1; c < cols; c++) {
    const x = Math.round(c * tileW);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, exportHeight);
    ctx.stroke();
  }

  for (let r = 1; r < rows; r++) {
    const y = Math.round(r * tileH);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(exportWidth, y);
    ctx.stroke();
  }

  return exportCanvas;
}
