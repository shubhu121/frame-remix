"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export type TreatmentKind =
  | "pop"
  | "duotone"
  | "cinema"
  | "thermal"
  | "glitch"
  | "chrome"
  | "ink";

export interface Treatment {
  id: string;
  label: string;
  css?: string;
  svg?: TreatmentKind;
  overlay?: React.CSSProperties;
  overlaySrc?: string;
  overlayBlend?: React.CSSProperties["mixBlendMode"];
  overlayOpacity?: number;
}

export interface TreatmentGridProps {
  src: string;
  alt: string;
  treatments?: Treatment[];
  cols?: number;
  minCols?: number;
  maxCols?: number;
  resizable?: boolean;
  aspect?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (id: string | null) => void;
  uploadable?: boolean;
  persistKey?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
  className?: string;
  "aria-label"?: string;
}

export const DEFAULT_TREATMENTS: Treatment[] = [
  { id: "original", label: "Original", css: "none" },
  { id: "cinema", label: "Cinema", svg: "cinema" },
  { id: "duotone", label: "Duotone", svg: "duotone" },
  { id: "pop", label: "Pop", svg: "pop" },
  { id: "thermal", label: "Thermal", svg: "thermal" },
  { id: "glitch", label: "Glitch", svg: "glitch" },
  { id: "chrome", label: "Chrome", svg: "chrome" },
  { id: "ink", label: "Ink", svg: "ink" },
];

function useControlled<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void
): [T, (v: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const set = React.useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange]
  );
  return [current, set];
}

function mixIndexFor(i: number, n: number, seed: number) {
  let x = (((i + 1) * 2654435761) ^ ((seed + 1) * 40503)) >>> 0;
  x ^= x >>> 15;
  x = (x * 2246822519) >>> 0;
  x ^= x >>> 13;
  return (x >>> 0) % n;
}

const ShuffleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M11 3.5h2.2v2.2M13.2 3.5 9.5 7.2M11 12.5h2.2v-2.2M13.2 12.5 9.5 8.8M2.8 3.5h1.8l7.6 9h1.4M2.8 12.5h1.8l2.4-2.85"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="2" y="2.6" width="9.5" height="9.5" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2.4 9.6 5 7.4l2.1 1.8 2.2-2 2 1.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="5.4" r="0.9" fill="currentColor" />
    <path d="M12.4 10v4M10.4 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2.4v7.2M5 6.8 8 9.8l3-3M3 11.4v1.2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M13 9.4A5.2 5.2 0 0 1 6.6 3a5.3 5.3 0 1 0 6.4 6.4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="2.7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.5 3.5l1.1 1.1M11.4 11.4l1.1 1.1M12.5 3.5l-1.1 1.1M4.6 11.4l-1.1 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export function TreatmentGrid({
  src,
  alt,
  treatments = DEFAULT_TREATMENTS,
  cols: colsProp = 4,
  minCols = 2,
  maxCols = 12,
  resizable = true,
  aspect = "3 / 4",
  value,
  defaultValue = null,
  onChange,
  uploadable = true,
  persistKey,
  isDark,
  onToggleTheme,
  className,
  "aria-label": ariaLabel = "Image treatment",
}: TreatmentGridProps) {
  const uid = React.useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();
  const [selected, setSelected] = useControlled<string | null>(value, defaultValue, onChange);
  const [seed, setSeed] = React.useState(0);
  const [cols, setCols] = React.useState(colsProp);
  const rows = Math.max(2, Math.round((cols * 4) / 3));
  const [uploads, setUploads] = React.useState<Treatment[]>([]);
  const [overrides, setOverrides] = React.useState<Record<number, string>>({});
  const [activeCell, setActiveCell] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);
  const uploadCount = React.useRef(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Self-scoped theming: the `dark:` styles key off this root's own
  // `data-tg-theme` attribute (not an inherited `.dark`), so the in-component
  // toggle works even inside a dark host page. When `isDark` is omitted the
  // component falls back to following the nearest ancestor `.dark`.
  const [hostDark, setHostDark] = React.useState(false);
  React.useEffect(() => {
    if (typeof isDark === "boolean") return;
    const check = () => setHostDark(!!rootRef.current?.closest(".dark"));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [isDark]);
  const dark = typeof isDark === "boolean" ? isDark : hostDark;

  const grayscale = "0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0";

  const list = React.useMemo(() => [...treatments, ...uploads], [treatments, uploads]);

  const filterFor = React.useCallback(
    (t: Treatment | undefined) => {
      if (!t) return "none";
      return t.svg ? `url(#${uid}-${t.svg})` : t.css ?? "none";
    },
    [uid]
  );

  const mosaicPos = React.useCallback(
    (r: number, c: number) =>
      `${(c / Math.max(1, cols - 1)) * 100}% ${(r / Math.max(1, rows - 1)) * 100}%`,
    [cols, rows]
  );
  const mosaicSize = `${cols * 100}% ${rows * 100}%`;

  const cells = React.useMemo(() => {
    const out: { r: number; c: number; t: Treatment }[] = [];
    const n = Math.max(1, list.length);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        out.push({ r, c, t: list[mixIndexFor(i, n, seed)] ?? list[0] });
      }
    }
    return out;
  }, [rows, cols, list, seed]);

  const options: { id: string | null; label: string; t?: Treatment }[] = [
    { id: null, label: "Mix" },
    ...list.map((t) => ({ id: t.id, label: t.label, t })),
  ];

  const activeTreatment = selected ? list.find((t) => t.id === selected) : undefined;
  const pulseKey = `${selected ?? "mix"}-${seed}-${list.length}-${cols}`;

  const handleColsChange = (newCols: number) => {
    setCols(newCols);
    setOverrides({});
    setActiveCell(null);
  };

  const shuffle = () => {
    setSelected(null);
    setSeed((s) => s + 1);
  };

  React.useEffect(() => {
    if (!persistKey) return;
    try {
      const raw = window.localStorage.getItem(`tg:${persistKey}`);
      if (!raw) return;
      const saved = JSON.parse(raw) as Treatment[];
      if (Array.isArray(saved) && saved.length) {
        queueMicrotask(() => {
          setUploads(saved);
          const n = saved.reduce((m, t) => {
            const num = Number(/(\d+)$/.exec(t.id)?.[1] ?? 0);
            return Math.max(m, num);
          }, 0);
          uploadCount.current = n;
        });
      }
    } catch {
      /* ignore malformed storage */
    }
  }, [persistKey]);

  React.useEffect(() => {
    if (!persistKey) return;
    try {
      if (uploads.length) window.localStorage.setItem(`tg:${persistKey}`, JSON.stringify(uploads));
      else window.localStorage.removeItem(`tg:${persistKey}`);
    } catch {
      /* quota or private mode */
    }
  }, [persistKey, uploads]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    uploadCount.current += 1;
    const id = `photo-${uploadCount.current}`;
    const label = f.name.replace(/\.[^.]+$/, "").slice(0, 20) || `Photo ${uploadCount.current}`;
    const reader = new FileReader();
    reader.onload = () => {
      const t: Treatment = {
        id,
        label,
        css: "saturate(1.12) contrast(1.04)",
        overlaySrc: String(reader.result),
        overlayBlend: "overlay",
        overlayOpacity: 0.9,
      };
      setUploads((u) => [...u, t]);
      setSelected(id);
    };
    reader.readAsDataURL(f);
  };

  const renameUpload = (id: string, label: string) =>
    setUploads((u) => u.map((t) => (t.id === id ? { ...t, label } : t)));

  const removeUpload = (id: string) => {
    setUploads((u) => u.filter((t) => t.id !== id));
    if (selected === id) setSelected(null);
    setOverrides((prev) => {
      const next: Record<number, string> = {};
      for (const [k, v] of Object.entries(prev)) if (v !== id) next[Number(k)] = v;
      return next;
    });
  };

  React.useEffect(() => {
    if (activeCell === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCell(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCell]);

  const closeMenu = () => {
    setMenuFor(null);
    setRenameId(null);
  };

  React.useEffect(() => {
    if (menuFor === null) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest?.("[data-tg-menu]")) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuFor]);

  const commitRename = (id: string, fallback: string) => {
    renameUpload(id, draft.trim() || fallback);
    closeMenu();
  };

  const loadImage = (s: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = s;
    });

  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const base = await loadImage(src);
      const iw = base.naturalWidth || base.width;
      const ih = base.naturalHeight || base.height;
      const cw = iw / cols;
      const ch = ih / rows;

      const used: (Treatment | undefined)[] = [];
      const ovSrcs = new Set<string>();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const override = overrides[i] ? list.find((x) => x.id === overrides[i]) : undefined;
          const useT = override ?? (selected === null ? cells[i].t : activeTreatment);
          used[i] = useT;
          if (useT?.overlaySrc) ovSrcs.add(useT.overlaySrc);
        }
      }
      const ovMap = new Map<string, HTMLImageElement>();
      await Promise.all([...ovSrcs].map(async (s) => ovMap.set(s, await loadImage(s))));

      const canvas = document.createElement("canvas");
      canvas.width = iw;
      canvas.height = ih;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = used[r * cols + c];
          const tile = document.createElement("canvas");
          tile.width = Math.ceil(cw);
          tile.height = Math.ceil(ch);
          const tctx = tile.getContext("2d");
          if (!tctx) continue;
          tctx.filter = filterFor(t);
          tctx.drawImage(base, c * cw, r * ch, cw, ch, 0, 0, tile.width, tile.height);
          tctx.filter = "none";
          if (t?.overlaySrc) {
            const ov = ovMap.get(t.overlaySrc);
            if (ov) {
              const ow = ov.naturalWidth || ov.width;
              const oh = ov.naturalHeight || ov.height;
              tctx.globalCompositeOperation = (t.overlayBlend as GlobalCompositeOperation) ?? "overlay";
              tctx.globalAlpha = t.overlayOpacity ?? 0.9;
              tctx.drawImage(ov, (c * ow) / cols, (r * oh) / rows, ow / cols, oh / rows, 0, 0, tile.width, tile.height);
              tctx.globalAlpha = 1;
              tctx.globalCompositeOperation = "source-over";
            }
          }
          ctx.drawImage(tile, c * cw, r * ch, cw, ch);
        }
      }

      const line = Math.max(1, Math.round(iw / (cols * 220)));
      ctx.fillStyle = "rgba(18,18,20,0.8)";
      for (let c = 1; c < cols; c++) ctx.fillRect(Math.round(c * cw - line / 2), 0, line, ih);
      for (let r = 1; r < rows; r++) ctx.fillRect(0, Math.round(r * ch - line / 2), iw, line);

      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `treatment-${selected ?? "mix"}-${cols}x${rows}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setBusy(false);
    }
  };

  const radioRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onRadioKey = (e: React.KeyboardEvent, idx: number) => {
    const last = options.length - 1;
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setSelected(options[next].id);
    radioRefs.current[next]?.focus();
  };

  const paint = activeCell !== null;
  const selectedIdx = options.findIndex((o) => o.id === selected);

  const pickOption = (id: string | null) => {
    if (paint && activeCell !== null) {
      setOverrides((prev) => {
        const next = { ...prev };
        if (id === null) delete next[activeCell];
        else next[activeCell] = id;
        return next;
      });
    } else {
      setOverrides({});
      setSelected(id);
    }
  };

  const swatchStack = (t?: Treatment) => (
    <>
      <span
        className="block h-full w-full"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center 22%",
          filter: filterFor(t),
        }}
      />
      {t?.overlaySrc && (
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${t.overlaySrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: t.overlayBlend ?? "overlay",
            opacity: t.overlayOpacity ?? 0.9,
          }}
        />
      )}
      {t?.overlay && <span className="absolute inset-0" style={t.overlay} />}
    </>
  );

  return (
    <div
      ref={rootRef}
      data-tg-theme={dark ? "dark" : "light"}
      className={["mx-auto flex w-full max-w-[360px] flex-col items-center", className ?? ""].join(" ")}
    >
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <filter id={`${uid}-pop`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="1.9" />
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.28 0.55 0.82 1" />
              <feFuncG type="discrete" tableValues="0 0.28 0.55 0.82 1" />
              <feFuncB type="discrete" tableValues="0 0.28 0.55 0.82 1" />
            </feComponentTransfer>
          </filter>
          <filter id={`${uid}-cinema`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="1.25" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.05 0.34 0.62 0.86 1" />
              <feFuncG type="table" tableValues="0.06 0.3 0.52 0.76 0.95" />
              <feFuncB type="table" tableValues="0.22 0.38 0.44 0.5 0.72" />
            </feComponentTransfer>
          </filter>
          <filter id={`${uid}-duotone`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={grayscale} />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.12 0.98 1" />
              <feFuncG type="table" tableValues="0.02 0.16 0.98" />
              <feFuncB type="table" tableValues="0.28 0.55 0.86" />
            </feComponentTransfer>
            <feColorMatrix type="saturate" values="1.3" />
          </filter>
          <filter id={`${uid}-thermal`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={grayscale} />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.02 0.15 0.55 0.92 1 1" />
              <feFuncG type="table" tableValues="0 0.02 0.22 0.55 0.9 1" />
              <feFuncB type="table" tableValues="0.22 0.62 0.66 0.28 0.08 0.6" />
            </feComponentTransfer>
          </filter>
          <filter id={`${uid}-glitch`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feOffset in="SourceGraphic" dx="4" dy="-2" result="o1" />
            <feColorMatrix in="o1" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
            <feOffset in="SourceGraphic" dx="-4" dy="2" result="o2" />
            <feColorMatrix in="o2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" />
          </filter>
          <filter id={`${uid}-chrome`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feConvolveMatrix order="3" preserveAlpha="true" divisor="1" bias="0.5" kernelMatrix="-2 -1 0 -1 1 1 0 1 2" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.15" />
              <feFuncG type="linear" slope="1.15" />
              <feFuncB type="linear" slope="1.35" />
            </feComponentTransfer>
          </filter>
          <filter id={`${uid}-ink`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feConvolveMatrix order="3" preserveAlpha="true" divisor="1" bias="0" kernelMatrix="0 -1 0 -1 4 -1 0 -1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="1 0" />
              <feFuncG type="table" tableValues="1 0" />
              <feFuncB type="table" tableValues="1 0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [[data-tg-theme=dark]_&]:bg-white/[0.08] [[data-tg-theme=dark]_&]:text-zinc-200 [[data-tg-theme=dark]_&]:hover:bg-white/[0.14]"
        >
          <ShuffleIcon />
          Shuffle
        </button>
        {uploadable && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [[data-tg-theme=dark]_&]:bg-white/[0.08] [[data-tg-theme=dark]_&]:text-zinc-200 [[data-tg-theme=dark]_&]:hover:bg-white/[0.14]"
          >
            <AddImageIcon />
            Add photo
          </button>
        )}
        <button
          type="button"
          onClick={download}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 [[data-tg-theme=dark]_&]:bg-white/[0.08] [[data-tg-theme=dark]_&]:text-zinc-200 [[data-tg-theme=dark]_&]:hover:bg-white/[0.14]"
        >
          <DownloadIcon />
          {busy ? "Saving…" : "Download"}
        </button>
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [[data-tg-theme=dark]_&]:bg-white/[0.08] [[data-tg-theme=dark]_&]:text-zinc-200 [[data-tg-theme=dark]_&]:hover:bg-white/[0.14]"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        )}
      </div>

      {resizable && (
        <div className="mb-3 flex w-full items-center gap-2.5">
          <span className="text-[11px] font-medium text-zinc-400 [[data-tg-theme=dark]_&]:text-zinc-500">Frames</span>
          <input
            type="range"
            min={minCols}
            max={maxCols}
            step={1}
            value={cols}
            onChange={(e) => handleColsChange(Number(e.target.value))}
            aria-label="Grid density"
            className="tg-range h-1 flex-1 cursor-ew-resize appearance-none rounded-full bg-zinc-200 accent-zinc-900 [[data-tg-theme=dark]_&]:bg-white/15 [[data-tg-theme=dark]_&]:accent-zinc-100"
          />
          <span className="w-10 text-right text-[11px] tabular-nums text-zinc-500 [[data-tg-theme=dark]_&]:text-zinc-400">
            {cols}&#215;{rows}
          </span>
        </div>
      )}

      <div
        role="img"
        aria-label={alt}
        className="grid w-full bg-zinc-900/80 [[data-tg-theme=dark]_&]:bg-white/20"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, aspectRatio: aspect, gap: "1px" }}
      >
        {cells.map(({ r, c, t }) => {
          const i = r * cols + c;
          const override = overrides[i] ? list.find((x) => x.id === overrides[i]) : undefined;
          const useT = override ?? (selected === null ? t : activeTreatment);
          const isActive = activeCell === i;
          const delay = reduce ? 0 : Math.min((r + c) * 0.018, 0.4);
          return (
            <motion.div
              key={`${r}-${c}`}
              onClick={() => setActiveCell(isActive ? null : i)}
              className="group relative cursor-pointer"
              whileHover={reduce ? undefined : { scale: 1.06, zIndex: 5 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <motion.div
                key={pulseKey}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.34, delay, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: mosaicSize,
                    backgroundPosition: mosaicPos(r, c),
                    filter: filterFor(useT),
                  }}
                />
                {useT?.overlaySrc && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${useT.overlaySrc})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: mosaicSize,
                      backgroundPosition: mosaicPos(r, c),
                      mixBlendMode: useT.overlayBlend ?? "overlay",
                      opacity: useT.overlayOpacity ?? 0.9,
                    }}
                  />
                )}
                {useT?.overlay && <div className="absolute inset-0" style={useT.overlay} />}
              </motion.div>
              {isActive && <span className="pointer-events-none absolute inset-0 z-10 ring-2 ring-inset ring-blue-500" />}
            </motion.div>
          );
        })}
      </div>

      {paint && (
        <p className="mt-2 text-[11px] text-zinc-500 [[data-tg-theme=dark]_&]:text-zinc-400">
          Painting one frame · pick a filter, or Esc to cancel
        </p>
      )}

      <div role="radiogroup" aria-label={ariaLabel} className="mt-3 flex w-full flex-wrap items-center justify-center gap-1.5">
        {options.map((o, idx) => {
          const active = paint
            ? (activeCell !== null ? overrides[activeCell] ?? null : null) === o.id
            : o.id === selected;
          const isUpload = !!o.t?.overlaySrc;
          const menuOpen = isUpload && menuFor === o.t!.id;
          return (
            <span key={o.id ?? "__mix"} className="relative inline-flex" data-tg-menu={menuOpen ? "" : undefined}>
              <button
                ref={(el) => {
                  radioRefs.current[idx] = el;
                }}
                role="radio"
                aria-checked={active}
                tabIndex={active || (selectedIdx === -1 && idx === 0) ? 0 : -1}
                onClick={() => pickOption(o.id)}
                onKeyDown={(e) => onRadioKey(e, idx)}
                onContextMenu={
                  isUpload
                    ? (e) => {
                        e.preventDefault();
                        setRenameId(null);
                        setMenuFor(o.t!.id);
                      }
                    : undefined
                }
                title={isUpload ? "Right-click to rename or remove" : undefined}
                className={[
                  "flex w-[104px] items-center justify-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-[12px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
                  active
                    ? "bg-zinc-900 text-white [[data-tg-theme=dark]_&]:bg-zinc-100 [[data-tg-theme=dark]_&]:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 [[data-tg-theme=dark]_&]:text-zinc-300 [[data-tg-theme=dark]_&]:hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "relative h-4 w-4 shrink-0 overflow-hidden rounded-full ring-1",
                    active ? "ring-white/30 [[data-tg-theme=dark]_&]:ring-black/20" : "ring-zinc-950/10 [[data-tg-theme=dark]_&]:ring-white/15",
                  ].join(" ")}
                >
                  {o.id === null ? (
                    <span
                      className="block h-full w-full"
                      style={{ background: "conic-gradient(from 0deg, #d1495b, #edae49, #00798c, #8e44ad, #d1495b)" }}
                    />
                  ) : (
                    swatchStack(o.t)
                  )}
                </span>
                <span className="truncate">{o.label}</span>
              </button>

              {menuOpen && (
                <div
                  data-tg-menu=""
                  className="absolute left-1/2 top-full z-30 mt-1.5 w-max -translate-x-1/2 rounded-lg border border-zinc-950/10 bg-white p-1 shadow-lg shadow-zinc-900/10 [[data-tg-theme=dark]_&]:border-white/10 [[data-tg-theme=dark]_&]:bg-zinc-900 [[data-tg-theme=dark]_&]:shadow-black/40"
                >
                  {renameId === o.t!.id ? (
                    <input
                      autoFocus
                      value={draft}
                      maxLength={24}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(o.t!.id, o.t!.label);
                        if (e.key === "Escape") closeMenu();
                      }}
                      onBlur={() => commitRename(o.t!.id, o.t!.label)}
                      aria-label="Filter name"
                      className="w-32 rounded-md bg-zinc-100 px-2 py-1 text-[12px] text-zinc-800 outline-none ring-1 ring-blue-500 [[data-tg-theme=dark]_&]:bg-zinc-800 [[data-tg-theme=dark]_&]:text-zinc-100"
                    />
                  ) : (
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(o.t!.label);
                          setRenameId(o.t!.id);
                        }}
                        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] text-zinc-700 transition-colors hover:bg-zinc-100 [[data-tg-theme=dark]_&]:text-zinc-200 [[data-tg-theme=dark]_&]:hover:bg-white/[0.08]"
                      >
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                          <path d="M9.2 2.6 11.4 4.8 5 11.2 2.4 11.6 2.8 9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeUpload(o.t!.id);
                          closeMenu();
                        }}
                        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] text-red-500 transition-colors hover:bg-red-50 [[data-tg-theme=dark]_&]:hover:bg-red-500/10"
                      >
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                          <path d="M3 4h8M5.5 4V2.8h3V4M4.2 4l.5 7.2h4.6L9.8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default TreatmentGrid;
