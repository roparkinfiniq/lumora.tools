import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Toast from "../components/Toast";
import { FileImage, Trash2, Download, UploadCloud, HelpCircle, Layers } from "lucide-react";

export default function IcoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("Select a PNG/JPG image to start.");
  const [isHovered, setIsHovered] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizes = [16, 32, 48, 64];

  const handleFile = (f: File) => {
    if (!/^image\/(png|jpeg|jpg)$/i.test(f.type)) {
      alert("Only PNG and JPG images are supported.");
      return;
    }

    if (f.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB.");
      return;
    }

    setFile(f);
    setStatus("Image loaded. Click Convert to make ICO.");
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (icoUrl) URL.revokeObjectURL(icoUrl);
    setPreviewUrl(URL.createObjectURL(f));
    setIcoUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const drawToCanvas = (img: HTMLImageElement, size: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    
    ctx.clearRect(0, 0, size, size);

    const iw = img.width;
    const ih = img.height;
    
    // Contain logic (scale keeping aspect ratio, center on square canvas)
    const scale = Math.min(size / iw, size / ih);
    const nw = Math.round(iw * scale);
    const nh = Math.round(ih * scale);
    const dx = Math.floor((size - nw) / 2);
    const dy = Math.floor((size - nh) / 2);

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, nw, nh);
    return canvas;
  };

  const canvasToPNGAB = (cnv: HTMLCanvasElement): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      cnv.toBlob((b) => {
        if (!b) return reject(new Error("Canvas blob generation failed"));
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(b);
      }, "image/png");
    });
  };

  const buildICOFromPNGs = (buffers: ArrayBuffer[]): ArrayBuffer => {
    const count = buffers.length;
    const headerSize = 6 + 16 * count;
    let offset = headerSize;
    let totalSize = headerSize;
    for (const buf of buffers) totalSize += buf.byteLength;

    const out = new Uint8Array(totalSize);
    const dv = new DataView(out.buffer);

    // ICONHEADER
    dv.setUint16(0, 0, true); // Reserved
    dv.setUint16(2, 1, true); // Type: 1 = ICO
    dv.setUint16(4, count, true); // Number of images

    // ICONDIRENTRY + Image Data
    let entryPos = 6;
    for (let i = 0; i < count; i++) {
      const ab = buffers[i];
      const view = new Uint8Array(ab);
      const imgSize = view.byteLength;
      const imgSizeDim = sizes[i];

      out[entryPos + 0] = imgSizeDim === 256 ? 0 : imgSizeDim; // Width
      out[entryPos + 1] = imgSizeDim === 256 ? 0 : imgSizeDim; // Height
      out[entryPos + 2] = 0; // Number of colors in palette (0 for PNG)
      out[entryPos + 3] = 0; // Reserved
      dv.setUint16(entryPos + 4, 1, true); // Color planes
      dv.setUint16(entryPos + 6, 32, true); // Bits per pixel
      dv.setUint32(entryPos + 8, imgSize, true); // Size of image data in bytes
      dv.setUint32(entryPos + 12, offset, true); // Offset of image data
      entryPos += 16;

      out.set(view, offset);
      offset += imgSize;
    }

    return out.buffer;
  };

  const handleConvert = async () => {
    if (!file || !previewUrl) return;
    setIsConverting(true);
    setStatus("Loading image resource...");

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image decoding failed"));
        img.src = previewUrl;
      });

      setStatus("Rendering resolution pages...");
      const pngABs: ArrayBuffer[] = [];
      for (const size of sizes) {
        const cnv = drawToCanvas(img, size);
        const ab = await canvasToPNGAB(cnv);
        pngABs.push(ab);
      }

      setStatus("Packaging ICO file structure...");
      const icoAB = buildICOFromPNGs(pngABs);
      const blob = new Blob([icoAB], { type: "image/x-icon" });

      if (icoUrl) URL.revokeObjectURL(icoUrl);
      const url = URL.createObjectURL(blob);
      setIcoUrl(url);

      setStatus("Completed! Download button is active.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + err.message);
      alert("ICO generation failed: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (icoUrl) URL.revokeObjectURL(icoUrl);
    setPreviewUrl(null);
    setIcoUrl(null);
    setStatus("Cleared. Ready for new image.");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (icoUrl) URL.revokeObjectURL(icoUrl);
    };
  }, [previewUrl, icoUrl]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast
        isVisible={showToast}
        message="ICO file packaging complete!"
        onClose={() => setShowToast(false)}
      />

      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <FileImage className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">PNG/JPG → ICO Converter</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Favicon Creator V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Layers className={`h-3.5 w-3.5 ${isConverting ? 'animate-pulse' : ''}`} />
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
              Select or Drop a square image
            </h4>
            <p className="text-xs text-white/30 max-w-xs">
              Supports PNG and JPG formats (max 2MB). Ideal aspect ratio is 1:1.
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
            {/* Input Preview Panel */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 mb-2">
                <FileImage className="h-4 w-4 text-lumora-highlight" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Source Image</h4>
              </div>

              <div className="flex-1 flex items-center justify-center bg-lumora-bg/40 border border-white/5 rounded-2xl p-4 min-h-[200px]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Original Preview"
                    className="max-h-[160px] max-w-full object-contain rounded-lg"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 text-xs text-lumora-sub font-mono">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="text-white max-w-[150px] truncate">{file.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="text-white">
                    {Math.round((file.size / 1024) * 100) / 100} KB
                  </span>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-[24px]">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-lumora-blue" />
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">ICO Output Pack</h4>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center bg-lumora-bg/40 border border-white/5 rounded-2xl p-4 min-h-[200px] text-center">
                {icoUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3 items-end p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                      {sizes.map((s) => (
                        <div key={s} className="flex flex-col items-center gap-1.5">
                          <div
                            className="bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:8px_8px] border border-white/5 rounded flex items-center justify-center overflow-hidden"
                            style={{ width: `${s + 8}px`, height: `${s + 8}px` }}
                          >
                            <img
                              src={previewUrl!}
                              alt={`${s}px preview`}
                              style={{ width: `${s}px`, height: `${s}px`, objectFit: "contain" }}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-white/30">{s}px</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={icoUrl}
                      download="favicon.ico"
                      className="px-6 py-3 bg-lumora-blue text-black hover:bg-white hover:shadow-lg transition-all rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Save favicon.ico
                    </a>
                  </div>
                ) : (
                  <div className="opacity-20 flex flex-col items-center gap-2">
                    <Layers className="h-10 w-10 text-white" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">
                      ICO packages will be shown here
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-lumora-blue/5 border border-lumora-blue/20 rounded-xl p-3 flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-lumora-blue shrink-0 mt-0.5" />
                <p className="text-[11px] text-lumora-blue/80 leading-relaxed">
                  The generated ICO file bundles 4 resolution layers. This allows browsers and systems to choose the crispest resolution size depending on whether it displays in a small tab or a shortcut shelf.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-lumora-highlight" />
          <span>Local-first processing. Your data never leaves your browser.</span>
        </div>
        <span>{status}</span>
      </div>
    </div>
  );
}
