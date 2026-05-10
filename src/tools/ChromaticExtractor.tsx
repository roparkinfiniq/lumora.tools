import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Toast from "../components/Toast";
import { 
  Upload, 
  Palette, 
  Copy, 
  Check, 
  Trash2, 
  Image as ImageIcon,
  Zap,
  Info
} from "lucide-react";

export default function ChromaticExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColors = (imgUrl: string) => {
    // ... (rest of extractColors logic remains unchanged)
    setIsAnalyzing(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colors: { [key: string]: number } = {};

      for (let i = 0; i < imageData.length; i += 20) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = rgbToHex(r, g, b);
        colors[hex] = (colors[hex] || 0) + 1;
      }

      const sortedColors = Object.entries(colors)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color);

      const result: string[] = [];
      for (const color of sortedColors) {
        if (result.length >= 8) break;
        if (!result.some(c => colorDistance(c, color) < 40)) {
          result.push(color);
        }
      }

      setPalette(result);
      setIsAnalyzing(false);
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  const colorDistance = (c1: string, c2: string) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    const r1 = hexToRgb(c1);
    const r2 = hexToRgb(c2);
    return Math.sqrt(
      Math.pow(r1.r - r2.r, 2) +
      Math.pow(r1.g - r2.g, 2) +
      Math.pow(r1.b - r2.b, 2)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImage(url);
        extractColors(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setImage(null);
    setPalette([]);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Toast 
        isVisible={showToast} 
        message="복사되었습니다" 
        onClose={() => setShowToast(false)} 
      />
      {/* Tool Header/Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Palette Extractor</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Image Analysis V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {image && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center gap-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2 bg-white text-black hover:bg-white/90 text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
        {/* Image Preview Area */}
        <div className="lg:col-span-7 h-full flex flex-col gap-3">
          <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2 px-2">
            <ImageIcon className="h-3 w-3" /> Visual Context
          </span>
          <div 
            className={`flex-1 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative group bg-[#0a0a0c] ${
              image ? 'border-transparent' : 'border-white/5 hover:border-white/10 cursor-pointer'
            }`}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-12">
                <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7 text-white/20" />
                </div>
                <p className="text-white/40 text-xs font-display font-bold uppercase tracking-widest leading-relaxed">
                  Drop your image here <br /> or click to browse
                </p>
              </div>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <Zap className="h-10 w-10 text-lumora-highlight animate-pulse mb-4" />
                <span className="text-xs font-display font-bold text-white uppercase tracking-widest animate-pulse">Analyzing Pixels...</span>
              </div>
            )}
          </div>
        </div>

        {/* Palette Display Area */}
        <div className="lg:col-span-5 h-full flex flex-col gap-3">
          <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2 px-2">
            <Palette className="h-3 w-3" /> Extracted Palette
          </span>
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col gap-4">
            {palette.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 h-full overflow-y-auto no-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {palette.map((hex, idx) => (
                    <motion.button
                      key={hex + idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ 
                        opacity: { delay: idx * 0.05 },
                        x: { delay: idx * 0.05 },
                        scale: { duration: 0.1 }
                      }}
                      onClick={() => handleCopy(hex)}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-white/20 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-12 w-12 rounded-xl shadow-inner border border-white/10 group-hover:scale-105 transition-transform" 
                          style={{ backgroundColor: hex }}
                        />
                        <div>
                          <p className="text-[13px] font-mono font-bold text-white uppercase">{hex}</p>
                          <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">Click to copy</p>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Copy className="h-4 w-4 text-white/40" />
                      </motion.div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-8">
                <Palette className="h-12 w-12 mb-4" />
                <p className="text-xs font-display font-bold uppercase tracking-widest max-w-[150px]">Upload an image to extract colors</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <Info className="h-3.5 w-3.5 text-lumora-blue" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Extracting harmonious 8-bit identity from visual input. Local execution.
        </p>
      </div>
    </div>
  );
}
