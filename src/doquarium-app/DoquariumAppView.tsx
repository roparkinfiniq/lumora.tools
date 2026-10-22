import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Lock, LogOut, Repeat, Smartphone, Users } from "lucide-react";
import { applySeo } from "../seo";
import { doneToday, isVisible, sortTodos, type WebBackup } from "./backup";
import { loadBackup, signInWithGoogle, signOutWeb, watchUser, type User } from "./firebase";

// Doquarium on the web (/doquarium/app, Korean /doquarium/app/ko): sign in with
// the same Google account as the app and see your tanks' to-dos. Step 1 of the
// web to-do plan (doquarium repo docs/10 "PC에서 쓰기"): read-only, from the
// phone's sign-in backup. Adding / finishing / editing / deleting comes with the
// next app update (the app reads a server "mailbox"). The fish stays on the phone.

type Lang = "en" | "ko";
export const DOQUARIUM_APP_PATH = "/doquarium/app";

const COPY = {
  en: {
    back: "Doquarium",
    title: "Doquarium on the web",
    sub: "See your to-dos on any computer. Your fish stays on your phone.",
    signInTitle: "Sign in to see your tanks",
    signInBody:
      "Use the same Google account you signed in with in the app (Settings → Account). Signing in with Apple on the web is coming soon.",
    signIn: "Sign in with Google",
    signingIn: "Signing in…",
    signInFailed: "Couldn't sign in. Please try again.",
    loading: "Loading your tanks…",
    noBackupTitle: "No backup yet",
    noBackupBody: (email: string) =>
      `We couldn't find any records for ${email}. In the app, open Settings → Account and sign in with this Google account, then come back here.`,
    loadFailed: "Couldn't load your tanks. Check your connection and try again.",
    retry: "Try again",
    myTank: "My tank",
    shared: "Shared tank",
    today: "Today",
    nothing: "Nothing left for today.",
    finishedToday: (n: number) => `Finished today (${n})`,
    due: (d: string) => `Due ${d}`,
    onlyMe: "Only me",
    repeats: "Repeats",
    synced: (t: string) => `Last updated from your phone: ${t}`,
    syncNote: "The list updates when your phone saves a backup (while the app is open).",
    comingSoon: "Adding, finishing, editing, and deleting to-dos from the web arrives with the next app update.",
    signOut: "Sign out",
    openApp: "Your fish eats when you finish to-dos in the app.",
  },
  ko: {
    back: "두쿠아리움",
    title: "웹에서 보는 두쿠아리움",
    sub: "어느 컴퓨터에서든 내 할 일을 볼 수 있어요. 물고기는 폰에서 기다려요.",
    signInTitle: "로그인하고 내 어항 보기",
    signInBody: "앱에서 로그인한 것과 같은 Google 계정으로 로그인해 주세요 (앱의 설정 → 계정). 웹의 Apple 로그인은 곧 열려요.",
    signIn: "Google로 로그인",
    signingIn: "로그인하는 중…",
    signInFailed: "로그인하지 못했어요. 다시 해 주세요.",
    loading: "내 어항을 불러오는 중…",
    noBackupTitle: "아직 백업이 없어요",
    noBackupBody: (email: string) =>
      `${email} 계정의 기록을 찾지 못했어요. 앱의 설정 → 계정에서 이 Google 계정으로 로그인한 뒤 다시 열어 주세요.`,
    loadFailed: "어항을 불러오지 못했어요. 인터넷을 확인하고 다시 해 주세요.",
    retry: "다시 불러오기",
    myTank: "내 어항",
    shared: "단체 어항",
    today: "오늘 할 일",
    nothing: "오늘 남은 할 일이 없어요.",
    finishedToday: (n: number) => `오늘 끝낸 일 (${n})`,
    due: (d: string) => `${d}까지`,
    onlyMe: "나만 보기",
    repeats: "반복",
    synced: (t: string) => `폰에서 마지막으로 가져온 때: ${t}`,
    syncNote: "목록은 폰이 백업할 때(앱을 켜 둔 동안) 새로 바뀌어요.",
    comingSoon: "웹에서 할 일 추가 · 끝내기 · 고치기 · 지우기는 다음 앱 업데이트와 함께 열려요.",
    signOut: "로그아웃",
    openApp: "할 일은 앱에서 끝내면 물고기가 냠 먹어요.",
  },
} as const;

