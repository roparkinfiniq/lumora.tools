import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Toast from "../components/Toast";
import { Image, Trash2, Download, Sliders, RefreshCw, UploadCloud } from "lucide-react";

export default function PngJpgConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);

  const [format, setFormat] = useState<"auto" | "jpg" | "png">("auto");
  const [quality, setQuality] = useState(0.92);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [status, setStatus] = useState("Upload an image to start converting.");
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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

  const chooseTargetAuto = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    return ext === "png" ? "jpg" : "png";
  };

  const getTargetFormat = () => {
    if (format === "auto") {
      return file ? chooseTargetAuto(file) : "jpg";
    }
    return format;
  };

  const hexToRgb = (hex: string) => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match
      ? {
          r: parseInt(match[1], 16),
          g: parseInt(match[2], 16),
          b: parseInt(match[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      alert("Only PNG and JPG images are supported.");
      return;
    }

    setFile(f);
    setStatus("Image loaded. Choose options and click Convert.");
    
    // Reset output
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
      setOutputUrl(null);
      setOutputSize(null);
    }

    const url = URL.createObjectURL(f);
    setOriginalUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      imageRef.current = img;
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

  const handleConvert = () => {
    if (!file || !imageRef.current) return;
    setIsConverting(true);
    setStatus("Converting...");

    setTimeout(() => {
      try {
        const img = imageRef.current!;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        canvas.width = w;
        canvas.height = h;

        const targetFmt = getTargetFormat();
        const mime = targetFmt === "jpg" ? "image/jpeg" : "image/png";

        if (mime === "image/jpeg") {
          const { r, g, b } = hexToRgb(bgColor);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(0, 0, w, h);
        } else {
          ctx.clearRect(0, 0, w, h);
        }

        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL(mime, mime === "image/jpeg" ? quality : undefined);
        
        // Calculate size from base64
        const base64 = dataUrl.split(",")[1] || "";
        const bytes = Math.ceil((base64.length * 3) / 4);
        
        const base = file.name.replace(/\.(png|jpg|jpeg)$/i, "");
        const outName = `${base}_converted.${targetFmt}`;

        if (outputUrl) {
          URL.revokeObjectURL(outputUrl);
        }

        setOutputUrl(dataUrl);
        setOutputName(outName);
        setOutputSize(bytes);
        setStatus("Conversion complete!");
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err: any) {
        console.error(err);
        setStatus("Error: " + err.message);
      } finally {
        setIsConverting(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOriginalUrl(null);
    setOutputUrl(null);
    setOutputSize(null);
    setOriginalWidth(null);
    setOriginalHeight(null);
    imageRef.current = null;
    setFormat("auto");
    setQuality(0.92);
    setBgColor("#ffffff");
    setStatus("Clear complete. Ready for new image.");
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [originalUrl, outputUrl]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="Conversion completed!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <Image className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">PNG ↔ JPG Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Local Converter V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isConverting ? 'animate-spin' : ''}`} />
            Convert
          </button>
          <button
            onClick={handleClear}
            disabled={!file}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10 disabled:opacity-50 disabled:pointer-events-none"
            title="Clear"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Upload Area */}
        {!file ? (
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
              Drag & Drop files here, or click to browse
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports PNG and JPG formats. File stays on your browser (no server upload).
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Options Panel */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Conversion Settings</h4>
              </div>

              {/* Format Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-display font-bold text-white/50 uppercase tracking-wider">Output Format</label>
                <div className="grid grid-cols-3 gap-2 bg-lumora-bg/60 p-1.5 rounded-xl border border-white/5">
                  {(["auto", "jpg", "png"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 px-3 text-[11px] font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                        format === fmt
                          ? "bg-lumora-highlight text-black shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {fmt === "auto" ? `Auto (${getTargetFormat()})` : fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality slider - only if output is jpg */}
              {getTargetFormat() === "jpg" && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center text-xs font-display font-bold text-white/50 uppercase tracking-wider">
                    <span>JPEG Quality</span>
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
                  <span className="text-[10px] text-white/30">Lower quality reduces file size.</span>
                </div>
              )}

              {/* Background Color Picker - only if output is jpg */}
              {getTargetFormat() === "jpg" && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-display font-bold text-white/50 uppercase tracking-wider">
                    Background Color (for transparent areas)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={bgColor.toUpperCase()}
                      onChange={(e) => {
                        if (e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                          setBgColor(e.target.value);
                        }
                      }}
                      className="bg-lumora-bg/80 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-white/80 focus:outline-none w-28 uppercase"
                    />
                  </div>
                </div>
              )}
              
              {/* Image Info metadata */}
              <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-lumora-sub font-mono">
                <div className="flex justify-between">
                  <span>Filename:</span>
                  <span className="text-white max-w-[200px] truncate">{file.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Source Size:</span>
                  <span className="text-white">{fmtBytes(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span className="text-white">
                    {originalWidth && originalHeight ? `${originalWidth} × ${originalHeight}px` : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-2">Live Preview</h4>
              
              <div className="flex-1 grid grid-rows-2 gap-4 min-h-[280px]">
                {/* Source Preview */}
                <div className="bg-lumora-bg/40 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 overflow-hidden relative">
                  <span className="absolute top-4 left-4 text-[9px] font-display font-bold uppercase tracking-widest bg-white/10 text-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm z-10">
                    Source
                  </span>
                  <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]">
                    {originalUrl && (
                      <img
                        src={originalUrl}
                        alt="Source Preview"
                        className="max-h-[100px] max-w-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Converted Preview */}
                <div className="bg-lumora-bg/20 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 overflow-hidden relative">
                  <span className="absolute top-4 left-4 text-[9px] font-display font-bold uppercase tracking-widest bg-lumora-blue/20 text-lumora-blue px-2 py-0.5 rounded-md backdrop-blur-sm z-10">
                    Output
                  </span>
                  <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]">
                    {outputUrl ? (
                      <img
                        src={outputUrl}
                        alt="Output Preview"
                        className="max-h-[100px] max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-display font-bold text-white/20 uppercase tracking-widest">
                        Pending conversion
                      </span>
                    )}
                  </div>
                  {outputUrl && outputSize && (
                    <div className="flex justify-between items-center text-[10px] font-mono text-lumora-sub px-1">
                      <span>Size: {fmtBytes(outputSize)}</span>
                      <a
                        href={outputUrl}
                        download={outputName}
                        className="text-lumora-blue hover:underline flex items-center gap-1 font-display font-bold"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
