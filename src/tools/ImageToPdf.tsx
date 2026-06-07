import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import Toast from "../components/Toast";
import { FileUp, Trash2, Download, UploadCloud, ArrowUp, ArrowDown, Settings, ListOrdered } from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  url: string;
  img: HTMLImageElement;
  w: number;
  h: number;
}

export default function ImageToPdf() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "legal" | "auto">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [margin, setMargin] = useState(10);
  const [fitMode, setFitMode] = useState<"contain" | "cover" | "fitw" | "fith">("contain");
  const [quality, setQuality] = useState(0.92);

  const [status, setStatus] = useState("Add images to begin packaging PDF.");
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const handleFiles = async (files: FileList) => {
    setStatus("Loading images...");
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      setStatus("No valid images selected.");
      return;
    }

    const newItems: ImageItem[] = [];
    for (const file of imageFiles) {
      const url = URL.createObjectURL(file);
      try {
        const img = await loadImage(url);
        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          url,
          img,
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      } catch (err) {
        console.error("Failed to load image", err);
        URL.revokeObjectURL(url);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setStatus(`Added ${newItems.length} images.`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[nextIndex];
      updated[nextIndex] = temp;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed.url);
      return updated;
    });
  };

  const handleClear = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
    setStatus("Queue cleared. Ready for new images.");
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    setItems((prev) => {
      const updated = [...prev];
      const item = updated.splice(dragIndex, 1)[0];
      updated.splice(index, 0, item);
      return updated;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // Convert to PDF logic
  const handleGeneratePdf = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setStatus("Compiling PDF pages...");

    try {
      const PAGE_SIZES = {
        a4: { w: 210, h: 297 },
        letter: { w: 215.9, h: 279.4 },
        legal: { w: 215.9, h: 355.6 },
      };

      // Create PDF document
      // We initialize with 'a4' portrait, we can change size per page dynamically
      const doc = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: pageSize === "auto" ? "a4" : pageSize,
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // If not first page, add a new page
        if (i > 0) {
          doc.addPage(
            pageSize === "auto" ? [item.w * 0.264583, item.h * 0.264583] : pageSize,
            orientation
          );
        } else if (pageSize === "auto") {
          // If first page is auto, set its size (px * 0.264583 = mm)
          doc.setPage(1);
          doc.deletePage(1);
          doc.addPage([item.w * 0.264583, item.h * 0.264583], orientation);
        }

        // Current Page Dimensions
        let pw = doc.internal.pageSize.getWidth();
        let ph = doc.internal.pageSize.getHeight();

        // Target drawing box after margin
        const mx = margin;
        const my = margin;
        const targetW = pw - mx * 2;
        const targetH = ph - my * 2;

        if (targetW > 0 && targetH > 0) {
          // Image size
          const iw = item.w;
          const ih = item.h;

          let dw = targetW;
          let dh = targetH;
          let dx = mx;
          let dy = my;

          const sImage = iw / ih;
          const sTarget = targetW / targetH;

          if (fitMode === "contain") {
            if (sImage > sTarget) {
              // fit to width
              dw = targetW;
              dh = targetW / sImage;
              dy = my + (targetH - dh) / 2;
            } else {
              // fit to height
              dh = targetH;
              dw = targetH * sImage;
              dx = mx + (targetW - dw) / 2;
            }
          } else if (fitMode === "cover") {
            if (sImage > sTarget) {
              dh = targetH;
              dw = targetH * sImage;
              dx = mx + (targetW - dw) / 2; // will clip sides
            } else {
              dw = targetW;
              dh = targetW / sImage;
              dy = my + (targetH - dh) / 2; // will clip top/bottom
            }
          } else if (fitMode === "fitw") {
            dw = targetW;
            dh = targetW / sImage;
            dy = my;
          } else if (fitMode === "fith") {
            dh = targetH;
            dw = targetH * sImage;
            dx = mx;
          }

          // Convert image data to base64 jpeg
          const canvas = document.createElement("canvas");
          canvas.width = item.w;
          canvas.height = item.h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, item.w, item.h);
            ctx.drawImage(item.img, 0, 0);
          }
          const jpegData = canvas.toDataURL("image/jpeg", quality);

          // Add to PDF
          doc.addImage(jpegData, "JPEG", dx, dy, dw, dh, undefined, "FAST");
        }

        setProgress(Math.round(((i + 1) / items.length) * 100));
        // Small delay for UI updates
        await new Promise((r) => setTimeout(r, 50));
      }

      doc.save("images_to_pdf.pdf");
      setStatus("PDF packaged successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + err.message);
      alert("Failed to generate PDF: " + err.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [items]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="PDF download initiated!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <FileUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Image to PDF Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Multi-image compiler V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGeneratePdf}
            disabled={items.length === 0 || isProcessing}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            {isProcessing ? `Packing (${progress}%)` : "Convert to PDF"}
          </button>
          <button
            onClick={handleClear}
            disabled={items.length === 0}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 rounded-xl transition-all border border-white/10 disabled:opacity-50 disabled:pointer-events-none"
            title="Clear Queue"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        {items.length === 0 ? (
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
              Select or Drop image files to combine
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports JPG, PNG, and WEBP formats. Reorder pages after loading.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
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
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">PDF Options</h4>
              </div>

              {/* Page Size Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                >
                  <option value="a4">A4 (210 × 297mm)</option>
                  <option value="letter">Letter (8.5 × 11in)</option>
                  <option value="legal">Legal (8.5 × 14in)</option>
                  <option value="auto">Auto (Match Image Ratio)</option>
                </select>
              </div>

              {/* Orientation (only if not Auto) */}
              {pageSize !== "auto" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                  >
                    <option value="p">Portrait (Vertical)</option>
                    <option value="l">Landscape (Horizontal)</option>
                  </select>
                </div>
              )}

              {/* Margin */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                  <span>Margin Size</span>
                  <span className="font-mono text-lumora-highlight">{margin} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lumora-highlight"
                />
              </div>

              {/* Fit Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Image Placement Fit</label>
                <select
                  value={fitMode}
                  onChange={(e) => setFitMode(e.target.value as any)}
                  className="w-full bg-lumora-bg/85 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/80 focus:outline-none"
                >
                  <option value="contain">Contain (Full Image Visible, Margins Padded)</option>
                  <option value="cover">Cover (No Margins, Image May Be Clipped)</option>
                  <option value="fitw">Fit Width (Scale to Fit Horizontal margins)</option>
                  <option value="fith">Fit Height (Scale to Fit Vertical margins)</option>
                </select>
              </div>

              {/* JPG quality (for conversion inside PDF) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                  <span>Export Quality (JPG)</span>
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

              {/* Action helper */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-auto py-2.5 border border-dashed border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors bg-white/[0.01]"
              >
                + Add More Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                }}
                className="hidden"
              />
            </div>

            {/* Visual Queue (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ListOrdered className="h-4 w-4 text-lumora-blue" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Page Sequence Queue ({items.length})</h4>
              </div>

              {/* Grid lists of pages */}
              <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 flex flex-col gap-2 no-scrollbar">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 bg-lumora-bg/40 border p-3 rounded-xl transition-all cursor-grab ${
                      dragIndex === index
                        ? "border-lumora-highlight/50 bg-lumora-highlight/5 opacity-50"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Index Badge */}
                    <div className="h-5 w-5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-white/40 flex items-center justify-center">
                      #{index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      <img src={item.url} alt="Thumbnail" className="object-cover h-full w-full" />
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate" title={item.file.name}>
                        {item.file.name}
                      </div>
                      <div className="text-[10px] text-white/30 font-mono">
                        {item.w} × {item.h}px · {Math.round((item.file.size / 1024) * 100) / 100} KB
                      </div>
                    </div>

                    {/* Up / Down Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        className="p-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none rounded text-white/60 hover:text-white transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 1)}
                        disabled={index === items.length - 1}
                        className="p-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none rounded text-white/60 hover:text-white transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded transition-colors"
                        title="Remove Page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <span className="text-[9px] text-white/30 font-display font-bold uppercase tracking-widest text-center mt-2">
                💡 Hint: Drag and drop rows up and down to change PDF page ordering.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <FileUp className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
