import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Mail } from "lucide-react";
import { BETA, BETA_PATH, DELETE_PATH, DOQUARIUM, PRIVACY_PATH, type PolicyLang } from "../data/doquarium";
import { DOQUARIUM_HOME } from "../data/doquariumHome";
import { applySeo } from "../seo";
import DoquariumReel from "./DoquariumReel";

// Doquarium official homepage: /doquarium (English) and /doquarium/ko (Korean).
// Copy lives in src/data/doquariumHome.ts; screenshots are the store images in
// public/media/doquarium/{en,ko}/ (from the doquarium repo's
// design/brand/google-play/screenshots/store/, re-encoded to WebP).

export const DOQUARIUM_PATH = "/doquarium";
const TEAL = "#3ef2ff";

export function doquariumLangFromPath(path: string): PolicyLang {
  return /\/ko\/?$/.test(path) ? "ko" : "en";
}

const SEO: Record<PolicyLang, { title: string; description: string }> = {
  en: {
    title: "Doquarium — Finish a Task, Feed Your Fish | A Neon To-Do App",
    description:
      "Doquarium is a to-do app with a neon fish tank. Finish tasks to feed and grow your fish, hatch rare eggs, and share a tank with friends. Android beta now, iPhone coming soon.",
  },
  ko: {
    title: "두쿠아리움 — 할 일 끝내면 물고기가 냠! 네온 어항 할 일 앱",
    description:
      "두쿠아리움은 네온 어항이 있는 할 일 앱이에요. 할 일을 끝내면 물고기가 먹고 자라고, 알을 깨고, 친구랑 같은 어항을 키워요. 지금 안드로이드 베타 중, 아이폰도 곧.",
  },
};

