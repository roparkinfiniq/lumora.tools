import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";

// Detailed neon creatures for the Doquarium rarity showcase.
// Follows the app's art standard (doquarium docs/15): 3-layer neon tube
// (wide bloom → near bloom → crisp line + thin white core), translucent body
// (darker on the back, lighter at the belly), fin membranes that fade from the
// root to the tip with faint rays, a glowing eye with a highlight, slow
// "breathing" light, a soft halo, and tiny inner sparkles.
// Rarity rules (higher tiers add one more special thing each):
//   Common    clean teal
//   Rare      + a blue sheen on the head
//   Mystic    + violet light flowing along the body, soft bloom
//   Legendary + aurora (gold → violet → teal), wide bloom, sparkle trail

export type Rarity = "common" | "rare" | "mystic" | "legendary";

const TEAL = "#3ef2ff";

interface Ink {
  id: string;
  line: string; // stroke for outlines (color or gradient url)
  base: string; // solid color for fills and membranes
  accent: string; // second color (head sheen / flow)
}

// The bloom layers come from ONE filter on the whole creature (`${id}-glow`),
// not a blur per line: per-line blurs were re-computed ~60 times per frame
// while the fish animate, which made the page stutter.
function Neon({ ink, d, w = 1.6, glow = 1, core = true, stroke }: { ink: Ink; d: string; w?: number; glow?: number; core?: boolean; stroke?: string }) {
  const s = stroke ?? ink.line;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={s} strokeWidth={w * 2.2} opacity={0.28 * glow} />
      <path d={d} stroke={s} strokeWidth={w} opacity={Math.min(1, glow)} />
      {core && <path d={d} stroke="#ffffff" strokeWidth={w * 0.32} opacity={0.7 * Math.min(1, glow)} />}
    </g>
  );
}

/** Fin / tail membrane: dense at the root, transparent at the tip, with faint rays. */
function Membrane({ ink, name, d, root, reach, rays = [], edge = 0.5 }: { ink: Ink; name: string; d: string; root: [number, number]; reach: number; rays?: string[]; edge?: number }) {
  const gid = `${ink.id}-m-${name}`;
  return (
    <g>
      <defs>
        <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={root[0]} cy={root[1]} r={reach}>
          <stop offset="0%" stopColor={ink.base} stopOpacity={0.4} />
          <stop offset="100%" stopColor={ink.base} stopOpacity={0.05} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${gid})`} />
      {rays.map((r) => (
        <path key={r} d={r} fill="none" stroke={ink.base} strokeWidth={0.5} opacity={0.32} strokeLinecap="round" />
      ))}
      <Neon ink={ink} d={d} w={1.1} glow={edge} core={false} />
    </g>
  );
}

function Eye({ ink, x, y, r = 3 }: { ink: Ink; x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill={`url(#${ink.id}-eyeglow)`} />
      <circle cx={x} cy={y} r={r} fill="#06121a" stroke={ink.base} strokeWidth={0.9} />
      <circle cx={x + r * 0.3} cy={y - r * 0.3} r={r * 0.38} fill="#ffffff" />
    </g>
  );
}

