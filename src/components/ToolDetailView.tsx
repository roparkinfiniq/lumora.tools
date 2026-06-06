import { motion } from 'motion/react';
import { Tool } from '../types';
import JsonStructure from '../tools/JsonStructure';
import MarkdownEther from '../tools/MarkdownEther';
import ChromaticExtractor from '../tools/ChromaticExtractor';
import VectorLabGradients from '../tools/VectorLabGradients';
import PdfStudio from '../tools/PdfStudio';
import WorkoutCanvas from '../tools/WorkoutCanvas';
import { 
  ArrowLeft, 
  Activity,
} from 'lucide-react';

interface ToolDetailViewProps {
  tool: Tool;
  onBack: () => void;
}

export default function ToolDetailView({ tool, onBack }: ToolDetailViewProps) {
  // Map tool IDs to their implementation components
  const renderToolLogic = () => {
    switch (tool.id) {
      case "1":
        return <PdfStudio />;
      case "3":
        return <VectorLabGradients />;
      case "4":
        return <JsonStructure />;
      case "5":
        return <MarkdownEther />;
      case "6":
        return <ChromaticExtractor />;
      case "7":
        return <WorkoutCanvas />;
      default:
        return (
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
        );
    }
  };

  return (
    <div className={`mx-auto px-3 sm:px-6 py-8 md:py-12 ${tool.id === "7" ? "max-w-6xl w-full" : "container"}`}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-10 md:mb-16 px-0.5 sm:px-2 gap-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-xs font-display font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5 whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-display font-bold text-white/50 uppercase tracking-widest shadow-sm whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            Live Execution
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        {/* Left Column: Info & Usage */}
        <div className={tool.id === "7" ? "lg:col-span-5 space-y-6" : "lg:col-span-4 space-y-6"}>
          {/* Tool Info Card */}
          <div className="bento-card p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-lumora-highlight/10 text-lumora-highlight text-[10px] font-display font-bold uppercase tracking-widest mb-6">
              {tool.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4 leading-tight">
              {tool.name}
            </h1>
            <p className="text-base text-lumora-sub font-medium leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* How to Use Card */}
          {tool.usageSteps && tool.usageSteps.length > 0 && (
            <div className="bento-card p-8 bg-white/[0.02]">
              <h4 className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest mb-7">How to Use</h4>
              <div className="flex flex-col gap-5">
                {tool.usageSteps.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0 h-6 w-6 rounded-full bg-lumora-highlight/10 border border-lumora-highlight/20 flex items-center justify-center text-[10px] font-mono font-bold text-lumora-highlight mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[13px] font-display font-bold text-white mb-1">{item.step}</p>
                      <p className="text-[12px] text-white/40 font-medium leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Execution Area */}
        <div className={tool.id === "7" ? "lg:col-span-7 h-full flex justify-center" : "lg:col-span-8 h-full"}>
          <div className={`bento-card min-h-[560px] flex flex-col relative overflow-hidden group ${
            tool.id === "7" ? "max-w-[500px] w-full p-0" : "p-8 md:p-10"
          }`}>
            <div className="shimmer-effect absolute inset-0 opacity-20 pointer-events-none" />
            
            {renderToolLogic()}

            {/* Technical Detail Overlays */}
            {!["1", "3", "4", "5", "6", "7"].includes(tool.id) && (
              <>
                <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-white/5 text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
                  Playground
                </div>
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-[10px] font-display font-bold text-white/40 uppercase tracking-widest">Ready</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

