import { useRef } from "react";
import { usePauseOffscreen } from "../lib/usePauseOffscreen";

// Animated neon tank drawing for the home page Doquarium card.
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
.anim-paused * { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .dq-tail, .dq-fish-a, .dq-fish-b, .dq-food, .dq-bubble { animation: none; }
  .dq-fish-a { transform: translate(200px,120px); }
  .dq-fish-b { transform: translate(140px,200px) scale(0.7,0.7); }
}
`;

export function NeonTank() {
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

