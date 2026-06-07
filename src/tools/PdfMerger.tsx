import React, { useState, useRef, useEffect } from "react";
import Toast from "../components/Toast";
import { Files, Trash2, Download, UploadCloud, ArrowUp, ArrowDown, ListOrdered, Settings, RefreshCw } from "lucide-react";

interface PdfFileItem {
  id: string;
  file: File;
  size: number;
}

export default function PdfMerger() {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [status, setStatus] = useState("Loading PDF-Lib compilation engine...");
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Failed to load script " + src));
      document.head.appendChild(s);
    });
  };

  useEffect(() => {
    const w = window as any;
    if (w.PDFLib) {
      setIsLibLoaded(true);
      setStatus("PDF-Lib compilation engine loaded. Ready.");
      return;
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js")
      .then(() => {
        setIsLibLoaded(true);
        setStatus("PDF-Lib compilation engine loaded. Ready.");
      })
      .catch((err) => {
        console.error(err);
        setStatus("Failed to load PDF compilation engines. Check internet connections.");
      });
  }, []);

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

  const handleFiles = (files: FileList) => {
    const pdfFiles = Array.from(files).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      alert("Only PDF files are supported.");
      return;
    }

    const newItems = pdfFiles.map((file) => ({
      id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      size: file.size,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setStatus(`Added ${newItems.length} documents to merge queue.`);
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
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleClear = () => {
    setItems([]);
    setStatus("Queue cleared. Ready for new files.");
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

  const handleMerge = async () => {
    if (items.length < 2) return;
    setIsProcessing(true);
    setStatus("Merging PDF documents...");

    try {
      const w = window as any;
      if (!w.PDFLib) throw new Error("PDFLib compilation engine not loaded.");

      const { PDFDocument } = w.PDFLib;
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setStatus(`Importing document ${i + 1} of ${items.length}: ${item.file.name}...`);
        
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => mergedPdf.addPage(page));
      }

      setStatus("Rendering merged file byte arrays...");
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_documents.pdf";
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setStatus("PDF merge completed successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Merge error: " + err.message);
      alert("Merging failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBytes = items.reduce((acc, item) => acc + item.size, 0);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="PDF merge downloaded!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <Files className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">PDF Merger</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Local PDF Compiler V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMerge}
            disabled={items.length < 2 || isProcessing || !isLibLoaded}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            Merge Documents
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
        {!isLibLoaded ? (
          <div className="flex-1 min-h-[300px] border border-white/5 bg-lumora-bg/40 rounded-[24px] flex flex-col items-center justify-center p-8 text-center text-lumora-sub gap-3">
            <RefreshCw className="h-10 w-10 text-lumora-highlight animate-spin" />
            <h4 className="text-white font-display font-bold text-base">Loading PDF Merge Engine...</h4>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              We are fetching PDF-Lib script structures. Pages will be compiled completely locally inside your browser sandbox.
            </p>
          </div>
        ) : items.length === 0 ? (
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
              Select or Drop PDF files to combine
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports standard PDF documents. Requires at least 2 files.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
            {/* Stats Info Panel (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Merge Statistics</h4>
              </div>

              <div className="bg-lumora-bg/40 rounded-2xl border border-white/5 p-6 text-center flex-1 flex flex-col justify-center">
                <div className="h-12 w-12 bg-lumora-highlight/10 text-lumora-highlight rounded-2xl flex items-center justify-center mx-auto mb-4 border border-lumora-highlight/10">
                  <Files className="h-6 w-6" />
                </div>
                <h5 className="text-white font-display font-bold text-base mb-2">Ready to Merge</h5>
                <p className="text-xs text-lumora-sub leading-relaxed max-w-[200px] mx-auto">
                  You have placed {items.length} files in the compilation queue.
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2 text-[11px] font-mono text-lumora-sub">
                <div className="flex justify-between">
                  <span>Number of files:</span>
                  <span className="text-white">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Combined File Size:</span>
                  <span className="text-white">{fmtBytes(totalBytes)}</span>
                </div>
              </div>
            </div>

            {/* Visual Queue Panel (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ListOrdered className="h-4 w-4 text-lumora-blue" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Merge Queue ({items.length})</h4>
              </div>

              {/* Scrollable list */}
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
                    <div className="h-5 w-5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-white/40 flex items-center justify-center shrink-0">
                      #{index + 1}
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate" title={item.file.name}>
                        {item.file.name}
                      </div>
                      <div className="text-[10px] text-white/30 font-mono">
                        {fmtBytes(item.size)}
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
                        title="Remove Document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add button inside list */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 border border-dashed border-white/5 hover:border-white/15 text-lumora-highlight text-xs font-display font-bold uppercase tracking-wider transition-colors rounded-xl bg-white/[0.01]"
              >
                + Add More PDF Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                }}
                className="hidden"
              />

              <span className="text-[9px] text-white/30 font-display font-bold uppercase tracking-widest text-center mt-1">
                💡 Drag items up and down to change the PDF merging sequence.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Files className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
