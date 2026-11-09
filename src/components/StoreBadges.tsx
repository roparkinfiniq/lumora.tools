import type { MouseEvent } from "react";
import { APP_STORE_URL, PLAY_URL, type PolicyLang } from "../data/doquarium";

// The official store badges (Google Play "Get it on" PNG, Apple "Download on the App Store" SVG),
// in public/media/doquarium/badges/ and trimmed to the badge edge. Keep them unchanged:
// both stores ask for the artwork as is (no recolor or stretch), with a little room around it.

const ALT: Record<PolicyLang, { play: string; apple: string }> = {
  en: { play: "Get it on Google Play", apple: "Download on the App Store" },
  ko: { play: "Google Play에서 다운로드", apple: "App Store에서 다운로드" },
};

export default function StoreBadges({
  lang,
  size = "lg",
  onClick,
}: {
  lang: PolicyLang;
  /** lg: page hero (52px tall, 44px on phones so both fit on one line) · sm: cards (44px) */
  size?: "lg" | "sm";
  onClick?: (e: MouseEvent) => void;
}) {
  const h = size === "lg" ? "h-11 sm:h-[52px]" : "h-11";
  const link = "inline-block rounded-[10px] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ef2ff]";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} className={link}>
        <img src={`/media/doquarium/badges/google-play-${lang}.png`} alt={ALT[lang].play} className={`${h} w-auto`} />
      </a>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={onClick} className={link}>
        <img src={`/media/doquarium/badges/app-store-${lang}.svg`} alt={ALT[lang].apple} className={`${h} w-auto`} />
      </a>
    </div>
  );
}
