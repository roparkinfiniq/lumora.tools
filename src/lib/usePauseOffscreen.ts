import { useEffect, type RefObject } from "react";

// CSS animations paused by this hook need the rule below somewhere on the page
// (NeonTank includes it): .anim-paused * { animation-play-state: paused !important; }

/**
 * Pauses an animated SVG while it is off screen (CSS animations + SMIL
 * gradients), so scrolling past it costs nothing.
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
