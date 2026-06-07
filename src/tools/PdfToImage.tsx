import React, { useState, useRef, useEffect } from "react";
import Toast from "../components/Toast";
import { FileImage, Trash2, Download, UploadCloud, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move, Settings, Eye, RefreshCw } from "lucide-react";

interface ViewerState {
  pdfFile: File | null;
  pdfDoc: any | null;
  curPage: number;
  totalPages: number;
  scale: number;
  transX: number;
  transY: number;
  isPanning: boolean;
  startX: number;
  startY: number;
}

export default function PdfToImage() {
  const [state, setState] = useState<ViewerState>({
    pdfFile: null,
    pdfDoc: null,
    curPage: 1,
    totalPages: 0,
    scale: 1.0,
    transX: 0,
    transY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
  });

  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [resolutionScale, setResolutionScale] = useState(2.0); // 1 = 72dpi, 2 = 144dpi (default)
  const [quality, setQuality] = useState(0.92);
  const [status, setStatus] = useState("Loading conversion libraries...");
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pageCache = useRef<Record<number, any>>({});

  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Failed to load script " + src));
      document.head.appendChild(s);
    });
  };

  const ensureLibs = async () => {
    try {
      const w = window as any;
      if (!w.pdfjsLib) {
        // Try multiple CDN mirrors for fallback
        const urls = [
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.min.js",
          "https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.min.js",
        ];
        let loaded = false;
        for (const url of urls) {
          try {
            await loadScript(url);
            if (w.pdfjsLib) {
              loaded = true;
              break;
            }
          } catch (e) {
            console.debug("Failed loading CDN", url, e);
          }
        }
        if (!loaded) throw new Error("Could not load pdfjsLib from any CDN");
      }
      
      // Set worker source
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      if (!w.JSZip) {
        await loadScript("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js");
      }

      setIsLibLoaded(true);
      setStatus("PDF extraction engine ready. Upload a file.");
    } catch (err: any) {
      console.error(err);
      setStatus("Failed to load dependency libraries. Check your connection.");
    }
  };

  useEffect(() => {
    ensureLibs();
  }, []);

  const getPage = async (num: number) => {
    if (pageCache.current[num]) return pageCache.current[num];
    const page = await state.pdfDoc.getPage(num);
    pageCache.current[num] = page;
    return page;
  };

  // Render current page to canvas
  const renderViewer = async (currentPageNum: number, currentScale: number, resetViewport: boolean = false) => {
    if (!state.pdfDoc || !canvasRef.current) return;

    try {
      const page = await getPage(currentPageNum);
      let targetScale = currentScale;

      if (resetViewport && stageRef.current) {
        const trial = page.getViewport({ scale: 1.0 });
        const w = stageRef.current.clientWidth - 30;
        const h = stageRef.current.clientHeight - 30;
        const sx = w / trial.width;
        const sy = h / trial.height;
        targetScale = Math.max(Math.min(sx, sy), 0.25);
        setState((prev) => ({ ...prev, scale: targetScale, transX: 0, transY: 0 }));
      }

      const vp = page.getViewport({ scale: targetScale });
      const canvas = canvasRef.current;
      canvas.width = vp.width;
      canvas.height = vp.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        await page.render({
          canvasContext: ctx,
          viewport: vp,
        }).promise;
      }
    } catch (err) {
      console.error("Error rendering page", err);
    }
  };

  // Trigger render when curPage or scale changes
  useEffect(() => {
    if (state.pdfDoc) {
      renderViewer(state.curPage, state.scale);
    }
  }, [state.pdfDoc, state.curPage, state.scale]);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are supported.");
      return;
    }

    setStatus("Reading PDF buffer...");
    pageCache.current = {};

    try {
      const data = await f.arrayBuffer();
      const w = window as any;
      const pdfDoc = await w.pdfjsLib.getDocument({ data }).promise;

      setState((prev) => ({
        ...prev,
        pdfFile: f,
        pdfDoc: pdfDoc,
        curPage: 1,
        totalPages: pdfDoc.numPages,
      }));
      setStatus(`Loaded PDF: ${pdfDoc.numPages} pages.`);
      
      // Delay slightly for layout to compute clientWidth
      setTimeout(() => {
        renderViewer(1, 1.0, true);
      }, 100);
    } catch (err: any) {
      console.error(err);
      alert("Failed to load PDF. File might be corrupted or password-protected.");
      setStatus("Loading error.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const setZoom = (mult: number) => {
    if (!state.pdfDoc) return;
    const nextScale = Math.min(Math.max(state.scale * mult, 0.25), 8.0);
    setState((prev) => ({ ...prev, scale: nextScale }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!state.pdfDoc) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1 / 1.15 : 1.15;
    setZoom(factor);
  };

  const startPan = (e: React.MouseEvent) => {
    if (!state.pdfDoc) return;
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

  const handlePageChange = (num: number) => {
    if (!state.pdfDoc) return;
    const clamped = Math.min(Math.max(1, num), state.totalPages);
    setState((prev) => ({ ...prev, curPage: clamped }));
  };

  const handleExtractImages = async () => {
    const { pdfDoc, pdfFile } = state;
    if (!pdfDoc || !pdfFile) return;

    setIsProcessing(true);
    setProgress(0);
    setStatus("Extracting pages as images...");

    try {
      const w = window as any;
      const zip = new w.JSZip();
      const baseName = pdfFile.name.replace(/\.pdf$/i, "");

      for (let p = 1; p <= state.totalPages; p++) {
        setStatus(`Extracting page ${p} of ${state.totalPages}...`);
        const page = await getPage(p);
        const vp = page.getViewport({ scale: resolutionScale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get context for offscreen canvas");

        await page.render({
          canvasContext: ctx,
          viewport: vp,
        }).promise;

        const mime = format === "jpeg" ? "image/jpeg" : "image/png";
        const q = format === "jpeg" ? quality : undefined;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), mime, q);
        });

        const buf = await blob.arrayBuffer();
        const ext = format === "jpeg" ? "jpg" : "png";
        const numStr = String(p).padStart(3, "0");
        zip.file(`${baseName}_p${numStr}.${ext}`, buf);

        setProgress(Math.round((p / state.totalPages) * 100));
        await new Promise((r) => setTimeout(r, 10)); // Allow UI yield
      }

      setStatus("Packaging ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}_images.zip`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setStatus("ZIP download complete!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Extraction failed: " + err.message);
      alert("Extraction failed: " + err.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setState({
      pdfFile: null,
      pdfDoc: null,
      curPage: 1,
      totalPages: 0,
      scale: 1.0,
      transX: 0,
      transY: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
    });
    pageCache.current = {};
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 0;
      canvas.height = 0;
    }
    setFormat("png");
    setResolutionScale(2.0);
    setQuality(0.92);
    setStatus("Cleared. Ready for new PDF.");
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="ZIP archive generated successfully!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <FileImage className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">PDF to Image Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Client Page Extractor V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExtractImages}
            disabled={!state.pdfDoc || isProcessing || !isLibLoaded}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            {isProcessing ? `Extracting (${progress}%)` : "Save all pages"}
          </button>
          <button
            onClick={handleClear}
            disabled={!state.pdfFile}
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
            <h4 className="text-white font-display font-bold text-base">Loading PDF & ZIP engines...</h4>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              We are fetching PDF.js and JSZip binaries to handle the conversion inside your browser sandbox.
            </p>
          </div>
        ) : !state.pdfDoc ? (
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
              Select or Drop a PDF file
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports standard PDF documents. Pages are converted locally.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
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
            <div className="lg:col-span-5 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Output options</h4>
              </div>

              {/* Format Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Image Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                >
                  <option value="png">PNG (Lossless / High Quality)</option>
                  <option value="jpeg">JPG (Compressed / Smaller Zip)</option>
                </select>
              </div>

              {/* Resolution Scale */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                  <span>DPI Resolution Scale</span>
                  <span className="font-mono text-lumora-highlight">{resolutionScale}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.25"
                  value={resolutionScale}
                  onChange={(e) => setResolutionScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lumora-highlight"
                />
                <span className="text-[9px] text-white/30">1x (~72 DPI) is standard. 2x (~144 DPI) is recommended for crisp text.</span>
              </div>

              {/* Quality Slider (for JPG only) */}
              {format === "jpeg" && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                    <span>JPEG Quality</span>
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
                </div>
              )}

              {/* PDF Stats Summary */}
              <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2 text-[11px] font-mono text-lumora-sub">
                <div className="flex justify-between">
                  <span>PDF Name:</span>
                  <span className="text-white max-w-[150px] truncate">{state.pdfFile!.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>PDF Size:</span>
                  <span className="text-white">
                    {Math.round((state.pdfFile!.size / 1024) * 100) / 100} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Pages:</span>
                  <span className="text-white">{state.totalPages}</span>
                </div>
              </div>
            </div>

            {/* Viewer Panel (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-lumora-blue" />
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Document Viewer</h4>
                </div>

                {/* Page Navigation */}
                 <div className="flex items-center gap-2 bg-lumora-bg/60 px-3 py-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => handlePageChange(state.curPage - 1)}
                    disabled={state.curPage <= 1}
                    className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={state.curPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                    className="w-10 bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-white/30">/ {state.totalPages}</span>
                  <button
                    onClick={() => handlePageChange(state.curPage + 1)}
                    disabled={state.curPage >= state.totalPages}
                    className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(1 / 1.2)} className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/5">
                    <ZoomOut className="h-3 w-3" />
                  </button>
                  <button onClick={() => renderViewer(state.curPage, state.scale, true)} className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-display font-bold text-white/60 hover:text-white rounded-lg transition-colors border border-white/5">
                    Fit
                  </button>
                  <button onClick={() => setZoom(1.2)} className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/5">
                    <ZoomIn className="h-3 w-3" />
                  </button>
                  <span className="font-mono text-[9px] text-white/40 ml-1.5">{Math.round(state.scale * 100)}%</span>
                </div>
              </div>

              {/* Stage Container */}
              <div
                ref={stageRef}
                onWheel={handleWheel}
                onMouseDown={startPan}
                onMouseMove={doPan}
                onMouseUp={endPan}
                onMouseLeave={endPan}
                className="flex-1 min-h-[260px] bg-lumora-bg/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-grab"
              >
                <div
                  style={{
                    transform: `translate(${state.transX}px, ${state.transY}px)`,
                    transition: state.isPanning ? "none" : "transform 0.15s ease-out",
                  }}
                  className="flex items-center justify-center max-h-[85%] max-w-[85%]"
                >
                  <canvas ref={canvasRef} className="max-w-full max-h-full object-contain pointer-events-none select-none rounded border border-white/5 shadow-lg bg-white" />
                </div>
                <div className="absolute bottom-3 right-3 p-1.5 rounded bg-black/60 backdrop-blur-sm border border-white/5 pointer-events-none">
                  <Move className="h-3.5 w-3.5 text-white/40" />
                </div>
              </div>

              <span className="text-[9px] text-white/30 font-display font-bold uppercase tracking-widest text-center mt-2">
                💡 Scroll wheel to zoom, click and drag canvas area to pan around.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <FileImage className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
