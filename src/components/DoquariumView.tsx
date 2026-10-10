import { motion } from "motion/react";
import {
  ListPlus,
  CheckCircle2,
  CloudFog,
  Ghost,
  BookOpen,
  Users,
  Gauge,
  Palette,
  Lock,
  BellOff,
  HeartHandshake,
  Mail,
  ArrowRight,
} from "lucide-react";
import { DOQUARIUM } from "../data/doquarium";
import { useRef } from "react";
import RarityFish, { RarityFishStyles, usePauseOffscreen, type Rarity } from "./RarityFish";

const NEON = "#3ef2ff";

// Fish outline borrowed from the app's neon concept art.
const FISH_BODY = "M-30,0 C-20,-19 14,-21 32,0 C14,21 -20,19 -30,0 Z";
const FISH_TAIL = "M-28,0 L-50,-15 L-44,0 L-50,15 Z";
const FISH_FINS = ["M-6,-15 Q4,-30 14,-15", "M-2,14 Q4,24 10,15", "M10,-11 Q5,0 10,11"];

function NeonFish({
  stroke,
  fill,
  gradientId,
  eyeColor = "#ffffff",
}: {
  stroke: string;
  fill: string;
  gradientId?: string;
  eyeColor?: string;
}) {
  const s = gradientId ? `url(#${gradientId})` : stroke;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <g className="dq-tail">
        <path d={FISH_TAIL} fill={fill} stroke={s} strokeWidth={2} />
      </g>
      <path d={FISH_BODY} fill={fill} stroke={s} strokeWidth={2} />
      {FISH_FINS.map((d) => (
        <path key={d} d={d} fill="none" stroke={s} strokeWidth={1.4} opacity={0.8} />
      ))}
      <circle cx={20} cy={-4} r={2.4} fill={eyeColor} />
    </g>
  );
}

function GlowDefs() {
  return (
    <defs>
      <filter id="dq-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="dq-mystic" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3ef2ff" />
        <stop offset="100%" stopColor="#b47bff" />
      </linearGradient>
      <radialGradient id="dq-water" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor="rgba(62,242,255,0.10)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
    </defs>
  );
}

const TANK_STYLES = `
@keyframes dq-swim { 0% { transform: translate(70px,120px) scale(1,1); } 45% { transform: translate(330px,100px) scale(1,1); } 50% { transform: translate(340px,104px) scale(-1,1); } 95% { transform: translate(80px,128px) scale(-1,1); } 100% { transform: translate(70px,120px) scale(1,1); } }
@keyframes dq-swim2 { 0% { transform: translate(300px,205px) scale(-0.7,0.7); } 48% { transform: translate(110px,190px) scale(-0.7,0.7); } 52% { transform: translate(104px,192px) scale(0.7,0.7); } 96% { transform: translate(296px,208px) scale(0.7,0.7); } 100% { transform: translate(300px,205px) scale(-0.7,0.7); } }
@keyframes dq-tail { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
@keyframes dq-fall { 0% { transform: translateY(-20px); opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(250px); opacity: 0; } }
@keyframes dq-bubble { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .7; } 100% { transform: translateY(-260px); opacity: 0; } }
.dq-tail { transform-box: fill-box; transform-origin: 100% 50%; animation: dq-tail 0.9s ease-in-out infinite; }
.dq-fish-a { animation: dq-swim 16s ease-in-out infinite; }
.dq-fish-b { animation: dq-swim2 21s ease-in-out infinite; }
.dq-food { animation: dq-fall 7s linear infinite; }
.dq-bubble { animation: dq-bubble 6s ease-in infinite; }
@media (prefers-reduced-motion: reduce) {
  .dq-tail, .dq-fish-a, .dq-fish-b, .dq-food, .dq-bubble { animation: none; }
  .dq-fish-a { transform: translate(200px,120px); }
  .dq-fish-b { transform: translate(140px,200px) scale(0.7,0.7); }
}
`;

