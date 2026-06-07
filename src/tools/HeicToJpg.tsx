import React, { useState, useRef, useEffect } from "react";
import Toast from "../components/Toast";
import { Image as ImageIcon, Trash2, Download, UploadCloud, RefreshCw, AlertTriangle } from "lucide-react";

export default function HeicToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [status, setStatus] = useState("Loading conversion engine...");
  const [isHovered, setIsHovered] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [jpgSize, setJpgSize] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [quality, setQuality] = useState(0.9);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load heic2any library dynamically from CDN
  useEffect(() => {
    if ((window as any).heic2any) {
      setIsLibLoaded(true);
      setStatus("HEIC decoder loaded. Drop a file to start.");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/heic2any/dist/heic2any.min.js";
    script.async = true;
    script.onload = () => {
      setIsLibLoaded(true);
      setStatus("HEIC decoder loaded. Ready.");
    };
    script.onerror = () => {
      setStatus("Failed to load HEIC decoder. Check internet connections.");
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if unmounted before load
      if (document.body.contains(script) && !(window as any).heic2any) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleFile = (f: File) => {
    // HEIC files sometimes have empty mime-types in older browsers or Windows,
    // so we check extension as well
    const ext = f.name.split(".").pop()?.toLowerCase();
    const isHeic = ext === "heic" || ext === "heif" || f.type === "image/heic" || f.type === "image/heif";
    
    if (!isHeic) {
      alert("Only HEIC or HEIF images are supported.");
      return;
    }

    setFile(f);
    setStatus("HEIC loaded. Adjust quality and click Convert.");
    if (jpgUrl) {
      URL.revokeObjectURL(jpgUrl);
      setJpgUrl(null);
      setJpgSize(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file || !(window as any).heic2any) return;
    setIsConverting(true);
    setStatus("Decoding Apple HEIC container... (this can take a few seconds)");

    try {
      // call heic2any
      const heic2anyFn = (window as any).heic2any;
      const resBlob = await heic2anyFn({
        blob: file,
        toType: "image/jpeg",
        quality: quality,
      });

      // heic2any can return an array if input was multiple, but we only supply one file
      const blob = Array.isArray(resBlob) ? resBlob[0] : resBlob;
      const url = URL.createObjectURL(blob);
      
      setJpgUrl(url);
      setJpgSize(blob.size);
      setStatus("Conversion successful!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Conversion failed. Ensure the HEIC file is valid.");
      alert("Conversion failed: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (jpgUrl) URL.revokeObjectURL(jpgUrl);
    setJpgUrl(null);
    setJpgSize(null);
    setQuality(0.9);
    setStatus("Cleared. Ready for HEIC photo.");
  };

  useEffect(() => {
    return () => {
      if (jpgUrl) URL.revokeObjectURL(jpgUrl);
    };
  }, [jpgUrl]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="HEIC decoded to JPEG!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">HEIC to JPG Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Apple HEIF Decoder V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleConvert}
            disabled={!file || isConverting || !isLibLoaded}
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
        {!isLibLoaded ? (
          <div className="flex-1 min-h-[300px] border border-white/5 bg-lumora-bg/40 rounded-[24px] flex flex-col items-center justify-center p-8 text-center text-lumora-sub gap-3">
            <RefreshCw className="h-10 w-10 text-lumora-highlight animate-spin" />
            <h4 className="text-white font-display font-bold text-base">Loading HEIC Converter Library...</h4>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              We are fetching the browser decoding script. This takes just a moment on first load.
            </p>
          </div>
        ) : !file ? (
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
              Select or Drop Apple HEIC photos
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports .heic or .heif files. Your photos are processed privately inside your browser.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".heic,.heif,image/heic,image/heif"
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
            {/* Input Details */}
            <div className="flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">HEIC Source File</h4>
              </div>

              {/* Box showing file name/metadata */}
              <div className="flex-1 flex flex-col items-center justify-center bg-lumora-bg/40 border border-white/5 rounded-2xl p-6 text-center">
                <div className="h-16 w-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-white/40 mb-4">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <h5 className="text-sm font-semibold text-white truncate max-w-[200px] mb-1">{file.name}</h5>
                <span className="font-mono text-xs text-lumora-sub">{fmtBytes(file.size)}</span>
              </div>

              {/* Quality Settings */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center text-xs font-display font-bold text-white/50 uppercase tracking-wider">
                  <span>JPEG Quality Output</span>
                  <span className="font-mono text-lumora-highlight">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lumora-highlight"
                />
                <span className="text-[10px] text-white/30">Determines the JPEG compression of the final file.</span>
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="h-4 w-4 text-lumora-blue" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">JPEG Conversion Output</h4>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center bg-lumora-bg/40 border border-white/5 rounded-2xl p-4 min-h-[220px] text-center">
                {jpgUrl ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex-1 flex items-center justify-center max-h-[140px] overflow-hidden rounded-lg">
                      <img
                        src={jpgUrl}
                        alt="JPEG Output Preview"
                        className="max-h-[140px] max-w-full object-contain"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center w-full text-xs font-mono text-lumora-sub border-t border-white/5 pt-3 px-1">
                      <span>Size: {jpgSize ? fmtBytes(jpgSize) : "-"}</span>
                      <a
                        href={jpgUrl}
                        download={`${file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                        className="px-4 py-2 bg-lumora-blue hover:bg-white text-black transition-all rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                      >
                        <Download className="h-3 w-3" /> Save JPEG
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="opacity-20 flex flex-col items-center gap-2">
                    <ImageIcon className="h-10 w-10 text-white" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">
                      Converted image will appear here
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  HEIC photo rendering takes high computational memory. Close other heavy tabs if conversion freezes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