function StoreBadge({ store, label }: { store: string; label: string }) {
  return (
    <div className="flex items-center justify-between h-14 px-5 rounded-xl bg-white/[0.03] border border-white/10 text-white/70">
      <span className="font-display font-bold text-sm">{store}</span>
      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#3ef2ff] bg-[#3ef2ff]/10 border border-[#3ef2ff]/25 px-2.5 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}

function Screenshot({ lang, shot, alt }: { lang: PolicyLang; shot: string; alt: string }) {
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="absolute -inset-8 bg-[#3ef2ff]/[0.07] blur-[70px] rounded-full pointer-events-none" />
      <img
        src={`/media/doquarium/${lang}/${shot}.webp`}
        alt={alt}
        width={720}
        height={1280}
        loading="lazy"
        decoding="async"
        className="relative w-full h-auto rounded-[28px] border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

export default function DoquariumView({ onOpen }: { onOpen: (view: string) => void }) {
  const [lang, setLang] = useState<PolicyLang>(() => doquariumLangFromPath(window.location.pathname));
  const t = DOQUARIUM_HOME[lang];

  useEffect(() => {
    const url = lang === "ko" ? `${DOQUARIUM_PATH}/ko` : DOQUARIUM_PATH;
    const path = window.location.pathname.replace(/\/$/, "");
    if ((path === DOQUARIUM_PATH || path === `${DOQUARIUM_PATH}/ko`) && path !== url) {
      window.history.replaceState(window.history.state, "", url);
    }
    document.documentElement.lang = lang;
    applySeo(SEO[lang], url);
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  // Open a sub-page (privacy, account deletion, beta) in the same language.
  const open = (view: string, base: string) => (e: MouseEvent) => {
    e.preventDefault();
    window.history.pushState({ view }, "", lang === "ko" ? `${base}/ko` : base);
    onOpen(view);
  };
  const subHref = (base: string) => (lang === "ko" ? `${base}/ko` : base);

  return (
    <div className="pt-6">
      {/* Language */}
      <div className="container max-w-6xl mx-auto px-6 flex justify-end mb-6">
        <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10" role="group" aria-label="Language">
          {(["en", "ko"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-colors ${
                lang === l ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {DOQUARIUM_HOME[l].langLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2">
            <div className="inline-flex px-3 py-1.5 rounded-[12px] bg-white/[0.03] border border-white/10 mb-8 items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ef2ff] shadow-[0_0_8px_rgba(62,242,255,0.9)]" />
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-white/80">
                {BETA.recruiting ? t.badgeBeta : t.badgeSoon}
              </span>
            </div>
            {lang === "ko" && (
              <p className="text-sm font-display font-bold tracking-[0.3em] text-[#3ef2ff] mb-2">DOQUARIUM</p>
            )}
            <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 tracking-tight leading-[1.1] mb-6">
              {lang === "ko" ? "두쿠아리움." : "Doquarium."}
            </h1>
            <p className="text-xl md:text-2xl font-display font-bold text-[#3ef2ff] mb-6 [text-shadow:0_0_18px_rgba(62,242,255,0.45)]">
              {t.tagline}
            </p>
            <p className="text-base sm:text-lg text-white/60 font-medium mb-10 leading-relaxed max-w-xl">{t.lead}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <StoreBadge store="Google Play" label={t.storeSoon} />
              <StoreBadge store="App Store" label={t.storeSoon} />
            </div>
            {BETA.recruiting && (
              <a
                href={subHref(BETA_PATH)}
                onClick={open("doquarium-beta", BETA_PATH)}
                className="mt-4 w-full max-w-lg flex items-center justify-between h-14 px-5 rounded-xl bg-[#3ef2ff] text-[#062226] font-display font-bold hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(62,242,255,0.45)] transition-all"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm">{t.betaCta}</span>
                  <span className="text-[11px] font-medium text-[#062226]/60">{t.betaSub}</span>
                </span>
                <ArrowRight className="h-5 w-5" />
              </a>
            )}
            <a
              href={subHref("/doquarium/app")}
              onClick={open("doquarium-app", "/doquarium/app")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-display font-bold text-[#8ff7ff]/70 hover:text-[#8ff7ff] transition-colors"
            >
              {t.webCta} <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-1/2 w-full">
            {/* key: a fresh player per language, so the Korean page plays the Korean video */}
            <div key={lang}>
              <DoquariumReel lang={lang} label={t.reelLabel} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="container max-w-6xl mx-auto px-6 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-6">{t.storyTitle}</h2>
          {t.story.map((p) => (
            <p key={p} className="text-lg text-lumora-sub font-medium leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Features with real app screens */}
      <section className="container max-w-6xl mx-auto px-6 mb-28 flex flex-col gap-24">
        {t.features.map((f, i) => (
          <div key={f.shot} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
            <div className="md:w-1/2 w-full">
              <Screenshot lang={lang} shot={f.shot} alt={f.alt} />
            </div>
            <div className="md:w-1/2 w-full max-w-xl">
              <span className="font-mono text-xs text-[#3ef2ff]/60">0{i + 1}</span>
              <h3 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight mt-2 mb-5">{f.title}</h3>
              {f.body.map((p) => (
                <p key={p} className="text-base md:text-lg text-lumora-sub font-medium leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* More */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-10">{t.moreTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.more.map((m) => (
            <div key={m.title} className="rounded-[24px] bg-[#0c0c0e] border border-white/5 p-7">
              <h3 className="text-lg font-display font-bold text-white mb-2">{m.title}</h3>
              <p className="text-sm text-lumora-sub font-medium leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">{t.principlesTitle}</h2>
          <p className="text-lg text-lumora-sub font-medium">{t.principlesSub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.principles.map((p) => (
            <div key={p.title} className="border-l-2 pl-5" style={{ borderColor: `${TEAL}55` }}>
              <h3 className="font-display font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-lumora-sub font-medium leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-6xl mx-auto px-6 mb-28">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-8">{t.faqTitle}</h2>
        <div className="max-w-3xl flex flex-col gap-3">
          {t.faq.map((item) => (
            <details key={item.q} className="group rounded-2xl bg-white/[0.02] border border-white/5 open:border-[#3ef2ff]/20">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-display font-bold text-white">
                {item.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-white/40 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm md:text-base text-lumora-sub font-medium leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact + legal */}
      <section className="container max-w-6xl mx-auto px-6 mb-32">
        <div className="relative max-w-4xl mx-auto rounded-[40px] border border-[#3ef2ff]/15 bg-[#0c0c0e] px-8 py-14 md:px-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#3ef2ff]/15 blur-[100px] pointer-events-none" />
          <h2 className="relative text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4">{t.contactTitle}</h2>
          <p className="relative text-lumora-sub mb-10 max-w-xl mx-auto">{t.contactBody}</p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            {BETA.recruiting && (
              <a
                href={subHref(BETA_PATH)}
                onClick={open("doquarium-beta", BETA_PATH)}
                className="flex items-center gap-2 px-6 h-12 rounded-xl bg-[#3ef2ff] text-[#062226] font-display font-bold text-sm hover:-translate-y-0.5 transition-transform"
              >
                {t.betaCta} <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <a
              href={`mailto:${DOQUARIUM.contactEmail}`}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white text-black font-display font-bold text-sm hover:-translate-y-0.5 transition-transform"
            >
              <Mail className="h-4 w-4" /> {DOQUARIUM.contactEmail}
            </a>
          </div>
          <div className="relative mt-8 flex items-center justify-center gap-6 text-xs font-medium text-white/40">
            <a href={subHref(PRIVACY_PATH)} onClick={open("doquarium-privacy", PRIVACY_PATH)} className="hover:text-white underline underline-offset-4 decoration-white/20">
              {t.privacy}
            </a>
            <a href={subHref(DELETE_PATH)} onClick={open("doquarium-delete", DELETE_PATH)} className="hover:text-white underline underline-offset-4 decoration-white/20">
              {t.deleteAccount}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