function NeonTank() {
  const svgRef = useRef<SVGSVGElement>(null);
  usePauseOffscreen(svgRef);
  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <style>{TANK_STYLES}</style>
      <div className="absolute -inset-10 bg-[#3ef2ff]/10 blur-[90px] rounded-full pointer-events-none" />
      <div className="relative rounded-[36px] border border-[#3ef2ff]/25 bg-black shadow-[0_0_60px_rgba(62,242,255,0.12),inset_0_0_40px_rgba(62,242,255,0.06)] overflow-hidden">
        <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-auto block" role="img" aria-label="Two neon fish swimming in a dark tank while food pellets drift down">
          <GlowDefs />
          <rect width="400" height="300" fill="url(#dq-water)" />
          {/* one glow pass for the whole scene (cheaper than a blur per shape) */}
          <g filter="url(#dq-glow)">
          {/* Water surface */}
          <path d="M0,28 Q50,20 100,28 T200,28 T300,28 T400,28" fill="none" stroke={NEON} strokeOpacity={0.35} strokeWidth={1.2} />
          {/* Falling food = your to-dos */}
          {[
            { x: 120, d: "0s" },
            { x: 230, d: "2.4s" },
            { x: 300, d: "4.8s" },
          ].map((f) => (
            <circle key={f.x} className="dq-food" style={{ animationDelay: f.d }} cx={f.x} cy={30} r={3.2} fill="#ffe9a8" />
          ))}
          {/* Bubbles */}
          {[
            { x: 52, d: "0s" },
            { x: 60, d: "2s" },
            { x: 352, d: "3.5s" },
          ].map((b) => (
            <circle key={b.x + b.d} className="dq-bubble" style={{ animationDelay: b.d }} cx={b.x} cy={285} r={2.5} fill="none" stroke={NEON} strokeOpacity={0.6} />
          ))}
          <g className="dq-fish-b">
            <NeonFish stroke="#b47bff" fill="rgba(180,123,255,0.10)" gradientId="dq-mystic" />
          </g>
          <g className="dq-fish-a">
            <NeonFish stroke={NEON} fill="rgba(62,242,255,0.10)" />
          </g>
          {/* Sand line + plant */}
          <path d="M0,282 Q100,272 200,280 T400,276" fill="none" stroke={NEON} strokeOpacity={0.25} strokeWidth={1.2} />
          <g fill="none" stroke={NEON} strokeOpacity={0.45} strokeWidth={1.6} strokeLinecap="round">
            <path d="M330,282 Q322,250 334,226 Q344,204 336,180" />
            <path d="M342,282 Q352,258 346,236" />
          </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

const STEPS = [
  {
    icon: ListPlus,
    title: "Add a to-do",
    body: "Every task you write drops into your tank as a glowing piece of fish food.",
  },
  {
    icon: CheckCircle2,
    title: "Finish it, feed your fish",
    body: "Check it off and your fish swims over to eat. Each day you finish at least one task, it grows a day older, from egg to adult.",
  },
  {
    icon: CloudFog,
    title: "Leave it, and the water clouds",
    body: "Food you ignore starts to spoil the day after you add it. The water gets murky and your fish slowly gets sick. Nothing dies in one sudden moment.",
  },
];

const RARITIES: { rarity: Rarity; name: string; species: string; note: string; text: string }[] = [
  { rarity: "common", name: "Common", species: "Glowfish", note: "A clean teal glow", text: "text-[#3ef2ff]" },
  { rarity: "rare", name: "Rare", species: "Angelfish", note: "Plus a blue sheen on the head", text: "text-[#7aa2ff]" },
  { rarity: "mystic", name: "Mystic", species: "Betta", note: "Plus violet light flowing along the body", text: "text-[#c4a1ff]" },
  { rarity: "legendary", name: "Legendary", species: "Sea Dragon", note: "Plus an aurora glow and a sparkling trail", text: "text-[#ffd84a]" },
];

const FEATURES = [
  {
    icon: Ghost,
    title: "A ghost, not a gravestone.",
    body: "If your fish does pass away, it floats around as a goofy little ghost. Bring it back with coins, or let it go and start again.",
  },
  {
    icon: BookOpen,
    title: "A collection to grow into.",
    body: "Each egg hatches into a random species, from fish to jellyfish, turtles, sharks, and sea dragons. Grown fish are added to your collection, and you can keep your favorites in a personal aquarium.",
  },
  {
    icon: Users,
    title: "Shared tanks with friends.",
    body: "Share a room code and your fish swim together in one tank. Send a quick cheer, poke, or celebration. Friends see your fish and how much you got done, and only see your actual to-dos in tanks set up to share them.",
  },
  {
    icon: Gauge,
    title: "Easy or Hard, per tank.",
    body: "Easy for building habits without pressure. Hard for exams and deadlines: faster growth, but your fish goes hungry on days you do nothing.",
  },
  {
    icon: Palette,
    title: "Decorations they react to.",
    body: "Spend coins earned from finished tasks on plants, coral, caves, and more. Fish hide in caves and rest on moss, and little shrimp hitch a ride on the marimo.",
  },
];

const PRINCIPLES = [
  {
    icon: BellOff,
    title: "Built to let you go",
    body: "No infinite feeds, no streak guilt, no endless rewards for staring at the screen. Check in, feed your fish, and get back to your day.",
  },
  {
    icon: HeartHandshake,
    title: "Fully enjoyable for free",
    body: "Coins come from finishing real tasks. Spending money is never the way to win.",
  },
  {
    icon: Lock,
    title: "Your list stays yours",
    body: "Used solo, everything stays on your phone. Friends never see your to-dos unless you join a tank made for sharing them, and you can still hide any to-do with \"Only me\".",
  },
];

function StoreBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between h-14 px-5 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
      <span className="font-display font-bold text-sm">{label}</span>
      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#3ef2ff] bg-[#3ef2ff]/10 border border-[#3ef2ff]/25 px-2.5 py-1 rounded-full">
        {DOQUARIUM.storeStatus}
      </span>
    </div>
  );
}

