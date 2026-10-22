import { useEffect, useRef, useState } from "react";
import { Volume1, Volume2, VolumeX, Play } from "lucide-react";

// Doquarium promo reel (real app footage, English captions, 32s vertical).
// Web copy of 래원's "doquarium-reel-02-deep" (720x1280, 30fps, ~1.5MB) in
// public/media. Nothing downloads until the reel scrolls into view; it then
// plays muted and loops, and pauses again when scrolled away. Sound is opt-in.
// With "reduce motion" on, it waits for a tap instead of autoplaying.
// Sound: the file is mastered quiet for the web (about -24 LUFS). Turning sound
// on starts at half volume and shows a volume slider (remembered per browser).
// iPhone Safari ignores page volume, so there only on/off is shown.

const SRC = "/media/doquarium-reel.mp4";
const POSTER = "/media/doquarium-reel-poster.jpg";
const VOLUME_KEY = "doquarium_reel_volume";

function savedVolume() {
  try {
    const v = Number(localStorage.getItem(VOLUME_KEY));
    return v > 0 && v <= 1 ? v : 0.5;
  } catch {
    return 0.5;
  }
}

/** iPhone Safari keeps media volume at 1 no matter what the page sets */
function canSetVolume() {
  try {
    const probe = document.createElement("video");
    probe.volume = 0.5;
    return probe.volume === 0.5;
  } catch {
    return false;
  }
}

export default function DoquariumReel({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(savedVolume);
  const [volumeAdjustable] = useState(canSetVolume);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduceMotion]);

  const togglePlay = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.volume = volume;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) video.play().catch(() => {});
  };

  const changeVolume = (next: number) => {
    const video = ref.current;
    setVolume(next);
    if (video) {
      video.volume = next;
      video.muted = next === 0;
      setMuted(video.muted);
    }
    if (next > 0) {
      try {
        localStorage.setItem(VOLUME_KEY, String(next));
      } catch {
        // private window: just not remembered
      }
    }
  };

  const SoundIcon = muted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="absolute -inset-10 bg-[#3ef2ff]/10 blur-[90px] rounded-full pointer-events-none" />
      <div className="relative rounded-[40px] border-[6px] border-[#1c2427] bg-black shadow-[0_0_60px_rgba(62,242,255,0.15),0_30px_60px_-20px_rgba(0,0,0,0.9)] overflow-hidden aspect-[9/16]">
        <video
          ref={ref}
          src={SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
          aria-label={label}
        />
        {paused && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Play video"
          >
            <Play className="h-7 w-7 ml-1" />
          </button>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/55 border border-white/15 backdrop-blur-sm p-0.5">
          {!muted && volumeAdjustable && (
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-24 ml-3 accent-[#3ef2ff] cursor-pointer"
            />
          )}
          <button
            onClick={toggleSound}
            className="h-9 w-9 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors"
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
          >
            <SoundIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
