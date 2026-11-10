import type { MouseEvent } from "react";
import { APP_STORE_URL, PLAY_URL, type PolicyLang } from "../data/doquarium";

// Store buttons: white, the real store logos, both the same size (래원 2026-11-10 picked this
// over the official black badges, which looked heavy and blurry on the dark page).

const COPY: Record<PolicyLang, { play: [string, string]; apple: [string, string] }> = {
  en: { play: ["GET IT ON", "Google Play"], apple: ["Download on the", "App Store"] },
  ko: { play: ["다운로드", "Google Play"], apple: ["다운로드", "App Store"] },
};

function PlayLogo() {
  return (
    <svg viewBox="0 0 28.99 31.99" className="h-6 w-6 shrink-0" aria-hidden="true">
        <path d="M13.54 15.28.12 29.34a3.66 3.66 0 0 0 5.33 2.16l15.1-8.6Z" fill="#ea4335" />
        <path d="m27.11 12.89-6.53-3.74-7.35 6.45 7.38 7.28 6.48-3.7a3.54 3.54 0 0 0 1.5-4.79 3.62 3.62 0 0 0-1.5-1.5z" fill="#fbbc04" />
        <path d="M.12 2.66a3.57 3.57 0 0 0-.12.92v24.84a3.57 3.57 0 0 0 .12.92L14 15.64Z" fill="#4285f4" />
        <path d="m13.64 16 6.94-6.85L5.5.51A3.73 3.73 0 0 0 3.63 0 3.64 3.64 0 0 0 .12 2.65Z" fill="#34a853" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="7.5 7.5 22 25" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M24.76888,20.30068a4.94881,4.94881,0,0,1,2.35656-4.15206,5.06566,5.06566,0,0,0-3.99116-2.15768c-1.67924-.17626-3.30719,1.00483-4.1629,1.00483-.87227,0-2.18977-.98733-3.6085-.95814a5.31529,5.31529,0,0,0-4.47292,2.72787c-1.934,3.34842-.49141,8.26947,1.3612,10.97608.9269,1.32535,2.01018,2.8058,3.42763,2.7533,1.38706-.05753,1.9051-.88448,3.5794-.88448,1.65876,0,2.14479.88448,3.591.8511,1.48838-.02416,2.42613-1.33124,3.32051-2.66914a10.962,10.962,0,0,0,1.51842-3.09251A4.78205,4.78205,0,0,1,24.76888,20.30068Z" />
        <path d="M22.03725,12.21089a4.87248,4.87248,0,0,0,1.11452-3.49062,4.95746,4.95746,0,0,0-3.20758,1.65961,4.63634,4.63634,0,0,0-1.14371,3.36139A4.09905,4.09905,0,0,0,22.03725,12.21089Z" />
    </svg>
  );
}

export default function StoreBadges({
  lang,
  size = "lg",
  onClick,
}: {
  lang: PolicyLang;
  /** lg: page hero (52px tall; a little smaller on phones so both fit on one line) · sm: cards */
  size?: "lg" | "sm";
  onClick?: (e: MouseEvent) => void;
}) {
  const t = COPY[lang];
  const box = size === "lg" ? "h-12 w-[150px] sm:h-[52px] sm:w-[176px]" : "h-12 w-[168px]";
  const btn = `${box} flex items-center gap-2.5 px-4 rounded-[14px] bg-white text-[#0b0b0f] hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(62,242,255,0.35)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ef2ff]`;
  const label = (small: string, big: string) => (
    <span className="flex flex-col leading-[1.1] min-w-0">
      <span className="text-[10px] font-display font-bold tracking-wide text-black/55 whitespace-nowrap">{small}</span>
      <span className="text-base sm:text-[17px] font-display font-extrabold whitespace-nowrap">{big}</span>
    </span>
  );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} className={btn} aria-label={`${t.play[0]} ${t.play[1]}`}>
        <PlayLogo />
        {label(...t.play)}
      </a>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} className={btn} aria-label={`${t.apple[0]} ${t.apple[1]}`}>
        <AppleLogo />
        {label(...t.apple)}
      </a>
    </div>
  );
}