const SEO: Record<Lang, { title: string; description: string }> = {
  en: { title: "Doquarium on the Web — Your To-Dos on Any Computer", description: "Sign in with Google to see your Doquarium tanks and to-dos on any computer." },
  ko: { title: "웹에서 보는 두쿠아리움 — 어느 컴퓨터에서든 내 할 일", description: "Google로 로그인하면 어느 컴퓨터에서든 두쿠아리움 어항과 할 일을 볼 수 있어요." },
};

type State =
  | { kind: "checking" }
  | { kind: "signedOut"; error?: boolean; busy?: boolean }
  | { kind: "loading"; user: User }
  | { kind: "ready"; user: User; backup: WebBackup }
  | { kind: "empty"; user: User }
  | { kind: "error"; user: User };

export default function DoquariumAppView({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<Lang>(() => (/\/ko\/?$/.test(window.location.pathname) ? "ko" : "en"));
  const t = COPY[lang];
  const [state, setState] = useState<State>({ kind: "checking" });
  const [tankId, setTankId] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const url = lang === "ko" ? `${DOQUARIUM_APP_PATH}/ko` : DOQUARIUM_APP_PATH;
    if (window.location.pathname.startsWith(DOQUARIUM_APP_PATH) && window.location.pathname !== url) {
      window.history.replaceState(window.history.state, "", url);
    }
    document.documentElement.lang = lang;
    applySeo(SEO[lang], url);
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  const load = async (user: User) => {
    setState({ kind: "loading", user });
    try {
      const backup = await loadBackup(user.uid);
      if (!backup) setState({ kind: "empty", user });
      else {
        setState({ kind: "ready", user, backup });
        setTankId((id) => (id !== null && backup.tanks.some((x) => x.id === id) ? id : backup.activeId));
      }
    } catch {
      setState({ kind: "error", user });
    }
  };

  useEffect(() => watchUser((user) => (user ? load(user) : setState({ kind: "signedOut" }))), []);

  const signIn = async () => {
    setState({ kind: "signedOut", busy: true });
    try {
      await signInWithGoogle();
    } catch {
      setState({ kind: "signedOut", error: true });
    }
  };

  const fmt = useMemo(() => {
    const locale = lang === "ko" ? "ko-KR" : "en-US";
    return {
      day: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
      time: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    };
  }, [lang]);

  const now = new Date();
  const ready = state.kind === "ready" ? state : null;
  const tank = ready?.backup.tanks.find((x) => x.id === tankId) ?? ready?.backup.tanks[0];
  const open = tank ? sortTodos(tank.todos.filter((x) => isVisible(x, now))) : [];
  const done = tank ? tank.todos.filter((x) => doneToday(x, now)).sort((a, b) => b.doneAt!.getTime() - a.doneAt!.getTime()) : [];
  const user = "user" in state ? state.user : null;

  return (
    <div className="container max-w-3xl mx-auto px-6 pt-12 pb-32">
      <div className="flex items-center justify-between gap-4 mb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-display font-bold text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </button>
        <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10" role="group" aria-label="Language">
          {(["en", "ko"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-colors ${lang === l ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
            >
              {l === "en" ? "English" : "한국어"}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-3">{t.title}</h1>
      <p className="text-base md:text-lg text-lumora-sub font-medium mb-10">{t.sub}</p>

      {(state.kind === "checking" || state.kind === "loading") && (
        <p className="text-white/50 font-medium animate-pulse">{t.loading}</p>
      )}

      {state.kind === "signedOut" && (
        <div className="rounded-[28px] border border-[#3ef2ff]/15 bg-[#0c0c0e] p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{t.signInTitle}</h2>
          <p className="text-sm md:text-base text-lumora-sub font-medium leading-relaxed mb-8">{t.signInBody}</p>
          <button
            onClick={signIn}
            disabled={state.busy}
            className="flex items-center justify-center gap-3 h-12 px-6 rounded-xl bg-white text-black font-display font-bold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60"
          >
            <GoogleMark /> {state.busy ? t.signingIn : t.signIn}
          </button>
          {state.error && <p className="mt-4 text-sm text-red-400">{t.signInFailed}</p>}
        </div>
      )}

      {state.kind === "empty" && (
        <div className="rounded-[28px] border border-white/10 bg-[#0c0c0e] p-8">
          <h2 className="text-xl font-display font-bold text-white mb-3">{t.noBackupTitle}</h2>
          <p className="text-sm md:text-base text-lumora-sub font-medium leading-relaxed">{t.noBackupBody(state.user.email ?? "")}</p>
        </div>
      )}

      {state.kind === "error" && (
        <div className="rounded-[28px] border border-white/10 bg-[#0c0c0e] p-8">
          <p className="text-sm md:text-base text-lumora-sub font-medium mb-5">{t.loadFailed}</p>
          <button onClick={() => load(state.user)} className="h-11 px-5 rounded-xl bg-white/10 border border-white/10 text-white font-display font-bold text-sm hover:bg-white/15">
            {t.retry}
          </button>
        </div>
      )}

      {ready && tank && (
        <>
          {ready.backup.tanks.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
              {ready.backup.tanks.map((x) => (
                <button
                  key={x.id || "first"}
                  onClick={() => setTankId(x.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 h-10 rounded-full text-sm font-display font-bold transition-colors ${
                    x.id === tank.id ? "bg-[#c9fbff] text-[#062226]" : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {x.shared && <Users className="h-3.5 w-3.5" />}
                  {x.name || t.myTank}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-[28px] border border-white/10 bg-[#0c0c0e] overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#3ef2ff]/70 mb-1">
                  {tank.name || t.myTank}
                  {tank.shared && <span className="text-white/30"> · {t.shared}</span>}
                </p>
                <h2 className="text-2xl font-display font-bold text-white">
                  {t.today} <span className="text-white/30 font-medium">{open.length}</span>
                </h2>
              </div>
            </div>

            {open.length === 0 ? (
              <p className="px-6 py-8 text-lumora-sub font-medium">{t.nothing}</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {open.map((x) => (
                  <li key={x.id} className="flex items-center gap-4 px-6 py-4">
                    <span className="h-5 w-5 shrink-0 rounded-full border-2 border-white/25" aria-hidden="true" />
                    <span className="flex-1 min-w-0 text-white font-medium break-words">{x.title}</span>
                    <span className="flex items-center gap-2 shrink-0 text-xs text-white/40">
                      {x.repeat && <Repeat className="h-3.5 w-3.5" aria-label={t.repeats} />}
                      {x.private && <Lock className="h-3.5 w-3.5" aria-label={t.onlyMe} />}
                      {x.dueDate && <span>{t.due(fmt.day.format(x.dueDate))}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {done.length > 0 && (
              <div className="border-t border-white/5">
                <button onClick={() => setShowDone((v) => !v)} className="w-full flex items-center justify-between px-6 py-4 text-sm font-display font-bold text-white/50 hover:text-white">
                  {t.finishedToday(done.length)}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showDone ? "rotate-180" : ""}`} />
                </button>
                {showDone && (
                  <ul className="pb-3">
                    {done.map((x) => (
                      <li key={x.id} className="flex items-center gap-4 px-6 py-2.5">
                        <span className="h-5 w-5 shrink-0 rounded-full bg-[#3ef2ff]/30 border-2 border-[#3ef2ff]/50" aria-hidden="true" />
                        <span className="flex-1 min-w-0 text-white/40 line-through break-words">{x.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 text-xs md:text-sm text-white/40 font-medium">
            {ready.backup.updatedAt && <p>{t.synced(fmt.time.format(ready.backup.updatedAt))}</p>}
            <p>{t.syncNote}</p>
            <p className="flex items-start gap-2 text-[#8ff7ff]/70">
              <Smartphone className="h-4 w-4 shrink-0 mt-0.5" /> {t.comingSoon}
            </p>
          </div>
        </>
      )}

      {user && (
        <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-white/5 text-sm">
          <span className="text-white/40 truncate">{user.email}</span>
          <button onClick={() => signOutWeb()} className="flex items-center gap-2 text-white/50 hover:text-white font-display font-bold">
            <LogOut className="h-4 w-4" /> {t.signOut}
          </button>
        </div>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}
