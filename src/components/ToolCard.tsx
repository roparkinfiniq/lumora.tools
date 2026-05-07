import { motion } from 'motion/react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = (Icons as any)[tool.icon] as LucideIcon;

  return (
    <motion.div
      className="bento-card p-6 sm:p-8 group relative overflow-hidden flex flex-col h-full transition-all duration-500 hover:border-white/15 hover:bg-white/[0.03]"
    >
      <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.06] group-hover:border-white/20 transition-all duration-500 shadow-none">
          {Icon && <Icon className="h-6 w-6 text-white/30 group-hover:text-white transition-colors duration-500" />}
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
          <span className="text-[10px] font-sans font-semibold text-white/50 uppercase tracking-widest pl-[0.1em]">
            {tool.category}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-display font-bold text-white mb-3 tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm text-lumora-sub leading-relaxed font-light mb-8 group-hover:text-white/60 transition-colors line-clamp-3">
          {tool.description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 relative z-10 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
          Open Utility
        </span>
        <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
      </div>
    </motion.div>
  );
}
