import React, { useState, useEffect, useRef } from "react";
import Toast from "../components/Toast";
import bwipjs from "bwip-js";
import jsPDF from "jspdf";
import {
  ScanBarcode,
  Copy,
  Download,
  Printer,
  Sparkles,
  Grid,
  FileCode,
  ShieldCheck,
  AlertCircle,
  Settings2,
  FileSpreadsheet,
  PackageCheck
} from "lucide-react";

// Barcode symbology definition
interface SymbologyOption {
  id: string;
  name: string;
  category: "Logistics" | "2D Matrix" | "Retail" | "Industrial";
  defaultText: string;
  description: string;
  validate?: (text: string) => string | null;
}

const SYMBOLOGY_OPTIONS: SymbologyOption[] = [
  {
    id: "code128",
    name: "Code 128",
    category: "Logistics",
    defaultText: "LMR-LOGI-88492",
    description: "Standard high-density barcode for shipping labels, SSCC, & tracking IDs.",
  },
  {
    id: "code39",
    name: "Code 39",
    category: "Logistics",
    defaultText: "SHELF-A01-04",
    description: "Alphanumeric barcode widely used for warehouse bin tags & asset management.",
  },
  {
    id: "itf14",
    name: "ITF-14",
    category: "Logistics",
    defaultText: "10012345678902",
    description: "Interleaved 2 of 5 with bearer bars for outer carton / master case packaging.",
    validate: (t) => (/^\d{14}$/.test(t) ? null : "ITF-14 requires exactly 14 numeric digits."),
  },
  {
    id: "datamatrix",
    name: "Data Matrix",
    category: "2D Matrix",
    defaultText: "SN-2026-X88902-B",
    description: "Compact 2D matrix ideal for small electronics, equipment tags, & medicine.",
  },
  {
    id: "qrcode",
    name: "QR Code",
    category: "2D Matrix",
    defaultText: "https://lumora.tools",
    description: "High-capacity matrix code for URLs, warehouse asset inspection, & location routing.",
  },
  {
    id: "ean13",
    name: "EAN-13",
    category: "Retail",
    defaultText: "8801234567896",
    description: "13-digit standard GTIN barcode for international retail packaging.",
    validate: (t) => (/^\d{12,13}$/.test(t) ? null : "EAN-13 requires 12 or 13 numeric digits."),
  },
  {
    id: "upca",
    name: "UPC-A",
    category: "Retail",
    defaultText: "012345678905",
    description: "12-digit standard retail barcode used across North America.",
    validate: (t) => (/^\d{11,12}$/.test(t) ? null : "UPC-A requires 11 or 12 numeric digits."),
  },
  {
    id: "codabar",
    name: "Codabar",
    category: "Industrial",
    defaultText: "A12345678B",
    description: "Self-checking barcode for libraries, courier express bags, & blood banks.",
  },
];

// Presets for quick logistics setup
interface PresetOption {
  name: string;
  symbology: string;
  header: string;
  code: string;
  description: string;
}

const PRESETS: PresetOption[] = [
  {
    name: "Warehouse Bin Tag",
    symbology: "code39",
    header: "ZONE A / RACK 04",
    code: "LOC-A04-12",
    description: "Shelf location label with bold header text.",
  },
  {
    name: "Master Carton (ITF-14)",
    symbology: "itf14",
    header: "CASE PACK 24 PCS",
    code: "10012345678902",
    description: "Outer box packaging barcode with protective borders.",
  },
  {
    name: "Shipping Package",
    symbology: "code128",
    header: "EXPRESS OVERNIGHT",
    code: "TRK-98420119-KR",
    description: "Standard Code 128 shipping tracking code.",
  },
  {
    name: "Asset / Device Tag",
    symbology: "datamatrix",
    header: "PROPERTY OF LOGISTICS",
    code: "EQP-SCANNER-991",
    description: "High-density 2D tag for equipment tracking.",
  },
];

