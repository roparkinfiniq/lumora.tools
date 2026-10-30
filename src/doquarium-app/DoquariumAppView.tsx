import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowLeft, CalendarDays, Check, ChevronDown, Clock, CloudFog, Fish, Ghost, List, Lock, LogOut, Pencil, Plus, Repeat, Smartphone, Trash2, Users, X } from "lucide-react";
import { applySeo } from "../seo";
import {
  MAX_CATEGORIES,
  MAX_CATEGORY_NAME,
  MAX_TITLE,
  MIN_APP_BUILD,
  EDIT_MORE_BUILD,
  MAX_DUE_DAYS,
  applyNotes,
  categoryColor,
  dayKey,
  ROT_MAX,
  daysSince,
  doneToday,
  rotLevel,
  isVisible,
  newId,
  refreshRepeats,
  sortTodos,
  type NoteKind,
  type WebBackup,
  type WebNote,
  type WebCategory,
  type WebTodo,
} from "./backup";
import MonthView from "./MonthView";
import { WEB_WRITES, sendNote, signInWithApple, signInWithGoogle, signOutWeb, watchBackup, watchInbox, watchUser, type User } from "./firebase";

// Doquarium on the web (/doquarium/app, Korean /doquarium/app/ko): sign in with
// the same Google account as the app and see your tanks' to-dos (doquarium repo
// docs/10 "PC에서 쓰기"). Step 1 shows the phone's sign-in backup. Step 2 adds,
// finishes, edits and deletes to-dos and makes categories by dropping notes in
// the server mailbox; the phone applies them the next time the app is open, so
// the fish still eats on the phone. Writing needs the phone on MIN_APP_BUILD+.

type Lang = "en" | "ko";
export const DOQUARIUM_APP_PATH = "/doquarium/app";

