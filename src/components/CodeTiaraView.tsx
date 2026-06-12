import { motion } from "motion/react";
import {
  Download,
  Monitor,
  Smartphone,
  CheckSquare,
  Cloud,
  ArrowRight,
  Shield,
  Timer,
  Layers,
  Palette,
  Grid3X3,
} from "lucide-react";

export default function CodeTiaraView() {
  return (
    <div className="pt-12">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 relative z-20"
          >
            <div className="inline-flex px-3 py-1.5 rounded-[12px] bg-white/[0.03] border border-white/10 mb-8 items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-lumora-highlight shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-white/80">
                Flagship Product
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 tracking-tight leading-[1.1] mb-6 md:mb-8">
              Code Tiara.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/50 font-medium mb-10 md:mb-12 leading-relaxed max-w-xl">
              A completely noiseless productivity environment. Designed from the
              ground up for deep focus, offering flawless synchronization
              between your PC and mobile devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
              <a
                href="https://drive.google.com/uc?export=download&id=1d6DJ8F3Gm3BVyWOiNDs3VPmHafBMbzFa"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 lg:h-16 px-6 sm:px-8 rounded-xl bg-white text-black font-display font-bold text-base sm:text-lg hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-95 transition-all duration-300"
              >
                <span className="whitespace-nowrap">Download for PC</span>
                <div className="relative flex h-4 w-4 sm:h-5 sm:w-5 overflow-hidden">
                  <Download className="absolute top-0 left-0 h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:translate-y-full" />
                  <Download className="absolute -top-full left-0 h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:translate-y-full" />
                </div>
              </a>
              <button className="flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 lg:h-16 px-4 sm:px-6 rounded-xl bg-black border border-white/20 text-white font-display font-medium text-base sm:text-lg hover:bg-[#111] hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-95 transition-all duration-300 group">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 group-hover:scale-105 transition-transform duration-300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.774 1.765a2.235 2.235 0 0 0-.84 1.77v16.93a2.235 2.235 0 0 0 .84 1.77L13.62 12.39 3.774 1.765Z"
                    fill="#00f0ff"
                  />
                  <path
                    d="m17.155 15.938-3.535-3.548 3.535-3.538L22.5 11.23a1.458 1.458 0 0 1 0 2.316l-5.345 2.393Z"
                    fill="#ffe400"
                  />
                  <path
                    d="M3.774 22.235 13.62 12.39l3.535 3.548-11.451 5.4a1.868 1.868 0 0 1-1.93-.103Z"
                    fill="#ff004f"
                  />
                  <path
                    d="M3.774 1.765 13.62 11.23l3.535-3.538L5.704 2.288a1.868 1.868 0 0 0-1.93-.103Z"
                    fill="#00ff66"
                  />
                </svg>
                <div className="flex flex-col items-start justify-center text-left">
                  <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-white/80 leading-none mb-1 whitespace-nowrap">
                    GET IT ON
                  </span>
                  <span className="text-[20px] font-sans font-bold tracking-tight leading-none text-white whitespace-nowrap">
                    Google Play
                  </span>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center group pointer-events-none"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#c084fc]/10 to-[#ff7eb3]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-[340px] mx-auto z-10 perspective-[1200px]">
              <div className="bg-[#0f0f13]/90 backdrop-blur-xl rounded-[40px] border-[8px] border-[#1f1f23] shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden transform translate-y-12 group-hover:translate-y-6 [transform:rotateY(-12deg)_rotateX(8deg)] group-hover:[transform:rotateY(-4deg)_rotateX(4deg)] transition-all duration-700 ease-out will-change-transform h-[540px]">
                {/* Dynamic Island / Notch Mock */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1f1f23] rounded-b-3xl" />

                <div className="flex items-center justify-between border-b border-white/5 pb-4 pt-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-xl text-white tracking-tight">
                      Tasks
                    </h3>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    <Cloud className="h-3.5 w-3.5 text-[#ff7eb3]" />
                  </div>
                </div>

                <div className="flex flex-col gap-5 flex-1 mt-2">
                  {[
                    {
                      done: true,
                      w: "w-[85%]",
                      c: "bg-gradient-to-br from-[#c084fc] to-[#ff7eb3]",
                      bc: "border-[#c084fc]",
                    },
                    { done: false, w: "w-[65%]" },
                    { done: false, w: "w-[75%]" },
                    { done: false, w: "w-[55%]", sub: true },
                    { done: false, w: "w-[60%]", sub: true },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-2 rounded-xl transition-colors ${task.sub ? "opacity-40" : ""}`}
                    >
                      <div
                        className={`mt-1 h-6 w-6 rounded-[8px] border ${task.done ? `${task.c} ${task.bc}` : "border-white/10 bg-white/[0.02]"} flex items-center justify-center shrink-0`}
                      >
                        <CheckSquare
                          className={`h-4 w-4 ${task.done ? "text-white" : "text-transparent"}`}
                        />
                      </div>
                      <div className="flex-1 py-1">
                        <div
                          className={`h-3 ${task.w} ${task.done ? "bg-white/20" : "bg-white/80"} rounded-full mb-3 delay-${i * 100} group-hover:bg-white/90 transition-colors duration-500`}
                        />
                        {!task.done && (
                          <div className="h-2 w-16 bg-white/10 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0f0f13] to-transparent pointer-events-none" />
              </div>

              {/* Floating Element 1 - Sync Status */}
              <div className="absolute top-[12%] right-2 sm:top-[25%] sm:-right-8 md:-right-16 lg:-right-20 p-2 sm:p-4 bg-[#1a1a20]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform sm:translate-y-8 group-hover:translate-y-2 group-hover:-translate-x-2 transition-all duration-700 ease-out z-30 flex flex-col gap-2 scale-90 sm:scale-100 origin-right">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse" />
                  <span className="text-white/90 text-[10px] sm:text-xs font-bold font-display uppercase tracking-widest">
                    In Sync
                  </span>
                </div>
                <div className="h-1.5 w-16 sm:w-20 bg-white/20 rounded-full" />
              </div>

              {/* Floating Element 2 - Pomodoro */}
              <div className="absolute bottom-[20%] left-2 sm:bottom-[30%] sm:-left-8 md:-left-24 lg:-left-28 p-2 px-3 sm:p-4 sm:px-5 bg-[#1a1a20]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform sm:-translate-y-8 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-700 ease-out z-30 flex items-center gap-2 sm:gap-4 scale-90 sm:scale-100 origin-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#c084fc]/20 to-[#ff7eb3]/20 flex items-center justify-center border border-[#ff7eb3]/30 shrink-0">
                  <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-[#ff7eb3]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 text-[8px] sm:text-[10px] font-display uppercase tracking-widest mb-0.5">
                    Focus left
                  </span>
                  <span className="text-white text-base sm:text-xl font-mono font-bold tracking-tight">
                    18:42
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:auto-rows-[340px]">
          {/* Cell 2: Pomodoro Timer (1x1 span) */}
          <div className="bento-card lg:col-span-1 lg:row-span-1 p-8 bg-[#0c0c0e] flex flex-col relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7eb3]/10 blur-[80px] rounded-full translate-x-20 -translate-y-20 group-hover:bg-[#ff7eb3]/20 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-20">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Timer className="h-5 w-5 text-white/80" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">
                Deep Focus Cycles.
              </h3>
              <p className="text-lumora-sub font-medium leading-normal text-sm">
                Built-in Pomodoro timer seamlessly integrated into your task
                workflow.
              </p>
            </div>

            <div className="mt-auto relative z-10 flex items-end justify-center h-40">
              <div className="bg-[#141418] border border-white/10 rounded-2xl w-full p-5 shadow-xl translate-y-4 group-hover:translate-y-2 transition-transform duration-500 ease-out flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] font-display uppercase tracking-wider mb-1">
                    Tasks
                  </span>
                  <span className="text-white font-mono text-3xl tracking-tight">
                    25:00
                  </span>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#c084fc] to-[#ff7eb3] text-white flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.4)]">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Cell 3: Floating Desktop View (1x1 span) */}
          <div className="bento-card lg:col-span-1 lg:row-span-1 p-8 bg-[#0c0c0e] flex flex-col relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#c084fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-20">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Layers className="h-5 w-5 text-white/80" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">
                Unobtrusive Desktop View.
              </h3>
              <p className="text-lumora-sub font-medium leading-normal text-sm">
                Detach your tasks into floating sticky notes on your PC. Visible
                yet non-blocking.
              </p>
            </div>

            <div className="mt-auto relative z-10 flex items-center justify-center h-40 pt-4">
              {/* Blurred background rep */}
              <div className="absolute inset-0 top-10 flex justify-center overflow-hidden rounded-t-[32px]">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm" />
              </div>

              <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl w-[80%] p-4 shadow-2xl translate-y-6 group-hover:translate-y-2 transition-transform duration-500 ease-out">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="h-1.5 w-12 bg-white/30 rounded-full" />
                  <div className="h-3 w-3 bg-white/10 rounded-full" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-sm border border-[#ff7eb3]" />
                  <div className="h-1.5 w-24 bg-white/80 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm border border-white/20" />
                  <div className="h-1.5 w-16 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Cell 4: CUSTOMIZABLE THEMES (2x1 span) */}
          <div className="bento-card lg:col-span-2 lg:row-span-1 p-6 sm:p-10 bg-[#0c0c0e] flex flex-col lg:flex-row relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors min-h-[500px] lg:min-h-[340px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none lg:hidden" />

            <div className="relative z-20 lg:w-1/3 flex flex-col justify-center h-full mb-8 lg:mb-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-[#ff7eb3]/20 flex items-center justify-center mb-6 border border-[#c084fc]/30">
                <Palette className="h-6 w-6 text-[#ff7eb3]" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-4 tracking-tight">
                Work in Your Vibe.
              </h3>
              <p className="text-lumora-sub font-medium leading-relaxed text-base max-w-sm">
                Instantly switch between professional "Developer" (Dark),
                data-centric "Excel" (Spreadsheet), and playful "Princess"
                themes.
              </p>
            </div>

            <div className="relative z-10 lg:w-2/3 flex items-center justify-center lg:justify-end">
              {/* UI panes representing themes */}
              <div className="relative w-[340px] sm:w-[500px] lg:w-[600px] h-[260px] sm:h-[300px] flex items-center justify-center group-hover:translate-x-2 transition-transform duration-700 ease-out md:origin-right scale-75 sm:scale-100 lg:scale-[0.9] xl:scale-100 mt-4 sm:mt-8 lg:mt-0 ml-auto mr-auto lg:mr-0">
                {/* Princess Theme (Back) */}
                <div className="absolute left-0 sm:left-4 lg:left-0 w-56 sm:w-64 h-48 sm:h-56 bg-[#ffe4e6] border border-[#fecdd3] rounded-3xl p-4 sm:p-5 shadow-2xl -rotate-6 translate-y-4 group-hover:-rotate-12 group-hover:-translate-x-8 transition-all duration-700 will-change-transform transform-gpu">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-[#fb7185]" />
                    <div className="h-2 w-2 rounded-full bg-[#fb7185]" />
                  </div>
                  <div className="w-full h-8 bg-white/60 rounded-xl mb-3 flex items-center px-3 border border-white/80">
                    <div className="h-1.5 w-20 bg-[#fb7185] rounded-full" />
                  </div>
                  <div className="w-full h-8 bg-white/40 rounded-xl flex items-center px-3">
                    <div className="h-1.5 w-32 bg-[#fda4af] rounded-full" />
                  </div>
                </div>

                {/* Excel Theme (Middle) */}
                <div className="absolute left-[50px] sm:left-[120px] lg:left-[140px] w-56 sm:w-64 h-48 sm:h-56 bg-white border border-[#e2e8f0] rounded-lg p-0 shadow-2xl rotate-3 translate-y-2 group-hover:rotate-6 group-hover:-translate-y-4 transition-all duration-700 overflow-hidden flex flex-col will-change-transform transform-gpu">
                  <div className="bg-[#107c41] h-8 w-full flex items-center px-3">
                    <div className="w-16 h-2 bg-white/80 rounded-sm" />
                  </div>
                  <div className="flex-1 flex flex-col divide-y divide-[#e2e8f0]">
                    <div className="flex-1 flex divide-x divide-[#e2e8f0]">
                      <div className="flex-[0.2] bg-[#f8fafc]" />
                      <div className="flex-1 p-2 flex flex-col justify-center gap-2">
                        <div className="w-20 h-1.5 bg-[#cbd5e1] rounded-sm" />
                      </div>
                    </div>
                    <div className="flex-1 flex divide-x divide-[#e2e8f0]">
                      <div className="flex-[0.2] bg-[#f8fafc]" />
                      <div className="flex-1 p-2 flex flex-col justify-center gap-2">
                        <div className="w-32 h-1.5 bg-[#cbd5e1] rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Developer Theme (Front) */}
                <div className="absolute left-[100px] sm:left-[220px] lg:left-[260px] z-10 w-60 sm:w-72 h-56 sm:h-64 bg-[#0a0a0c] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] -rotate-2 group-hover:rotate-0 group-hover:translate-x-8 transition-all duration-700 will-change-transform backface-hidden transform-gpu">
                  <div className="flex items-center justify-between mb-5 sm:mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-[#c084fc]" />
                      <div className="h-2 w-16 bg-[#c084fc]/50 rounded-full" />
                    </div>
                    <div className="h-4 w-4 rounded-full bg-white/5 flex items-center justify-center">
                      <div className="h-1 w-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-white/[0.02] p-2 sm:p-3 rounded-xl border border-white/5">
                      <div className="h-3 w-3 border flex items-center justify-center border-[#ff7eb3] bg-transparent rounded-sm" />
                      <div className="h-1.5 w-3/4 bg-white/80 rounded-full" />
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.02] p-2 sm:p-3 rounded-xl border border-white/5 opacity-50">
                      <div className="h-3 w-3 border flex items-center justify-center border-white/20 bg-white/10 rounded-sm" />
                      <div className="h-1.5 w-1/2 bg-white/40 rounded-full line-through" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-6 mb-32">
        <div className="relative w-full max-w-4xl mx-auto rounded-[40px] p-[1px] overflow-hidden group">
          {/* Neon Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c084fc] to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700" />

          <div className="relative bg-[#0c0c0e] rounded-[40px] px-8 py-16 md:px-16 md:py-24 text-center overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#ff7eb3]/20 blur-[100px] pointer-events-none" />

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-4 md:mb-6">
              Ready to find your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#ff7eb3]">
                focus?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-lumora-sub max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of creators, developers, and thinkers who use Code
              Tiara to quiet the noise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-[#c084fc]" />
                <span className="text-white/60 text-sm font-medium">
                  Syncs Everywhere
                </span>
              </div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#c084fc]" />
                <span className="text-white/60 text-sm font-medium">
                  Local-First Privacy
                </span>
              </div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-[#c084fc]" />
                <span className="text-white/60 text-sm font-medium">
                  Zero Distractions
                </span>
              </div>
            </div>

            <a
              href="https://drive.google.com/uc?export=download&id=1d6DJ8F3Gm3BVyWOiNDs3VPmHafBMbzFa"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 lg:h-16 px-8 sm:px-10 rounded-xl bg-white text-black font-display font-bold text-base sm:text-lg hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-95 transition-all duration-300"
            >
              <span>Download for PC</span>
              <div className="relative flex h-4 w-4 sm:h-5 sm:w-5 overflow-hidden">
                <Download className="absolute top-0 left-0 h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover/btn:translate-y-full" />
                <Download className="absolute -top-full left-0 h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover/btn:translate-y-full" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
