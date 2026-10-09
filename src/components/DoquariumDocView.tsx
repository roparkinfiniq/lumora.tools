import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PolicyDoc, PolicyLang } from "../data/doquarium";

// Shared layout for Doquarium's legal pages (privacy policy, account deletion).
// Korean is served at `${basePath}/ko` so the link can be given to Korean users
// and app stores directly. English is the default.
export function docLangFromPath(path: string, basePath: string): PolicyLang {
  return path.startsWith(`${basePath}/ko`) ? "ko" : "en";
}

export default function DoquariumDocView({
  docs,
  basePath,
  onBack,
}: {
  docs: Record<PolicyLang, PolicyDoc>;
  basePath: string;
  onBack: () => void;
}) {
  const [lang, setLang] = useState<PolicyLang>(() => docLangFromPath(window.location.pathname, basePath));
  const doc = docs[lang];

  useEffect(() => {
    const url = lang === "ko" ? `${basePath}/ko` : basePath;
    // App pushes the base URL when navigating here; only swap the language part,
    // so the previous page stays in history.
    const onThisPage = window.location.pathname.startsWith(basePath);
    if (onThisPage && window.location.pathname !== url) {
      window.history.replaceState(window.history.state, "", url);
    }
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang, basePath]);

  return (
    <div className="container max-w-3xl mx-auto px-6 pt-12 pb-32">
      <div className="flex items-center justify-between gap-4 mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-display font-bold text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Doquarium
        </button>
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
              {l === "en" ? "English" : "한국어"}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
        {doc.heading}
      </h1>
      {doc.effective && <p className="text-sm font-mono text-white/40 mb-10">{doc.effective}</p>}
      <p className={`text-base md:text-lg text-white/75 leading-relaxed mb-14 ${doc.effective ? "" : "mt-6"}`}>{doc.intro}</p>

      <div className="flex flex-col gap-12">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight mb-5">
              {section.title}
            </h2>

            {section.table && doc.tableHeaders && (
              <>
                {/* Table on wide screens */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 mb-6">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-white/60 font-display">
                      <tr>
                        {doc.tableHeaders.map((h) => (
                          <th key={h} className="px-4 py-3 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {section.table.map((row) => (
                        <tr key={row.when} className="align-top">
                          <td className="px-4 py-4 text-white font-medium w-[22%]">{row.when}</td>
                          <td className="px-4 py-4 text-white/70 leading-relaxed">{row.what}</td>
                          <td className="px-4 py-4 text-white/70 w-[18%]">{row.why}</td>
                          <td className="px-4 py-4 text-white/70 w-[20%]">{row.where}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Stacked cards on phones */}
                <div className="md:hidden flex flex-col gap-3 mb-6">
                  {section.table.map((row) => (
                    <div key={row.when} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                      <p className="text-white font-bold mb-3">{row.when}</p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                        <dt className="text-white/40">{doc.tableHeaders![1]}</dt>
                        <dd className="text-white/75">{row.what}</dd>
                        <dt className="text-white/40">{doc.tableHeaders![2]}</dt>
                        <dd className="text-white/75">{row.why}</dd>
                        <dt className="text-white/40">{doc.tableHeaders![3]}</dt>
                        <dd className="text-white/75">{row.where}</dd>
                      </dl>
                    </div>
                  ))}
                </div>
              </>
            )}

            {section.ordered ? (
              <ol className="flex flex-col gap-3">
                {section.items.map((item, i) => (
                  <li key={item} className="flex gap-4 items-start rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                    <span className="h-7 w-7 shrink-0 rounded-full bg-[#3ef2ff]/10 border border-[#3ef2ff]/30 text-[#3ef2ff] text-xs font-mono font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-white/80 leading-relaxed pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li key={item} className="relative pl-5 text-white/75 leading-relaxed">
                    <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-[#3ef2ff]/70" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