const COPY = {
  en: {
    back: "Doquarium",
    title: "Doquarium on the web",
    sub: "Your to-dos on any computer. Your fish stays on your phone.",
    signInTitle: "Sign in to see your tanks",
    signInBody: "Use the same Google or Apple account you signed in with in the app (Settings → Account).",
    signIn: "Sign in with Google",
    signInApple: "Sign in with Apple",
    signingIn: "Signing in…",
    signInFailed: "Couldn't sign in. Please try again.",
    loading: "Loading your tanks…",
    noBackupTitle: "No backup yet",
    noBackupBody: (email: string) =>
      `We couldn't find any records for ${email}. In the app, open Settings → Account and sign in with this account, then come back here.`,
    loadFailed: "Couldn't load your tanks. Check your connection and try again.",
    retry: "Try again",
    myTank: "My tank",
    shared: "Shared tank",
    today: "Today",
    nothing: "Nothing left for today.",
    nothingHere: "Nothing left in this category.",
    finishedToday: (n: number) => `Finished today (${n})`,
    due: (d: string) => `Due ${d}`,
    onlyMe: "Only me",
    repeats: "Repeats",
    rotSpoiled: "Spoiled",
    addedYesterday: "Added yesterday",
    addedDaysAgo: (n: number) => (n === 1 ? "Added 1 day ago" : `Added ${n} days ago`),
    dueYesterday: "Due yesterday",
    dueDaysAgo: (n: number) => (n === 1 ? "1 day past due" : `${n} days past due`),
    fishOk: "Your fish is healthy",
    fishWeak: "Your fish feels a little weak",
    fishSick: "Your fish is very sick",
    fishDanger: "Your fish is in danger",
    fishGhost: "Your fish became a ghost · See it in the app",
    fishNote: "As your phone last saw it",
    all: "All",
    newCategory: "New category",
    categoryName: "Category name",
    categoriesFull: `Up to ${MAX_CATEGORIES} categories per tank.`,
    noCategory: "No category",
    addPlaceholder: "Add a to-do",
    addIn: (c: string) => `Goes into ${c}`,
    add: "Add",
    finish: (title: string) => `Finish: ${title}`,
    undo: (title: string) => `Undo: ${title}`,
    edit: (title: string) => `Edit: ${title}`,
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    deleteSure: "Delete?",
    waiting: "Waiting for your phone",
    waitingNote: (n: number) => `${n} change${n === 1 ? "" : "s"} will reach your phone the next time Doquarium is open. Your fish eats then.`,
    sendFailed: "Couldn't save that change. Check your connection and try again.",
    synced: (t: string) => `Last updated from your phone: ${t}`,
    syncNote: "The list updates when your phone saves a backup (while the app is open).",
    comingSoon: "Update Doquarium on your phone and open it once to add, finish, edit, and delete to-dos here too.",
    signOut: "Sign out",
    tabList: "List",
    tabMonth: "Month",
    dueDate: "Due date",
    noDue: "No due date",
    editCategory: (name: string) => `Edit category: ${name}`,
    deleteCategory: "Delete",
    deleteCategorySure: "Delete? Its to-dos stay",
    needUpdate24: "Changing due dates and renaming or deleting categories here needs Doquarium 1.0.0+24 on your phone.",
  },
  ko: {
    back: "두쿠아리움",
    title: "웹에서 보는 두쿠아리움",
    sub: "어느 컴퓨터에서든 내 할 일을 챙겨요. 물고기는 폰에서 기다려요.",
    signInTitle: "로그인하고 내 어항 보기",
    signInBody: "앱에서 로그인한 것과 같은 Google 또는 Apple 계정으로 로그인해 주세요 (앱의 설정 → 계정).",
    signIn: "Google로 로그인",
    signInApple: "Apple로 로그인",
    signingIn: "로그인하는 중…",
    signInFailed: "로그인하지 못했어요. 다시 해 주세요.",
    loading: "내 어항을 불러오는 중…",
    noBackupTitle: "아직 백업이 없어요",
    noBackupBody: (email: string) => `${email} 계정의 기록을 찾지 못했어요. 앱의 설정 → 계정에서 이 계정으로 로그인한 뒤 다시 열어 주세요.`,
    loadFailed: "어항을 불러오지 못했어요. 인터넷을 확인하고 다시 해 주세요.",
    retry: "다시 불러오기",
    myTank: "내 어항",
    shared: "단체 어항",
    today: "오늘 할 일",
    nothing: "오늘 남은 할 일이 없어요.",
    nothingHere: "이 카테고리에 남은 할 일이 없어요.",
    finishedToday: (n: number) => `오늘 끝낸 일 (${n})`,
    due: (d: string) => `${d}까지`,
    onlyMe: "나만 보기",
    repeats: "반복",
    rotSpoiled: "다 썩음",
    addedYesterday: "어제 등록",
    addedDaysAgo: (n: number) => `등록한 지 ${n}일`,
    dueYesterday: "어제 마감",
    dueDaysAgo: (n: number) => `마감 ${n}일 지남`,
    fishOk: "물고기가 건강해요",
    fishWeak: "물고기가 조금 기운이 없어요",
    fishSick: "물고기가 많이 아파요",
    fishDanger: "물고기가 위험해요",
    fishGhost: "물고기가 유령이 됐어요 · 앱에서 만나 주세요",
    fishNote: "폰에서 마지막으로 본 모습",
    all: "전체",
    newCategory: "새 카테고리",
    categoryName: "카테고리 이름",
    categoriesFull: `카테고리는 어항마다 ${MAX_CATEGORIES}개까지예요.`,
    noCategory: "카테고리 없음",
    addPlaceholder: "할 일 추가",
    addIn: (c: string) => `${c}에 들어가요`,
    add: "추가",
    finish: (title: string) => `끝내기: ${title}`,
    undo: (title: string) => `되돌리기: ${title}`,
    edit: (title: string) => `고치기: ${title}`,
    save: "저장",
    cancel: "취소",
    delete: "지우기",
    deleteSure: "지울까요?",
    waiting: "폰에 전해지길 기다리는 중",
    waitingNote: (n: number) => `바꾼 것 ${n}개는 다음에 두쿠아리움 앱을 열 때 폰에 전해지고, 그때 물고기가 냠 먹어요.`,
    sendFailed: "바꾼 것을 저장하지 못했어요. 인터넷을 확인하고 다시 해 주세요.",
    synced: (t: string) => `폰에서 마지막으로 가져온 때: ${t}`,
    syncNote: "목록은 폰이 백업할 때(앱을 켜 둔 동안) 새로 바뀌어요.",
    comingSoon: "폰의 두쿠아리움을 업데이트하고 한 번 열면, 여기서도 할 일을 추가 · 끝내기 · 고치기 · 지우기 할 수 있어요.",
    signOut: "로그아웃",
    tabList: "목록",
    tabMonth: "월별",
    dueDate: "마감일",
    noDue: "마감일 없음",
    editCategory: (name: string) => `카테고리 고치기: ${name}`,
    deleteCategory: "지우기",
    deleteCategorySure: "지울까요? 할 일은 남아요",
    needUpdate24: "여기서 마감일을 바꾸거나 카테고리 이름을 고치고 지우려면 폰의 두쿠아리움이 1.0.0+24 이상이어야 해요.",
  },
} as const;

const SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Doquarium on the Web — Your To-Dos on Any Computer",
    description: "Sign in with Google to see your Doquarium tanks and to-dos on any computer.",
  },
  ko: {
    title: "웹에서 보는 두쿠아리움 — 어느 컴퓨터에서든 내 할 일",
    description: "Google로 로그인하면 어느 컴퓨터에서든 두쿠아리움 어항과 할 일을 볼 수 있어요.",
  },
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
  const [user, setUser] = useState<User | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [tankId, setTankId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  // List or a month calendar (래원 2026-10-30)
  const [view, setView] = useState<"list" | "month">("list");
  // Mailbox notes the phone hasn't applied yet (live), plus ones it just applied
  // whose new backup hasn't arrived yet (kept so the list doesn't flicker back)
  const [inbox, setInbox] = useState<WebNote[]>([]);
  const [settling, setSettling] = useState<WebNote[]>([]);
  const failed = useRef(new Set<string>());
  const [sendError, setSendError] = useState(false);
  // Short, soft motions (래원 2026-10-23): finishing fills the circle and folds the row away; deleting slides it out
  const [finishing, setFinishing] = useState<string[]>([]);
  const [leaving, setLeaving] = useState<Record<string, Leave>>({});

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

  useEffect(
    () =>
      watchUser((u) => {
        setUser(u);
        setInbox([]);
        setSettling([]);
        if (!u) setState({ kind: "signedOut" });
      }),
    [],
  );

  useEffect(() => {
    if (!user) return;
    setState({ kind: "loading", user });
    return watchBackup(
      user.uid,
      (backup) => {
        setSettling([]); // the phone's new backup already has them
        if (!backup) return setState({ kind: "empty", user });
        setState({ kind: "ready", user, backup });
        setTankId((id) => (id !== null && backup.tanks.some((x) => x.id === id) ? id : backup.activeId));
      },
      () => setState({ kind: "error", user }),
    );
  }, [user, retryKey]);

  useEffect(() => {
    if (!user || !WEB_WRITES) return;
    return watchInbox(user.uid, (notes) =>
      setInbox((before) => {
        const gone = before.filter((n) => !notes.some((m) => m.id === n.id) && !failed.current.has(n.id));
        if (gone.length) setSettling((s) => [...s, ...gone]);
        return notes;
      }),
    );
  }, [user]);

  const signIn = async (provider: "google" | "apple") => {
    setState({ kind: "signedOut", busy: true });
    try {
      await (provider === "apple" ? signInWithApple() : signInWithGoogle());
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

  // Draw again just after midnight, so on a page left open a missed repeat turns into today's share and rot labels move on
  const [midnights, setMidnights] = useState(0);
  useEffect(() => {
    const n = new Date();
    const wait = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime() - n.getTime() + 1000;
    const id = window.setTimeout(() => setMidnights((d) => d + 1), wait);
    return () => window.clearTimeout(id);
  }, [midnights]);

  const now = new Date();
  const ready = state.kind === "ready" ? state : null;
  const shown = useMemo(() => {
    if (!ready) return null;
    const notes = [...settling.filter((n) => !inbox.some((m) => m.id === n.id)), ...inbox];
    return applyNotes(ready.backup, notes);
  }, [ready, inbox, settling]);
  // Only when the phone runs an app that reads the mailbox (its backup says which build it last opened)
  const canWrite = WEB_WRITES && (ready?.backup.appBuild ?? 0) >= MIN_APP_BUILD;
  // Due dates and category rename · delete need a newer app (older phones would drop those notes)
  const canEditMore = canWrite && (ready?.backup.appBuild ?? 0) >= EDIT_MORE_BUILD;
  // 🌿 Relaxed tanks: a missed daily · weekday repeat shows as today's share, as the phone will after it opens (RepeatRefresh)
  const picked = shown?.tanks.find((x) => x.id === tankId) ?? shown?.tanks[0];
  const tank = picked && refreshRepeats(picked, now);
  const categories = tank?.categories ?? [];
  const activeFilter = filter !== null && categories.some((c) => c.id === filter) ? filter : null;
  const inFilter = (x: WebTodo) => activeFilter === null || x.category === activeFilter;
  const open = tank ? sortTodos(tank.todos.filter((x) => isVisible(x, now) && inFilter(x))) : [];
  const done = tank ? tank.todos.filter((x) => doneToday(x, now) && inFilter(x)).sort((a, b) => b.doneAt!.getTime() - a.doneAt!.getTime()) : [];
  const waitingIds = new Set(inbox.filter((n) => n.tank === tank?.id).map((n) => n.todo));
  const categoryName = (id?: string) => categories.find((c) => c.id === id)?.name;
  // "All": one section per category, in their order, then the ones without (like the app's category view)
  const grouped = activeFilter === null && categories.length > 0;
  const rows: ({ kind: "head"; id: string; name: string; color?: string; count: number } | { kind: "todo"; todo: WebTodo })[] = [];
  if (grouped) {
    for (const c of [...categories, { id: "", name: t.noCategory }]) {
      const items = open.filter((x) => (c.id ? x.category === c.id : !categories.some((k) => k.id === x.category)));
      if (!items.length) continue;
      rows.push({ kind: "head", id: c.id || "none", name: c.name, color: categoryColor(categories, c.id), count: items.length });
      for (const x of items) rows.push({ kind: "todo", todo: x });
    }
  } else for (const x of open) rows.push({ kind: "todo", todo: x });

  const send = (kind: NoteKind, fields: Omit<WebNote, "id" | "kind" | "tank" | "at">) => {
    if (!user || !tank) return;
    const note: WebNote = { id: newId("w"), kind, tank: tank.id, at: Date.now(), ...fields };
    setSendError(false);
    sendNote(user.uid, note).catch(() => {
      failed.current.add(note.id);
      setSendError(true);
    });
    return note;
  };

  // The row plays its motion first, then the note goes out (the overlay then removes the row, which folds away)
  const finish = (id: string) => {
    if (finishing.includes(id)) return;
    setFinishing((f) => [...f, id]);
    setLeaving((l) => ({ ...l, [id]: "done" }));
    window.setTimeout(() => send("done", { todo: id }), 450);
  };
  const remove = (id: string) => {
    setLeaving((l) => ({ ...l, [id]: "delete" }));
    window.requestAnimationFrame(() => send("delete", { todo: id }));
  };
  const undo = (id: string) => {
    setFinishing((f) => f.filter((x) => x !== id));
    setLeaving((l) => ({ ...l, [id]: "undo" }));
    window.requestAnimationFrame(() => send("undo", { todo: id }));
  };

  const pickTank = (id: string) => {
    setTankId(id);
    setFilter(null);
  };

  return (
    // "Reduce motion" on the computer turns the slides off (fades stay)
    <MotionConfig reducedMotion="user">
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

        {(state.kind === "checking" || state.kind === "loading") && <p className="text-white/50 font-medium animate-pulse">{t.loading}</p>}

        {state.kind === "signedOut" && (
          <div className="rounded-[28px] border border-[#3ef2ff]/15 bg-[#0c0c0e] p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{t.signInTitle}</h2>
            <p className="text-sm md:text-base text-lumora-sub font-medium leading-relaxed mb-8">{t.signInBody}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => signIn("google")}
                disabled={state.busy}
                className="flex items-center justify-center gap-3 h-12 px-4 sm:px-6 rounded-xl bg-white text-black font-display font-bold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60"
              >
                <GoogleMark /> {state.busy ? t.signingIn : t.signIn}
              </button>
              <button
                onClick={() => signIn("apple")}
                disabled={state.busy}
                className="flex items-center justify-center gap-3 h-12 px-4 sm:px-6 rounded-xl bg-black text-white border border-white/25 font-display font-bold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60"
              >
                <AppleMark /> {state.busy ? t.signingIn : t.signInApple}
              </button>
            </div>
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
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="h-11 px-5 rounded-xl bg-white/10 border border-white/10 text-white font-display font-bold text-sm hover:bg-white/15"
            >
              {t.retry}
            </button>
          </div>
        )}

        {ready && shown && tank && (
          <>
            {shown.tanks.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
                {shown.tanks.map((x) => (
                  <button
                    key={x.id || "first"}
                    onClick={() => pickTank(x.id)}
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
              <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-white/5">
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#3ef2ff]/70 mb-1">
                  {tank.name || t.myTank}
                  {tank.shared && <span className="text-white/30"> · {t.shared}</span>}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-display font-bold text-white">
                    {t.today} <span className="text-white/30 font-medium">{open.length}</span>
                  </h2>
                  <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10" role="group">
                    {(
                      [
                        ["list", List, t.tabList],
                        ["month", CalendarDays, t.tabMonth],
                      ] as const
                    ).map(([v, Icon, label]) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        aria-pressed={view === v}
                        className={`h-8 px-3 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-colors ${
                          view === v ? "bg-white text-black" : "text-white/55 hover:text-white"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                {tank.fish && <FishLine t={t} fish={tank.fish} />}
                {(categories.length > 0 || canWrite) && (
                  <CategoryChips
                    t={t}
                    categories={categories}
                    active={activeFilter}
                    onPick={setFilter}
                    onRename={canEditMore ? (id, name) => send("renameCategory", { category: id, name }) : undefined}
                    onDelete={
                      canEditMore
                        ? (id) => {
                            send("deleteCategory", { category: id });
                            setFilter(null);
                          }
                        : undefined
                    }
                    onCreate={
                      canWrite
                        ? (name) => {
                            const same = categories.find((c) => c.name === name);
                            if (same) return setFilter(same.id);
                            const id = newId("c");
                            send("category", { category: id, name });
                            setFilter(id);
                          }
                        : undefined
                    }
                  />
                )}
              </div>

              {view === "month" && <MonthView lang={lang} tank={tank} categories={categories} filter={activeFilter} now={now} />}

              {view === "list" && canWrite && (
                <AddRow
                  t={t}
                  category={categoryName(activeFilter ?? undefined)}
                  canDue={canEditMore}
                  lang={lang}
                  now={now}
                  onAdd={(title, due) => send("add", { todo: newId(), title, category: activeFilter ?? undefined, due })}
                />
              )}

              {view === "list" && (
              <>

              {/* Always mounted so the last row can still fold away */}
              <ul className="divide-y divide-white/5">
                <AnimatePresence initial={false}>
                  {rows.map((r) =>
                    r.kind === "head" ? (
                      <motion.li key={`head:${r.id}`} className="overflow-hidden bg-white/[0.02]" initial={ENTER} animate={SHOWN} exit={EXIT.undo} transition={EASE}>
                        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs font-display font-bold text-white/60">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color ?? "rgba(255,255,255,0.25)" }} aria-hidden="true" />
                          {r.name}
                          <span className="text-white/30">{r.count}</span>
                        </div>
                      </motion.li>
                    ) : (
                    <motion.li key={r.todo.id} className="overflow-hidden" initial={ENTER} animate={SHOWN} exit={EXIT[leaving[r.todo.id] ?? "undo"]} transition={EASE}>
                      <TodoRow
                        t={t}
                        todo={r.todo}
                        categories={categories}
                        color={categoryColor(categories, r.todo.category)}
                        canDue={canEditMore && !r.todo.repeat}
                        lang={lang}
                        now={now}
                        showCategory={activeFilter === null && !grouped}
                        waiting={waitingIds.has(r.todo.id)}
                        due={r.todo.dueDate ? t.due(fmt.day.format(r.todo.dueDate)) : undefined}
                        rot={rotLabel(t, r.todo, rotLevel(r.todo, now, tank.crew), now)}
                        finishing={finishing.includes(r.todo.id)}
                        onFinish={canWrite ? () => finish(r.todo.id) : undefined}
                        onSave={(title, category, due) => {
                          const x = r.todo;
                          const before = x.dueDate ? dayKey(x.dueDate) : "";
                          send("edit", {
                            todo: x.id,
                            title: title !== x.title ? title : undefined,
                            category: category !== (x.category ?? "") ? category : undefined,
                            due: due !== undefined && due !== before ? due : undefined,
                          });
                        }}
                        onDelete={() => remove(r.todo.id)}
                      />
                    </motion.li>
                    ),
                  )}
                </AnimatePresence>
              </ul>
              {open.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="px-4 sm:px-6 py-8 text-lumora-sub font-medium"
                >
                  {activeFilter === null ? t.nothing : t.nothingHere}
                </motion.p>
              )}

              {done.length > 0 && (
                <div className="border-t border-white/5">
                  <button
                    onClick={() => setShowDone((v) => !v)}
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-display font-bold text-white/50 hover:text-white"
                  >
                    {t.finishedToday(done.length)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showDone ? "rotate-180" : ""}`} />
                  </button>
                  {showDone && (
                    <ul className="pb-3">
                      <AnimatePresence initial={false}>
                        {done.map((x) => (
                          <motion.li key={x.id} className="overflow-hidden" initial={ENTER} animate={SHOWN} exit={EXIT.undo} transition={EASE}>
                            <div className="flex items-center gap-4 px-4 sm:px-6 py-2.5">
                              {canWrite ? (
                                <button
                                  onClick={() => undo(x.id)}
                                  aria-label={t.undo(x.title)}
                                  title={t.undo(x.title)}
                                  className="h-5 w-5 shrink-0 rounded-full bg-[#3ef2ff]/30 border-2 border-[#3ef2ff]/50 flex items-center justify-center hover:bg-[#3ef2ff]/15 transition-colors"
                                >
                                  <Check className="h-3 w-3 text-[#c9fbff]" strokeWidth={3} />
                                </button>
                              ) : (
                                <span className="h-5 w-5 shrink-0 rounded-full bg-[#3ef2ff]/30 border-2 border-[#3ef2ff]/50" aria-hidden="true" />
                              )}
                              <span className="flex-1 min-w-0 text-white/40 line-through break-words">{x.title}</span>
                              {waitingIds.has(x.id) && <Waiting label={t.waiting} />}
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>
              )}
              </>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-xs md:text-sm text-white/40 font-medium">
              {sendError && <p className="text-red-400">{t.sendFailed}</p>}
              {inbox.length > 0 && (
                <p className="flex items-start gap-2 text-[#8ff7ff]/70">
                  <Smartphone className="h-4 w-4 shrink-0 mt-0.5" /> {t.waitingNote(inbox.length)}
                </p>
              )}
              {ready.backup.updatedAt && <p>{t.synced(fmt.time.format(ready.backup.updatedAt))}</p>}
              <p>{t.syncNote}</p>
              {!canWrite && (
                <p className="flex items-start gap-2 text-[#8ff7ff]/70">
                  <Smartphone className="h-4 w-4 shrink-0 mt-0.5" /> {t.comingSoon}
                </p>
              )}
              {canWrite && !canEditMore && (
                <p className="flex items-start gap-2 text-[#8ff7ff]/70">
                  <Smartphone className="h-4 w-4 shrink-0 mt-0.5" /> {t.needUpdate24}
                </p>
              )}
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
    </MotionConfig>
  );
}

type Copy = (typeof COPY)[Lang];

// Row motions: short and soft (docs/02: calm, no flashy rewards). Finished rows fold up, deleted rows slide left first
type Leave = "done" | "delete" | "undo";
const ENTER = { opacity: 0, height: 0 };
const SHOWN = { opacity: 1, height: "auto" };
const EASE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
const EXIT: Record<Leave, object> = {
  done: { opacity: 0, height: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
  delete: { opacity: 0, x: -40, height: 0, transition: { opacity: { duration: 0.22 }, x: { duration: 0.22 }, height: { duration: 0.24, delay: 0.14 } } },
  undo: { opacity: 0, height: 0, transition: { duration: 0.25 } },
};

/** The app's rot label (l10n rotAge): days counted on the calendar from the due date, or from the day it was written */
function rotLabel(t: Copy, todo: WebTodo, level: number, now: Date) {
  if (Math.floor(level) < 1) return undefined;
  const days = daysSince(todo.dueDate ?? todo.createdAt, now);
  const age = todo.dueDate ? (days <= 1 ? t.dueYesterday : t.dueDaysAgo(days)) : days <= 1 ? t.addedYesterday : t.addedDaysAgo(days);
  return level >= ROT_MAX - 1e-6 ? `${t.rotSpoiled} · ${age}` : age;
}

/** One line about the fish, in words like the app (no numbers), from the phone's last backup */
function FishLine({ t, fish }: { t: Copy; fish: { health: number; dead: boolean } }) {
  const text = fish.dead ? t.fishGhost : fish.health >= 99.5 ? t.fishOk : fish.health >= 60 ? t.fishWeak : fish.health >= 30 ? t.fishSick : t.fishDanger;
  const Icon = fish.dead ? Ghost : Fish;
  const tone = fish.dead || fish.health < 60 ? "text-white/60" : "text-[#8ff7ff]/80";
  return (
    <p className={`mt-2 flex items-center gap-2 text-sm font-medium ${tone}`} title={t.fishNote}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {text}
    </p>
  );
}

function Waiting({ label }: { label: string }) {
  return (
    <span className="shrink-0 text-[#8ff7ff]/60" title={label}>
      <Clock className="h-3.5 w-3.5" aria-label={label} />
    </span>
  );
}

function CategoryChips({
  t,
  categories,
  active,
  onPick,
  onCreate,
  onRename,
  onDelete,
}: {
  t: Copy;
  categories: WebCategory[];
  active: string | null;
  onPick: (id: string | null) => void;
  onCreate?: (name: string) => void;
  /** +24 phones: rename · delete the picked category (its to-dos stay, without a category) */
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [making, setMaking] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [sure, setSure] = useState(false);
  const editingCat = categories.find((c) => c.id === editing);

  if (editingCat && onRename && onDelete) {
    const done = () => {
      setEditing(null);
      setSure(false);
    };
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = newName.trim();
          if (n && n !== editingCat.name) onRename(editingCat.id, n);
          done();
        }}
        className="mt-4 flex flex-wrap items-center gap-2"
      >
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: categoryColor(categories, editingCat.id) }} aria-hidden="true" />
        <input
          autoFocus
          value={newName}
          maxLength={MAX_CATEGORY_NAME}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && done()}
          aria-label={t.categoryName}
          className="h-9 w-40 px-3 rounded-full bg-white/5 border border-[#3ef2ff]/40 text-sm text-white outline-none"
        />
        <button type="submit" disabled={!newName.trim()} className="h-9 px-4 rounded-full bg-white text-black text-xs font-display font-bold disabled:opacity-40">
          {t.save}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!sure) return setSure(true);
            onDelete(editingCat.id);
            done();
          }}
          className={`h-9 px-3.5 rounded-full text-xs font-display font-bold flex items-center gap-1.5 transition-colors ${
            sure ? "bg-red-500/20 text-red-300 border border-red-400/40" : "text-white/50 hover:text-red-300"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" /> {sure ? t.deleteCategorySure : t.deleteCategory}
        </button>
        <button type="button" onClick={done} aria-label={t.cancel} className="h-9 w-9 rounded-full text-white/50 hover:text-white flex items-center justify-center">
          <X className="h-4 w-4" />
        </button>
      </form>
    );
  }
  const full = categories.length >= MAX_CATEGORIES;
  const chip = (on: boolean) =>
    `shrink-0 h-8 px-3.5 rounded-full text-xs font-display font-bold transition-colors ${
      on ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
    }`;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (n) onCreate?.(n);
    setName("");
    setMaking(false);
  };
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 -mx-1 px-1 py-0.5">
      <button onClick={() => onPick(null)} aria-pressed={active === null} className={chip(active === null)}>
        {t.all}
      </button>
      {categories.map((c) => (
        <span key={c.id} className="shrink-0 flex items-center gap-1">
          <button onClick={() => onPick(c.id)} aria-pressed={active === c.id} className={`${chip(active === c.id)} flex items-center gap-1.5`}>
            <span className="h-2 w-2 rounded-full" style={{ background: categoryColor(categories, c.id) }} aria-hidden="true" />
            {c.name}
          </button>
          {active === c.id && onRename && (
            <button
              onClick={() => {
                setEditing(c.id);
                setNewName(c.name);
                setSure(false);
              }}
              aria-label={t.editCategory(c.name)}
              title={t.editCategory(c.name)}
              className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </span>
      ))}
      {onCreate &&
        (making ? (
          <form onSubmit={submit} className="shrink-0 flex items-center gap-1">
            <input
              autoFocus
              value={name}
              maxLength={MAX_CATEGORY_NAME}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => !name.trim() && setMaking(false)}
              onKeyDown={(e) => e.key === "Escape" && setMaking(false)}
              placeholder={t.categoryName}
              aria-label={t.categoryName}
              className="h-8 w-36 px-3 rounded-full bg-white/5 border border-[#3ef2ff]/40 text-xs text-white placeholder:text-white/30 outline-none"
            />
            <button type="submit" aria-label={t.add} className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setMaking(true)}
            disabled={full}
            title={full ? t.categoriesFull : undefined}
            className="shrink-0 h-8 px-3 rounded-full text-xs font-display font-bold border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:text-white/50"
          >
            <Plus className="h-3.5 w-3.5" /> {t.newCategory}
          </button>
        ))}
    </div>
  );
}

function AddRow({
  t,
  category,
  canDue,
  lang,
  now,
  onAdd,
}: {
  t: Copy;
  category?: string;
  canDue: boolean;
  lang: Lang;
  now: Date;
  onAdd: (title: string, due?: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    onAdd(v, canDue && due ? due : undefined);
    setTitle("");
    setDue("");
  };
  return (
    <form onSubmit={submit} className="px-4 sm:px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-3">
        <input
          value={title}
          maxLength={MAX_TITLE}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.addPlaceholder}
          aria-label={t.addPlaceholder}
          className="flex-1 min-w-0 h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#3ef2ff]/40 text-white placeholder:text-white/30 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          aria-label={t.add}
          className="shrink-0 h-11 px-4 sm:px-5 rounded-xl bg-white text-black font-display font-bold text-sm flex items-center gap-1.5 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">{t.add}</span>
        </button>
      </div>
      {canDue && (
        <div className="mt-2">
          <DueSelect t={t} lang={lang} now={now} value={due} onChange={setDue} />
        </div>
      )}
      {category && <p className="mt-2 text-xs text-white/40">{t.addIn(category)}</p>}
    </form>
  );
}

function TodoRow({
  t,
  todo,
  categories,
  color,
  canDue,
  lang,
  now,
  showCategory,
  waiting,
  due,
  rot,
  finishing,
  onFinish,
  onSave,
  onDelete,
}: {
  t: Copy;
  todo: WebTodo;
  categories: { id: string; name: string }[];
  /** the category's color (a thin bar at the left edge) */
  color?: string;
  /** +24 phones, not a repeat: the edit form can change the due date */
  canDue: boolean;
  lang: Lang;
  now: Date;
  showCategory: boolean;
  waiting: boolean;
  due?: string;
  /** "어제 등록" · "다 썩음 · 마감 2일 지남" while it rots (the app shows this instead of the due date) */
  rot?: string;
  /** Just finished: the circle fills with a soft glow and the title is crossed out, before the row folds away */
  finishing?: boolean;
  onFinish?: () => void;
  /** due: "2026-10-31", "" for none, undefined when it can't change */
  onSave: (title: string, category: string, due?: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category ?? "");
  const dueKey = todo.dueDate ? dayKey(todo.dueDate) : "";
  const [dueDay, setDueDay] = useState(dueKey);
  const [sure, setSure] = useState(false);
  const category0 = categories.find((c) => c.id === todo.category)?.name;
  const hasMeta = (showCategory && !!category0) || todo.repeat || todo.private || !!due || !!rot || waiting;
  // Rotting to-dos turn a murky olive grey, with the age next to them (docs/02: easy to spot, still easy to read)
  const ink = finishing ? "text-white/40 line-through pointer-events-none" : rot ? "text-[#A9A47F]" : "text-white";

  const start = () => {
    setTitle(todo.title);
    setCategory(todo.category ?? "");
    setDueDay(dueKey);
    setSure(false);
    setEditing(true);
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    const dueChanged = canDue && dueDay !== dueKey;
    if (v && (v !== todo.title || category !== (todo.category ?? "") || dueChanged)) onSave(v, category, dueChanged ? dueDay : undefined);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="px-4 sm:px-6 py-4 bg-white/[0.02]">
        <form onSubmit={save} className="flex flex-col gap-3">
          <input
            autoFocus
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            aria-label={t.edit(todo.title)}
            className="h-11 px-4 rounded-xl bg-white/5 border border-[#3ef2ff]/40 text-white outline-none"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#141417] border border-white/10 text-sm text-white outline-none"
            >
              <option value="">{t.noCategory}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {canDue && <DueSelect t={t} lang={lang} now={now} value={dueDay} onChange={setDueDay} />}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => (sure ? onDelete() : setSure(true))}
              className={`h-10 px-3.5 rounded-xl text-sm font-display font-bold flex items-center gap-1.5 transition-colors ${
                sure ? "bg-red-500/20 text-red-300 border border-red-400/40" : "text-white/50 hover:text-red-300"
              }`}
            >
              <Trash2 className="h-4 w-4" /> {sure ? t.deleteSure : t.delete}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-10 px-3.5 rounded-xl text-sm font-display font-bold text-white/50 hover:text-white flex items-center gap-1.5"
            >
              <X className="h-4 w-4" /> {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-10 px-4 rounded-xl bg-white text-black text-sm font-display font-bold disabled:opacity-40"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex items-start gap-4 px-4 sm:px-6 py-4">
      {color && <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full" style={{ background: color }} aria-hidden="true" />}
      {finishing ? (
        <span className="relative mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
          <motion.span
            className="absolute inset-0 rounded-full bg-[#3ef2ff]/35 border-2 border-[#3ef2ff]/80 flex items-center justify-center"
            initial={{ scale: 0.6 }}
            animate={{ scale: [0.6, 1.15, 1] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Check className="h-3 w-3 text-[#c9fbff]" strokeWidth={3} />
          </motion.span>
          {/* one soft ring of light, like a ripple in the tank */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#3ef2ff]/60"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </span>
      ) : onFinish ? (
        <button
          onClick={onFinish}
          aria-label={t.finish(todo.title)}
          title={t.finish(todo.title)}
          className="group mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-white/25 hover:border-[#3ef2ff]/70 flex items-center justify-center transition-colors"
        >
          <Check className="h-3 w-3 text-[#3ef2ff] opacity-0 group-hover:opacity-70 transition-opacity" strokeWidth={3} />
        </button>
      ) : (
        <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-white/25" aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        {onFinish ? (
          <button
            onClick={start}
            aria-label={t.edit(todo.title)}
            className={`block w-full text-left ${ink} font-medium break-words hover:opacity-80 transition-colors duration-300`}
          >
            {todo.title}
          </button>
        ) : (
          <span className={`block ${ink} font-medium break-words`}>{todo.title}</span>
        )}
        {hasMeta && (
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/40">
            {showCategory && category0 && <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{category0}</span>}
            {todo.repeat && <Repeat className="h-3.5 w-3.5" aria-label={t.repeats} />}
            {todo.private && <Lock className="h-3.5 w-3.5" aria-label={t.onlyMe} />}
            {rot ? (
              <span className="flex items-center gap-1 text-[#A9A47F]">
                <CloudFog className="h-3.5 w-3.5" aria-hidden="true" /> {rot}
              </span>
            ) : (
              due && <span>{due}</span>
            )}
            {waiting && <Waiting label={t.waiting} />}
          </span>
        )}
      </div>
    </div>
  );
}

/** "No due date", then today … +7 days (the app's picker); a due date outside that range stays as its own choice */
function DueSelect({ t, lang, now, value, onChange }: { t: Copy; lang: Lang; now: Date; value: string; onChange: (v: string) => void }) {
  const fmt = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", { month: "short", day: "numeric", weekday: "short" });
  const days = Array.from({ length: MAX_DUE_DAYS + 1 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
  const keys = days.map(dayKey);
  return (
    <label className="flex items-center gap-2 text-xs text-white/50">
      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{t.dueDate}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t.dueDate}
        className="h-10 px-3 rounded-xl bg-[#141417] border border-white/10 text-sm text-white outline-none"
      >
        <option value="">{t.noDue}</option>
        {value && !keys.includes(value) && <option value={value}>{fmt.format(new Date(`${value}T00:00:00`))}</option>}
        {days.map((d, i) => (
          <option key={keys[i]} value={keys[i]}>
            {fmt.format(d)}
          </option>
        ))}
      </select>
    </label>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.97.9-3.77 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.65zM14.1 5.83c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z" />
    </svg>
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
