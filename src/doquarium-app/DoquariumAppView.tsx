import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, ChevronDown, Clock, Lock, LogOut, Plus, Repeat, Smartphone, Trash2, Users, X } from "lucide-react";
import { applySeo } from "../seo";
import {
  MAX_CATEGORIES,
  MAX_CATEGORY_NAME,
  MAX_TITLE,
  MIN_APP_BUILD,
  applyNotes,
  doneToday,
  isVisible,
  newId,
  sortTodos,
  type NoteKind,
  type WebBackup,
  type WebNote,
  type WebTodo,
} from "./backup";
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
    signInBody:
      "Use the same Google or Apple account you signed in with in the app (Settings → Account).",
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
    waitingNote: (n: number) =>
      `${n} change${n === 1 ? "" : "s"} will reach your phone the next time Doquarium is open. Your fish eats then.`,
    sendFailed: "Couldn't save that change. Check your connection and try again.",
    synced: (t: string) => `Last updated from your phone: ${t}`,
    syncNote: "The list updates when your phone saves a backup (while the app is open).",
    comingSoon: "Update Doquarium on your phone and open it once to add, finish, edit, and delete to-dos here too.",
    signOut: "Sign out",
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
    noBackupBody: (email: string) =>
      `${email} 계정의 기록을 찾지 못했어요. 앱의 설정 → 계정에서 이 계정으로 로그인한 뒤 다시 열어 주세요.`,
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
  const [user, setUser] = useState<User | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [tankId, setTankId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  // Mailbox notes the phone hasn't applied yet (live), plus ones it just applied
  // whose new backup hasn't arrived yet (kept so the list doesn't flicker back)
  const [inbox, setInbox] = useState<WebNote[]>([]);
  const [settling, setSettling] = useState<WebNote[]>([]);
  const failed = useRef(new Set<string>());
  const [sendError, setSendError] = useState(false);

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

  const now = new Date();
  const ready = state.kind === "ready" ? state : null;
  const shown = useMemo(() => {
    if (!ready) return null;
    const notes = [...settling.filter((n) => !inbox.some((m) => m.id === n.id)), ...inbox];
    return applyNotes(ready.backup, notes);
  }, [ready, inbox, settling]);
  // Only when the phone runs an app that reads the mailbox (its backup says which build it last opened)
  const canWrite = WEB_WRITES && (ready?.backup.appBuild ?? 0) >= MIN_APP_BUILD;
  const tank = shown?.tanks.find((x) => x.id === tankId) ?? shown?.tanks[0];
  const categories = tank?.categories ?? [];
  const activeFilter = filter !== null && categories.some((c) => c.id === filter) ? filter : null;
  const inFilter = (x: WebTodo) => activeFilter === null || x.category === activeFilter;
  const open = tank ? sortTodos(tank.todos.filter((x) => isVisible(x, now) && inFilter(x))) : [];
  const done = tank
    ? tank.todos.filter((x) => doneToday(x, now) && inFilter(x)).sort((a, b) => b.doneAt!.getTime() - a.doneAt!.getTime())
    : [];
  const waitingIds = new Set(inbox.filter((n) => n.tank === tank?.id).map((n) => n.todo));
  const categoryName = (id?: string) => categories.find((c) => c.id === id)?.name;

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

  const pickTank = (id: string) => {
    setTankId(id);
    setFilter(null);
  };

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
          <button onClick={() => setRetryKey((k) => k + 1)} className="h-11 px-5 rounded-xl bg-white/10 border border-white/10 text-white font-display font-bold text-sm hover:bg-white/15">
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
              <h2 className="text-2xl font-display font-bold text-white">
                {t.today} <span className="text-white/30 font-medium">{open.length}</span>
              </h2>
              {(categories.length > 0 || canWrite) && (
                <CategoryChips
                  t={t}
                  categories={categories}
                  active={activeFilter}
                  onPick={setFilter}
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

            {canWrite && (
              <AddRow
                t={t}
                category={categoryName(activeFilter ?? undefined)}
                onAdd={(title) => send("add", { todo: newId(), title, category: activeFilter ?? undefined })}
              />
            )}

            {open.length === 0 ? (
              <p className="px-4 sm:px-6 py-8 text-lumora-sub font-medium">{activeFilter === null ? t.nothing : t.nothingHere}</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {open.map((x) => (
                  <Fragment key={x.id}>
                    <TodoRow
                      t={t}
                      todo={x}
                      categories={categories}
                      showCategory={activeFilter === null}
                      waiting={waitingIds.has(x.id)}
                      due={x.dueDate ? t.due(fmt.day.format(x.dueDate)) : undefined}
                      onFinish={canWrite ? () => send("done", { todo: x.id }) : undefined}
                      onSave={(title, category) =>
                        send("edit", {
                          todo: x.id,
                          title: title !== x.title ? title : undefined,
                          category: category !== (x.category ?? "") ? category : undefined,
                        })
                      }
                      onDelete={() => send("delete", { todo: x.id })}
                    />
                  </Fragment>
                ))}
              </ul>
            )}

            {done.length > 0 && (
              <div className="border-t border-white/5">
                <button onClick={() => setShowDone((v) => !v)} className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-display font-bold text-white/50 hover:text-white">
                  {t.finishedToday(done.length)}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showDone ? "rotate-180" : ""}`} />
                </button>
                {showDone && (
                  <ul className="pb-3">
                    {done.map((x) => (
                      <li key={x.id} className="flex items-center gap-4 px-4 sm:px-6 py-2.5">
                        {canWrite ? (
                          <button
                            onClick={() => send("undo", { todo: x.id })}
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
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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

type Copy = (typeof COPY)[Lang];

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
}: {
  t: Copy;
  categories: { id: string; name: string }[];
  active: string | null;
  onPick: (id: string | null) => void;
  onCreate?: (name: string) => void;
}) {
  const [making, setMaking] = useState(false);
  const [name, setName] = useState("");
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
        <button key={c.id} onClick={() => onPick(c.id)} aria-pressed={active === c.id} className={chip(active === c.id)}>
          {c.name}
        </button>
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

function AddRow({ t, category, onAdd }: { t: Copy; category?: string; onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    onAdd(v);
    setTitle("");
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
      {category && <p className="mt-2 text-xs text-white/40">{t.addIn(category)}</p>}
    </form>
  );
}

function TodoRow({
  t,
  todo,
  categories,
  showCategory,
  waiting,
  due,
  onFinish,
  onSave,
  onDelete,
}: {
  t: Copy;
  todo: WebTodo;
  categories: { id: string; name: string }[];
  showCategory: boolean;
  waiting: boolean;
  due?: string;
  onFinish?: () => void;
  onSave: (title: string, category: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category ?? "");
  const [sure, setSure] = useState(false);
  const category0 = categories.find((c) => c.id === todo.category)?.name;
  const hasMeta = (showCategory && !!category0) || todo.repeat || todo.private || !!due || waiting;

  const start = () => {
    setTitle(todo.title);
    setCategory(todo.category ?? "");
    setSure(false);
    setEditing(true);
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = title.trim();
    if (v && (v !== todo.title || category !== (todo.category ?? ""))) onSave(v, category);
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="px-4 sm:px-6 py-4 bg-white/[0.02]">
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
            <button type="button" onClick={() => setEditing(false)} className="h-10 px-3.5 rounded-xl text-sm font-display font-bold text-white/50 hover:text-white flex items-center gap-1.5">
              <X className="h-4 w-4" /> {t.cancel}
            </button>
            <button type="submit" disabled={!title.trim()} className="h-10 px-4 rounded-xl bg-white text-black text-sm font-display font-bold disabled:opacity-40">
              {t.save}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-4 px-4 sm:px-6 py-4">
      {onFinish ? (
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
          <button onClick={start} aria-label={t.edit(todo.title)} className="block w-full text-left text-white font-medium break-words hover:text-white/80">
            {todo.title}
          </button>
        ) : (
          <span className="block text-white font-medium break-words">{todo.title}</span>
        )}
        {hasMeta && (
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/40">
            {showCategory && category0 && <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{category0}</span>}
            {todo.repeat && <Repeat className="h-3.5 w-3.5" aria-label={t.repeats} />}
            {todo.private && <Lock className="h-3.5 w-3.5" aria-label={t.onlyMe} />}
            {due && <span>{due}</span>}
            {waiting && <Waiting label={t.waiting} />}
          </span>
        )}
      </div>
    </li>
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
