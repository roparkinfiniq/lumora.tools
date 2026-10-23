import { ArrowRight, Compass } from "lucide-react";

// Shown for addresses that match no page (and tool addresses that match no tool), instead of quietly
// showing the home page. Search engines are told not to index it (seo.ts "not-found").
export default function NotFoundView({ onOpen }: { onOpen: (view: string) => void }) {
  return (
    <div className="container max-w-3xl mx-auto px-6 pt-24 pb-40 text-center">
      <div className="mx-auto mb-8 h-16 w-16 rounded-2xl bg-lumora-highlight/10 border border-lumora-highlight/20 flex items-center justify-center">
        <Compass className="h-7 w-7 text-lumora-highlight" />
      </div>
      <p className="text-xs font-display font-bold uppercase tracking-widest text-white/40 mb-4">404</p>
      <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">This page doesn&apos;t exist</h1>
      <p className="text-base md:text-lg text-lumora-sub font-medium mb-10">
        The address <span className="font-mono text-white/70 break-all">{window.location.pathname}</span> doesn&apos;t lead anywhere. Maybe it moved, or there&apos;s a small typo.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => onOpen("home")}
          className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white text-black font-display font-bold text-sm hover:-translate-y-0.5 transition-transform"
        >
          Go home
        </button>
        <button
          onClick={() => onOpen("utilities")}
          className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          Browse all tools <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
