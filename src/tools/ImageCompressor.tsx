import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Toast from "../components/Toast";
import { FileDown, Trash2, Download, UploadCloud, Sliders, Maximize2, ZoomIn, ZoomOut, Move, RefreshCw } from "lucide-react";

interface CompressorState {
  file: File | null;
  img: HTMLImageElement | null;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedUrl: string | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  scale: number;
  transX: number;
  transY: number;
  isPanning: boolean;
  startX: number;
  startY: number;
}

export default function ImageCompressor() {
  const [state, setState] = useState<CompressorState>({
    file: null,
    img: null,
    originalSize: 0,
    originalWidth: 0,
    originalHeight: 0,
    compressedUrl: null,
    compressedSize: 0,
    compressedWidth: 0,
    compressedHeight: 0,
    scale: 1,
    transX: 0,
    transY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
  });

  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp" | "image/png">("image/jpeg");
  const [resizeMode, setResizeMode] = useState<string>("0"); // "0" is original, numbers are widths, "custom" is custom
  const [customWidth, setCustomWidth] = useState<string>("");
  const [status, setStatus] = useState("Drop an image to compress.");
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fmtBytes = (bytes: number) => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let val = bytes;
    while (val > 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return val.toFixed(i ? 2 : 0) + " " + units[i];
  };

  const handleFile = (f: File) => {
    if (!/^image\/(jpeg|png|webp)$/i.test(f.type)) {
      alert("Supported formats are JPG, PNG, and WEBP.");
      return;
    }

    if (f.size > 20 * 1024 * 1024) {
      alert("File size is too large (max 20MB).");
      return;
    }

    setStatus("Loading image...");
    
    // Revoke old URL if exists
    if (state.compressedUrl) {
      URL.revokeObjectURL(state.compressedUrl);
    }

    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setState((prev) => ({
        ...prev,
        file: f,
        img: img,
        originalSize: f.size,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        compressedUrl: null,
        compressedSize: 0,
        compressedWidth: img.naturalWidth,
        compressedHeight: img.naturalHeight,
        scale: 1,
        transX: 0,
        transY: 0,
      }));
      setStatus("Image loaded. Tuning settings will apply automatically.");
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Failed to load image.");
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const runCompression = useCallback(() => {
    const { img, file } = state;
    if (!img || !file) return;

    setIsProcessing(true);
    
    // Get target width
    let targetWidth = img.naturalWidth;
    if (resizeMode === "custom") {
      const parsed = parseInt(customWidth);
      if (parsed > 0) targetWidth = parsed;
    } else {
      const parsed = parseInt(resizeMode);
      if (parsed > 0) targetWidth = parsed;
    }

    // Proportional height
    const ratio = img.naturalHeight / img.naturalWidth;
    let targetHeight = Math.round(targetWidth * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Compress
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setIsProcessing(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        setState((prev) => {
          if (prev.compressedUrl && prev.compressedUrl.startsWith("blob:")) {
            URL.revokeObjectURL(prev.compressedUrl);
          }
          return {
            ...prev,
            compressedUrl: url,
            compressedSize: blob.size,
            compressedWidth: targetWidth,
            compressedHeight: targetHeight,
          };
        });
        setStatus(`Compressed: ${fmtBytes(file.size)} → ${fmtBytes(blob.size)}`);
        setIsProcessing(false);
      },
      format,
      format === "image/png" ? undefined : quality
    );
  }, [state.img, state.file, quality, format, resizeMode, customWidth]);

  // Debounced execution when settings change
  useEffect(() => {
    if (state.img) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        runCompression();
      }, 300);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [state.img, quality, format, resizeMode, customWidth, runCompression]);

  const handleClear = () => {
    if (state.compressedUrl && state.compressedUrl.startsWith("blob:")) {
      URL.revokeObjectURL(state.compressedUrl);
    }
    setState({
      file: null,
      img: null,
      originalSize: 0,
      originalWidth: 0,
      originalHeight: 0,
      compressedUrl: null,
      compressedSize: 0,
      compressedWidth: 0,
      compressedHeight: 0,
      scale: 1,
      transX: 0,
      transY: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
    });
    setQuality(0.8);
    setFormat("image/jpeg");
    setResizeMode("0");
    setCustomWidth("");
    setStatus("Cleared. Ready for new image.");
  };

  // Zoom & Pan Functions
  const setZoom = (newScale: number) => {
    const clamped = Math.min(Math.max(newScale, 0.25), 10);
    setState((prev) => ({ ...prev, scale: clamped }));
  };

  const fitImage = () => {
    setState((prev) => ({ ...prev, scale: 1, transX: 0, transY: 0 }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!state.compressedUrl) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1 / 1.15 : 1.15;
    setZoom(state.scale * factor);
  };

  const startPan = (e: React.MouseEvent) => {
    if (!state.compressedUrl) return;
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      isPanning: true,
      startX: e.clientX - prev.transX,
      startY: e.clientY - prev.transY,
    }));
  };

  const doPan = (e: React.MouseEvent) => {
    if (!state.isPanning) return;
    setState((prev) => ({
      ...prev,
      transX: e.clientX - prev.startX,
      transY: e.clientY - prev.startY,
    }));
  };

  const endPan = () => {
    setState((prev) => ({ ...prev, isPanning: false }));
  };

  useEffect(() => {
    return () => {
      if (state.compressedUrl && state.compressedUrl.startsWith("blob:")) {
        URL.revokeObjectURL(state.compressedUrl);
      }
    };
  }, [state.compressedUrl]);

  const savingsPercent =
    state.originalSize > 0
      ? Math.round(((state.originalSize - state.compressedSize) / state.originalSize) * 100)
      : 0;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="Saved to downloads!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <FileDown className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Image Compressor</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Lite local compressor V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state.compressedUrl && (
            <a
              href={state.compressedUrl}
              download={
                state.file
                  ? `compressed_${state.file.name.replace(/\.[^/.]+$/, "")}.${
                      format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png"
                    }`
                  : "compressed.jpg"
              }
              onClick={() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
              }}
              className="px-5 py-2 bg-white text-black hover:bg-white/90 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          )}
          <button
            onClick={handleClear}
            disabled={!state.file}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10 disabled:opacity-50 disabled:pointer-events-none"
            title="Clear"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        {!state.file ? (
          <div
            onDragEnter={() => setIsHovered(true)}
            onDragOver={(e) => { e.preventDefault(); setIsHovered(true); }}
            onDragLeave={() => setIsHovered(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[300px] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${
              isHovered
                ? "border-lumora-highlight bg-lumora-highlight/5 text-white"
                : "border-white/10 bg-lumora-bg/40 text-lumora-sub"
            }`}
          >
            <UploadCloud className="h-12 w-12 text-white/20 mb-4" />
            <h4 className="text-white font-display font-bold text-base mb-2">
              Select or Drop an image
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports JPG, PNG, and WEBP formats (max 20MB). Output calculations run client-side.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
            {/* Options Panel (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sliders className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Compression Options</h4>
              </div>

              {/* Quality Slider (not for PNG) */}
              {format !== "image/png" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-display font-bold text-white/50 uppercase tracking-wider">
                    <span>Quality / Compression Ratio</span>
                    <span className="font-mono text-lumora-highlight">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lumora-highlight"
                  />
                  <span className="text-[10px] text-white/30">Lower values yields smaller files but visible artifacts.</span>
                </div>
              )}

              {/* Format Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display font-bold text-white/50 uppercase tracking-wider">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none focus:border-lumora-highlight/30 focus:ring-1 focus:ring-lumora-highlight/10 cursor-pointer"
                >
                  <option value="image/jpeg">JPG (Highly Recommended)</option>
                  <option value="image/webp">WEBP (Modern Web Standard)</option>
                  <option value="image/png">PNG (Lossless, Retains Transparency)</option>
                </select>
              </div>

              {/* Width resizing options */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display font-bold text-white/50 uppercase tracking-wider">Image Width Scaling</label>
                <select
                  value={resizeMode}
                  onChange={(e) => setResizeMode(e.target.value)}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none focus:border-lumora-highlight/30 focus:ring-1 focus:ring-lumora-highlight/10 cursor-pointer"
                >
                  <option value="0">Keep Original Dimensions</option>
                  <option value="1920">1920px (FHD / Wide Screens)</option>
                  <option value="1280">1280px (HD / Standard Web)</option>
                  <option value="800">800px (Blog / Articles)</option>
                  <option value="600">600px (Mobile / Avatars)</option>
                  <option value="custom">Custom Width...</option>
                </select>

                <AnimatePresence>
                  {resizeMode === "custom" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-1.5"
                    >
                      <input
                        type="number"
                        placeholder="Width (e.g. 1000px)"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full bg-lumora-bg/80 border border-white/5 rounded-xl px-4 py-2 text-xs text-white/85 focus:outline-none focus:border-lumora-highlight/30"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Metadata summary */}
              <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2 text-[11px] font-mono text-lumora-sub">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="text-white max-w-[150px] truncate">{state.file.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Source Width:</span>
                  <span className="text-white">{state.originalWidth}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Source Height:</span>
                  <span className="text-white">{state.originalHeight}px</span>
                </div>
                {state.compressedWidth > 0 && (
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span>Target Scale:</span>
                    <span className="text-lumora-highlight font-bold">
                      {state.compressedWidth} × {state.compressedHeight}px
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Stage & Comparison (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-lumora-blue" />
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Viewer Stage</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(state.scale / 1.2)} className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/5" title="Zoom Out">
                    <ZoomOut className="h-3 w-3" />
                  </button>
                  <button onClick={fitImage} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-display font-bold text-white/60 hover:text-white rounded-lg transition-colors border border-white/5" title="Fit Screen">
                    Fit
                  </button>
                  <button onClick={() => setZoom(state.scale * 1.2)} className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/5" title="Zoom In">
                    <ZoomIn className="h-3 w-3" />
                  </button>
                  <span className="font-mono text-[9px] text-white/40 ml-1.5">{Math.round(state.scale * 100)}%</span>
                </div>
              </div>

              {/* Checkerboard Viewer Container */}
              <div
                ref={stageRef}
                onWheel={handleWheel}
                onMouseDown={startPan}
                onMouseMove={doPan}
                onMouseUp={endPan}
                onMouseLeave={endPan}
                className="flex-1 min-h-[260px] bg-lumora-bg/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-grab bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"
              >
                {state.compressedUrl ? (
                  <img
                    src={state.compressedUrl}
                    alt="Compression Preview"
                    style={{
                      transform: `translate(${state.transX}px, ${state.transY}px) scale(${state.scale})`,
                      transition: state.isPanning ? "none" : "transform 0.15s ease-out",
                    }}
                    className="max-h-[80%] max-w-[80%] object-contain pointer-events-none select-none"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/20 select-none pointer-events-none animate-pulse">
                    <RefreshCw className="h-8 w-8 animate-spin text-lumora-highlight/40" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">Processing Image...</span>
                  </div>
                )}
                {state.compressedUrl && (
                  <div className="absolute bottom-3 right-3 p-1.5 rounded bg-black/60 backdrop-blur-sm border border-white/5 pointer-events-none">
                    <Move className="h-3.5 w-3.5 text-white/40" />
                  </div>
                )}
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 bg-lumora-bg/40 border border-white/5 rounded-xl p-4 text-center items-center divide-x divide-white/5">
                <div>
                  <h5 className="text-[9px] font-display font-bold text-white/30 uppercase tracking-widest mb-1">Original</h5>
                  <span className="font-mono text-sm text-white/80">{fmtBytes(state.originalSize)}</span>
                </div>
                <div>
                  <h5 className="text-[9px] font-display font-bold text-white/30 uppercase tracking-widest mb-1">Compressed</h5>
                  <span className="font-mono text-sm text-lumora-highlight font-bold">
                    {state.compressedSize > 0 ? fmtBytes(state.compressedSize) : "-"}
                  </span>
                </div>
                <div>
                  <h5 className="text-[9px] font-display font-bold text-white/30 uppercase tracking-widest mb-1">Reduced</h5>
                  <span className={`font-mono text-sm font-bold ${savingsPercent > 0 ? "text-green-400" : "text-white/40"}`}>
                    {savingsPercent > 0 ? `-${savingsPercent}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <FileDown className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