export default function DoquariumView({ onOpenPrivacy, onOpenDelete }: { onOpenPrivacy: () => void; onOpenDelete: () => void }) {
  return (
    <div className="pt-12">
      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2">
            <div className="inline-flex px-3 py-1.5 rounded-[12px] bg-white/[0.03] border border-white/10 mb-8 items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ef2ff] shadow-[0_0_8px_rgba(62,242,255,0.9)]" />
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-white/80">
                Mobile App · Android & iPhone
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 tracking-tight leading-[1.1] mb-6">
              Doquarium.
            </h1>
            <p className="text-xl md:text-2xl font-display font-bold text-[#3ef2ff] mb-6 [text-shadow:0_0_18px_rgba(62,242,255,0.45)]">
              Grow your aquarium with to-dos.
            </p>
            <p className="text-base sm:text-lg text-white/55 font-medium mb-10 leading-relaxed max-w-xl">
              A neon to-do app where every task you finish feeds the fish in your
              tank. Spend less time scrolling, get real things done, and watch
              something small and glowing grow along with you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <StoreBadge label="Google Play" />
              <StoreBadge label="App Store" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-1/2 w-full">
            <NeonTank />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
          To-dos are fish food.
        </h2>
        <p className="text-lg text-lumora-sub font-medium mb-12 max-w-2xl">
          One simple rule runs the whole tank.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bento-card p-8 bg-[#0c0c0e] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 rounded-xl bg-[#3ef2ff]/10 border border-[#3ef2ff]/25 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-[#3ef2ff]" />
                </div>
                <span className="font-mono text-xs text-white/25">0{i + 1}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">{step.title}</h3>
              <p className="text-lumora-sub font-medium leading-relaxed text-sm">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rarity */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="rounded-[32px] border border-white/5 bg-black p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-3">
            Four rarities, told by light.
          </h2>
          <p className="text-lumora-sub font-medium mb-10 max-w-2xl">
            Every egg is a surprise. The rarer the fish, the more its glow
            blooms as it grows up.
          </p>
          <RarityFishStyles />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RARITIES.map((r) => (
              <div key={r.name} className="flex flex-col items-center text-center rounded-[24px] bg-white/[0.015] border border-white/[0.04] px-3 pt-2 pb-6">
                <RarityFish rarity={r.rarity} className="w-full max-w-[380px] h-auto" />
                <span className={`font-display font-bold text-lg ${r.text}`}>{r.name}</span>
                <span className="text-sm text-white/70 font-medium">{r.species}</span>
                <span className="text-xs text-white/40 font-medium mt-1">{r.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`bento-card p-8 bg-[#0c0c0e] border border-white/5 ${i === FEATURES.length - 1 ? "md:col-span-2" : ""}`}
            >
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <f.icon className="h-5 w-5 text-white/80" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-lumora-sub font-medium leading-relaxed text-sm max-w-xl">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Made to send you back to real life.
          </h2>
          <p className="text-lg text-lumora-sub font-medium">
            The real level-up happens off the screen. The fish just reflects it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="flex gap-4">
              <p.icon className="h-5 w-5 text-[#3ef2ff] shrink-0 mt-1" />
              <div>
                <h3 className="font-display font-bold text-white mb-1">{p.title}</h3>
                <p className="text-sm text-lumora-sub font-medium leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact + legal */}
      <section className="container max-w-6xl mx-auto px-6 mb-32">
        <div className="relative max-w-4xl mx-auto rounded-[40px] border border-[#3ef2ff]/15 bg-[#0c0c0e] px-8 py-14 md:px-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#3ef2ff]/15 blur-[100px] pointer-events-none" />
          <h2 className="relative text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4">
            Your tank is almost ready.
          </h2>
          <p className="relative text-lumora-sub mb-10 max-w-xl mx-auto">
            Doquarium is in testing now and launching on Android and iPhone
            soon. Questions or feedback? We would love to hear from you.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${DOQUARIUM.contactEmail}`}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white text-black font-display font-bold text-sm hover:-translate-y-0.5 transition-transform"
            >
              <Mail className="h-4 w-4" /> {DOQUARIUM.contactEmail}
            </a>
            <button
              onClick={onOpenPrivacy}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Privacy Policy <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={onOpenDelete}
            className="relative mt-6 text-xs font-medium text-white/40 hover:text-white underline underline-offset-4 decoration-white/20 transition-colors"
          >
            Delete your account and data
          </button>
        </div>
      </section>
    </div>
  );
}
