import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Toast from "../components/Toast";
import { 
  Paintbrush, 
  Plus, 
  Minus, 
  Copy, 
  RefreshCw, 
  ChevronRight,
  MoveHorizontal,
  Settings2,
  Trash2
} from "lucide-react";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function VectorLabGradients() {
  const [stops, setStops] = useState<ColorStop[]>([
    { id: "1", color: "#6366f1", position: 0 },
    { id: "2", color: "#ec4899", position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [showToast, setShowToast] = useState(false);

  const gradientString = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  }, [stops, angle]);

  const handleAddStop = () => {
    if (stops.length >= 5) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const newColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setStops([...stops, { id: newId, color: newColor, position: 50 }]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (id: string, updates: Partial<ColorStop>) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(`background: ${gradientString};`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleRandomize = () => {
    const newStops = stops.map(s => ({
      ...s,
      color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    }));
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  const PRESETS = [
    { name: "Hyper Blue", stops: [{ id: "1", color: "#2563eb", position: 0 }, { id: "2", color: "#9333ea", position: 100 }], angle: 135 },
    { name: "Sunset", stops: [{ id: "1", color: "#f97316", position: 0 }, { id: "2", color: "#be185d", position: 100 }], angle: 45 },
    { name: "Forest", stops: [{ id: "1", color: "#10b981", position: 0 }, { id: "2", color: "#065f46", position: 100 }], angle: 180 },
    { name: "Midnight", stops: [{ id: "1", color: "#0f172a", position: 0 }, { id: "2", color: "#334155", position: 100 }], angle: 225 },
    { name: "Neon", stops: [{ id: "1", color: "#00f2fe", position: 0 }, { id: "2", color: "#4facfe", position: 100 }], angle: 90 },
    { name: "Lava", stops: [{ id: "1", color: "#f83600", position: 0 }, { id: "2", color: "#f9d423", position: 100 }], angle: 315 },
  ];

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setStops(preset.stops);
    setAngle(preset.angle);
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
            <Paintbrush className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Gradient Composer</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">Vector Lab V2.4</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all border border-white/10"
            title="Randomize"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <motion.button
            onClick={handleCopyCss}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-white text-black text-[11px] font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy CSS
          </motion.button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
        {/* Preview Area */}
        <div className="lg:col-span-7 h-full flex flex-col gap-3">
          <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2 px-2">
            <MoveHorizontal className="h-3 w-3" /> Visual Laboratory
          </span>
          <div 
            className="flex-1 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative group"
            style={{ background: gradientString }}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
               <code className="text-[10px] font-mono text-white/70 truncate mr-4">{gradientString}</code>
               <Settings2 className="h-4 w-4 text-white/40" />
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="lg:col-span-5 h-full flex flex-col gap-3">
          <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest flex items-center gap-2 px-2">
            <Settings2 className="h-3 w-3" /> Composition Controls
          </span>
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col gap-6 overflow-hidden">
            
            {/* Presets Gallery */}
            <div className="space-y-3">
              <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest">Popular Presets</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="shrink-0 h-10 w-10 rounded-xl border border-white/10 hover:border-white/30 transition-all overflow-hidden relative group"
                    title={p.name}
                    style={{ 
                      background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.position}%`).join(", ")})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest">Rotation Angle</label>
                <span className="text-[13px] font-mono font-bold text-lumora-highlight">{angle}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={angle} 
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-lumora-highlight"
              />
            </div>

            {/* Color Stops */}
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-display font-bold text-white/40 uppercase tracking-widest">Color Nodes</label>
                <button 
                  onClick={handleAddStop}
                  disabled={stops.length >= 5}
                  className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all disabled:opacity-20"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {stops.map((stop, idx) => (
                    <motion.div 
                      key={stop.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex items-center gap-4 p-3 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-white/20 transition-all"
                    >
                      <div className="relative h-10 w-10 shrink-0">
                        <input 
                          type="color" 
                          value={stop.color} 
                          onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div 
                          className="h-full w-full rounded-xl border border-white/10" 
                          style={{ backgroundColor: stop.color }}
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-white/80 uppercase">{stop.color}</span>
                          <span className="text-[10px] font-mono text-white/20">{stop.position}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={stop.position} 
                          onChange={(e) => updateStop(stop.id, { position: parseInt(e.target.value) })}
                          className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white/20"
                        />
                      </div>

                      {stops.length > 2 && (
                        <button 
                          onClick={() => handleRemoveStop(stop.id)}
                          className="h-8 w-8 rounded-lg bg-white/0 hover:bg-red-500/10 text-white/0 group-hover:text-white/20 hover:text-red-400 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.01] border border-white/5 rounded-2xl">
        <ChevronRight className="h-3.5 w-3.5 text-lumora-highlight" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Exporting production-ready CSS linear-gradient. GPU Accelerated.
        </p>
      </div>
    </div>
  );
}