export default function BarcodeStudio() {
  const [activeTab, setActiveTab] = useState<"single" | "batch" | "labelsheet">("single");
  const [symbology, setSymbology] = useState<string>("code128");
  const [codeText, setCodeText] = useState<string>("LMR-LOGI-88492");
  const [labelText, setLabelText] = useState<string>("WAREHOUSE PALLET #04");
  const [showHumanReadable, setShowHumanReadable] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(25);
  const [scale, setScale] = useState<number>(3);
  const [barColor, setBarColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [isTransparentBg, setIsTransparentBg] = useState<boolean>(false);
  const [rotation, setRotation] = useState<"N" | "R" | "L" | "I">("N");
  
  // Batch Mode States
  const [batchInput, setBatchInput] = useState<string>(
    "LOC-A01-01\nLOC-A01-02\nLOC-A01-03\nLOC-A01-04\nLOC-A01-05"
  );
  
  // Label Sheet Layout Options
  const [sheetGrid, setSheetGrid] = useState<"2x7" | "3x8" | "4x10">("3x8");
  const [sheetPaper, setSheetPaper] = useState<"a4" | "thermal">("a4");

  // Error & Toast State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  // Render Barcode on Canvas
  useEffect(() => {
    if (activeTab !== "single") return;
    if (!canvasRef.current) return;

    const currentSymbology = SYMBOLOGY_OPTIONS.find((s) => s.id === symbology);
    if (currentSymbology?.validate) {
      const err = currentSymbology.validate(codeText);
      if (err) {
        setErrorMsg(err);
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        return;
      }
    }
    setErrorMsg(null);

    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: symbology,
        text: codeText.trim(),
        scale: scale,
        height: height,
        includetext: showHumanReadable,
        textxalign: "center",
        textsize: 10,
        barcolor: barColor.replace("#", ""),
        backgroundcolor: isTransparentBg ? undefined : bgColor.replace("#", ""),
        rotate: rotation,
      });
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to render barcode. Please check your text format.");
    }
  }, [
    activeTab,
    symbology,
    codeText,
    showHumanReadable,
    height,
    scale,
    barColor,
    bgColor,
    isTransparentBg,
    rotation,
  ]);

  // Copy PNG image to clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current || errorMsg) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        triggerToast("Barcode copied to clipboard!");
      });
    } catch (err) {
      triggerToast("Clipboard copy not supported in this browser.");
    }
  };

  // Download PNG file
  const handleDownloadPNG = () => {
    if (!canvasRef.current || errorMsg) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode_${symbology}_${codeText.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    link.click();
    triggerToast("PNG file downloaded!");
  };

  // Download SVG vector file
  const handleDownloadSVG = () => {
    if (errorMsg) return;
    try {
      const svgStr = (bwipjs as any).toSVG({
        bcid: symbology,
        text: codeText.trim(),
        scale: scale,
        height: height,
        includetext: showHumanReadable,
        textxalign: "center",
        barcolor: barColor.replace("#", ""),
        backgroundcolor: isTransparentBg ? undefined : bgColor.replace("#", ""),
        rotate: rotation,
      });

      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `barcode_${symbology}_${codeText.replace(/[^a-zA-Z0-9]/g, "_")}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      triggerToast("Vector SVG downloaded!");
    } catch (e: any) {
      setErrorMsg("Failed to generate SVG.");
    }
  };

  // Apply Preset
  const applyPreset = (preset: PresetOption) => {
    setSymbology(preset.symbology);
    setCodeText(preset.code);
    setLabelText(preset.header);
    triggerToast(`Applied "${preset.name}" preset`);
  };

  // Export PDF Label Sheet
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: sheetPaper === "a4" ? "a4" : [101.6, 152.4], // 4x6 inches in mm
      });

      const items = activeTab === "batch"
        ? batchInput.split("\n").map((line) => line.trim()).filter(Boolean)
        : Array(sheetGrid === "2x7" ? 14 : sheetGrid === "3x8" ? 24 : 40).fill(codeText);

      if (items.length === 0) {
        triggerToast("No items to print.");
        return;
      }

      if (sheetPaper === "thermal") {
        // Single 4x6 Thermal Label
        items.forEach((item, index) => {
          if (index > 0) doc.addPage([101.6, 152.4], "portrait");
          const tempCanvas = document.createElement("canvas");
          bwipjs.toCanvas(tempCanvas, {
            bcid: symbology,
            text: item,
            scale: 4,
            height: 25,
            includetext: showHumanReadable,
            textxalign: "center",
          });
          const imgData = tempCanvas.toDataURL("image/png");
          
          if (labelText) {
            doc.setFontSize(14);
            doc.text(labelText, 50.8, 20, { align: "center" });
          }
          doc.addImage(imgData, "PNG", 15, 35, 71.6, 45);
          doc.setFontSize(10);
          doc.text(`Item ${index + 1} of ${items.length}`, 50.8, 140, { align: "center" });
        });
      } else {
        // A4 Grid Layout
        let cols = 3;
        let rows = 8;
        if (sheetGrid === "2x7") { cols = 2; rows = 7; }
        if (sheetGrid === "4x10") { cols = 4; rows = 10; }

        const cellWidth = 190 / cols;
        const cellHeight = 270 / rows;
        const marginX = 10;
        const marginY = 10;

        items.forEach((item, index) => {
          const pageIndex = Math.floor(index / (cols * rows));
          const posInPage = index % (cols * rows);

          if (posInPage === 0 && pageIndex > 0) {
            doc.addPage("a4", "portrait");
          }

          const col = posInPage % cols;
          const row = Math.floor(posInPage / cols);

          const x = marginX + col * cellWidth;
          const y = marginY + row * cellHeight;

          // Draw cell border guideline
          doc.setDrawColor(220, 220, 220);
          doc.rect(x, y, cellWidth, cellHeight);

          try {
            const tempCanvas = document.createElement("canvas");
            bwipjs.toCanvas(tempCanvas, {
              bcid: symbology,
              text: item,
              scale: 3,
              height: 15,
              includetext: showHumanReadable,
              textxalign: "center",
            });
            const imgData = tempCanvas.toDataURL("image/png");

            if (labelText) {
              doc.setFontSize(7);
              doc.text(labelText, x + cellWidth / 2, y + 5, { align: "center" });
            }
            doc.addImage(imgData, "PNG", x + 3, y + (labelText ? 7 : 4), cellWidth - 6, cellHeight - 12);
          } catch (e) {
            // skip invalid code
          }
        });
      }

      doc.save(`barcodes_sheet_${symbology}_${Date.now()}.pdf`);
      triggerToast("PDF Label Sheet downloaded!");
    } catch (e: any) {
      triggerToast("Failed to generate PDF sheet.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast isVisible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-2 text-xs font-display font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "single"
                ? "bg-lumora-highlight text-white shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <ScanBarcode className="h-3.5 w-3.5" />
            Single Generator
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-4 py-2 text-xs font-display font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "batch"
                ? "bg-lumora-highlight text-white shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Batch Mode
          </button>
          <button
            onClick={() => setActiveTab("labelsheet")}
            className={`px-4 py-2 text-xs font-display font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "labelsheet"
                ? "bg-lumora-highlight text-white shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            Print Label Sheet
          </button>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === "single" && (
            <>
              <button
                onClick={handleCopyImage}
                disabled={!!errorMsg}
                className="px-4 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-40 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy PNG
              </button>
              <button
                onClick={handleDownloadPNG}
                disabled={!!errorMsg}
                className="px-4 py-2 bg-lumora-highlight/20 text-lumora-highlight hover:bg-lumora-highlight/30 disabled:opacity-40 border border-lumora-highlight/30 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </button>
              <button
                onClick={handleDownloadSVG}
                disabled={!!errorMsg}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all border border-white/10 cursor-pointer"
                title="Download Vector SVG"
              >
                <FileCode className="h-4 w-4" />
              </button>
            </>
          )}

          {(activeTab === "batch" || activeTab === "labelsheet") && (
            <button
              onClick={handleExportPDF}
              className="px-5 py-2 bg-white text-black hover:bg-white/90 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Export PDF Print Sheet
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
        {/* Left Control Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-lumora-highlight" />
              <h4 className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40">
                Logistics Presets
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lumora-highlight/40 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <p className="text-[11px] font-display font-bold text-white group-hover:text-lumora-highlight transition-colors">
                    {p.name}
                  </p>
                  <p className="text-[9px] text-white/30 truncate">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Symbology Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                Barcode Symbology
              </label>
              <select
                value={symbology}
                onChange={(e) => {
                  const selected = SYMBOLOGY_OPTIONS.find((s) => s.id === e.target.value);
                  setSymbology(e.target.value);
                  if (selected) setCodeText(selected.defaultText);
                }}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-lumora-highlight/50 transition-all cursor-pointer"
              >
                {SYMBOLOGY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Input Data depending on tab */}
            {activeTab === "single" ? (
              <>
                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                    Barcode Data / Code Text
                  </label>
                  <input
                    type="text"
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}
                    placeholder="Enter barcode string..."
                    className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-lumora-highlight/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                    Label Header / Location Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    placeholder="e.g. WAREHOUSE BIN A-04"
                    className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-lumora-highlight/50 transition-all"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                  Batch Code List (One barcode per line)
                </label>
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  rows={5}
                  placeholder="LOC-A01-01&#10;LOC-A01-02&#10;LOC-A01-03"
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-lumora-highlight/50 transition-all resize-none"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Barcode Style Customizations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Visual Options
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHumanReadable}
                  onChange={(e) => setShowHumanReadable(e.target.checked)}
                  className="rounded border-white/20 bg-[#0a0a0c] text-lumora-highlight focus:ring-0"
                />
                <span className="text-[10px] font-display font-bold text-white/60 uppercase tracking-widest">
                  Show Text
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] font-display text-white/40 mb-1">
                  <span>Bar Height</span>
                  <span>{height}mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-lumora-highlight bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-display text-white/40 mb-1">
                  <span>Bar Scale</span>
                  <span>{scale}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-lumora-highlight bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={barColor}
                  onChange={(e) => setBarColor(e.target.value)}
                  className="h-7 w-7 rounded-lg bg-transparent cursor-pointer border border-white/20"
                />
                <span className="text-[10px] font-mono text-white/50 uppercase">Bar: {barColor}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  disabled={isTransparentBg}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-7 w-7 rounded-lg bg-transparent cursor-pointer border border-white/20 disabled:opacity-20"
                />
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTransparentBg}
                    onChange={(e) => setIsTransparentBg(e.target.checked)}
                    className="rounded border-white/20 bg-[#0a0a0c] text-lumora-highlight"
                  />
                  <span className="text-[10px] font-display text-white/50 uppercase">Transparent</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Pane (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {activeTab === "single" && (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0c] border border-white/5 rounded-[24px] p-8 relative overflow-hidden group min-h-[380px]">
              {/* Background grid visual effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

              {/* Label Header Preview */}
              {labelText && !errorMsg && (
                <div className="mb-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-center">
                  <span className="text-xs font-mono font-bold text-lumora-highlight uppercase tracking-wider">
                    {labelText}
                  </span>
                </div>
              )}

              {/* Canvas Barcode Container */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${
                  isTransparentBg ? "bg-white/5 border border-white/10" : "bg-white shadow-2xl"
                }`}
              >
                <canvas ref={canvasRef} className="max-w-full h-auto" />
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="mt-6 px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-center flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-mono">{errorMsg}</p>
                </div>
              )}

              {/* Specs Badge */}
              {!errorMsg && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-white/30">
                  <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                    TYPE: {symbology.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                    SCALE: {scale}X
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                    HEIGHT: {height}MM
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === "batch" && (
            <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-[24px] p-6 overflow-auto max-h-[460px] no-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">
                  Batch Generated List ({batchInput.split("\n").filter(Boolean).length} items)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batchInput
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((item, idx) => (
                    <BatchItemCard
                      key={idx}
                      codeText={item}
                      symbology={symbology}
                      showText={showHumanReadable}
                    />
                  ))}
              </div>
            </div>
          )}

          {activeTab === "labelsheet" && (
            <div className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Grid className="h-4 w-4 text-lumora-highlight" />
                  Printable PDF Sheet Configurator
                </h4>
                <p className="text-xs text-white/40 font-medium leading-relaxed mb-6">
                  Generate print-ready PDF sticker sheets designed for standard A4 adhesive labels or 4x6 inch thermal shipping printers.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                      Target Paper Size
                    </label>
                    <select
                      value={sheetPaper}
                      onChange={(e: any) => setSheetPaper(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-display text-white focus:outline-none"
                    >
                      <option value="a4">Standard A4 Sheet (210 x 297 mm)</option>
                      <option value="thermal">4x6 Thermal Roll (101.6 x 152.4 mm)</option>
                    </select>
                  </div>

                  {sheetPaper === "a4" && (
                    <div>
                      <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-2 block">
                        A4 Sticker Grid Layout
                      </label>
                      <select
                        value={sheetGrid}
                        onChange={(e: any) => setSheetGrid(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-display text-white focus:outline-none"
                      >
                        <option value="2x7">2 x 7 Grid (14 Labels / Page)</option>
                        <option value="3x8">3 x 8 Grid (24 Labels / Page)</option>
                        <option value="4x10">4 x 10 Grid (40 Labels / Page)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-lumora-highlight/10 border border-lumora-highlight/20 rounded-2xl flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-lumora-highlight shrink-0" />
                <p className="text-[11px] text-white/80 font-medium">
                  Ready to print! Click <span className="font-bold text-white">"Export PDF Print Sheet"</span> in the top bar to generate your PDF document.
                </p>
              </div>
            </div>
          )}

          {/* Legal / Usage Guidance Notice Card */}
          <div className="px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <p className="text-[10px] text-white/50 font-medium leading-normal">
              <strong className="text-white/80 font-bold">100% Royalty-Free:</strong> Safe and open for internal warehouse logistics, inventory tags, & commercial operations. For official retail POS products (EAN-13 / UPC), ensure numbers use your registered GS1 company prefix.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <ScanBarcode className="h-3.5 w-3.5 text-lumora-highlight" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Local-first processing. Your data never leaves your browser. Zero Ads.
        </p>
      </div>
    </div>
  );
}

// Subcomponent for Batch Mode Card Rendering
function BatchItemCard({
  codeText,
  symbology,
  showText,
}: {
  key?: React.Key | null;
  codeText: string;
  symbology: string;
  showText: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: symbology,
        text: codeText,
        scale: 2,
        height: 15,
        includetext: showText,
        textxalign: "center",
      });
      setError(false);
    } catch (e) {
      setError(true);
    }
  }, [codeText, symbology, showText]);

  return (
    <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center min-h-[90px] shadow-sm">
      {error ? (
        <span className="text-[10px] font-mono text-red-500">Invalid barcode text</span>
      ) : (
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      )}
    </div>
  );
}
