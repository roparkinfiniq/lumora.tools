import { motion } from 'motion/react';
import { Tool } from '../types';
import { 
  ArrowLeft, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Activity,
  Copy,
  Download,
  Share2
} from 'lucide-react';

interface ToolDetailViewProps {
  tool: Tool;
  onBack: () => void;
}

export default function ToolDetailView({ tool, onBack }: ToolDetailViewProps) {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-16 px-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-xs font-display font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-display font-bold text-white/50 uppercase tracking-widest shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            Live Execution
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bento-card p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-lumora-highlight/10 text-lumora-highlight text-[10px] font-display font-bold uppercase tracking-widest mb-6">
              {tool.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4 md:mb-6 leading-tight">
              {tool.name}
            </h1>
            <p className="text-base text-lumora-sub font-medium leading-relaxed mb-10">
              {tool.description}
            </p>
            <div className="flex flex-col gap-4">
              <button className="w-full py-4 bg-white text-black font-display font-bold rounded-2xl transition-all hover:bg-white/90 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-lg">
                Start Playing
              </button>
              <div className="grid grid-cols-3 gap-3">
                <button className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                  <Copy className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
                <button className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                  <Download className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
                <button className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                  <Share2 className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          <div className="bento-card p-8 bg-white/[0.02]">
            <h4 className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest mb-8">Details</h4>
            <div className="space-y-6">
              {[
                { label: 'Speed', val: '0.2s', icon: Zap },
                { label: 'Platform', val: 'V3.2', icon: Settings2 },
                { label: 'Privacy', val: 'Safe', icon: ShieldCheck },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-white/40" />
                    </div>
                    <span className="text-[13px] text-white/60 font-medium tracking-wide">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-display font-bold text-white bg-white/5 px-3 py-1 rounded-full">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Area */}
        <div className="lg:col-span-8">
          <div className="bento-card aspect-[16/10] lg:aspect-auto lg:h-full min-h-[500px] flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden group">
            <div className="shimmer-effect absolute inset-0 opacity-20 pointer-events-none" />
            
            <div className="relative z-10 text-center space-y-10">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-[32px] bg-lumora-blue/10 border border-lumora-blue/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(186,230,253,0.2)]">
                <Activity className="h-10 w-10 text-lumora-blue group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-3">Tool Ready</h3>
                <p className="text-base text-lumora-sub font-medium max-w-sm mx-auto">This little helper is fully loaded and ready to go.</p>
              </div>
              <div className="max-w-[280px] mx-auto w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-lumora-blue shadow-[0_0_15px_rgba(186,230,253,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Technical Detail Overlays */}
            <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-white/5 text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
              Playground
            </div>
            <div className="absolute bottom-8 left-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
