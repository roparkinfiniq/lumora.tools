import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, Github, Mail, Type } from "lucide-react";
import { BETA, BETA_PATH, DELETE_PATH, PRIVACY_PATH } from "../data/doquarium";

// Site footer. On the Korean Doquarium pages (they set <html lang="ko">) it speaks Korean and its
// Doquarium links stay in Korean (/ko), like the pages' own links do.

/** The page language the current view set on <html> (Doquarium pages switch it to "ko") */
function useDocLang() {
  const [lang, setLang] = useState(() => document.documentElement.lang);
  useEffect(() => {
    const o = new MutationObserver(() => setLang(document.documentElement.lang));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    // the page above may have switched the language before this footer started listening
    setLang(document.documentElement.lang);
    return () => o.disconnect();
  }, []);
  return lang;
}

const COPY = {
  en: {
    tagline: "A playground of curious little web applications. Built with lots of coffee and a little bit of magic.",
    connect: "Connect",
    email: "Email",
    explore: "Explore",
    utilities: "Utilities",
    journal: "Journal",
    about: "About",
    doquarium: "Doquarium",
    privacy: "Privacy Policy",
    delete: "Delete Account",
    beta: "Beta Testing",
    note: "No cookies · Files stay in your browser",
  },
  ko: {
    tagline: "호기심으로 만든 작은 웹 도구들의 놀이터. 커피는 많이, 마법은 조금 넣어 만들었어요.",
    connect: "연락",
    email: "이메일",
    explore: "둘러보기",
    utilities: "도구",
    journal: "저널",
    about: "소개",
    doquarium: "두쿠아리움",
    privacy: "개인정보처리방침",
    delete: "계정 삭제",
    beta: "베타 테스트",
    note: "쿠키 없음 · 파일은 브라우저 안에서만",
  },
};

export default function SiteFooter({ onOpen }: { onOpen: (view: string) => void }) {
  const ko = useDocLang() === "ko";
  const t = ko ? COPY.ko : COPY.en;

  // Doquarium pages: open them in Korean when we're in Korean (the page reads its language from the address)
  const openDoquarium = (e: MouseEvent, view: string, base: string) => {
    e.preventDefault();
    if (ko) window.history.pushState({ view }, "", `${base}/ko`);
    onOpen(view);
  };

  const link = "hover:text-white transition-colors text-left flex items-center gap-2";
  return (
    <footer className="bg-lumora-bg/80 border-t border-white/5 py-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <button onClick={() => onOpen("home")} className="font-display text-3xl font-bold text-white mb-6 block text-left group">
              lumora
              <span className="text-lumora-accent group-hover:text-lumora-highlight transition-colors">.tools</span>
            </button>
            <p className="max-w-sm text-lumora-sub font-medium leading-relaxed">{t.tagline}</p>
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-white/50 mb-6 uppercase tracking-widest">{t.connect}</h4>
            <nav className="flex flex-col gap-4 text-base font-medium text-lumora-sub">
              <a href="https://github.com/roparkinfiniq/lumora.tools" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-3">
                <Github className="h-5 w-5 text-white/40" /> GitHub
              </a>
              <a href="mailto:raonepark@gmail.com" className="hover:text-white transition-colors flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/40" /> {t.email}
              </a>
              <a href="https://lumora-lab.tistory.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-3">
                <Type className="h-5 w-5 text-white/40" /> Tistory
              </a>
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-white/50 mb-6 uppercase tracking-widest">{t.explore}</h4>
            <nav className="flex flex-col gap-4 text-base font-medium text-lumora-sub">
              <button onClick={() => onOpen("utilities")} className={link}>
                <ArrowRight className="h-4 w-4 text-lumora-highlight/50" /> {t.utilities}
              </button>
              <button onClick={() => onOpen("insights")} className={link}>
                <ArrowRight className="h-4 w-4 text-lumora-blue/50" /> {t.journal}
              </button>
              <button onClick={() => onOpen("studio")} className={link}>
                <ArrowRight className="h-4 w-4 text-lumora-accent/50" /> {t.about}
              </button>
              <a href={ko ? "/doquarium/ko" : "/doquarium"} onClick={(e) => openDoquarium(e, "doquarium", "/doquarium")} className={link}>
                <ArrowRight className="h-4 w-4 text-[#3ef2ff]/50" /> {t.doquarium}
              </a>
              {/* sub-links line up under "Doquarium" (past its arrow) */}
              <div className="flex flex-col gap-3 pl-6 -mt-1">
                {[
                  { view: "doquarium-privacy", href: PRIVACY_PATH, label: t.privacy },
                  { view: "doquarium-delete", href: DELETE_PATH, label: t.delete },
                  ...(BETA.recruiting ? [{ view: "doquarium-beta", href: BETA_PATH, label: t.beta }] : []),
                ].map((l) => (
                  <a
                    key={l.view}
                    href={ko ? `${l.href}/ko` : l.href}
                    onClick={(e) => openDoquarium(e, l.view, l.href)}
                    className="hover:text-white transition-colors text-left text-sm text-white/50"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
          <span className="text-xs font-display font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">© 2026 Lumora. Made with 🤍.</span>
          <div className="flex items-center gap-3 text-xs font-display font-bold tracking-widest text-lumora-sub">
            <span className="h-2 w-2 rounded-full bg-lumora-highlight" aria-hidden="true" />
            {t.note}
          </div>
        </div>
      </div>
    </footer>
  );
}