function Sparkles({ points }: { points: [number, number, number][] }) {
  return (
    <g fill="#ffffff">
      {points.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={0.8} className="rf-twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </g>
  );
}

/** Body fill clipped to the body, with an optional radial sheen (rare: head). */
function Body({ ink, d, sheen, flow }: { ink: Ink; d: string; sheen?: [number, number, number]; flow?: boolean }) {
  return (
    <g>
      <defs>
        <clipPath id={`${ink.id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={`url(#${ink.id}-body)`} />
      <g clipPath={`url(#${ink.id}-clip)`}>
        {sheen && <circle cx={sheen[0]} cy={sheen[1]} r={sheen[2]} fill={`url(#${ink.id}-sheen)`} />}
        {flow && <rect x={-120} y={-90} width={240} height={180} fill={`url(#${ink.id}-flow)`} />}
        {/* belly light: brighter underside reflection */}
        <ellipse cx={0} cy={14} rx={60} ry={10} fill="#ffffff" opacity={0.035} />
      </g>
    </g>
  );
}

// ───────── Species ─────────

/** Glowfish (basic fish, Common): sleek body, forked tail, lateral line, gill arc. */
function Glowfish({ ink }: { ink: Ink }) {
  const body = "M-34,0 C-28,-19 4,-25 30,-10 C38,-6 41,-1 40,1 C39,4 34,8 28,11 C4,24 -28,19 -34,0 Z";
  return (
    <g>
      <g className="rf-tail" style={{ transformOrigin: "-32px 0px" }}>
        <Membrane
          ink={ink}
          name="tail"
          d="M-31,0 C-40,-5 -50,-17 -62,-26 C-58,-12 -56,-5 -52,0 C-56,5 -58,12 -62,26 C-50,17 -40,5 -31,0 Z"
          root={[-32, 0]}
          reach={34}
          rays={["M-34,-1 L-58,-21", "M-34,-0.5 L-55,-11", "M-34,0.5 L-55,11", "M-34,1 L-58,21"]}
          edge={0.6}
        />
      </g>
      <g className="rf-fin">
        <Membrane ink={ink} name="dorsal" d="M-14,-17 C-10,-31 4,-34 14,-20 C4,-22 -6,-20 -14,-17 Z" root={[-2, -18]} reach={18} rays={["M-8,-18 L-6,-28", "M-1,-19 L2,-30", "M6,-20 L9,-27"]} />
        <Membrane ink={ink} name="anal" d="M-12,15 C-10,25 -2,28 4,20 C-2,19 -8,17 -12,15 Z" root={[-4, 17]} reach={12} rays={["M-7,17 L-6,24", "M-2,18 L0,25"]} />
      </g>
      <Body ink={ink} d={body} sheen={ink.accent !== ink.base ? [36, -2, 26] : undefined} flow={ink.id.includes("flow")} />
      {/* lateral line + scale hints */}
      <path d="M-26,1 C-10,-3 8,-3 26,-1" fill="none" stroke={ink.base} strokeWidth={0.7} strokeDasharray="2 3" opacity={0.5} />
      <g fill="none" stroke={ink.base} strokeWidth={0.5} opacity={0.28}>
        <path d="M-14,-10 q4,4 0,8 M-6,-12 q4,5 0,10 M2,-13 q4,5 0,11 M10,-12 q4,5 0,10" />
        <path d="M-14,4 q4,4 0,8 M-6,4 q4,5 0,9 M2,4 q4,5 0,9 M10,4 q4,4 0,8" />
      </g>
      <Neon ink={ink} d={body} w={1.7} />
      <path d="M24,-11 Q18,0 24,11" fill="none" stroke={ink.base} strokeWidth={0.9} opacity={0.6} />
      <g className="rf-pec" style={{ transformOrigin: "16px 5px" }}>
        <Membrane ink={ink} name="pec" d="M16,5 C10,10 6,16 4,20 C10,18 15,12 18,7 Z" root={[16, 5]} reach={14} rays={["M15,6 L7,17", "M16,6 L11,17"]} edge={0.55} />
      </g>
      <Eye ink={ink} x={30} y={-4} r={2.8} />
      <Sparkles points={[[-12, -4, 0.9], [6, 6, 0.7], [-20, 6, 0.6]]} />
    </g>
  );
}

/** Angelfish (Rare): tall disc, long sail fins, trailing ventral filaments, vertical bands. */
function Angelfish({ ink }: { ink: Ink }) {
  const body = "M-20,0 C-18,-24 6,-30 30,-6 C34,-2 34,2 30,6 C6,30 -18,24 -20,0 Z";
  return (
    <g>
      <g className="rf-tail" style={{ transformOrigin: "-20px 0px" }}>
        <Membrane
          ink={ink}
          name="tail"
          d="M-19,0 C-30,-14 -42,-20 -50,-20 C-46,-8 -46,8 -50,20 C-42,20 -30,14 -19,0 Z"
          root={[-20, 0]}
          reach={32}
          rays={["M-22,-1 L-46,-16", "M-22,0 L-47,-6", "M-22,0 L-47,6", "M-22,1 L-46,16"]}
        />
        <path d="M-50,-20 C-56,-24 -62,-30 -66,-38 M-50,20 C-56,24 -62,30 -66,38" fill="none" stroke={ink.base} strokeWidth={0.8} opacity={0.45} strokeLinecap="round" />
      </g>
      <g className="rf-sail">
        <Membrane
          ink={ink}
          name="dorsal"
          d="M-10,-24 C-16,-42 -30,-60 -46,-76 C-30,-64 -6,-46 14,-22 C4,-26 -4,-26 -10,-24 Z"
          root={[0, -24]}
          reach={58}
          rays={["M-6,-26 L-34,-62", "M0,-25 L-24,-54", "M6,-24 L-12,-44"]}
          edge={0.6}
        />
        <Membrane
          ink={ink}
          name="anal"
          d="M-10,24 C-16,42 -30,60 -46,76 C-30,64 -6,46 14,22 C4,26 -4,26 -10,24 Z"
          root={[0, 24]}
          reach={58}
          rays={["M-6,26 L-34,62", "M0,25 L-24,54", "M6,24 L-12,44"]}
          edge={0.6}
        />
      </g>
      <Body ink={ink} d={body} sheen={[30, -4, 24]} flow={ink.id.includes("flow")} />
      {/* signature vertical bands */}
      <g clipPath={`url(#${ink.id}-clip)`} fill={ink.base} opacity={0.22}>
        <path d="M14,-30 C10,-10 10,10 14,30 L20,30 C16,10 16,-10 20,-30 Z" />
        <path d="M-2,-30 C-6,-10 -6,10 -2,30 L5,30 C1,10 1,-10 5,-30 Z" />
        <path d="M-16,-30 C-19,-10 -19,10 -16,30 L-11,30 C-14,10 -14,-10 -11,-30 Z" />
      </g>
      <Neon ink={ink} d={body} w={1.7} />
      <path d="M20,-14 Q15,0 20,14" fill="none" stroke={ink.base} strokeWidth={0.8} opacity={0.55} />
      {/* ventral filaments */}
      <g className="rf-whisker" style={{ transformOrigin: "10px 18px" }}>
        <Neon ink={ink} d="M10,18 C8,36 2,52 -6,70" w={0.8} glow={0.7} core={false} />
        <Neon ink={ink} d="M13,17 C12,34 8,50 2,64" w={0.7} glow={0.55} core={false} />
      </g>
      <Eye ink={ink} x={22} y={-6} r={3} />
      <Sparkles points={[[-6, -8, 0.8], [8, 10, 0.7], [-12, 8, 0.6]]} />
    </g>
  );
}

/** Betta (Mystic): slim body under a huge flowing veil tail and long fins. */
function Betta({ ink }: { ink: Ink }) {
  const body = "M-20,0 C-15,-12 8,-15 26,-6 C31,-3 32,0 31,2 C28,6 22,9 16,10 C0,13 -15,11 -20,0 Z";
  const tailRays = ["M-20,0 C-40,-14 -62,-34 -86,-40", "M-20,0 C-44,-6 -70,-14 -96,-16", "M-20,0 C-46,2 -72,4 -98,8", "M-20,0 C-44,10 -66,24 -90,34", "M-20,0 C-38,16 -54,34 -70,48"];
  return (
    <g>
      <g className="rf-veil" style={{ transformOrigin: "-20px 0px" }}>
        <Membrane
          ink={ink}
          name="tail"
          d="M-18,-2 C-36,-28 -64,-50 -88,-44 C-84,-36 -98,-28 -96,-16 C-104,-6 -96,2 -100,10 C-96,20 -100,28 -90,36 C-84,48 -70,52 -66,48 C-50,40 -32,22 -18,2 Z"
          root={[-20, 0]}
          reach={86}
          rays={tailRays}
          edge={0.65}
        />
      </g>
      <g className="rf-sail">
        <Membrane
          ink={ink}
          name="dorsal"
          d="M-14,-9 C-18,-28 -34,-44 -58,-46 C-52,-40 -54,-34 -48,-28 C-34,-20 -14,-14 6,-12 Z"
          root={[-8, -11]}
          reach={50}
          rays={["M-10,-11 L-50,-40", "M-4,-12 L-40,-30", "M2,-12 L-28,-22"]}
          edge={0.55}
        />
        <Membrane
          ink={ink}
          name="anal"
          d="M-12,9 C-20,30 -42,50 -70,56 C-62,48 -62,40 -56,36 C-38,28 -14,18 12,10 Z"
          root={[0, 10]}
          reach={66}
          rays={["M-6,11 L-60,50", "M2,10 L-44,36", "M8,10 L-26,24"]}
          edge={0.55}
        />
      </g>
      <Body ink={ink} d={body} sheen={[28, -2, 20]} flow={ink.id.includes("flow")} />
      {/* scale shimmer */}
      <g fill="none" stroke={ink.base} strokeWidth={0.45} opacity={0.3}>
        <path d="M-10,-6 q3,3 0,6 M-3,-8 q3,4 0,8 M4,-8 q3,4 0,8 M11,-7 q3,3 0,7" />
        <path d="M-10,2 q3,3 0,6 M-3,2 q3,3 0,7 M4,2 q3,3 0,6" />
      </g>
      <Neon ink={ink} d={body} w={1.6} />
      <path d="M20,-8 Q16,0 20,8" fill="none" stroke={ink.base} strokeWidth={0.8} opacity={0.55} />
      <g className="rf-pec" style={{ transformOrigin: "12px 7px" }}>
        <Membrane ink={ink} name="pelvic" d="M12,8 C8,18 4,30 -2,40 C6,32 12,20 15,9 Z" root={[12, 8]} reach={34} rays={["M12,9 L2,34"]} edge={0.6} />
      </g>
      <Eye ink={ink} x={23} y={-3} r={2.6} />
      <Sparkles points={[[-6, -3, 0.8], [6, 4, 0.6], [-50, -10, 0.7], [-62, 18, 0.6]]} />
    </g>
  );
}

/** Sea Dragon (Legendary): long S body, tube snout, leafy appendages, horned crown. */
function SeaDragon({ ink }: { ink: Ink }) {
  const body =
    "M60,-9 L40,-10 C34,-20 20,-22 10,-14 C0,-6 -10,-2 -24,-3 C-40,-4 -52,-14 -66,-15 C-78,-16 -88,-8 -92,2 C-95,10 -88,16 -82,12 C-79,9 -82,4 -78,2 C-72,-1 -62,4 -48,10 C-32,16 -12,16 2,8 C12,2 22,6 32,1 L40,-4 L60,-5 Z";
  // leaf appendage: drawn at origin pointing up, placed along the body
  const leaf =
    "M0,0 C-3,-5 -9,-7 -11,-13 C-7,-12 -6,-15 -7,-20 C-3,-17 -1,-21 1,-27 C3,-21 6,-19 9,-21 C7,-16 9,-13 11,-12 C6,-9 3,-5 0,0 Z";
  const leaves: [number, number, number, number][] = [
    // x, y, rotate, scale
    [12, -14, -10, 1],
    [-2, -6, -20, 1.1],
    [-20, -4, -5, 1.2],
    [-40, -6, 10, 1.05],
    [-60, -14, -15, 0.9],
    [-6, 11, 175, 1],
    [-26, 15, 190, 1.15],
    [-46, 11, 165, 0.95],
  ];
  return (
    <g>
      {leaves.map(([x, y, rot, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
          <g className="rf-leaf" style={{ animationDelay: `${i * -0.45}s` }}>
            <Membrane ink={ink} name={`leaf${i}`} d={leaf} root={[0, 0]} reach={26} rays={["M0,-1 L-7,-17", "M0,-1 L1,-24", "M0,-1 L7,-18"]} edge={0.6} />
          </g>
        </g>
      ))}
      <Body ink={ink} d={body} sheen={[30, -10, 24]} flow={ink.id.includes("flow")} />
      {/* body rings */}
      <g fill="none" stroke={ink.base} strokeWidth={0.6} opacity={0.38} clipPath={`url(#${ink.id}-clip)`}>
        {[-70, -58, -46, -34, -22, -10, 2].map((x) => (
          <path key={x} d={`M${x},-20 q-3,18 0,36`} />
        ))}
      </g>
      <Neon ink={ink} d={body} w={1.6} />
      {/* crown horns + head spines */}
      <Neon ink={ink} d="M22,-18 L20,-30 M28,-17 L30,-28 M16,-16 L10,-25" w={0.9} glow={0.8} core={false} />
      <circle cx={20} cy={-31} r={1.6} fill="#ffffff" opacity={0.9} />
      <circle cx={30} cy={-29} r={1.4} fill="#ffffff" opacity={0.9} />
      <Eye ink={ink} x={30} y={-9} r={2.6} />
      <Sparkles points={[[-14, 4, 0.9], [-50, 2, 0.8], [8, 0, 0.7], [-74, -6, 0.6]]} />
    </g>
  );
}

const SPECIES: Record<Rarity, (props: { ink: Ink }) => ReactNode> = {
  common: Glowfish,
  rare: Angelfish,
  mystic: Betta,
  legendary: SeaDragon,
};

const RF_STYLES = `
@keyframes rf-breathe { 0%,100% { opacity: .86; } 50% { opacity: 1; } }
@keyframes rf-bob { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-1.5deg); } }
@keyframes rf-glide { 0%,100% { transform: translate(0,0) rotate(0deg); } 33% { transform: translate(-3px,-5px) rotate(-2.5deg); } 66% { transform: translate(3px,-2px) rotate(1.5deg); } }
@keyframes rf-tail { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes rf-veil { 0%,100% { transform: rotate(-4deg) skewY(-3deg); } 50% { transform: rotate(4deg) skewY(3deg); } }
@keyframes rf-fin { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(.92); } }
@keyframes rf-pec { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(14deg); } }
@keyframes rf-leaf { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes rf-twinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes rf-trail { 0% { transform: translate(0,0) scale(1); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(-22px,4px) scale(.3); opacity: 0; } }
.rf-breathe { animation: rf-breathe 4.6s ease-in-out infinite; }
.rf-bob { animation: rf-bob 3.4s ease-in-out infinite; }
.rf-glide { animation: rf-glide 7s ease-in-out infinite; }
.rf-tail { transform-box: view-box; animation: rf-tail 1.1s ease-in-out infinite; }
.rf-veil { transform-box: view-box; animation: rf-veil 2.6s ease-in-out infinite; }
.rf-fin, .rf-sail { transform-box: fill-box; transform-origin: 50% 50%; animation: rf-fin 2.2s ease-in-out infinite; }
.rf-pec, .rf-whisker { transform-box: view-box; animation: rf-pec .9s ease-in-out infinite; }
.rf-whisker { animation-duration: 3.2s; }
.rf-leaf { transform-box: fill-box; transform-origin: 50% 100%; animation: rf-leaf 3s ease-in-out infinite; }
.rf-twinkle { animation: rf-twinkle 2.4s ease-in-out infinite; }
.rf-trail { animation: rf-trail 2.8s ease-out infinite; }
.anim-paused * { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .rf-breathe, .rf-bob, .rf-glide, .rf-tail, .rf-veil, .rf-fin, .rf-sail, .rf-pec, .rf-whisker, .rf-leaf, .rf-twinkle, .rf-trail { animation: none; }
}
`;

export function RarityFishStyles() {
  return <style>{RF_STYLES}</style>;
}

/**
 * Pauses an animated SVG while it is off screen (CSS animations + SMIL
 * gradients), so scrolling past it costs nothing. Shared with the hero tank.
 */
export function usePauseOffscreen(ref: RefObject<SVGSVGElement | null>) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting;
        svg.classList.toggle("anim-paused", !on);
        if (on) svg.unpauseAnimations();
        else svg.pauseAnimations();
      },
      { rootMargin: "120px" },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [ref]);
}

export default function RarityFish({ rarity, className = "" }: { rarity: Rarity; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  usePauseOffscreen(svgRef);
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const flows = rarity === "mystic" || rarity === "legendary";
  const id = `rf${raw}${flows ? "flow" : ""}`;

  const palette: Record<Rarity, { base: string; accent: string; line: string; halo: number; haloR: number }> = {
    common: { base: TEAL, accent: TEAL, line: TEAL, halo: 0.1, haloR: 70 },
    rare: { base: TEAL, accent: "#5b8cff", line: `url(#${id}-line)`, halo: 0.12, haloR: 74 },
    mystic: { base: "#b98cff", accent: "#b47bff", line: `url(#${id}-line)`, halo: 0.18, haloR: 84 },
    legendary: { base: "#ffe08a", accent: "#c4a1ff", line: `url(#${id}-line)`, halo: 0.24, haloR: 100 },
  };
  const p = palette[rarity];
  const ink: Ink = { id, line: p.line, base: p.base, accent: p.accent };
  const Species = SPECIES[rarity];
  // size follows each species (the app dropped the old "legendary = 1.2x" rule);
  // the sea dragon is drawn a bit larger because it is a long-bodied species
  const scale = rarity === "legendary" ? 1.2 : rarity === "rare" ? 0.92 : 1;
  // long tails / bodies sit left of the head; nudge them back to the center
  const shift = { common: 8, rare: 4, mystic: 26, legendary: 18 }[rarity];
  const motion = rarity === "legendary" ? "rf-glide" : "rf-bob";

  return (
    <svg ref={svgRef} viewBox="-130 -88 260 176" className={className} aria-hidden="true">
      <defs>
        {/* neon tube: wide bloom + near bloom + the crisp drawing, in one pass */}
        <filter id={`${id}-glow`} x="-25%" y="-30%" width="150%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="wideBlur" />
          <feComponentTransfer in="wideBlur" result="wide">
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="nearBlur" />
          <feComponentTransfer in="nearBlur" result="near">
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="near" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={p.accent} stopOpacity={p.halo * 1.6} />
          <stop offset="55%" stopColor={p.accent} stopOpacity={p.halo * 0.6} />
          <stop offset="100%" stopColor={p.accent} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-eyeglow`}>
          <stop offset="0%" stopColor={p.base} stopOpacity={0.45} />
          <stop offset="100%" stopColor={p.base} stopOpacity={0} />
        </radialGradient>
        {/* body: darker on the back, lighter at the belly */}
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.base} stopOpacity={0.34} />
          <stop offset="100%" stopColor={p.base} stopOpacity={0.06} />
        </linearGradient>
        <radialGradient id={`${id}-sheen`}>
          <stop offset="0%" stopColor={p.accent} stopOpacity={rarity === "common" ? 0 : 0.55} />
          <stop offset="100%" stopColor={p.accent} stopOpacity={0} />
        </radialGradient>
        {rarity === "rare" && (
          <linearGradient id={`${id}-line`} gradientUnits="userSpaceOnUse" x1="-70" y1="0" x2="40" y2="0">
            <stop offset="0%" stopColor={TEAL} />
            <stop offset="55%" stopColor={TEAL} />
            <stop offset="100%" stopColor="#6f9bff" />
          </linearGradient>
        )}
        {rarity === "mystic" && (
          <linearGradient id={`${id}-line`} gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="20" y2="0" spreadMethod="reflect">
            <stop offset="0%" stopColor={TEAL} />
            <stop offset="50%" stopColor="#c08bff" />
            <stop offset="100%" stopColor={TEAL} />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="240 0" dur="5s" repeatCount="indefinite" />
          </linearGradient>
        )}
        {rarity === "legendary" && (
          <linearGradient id={`${id}-line`} gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="60" y2="0" spreadMethod="reflect">
            <stop offset="0%" stopColor="#ffd84a" />
            <stop offset="50%" stopColor="#c08bff" />
            <stop offset="100%" stopColor={TEAL} />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="320 0" dur="6s" repeatCount="indefinite" />
          </linearGradient>
        )}
        {flows && (
          <linearGradient id={`${id}-flow`} gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="40" y2="0" spreadMethod="reflect">
            <stop offset="0%" stopColor={rarity === "legendary" ? "#ffd84a" : TEAL} stopOpacity={0} />
            <stop offset="50%" stopColor={rarity === "legendary" ? "#c08bff" : "#c08bff"} stopOpacity={0.35} />
            <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
            <animateTransform attributeName="gradientTransform" type="translate" from="-140 0" to="140 0" dur="4s" repeatCount="indefinite" />
          </linearGradient>
        )}
      </defs>

      <g transform={`translate(${shift} 0)`}>
      {/* soft bloom around the creature (wider for higher tiers) */}
      <ellipse cx={-14} cy={0} rx={p.haloR * 1.25} ry={p.haloR * 0.7} fill={`url(#${id}-halo)`} />

      {rarity === "legendary" && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(${-112 + (i % 3) * 4} ${10 + ((i * 7) % 14) - 7})`}>
              <path
                d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z"
                fill="#fff6c8"
                className="rf-trail"
                style={{ animationDelay: `${i * 0.55}s` }}
              />
            </g>
          ))}
        </g>
      )}

      <g className={motion}>
        <g className="rf-breathe" transform={`scale(${scale})`} filter={`url(#${id}-glow)`}>
          <Species ink={ink} />
        </g>
      </g>
      </g>
    </svg>
  );
}
