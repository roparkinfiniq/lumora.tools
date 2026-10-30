// Reads the Doquarium app's sign-in backup (Firestore `backups/{uid}`) into
// tanks and to-dos for the web. The backup is a copy of the phone's saved
// values (SharedPreferences): `tanks` holds the tank list as a JSON string, and
// each tank's to-dos are under `todos` (the first tank, id "") or
// `todos@{tankId}`. Field names follow the app's lib/models/todo.dart and
// tank.dart (doquarium repo). Keep in sync if those change.
//
// Step 2 (writing from the web): the web never edits the backup. It drops
// "notes" into the server mailbox `inbox/{uid}/notes`; the phone applies them
// in the order they were made (doquarium repo lib/services/inbox_service.dart),
// deletes them, and saves a new backup. Until then the web shows the backup
// with the waiting notes laid on top (applyNotes), using the same rules as the
// app so both agree.

export interface WebTodo {
  id: string;
  title: string;
  createdAt: Date;
  dueDate?: Date;
  doneAt?: Date;
  showFrom?: Date;
  repeat: boolean;
  /** The repeat rule (lib/models/repeat.dart), when its kind is one the web knows */
  repeatRule?: WebRepeat;
  /** Set on a repeat's "done" record (lib/models/todo.dart seriesId); the series itself has none */
  seriesId?: string;
  category?: string;
  private: boolean;
  order?: number;
}

export type RepeatKind = "daily" | "weekdays" | "everyNDays";

/** Repeat.toJson in the app: `days` are 1 = Monday … 7 = Sunday (weekdays only) */
export interface WebRepeat {
  kind: RepeatKind;
  days: number[];
}

export interface WebCategory {
  id: string;
  name: string;
}

export interface WebTank {
  id: string;
  name: string;
  shared: boolean;
  todos: WebTodo[];
  categories: WebCategory[];
  /** The fish as the phone last saved it (`fish_health`), not moved forward to now */
  fish?: WebFish;
  /** Cleaner creatures that slow rotting (🧹 shrimp · cleaner fish), from `cleaners` */
  crew: CrewStay[];
  /** 🌿 Relaxed tank: `fish_health`'s `mode` is not "hard", or there is no fish record yet (FishHealth's default, Difficulty.byName) */
  easy: boolean;
  /** To-dos finished more than 30 days ago, kept lightly for a year (`done_archive`, the app's lib/models/done_archive.dart, +24) */
  archive: ArchivedDone[];
}

/** One line of the year record: the day it was finished ("2026-10-30"), its title (≤ 40), its category */
export interface ArchivedDone {
  day: string;
  title: string;
  category?: string;
}

export interface WebFish {
  health: number;
  dead: boolean;
}

/** When one 🧹 cleaner was in the tank (lib/models/cleaners.dart Cleaner.boughtAt · endsAt) */
export interface CrewStay {
  from: number;
  to: number;
}

/** Same limits as the app (lib/models/todo.dart Todo.maxTitle, todo_category.dart) and firestore.rules */
export const MAX_TITLE = 100;
export const MAX_CATEGORIES = 8;
export const MAX_CATEGORY_NAME = 12;

export type NoteKind = "add" | "done" | "undo" | "edit" | "delete" | "category" | "renameCategory" | "deleteCategory";

/** One mailbox note. `category`: "" = no category; for kind "category" it is the new category's id */
export interface WebNote {
  id: string;
  kind: NoteKind;
  tank: string;
  at: number;
  todo?: string;
  title?: string;
  category?: string;
  name?: string;
  /** add · edit: due date "2026-10-31", or "" to clear (+24) */
  due?: string;
}

export interface WebBackup {
  tanks: WebTank[];
  activeId: string;
  updatedAt?: Date;
  /** The app build the phone last opened (`whats_new_build`, lib/services/app_update_service.dart) */
  appBuild?: number;
}

/** The first app build that reads the mailbox (1.0.0+19). Older phones would never apply web changes */
export const MIN_APP_BUILD = 19;

/** The first build that reads due dates and category rename · delete notes (1.0.0+24). Older phones drop them silently */
export const EDIT_MORE_BUILD = 24;

/** How far ahead a due date can be, like the app's date picker (AddTodoBar.maxDueDays) */
export const MAX_DUE_DAYS = 7;

const date = (v: unknown) => (typeof v === "string" && v ? new Date(v) : undefined);

function parseJson<T>(raw: unknown): T | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function parseArchive(raw: unknown): ArchivedDone[] {
  const list = parseJson<unknown[]>(raw) ?? [];
  return list.flatMap((e) =>
    Array.isArray(e) && typeof e[0] === "string" && typeof e[1] === "string"
      ? [{ day: e[0], title: e[1], category: typeof e[2] === "string" ? e[2] : undefined }]
      : [],
  );
}

function parseCategories(raw: unknown): WebCategory[] {
  const list = parseJson<Record<string, unknown>[]>(raw) ?? [];
  return list
    .filter((c) => typeof c?.id === "string" && typeof c?.name === "string")
    .map((c) => ({ id: c.id as string, name: c.name as string }));
}

function parseFish(raw: unknown): WebFish | undefined {
  const f = parseJson<Record<string, unknown>>(raw);
  if (!f || typeof f.health !== "number") return undefined;
  return { health: f.health, dead: f.dead === true };
}

/** Difficulty.byName in the app: anything but "hard" (no record, no or unknown mode) is Relaxed */
function parseEasy(raw: unknown): boolean {
  return parseJson<Record<string, unknown>>(raw)?.mode !== "hard";
}

/** Repeat.fromJson: the old "perWeek" reads as "every N days"; an unknown kind is left out (never refreshed, like every N days) */
function parseRepeat(raw: unknown): WebRepeat | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (r.kind === "daily") return { kind: "daily", days: [] };
  if (r.kind === "everyNDays" || r.kind === "perWeek") return { kind: "everyNDays", days: [] };
  if (r.kind === "weekdays") return { kind: "weekdays", days: Array.isArray(r.days) ? r.days.filter((d): d is number => typeof d === "number") : [] };
  return undefined;
}

// Only the 🧹 clean kinds slow rotting; lifetimes for ones saved before `days` was stored (CleanerKind.legacyDays)
const CLEANER_LEGACY_DAYS: Record<string, number> = { shrimp: 7, cleanerFish: 14 };
const DAY = 24 * 3600e3;

function parseCrew(raw: unknown): CrewStay[] {
  const list = parseJson<Record<string, unknown>[]>(raw) ?? [];
  return list.flatMap((c) => {
    const legacy = CLEANER_LEGACY_DAYS[c?.kind as string];
    const from = date(c?.boughtAt)?.getTime();
    if (!legacy || from === undefined) return [];
    const days = (typeof c.days === "number" ? c.days : legacy) + (typeof c.extra === "number" ? c.extra : 0);
    return [{ from, to: from + days * DAY }];
  });
}

function parseTodos(raw: unknown): WebTodo[] {
  const list = parseJson<Record<string, unknown>[]>(raw) ?? [];
  return list
    .filter((t) => typeof t?.id === "string" && typeof t?.title === "string")
    .map((t) => ({
      id: t.id as string,
      title: t.title as string,
      createdAt: date(t.createdAt) ?? new Date(0),
      dueDate: date(t.dueDate),
      doneAt: date(t.doneAt),
      showFrom: date(t.showFrom),
      repeat: t.repeat != null,
      repeatRule: parseRepeat(t.repeat),
      seriesId: typeof t.seriesId === "string" ? t.seriesId : undefined,
      category: typeof t.category === "string" ? t.category : undefined,
      private: t.private === true,
      order: typeof t.order === "number" ? t.order : undefined,
    }));
}

export function parseBackup(data: Record<string, unknown>, updatedAt?: Date): WebBackup {
  const shelf = parseJson<{ tanks?: Record<string, unknown>[]; active?: string }>(data.tanks);
  const listed = (shelf?.tanks ?? []).filter((t) => typeof t?.id === "string");
  const tanks: WebTank[] = (listed.length ? listed : [{ id: "", name: "" }]).map((t) => {
    const id = t.id as string;
    return {
      id,
      name: typeof t.name === "string" ? t.name : "",
      shared: typeof t.roomId === "string",
      todos: parseTodos(data[id ? `todos@${id}` : "todos"]),
      categories: parseCategories(data[id ? `categories@${id}` : "categories"]),
      fish: parseFish(data[id ? `fish_health@${id}` : "fish_health"]),
      crew: parseCrew(data[id ? `cleaners@${id}` : "cleaners"]),
      easy: parseEasy(data[id ? `fish_health@${id}` : "fish_health"]),
      archive: parseArchive(data[id ? `done_archive@${id}` : "done_archive"]),
    };
  });
  const active = typeof shelf?.active === "string" && tanks.some((t) => t.id === shelf.active) ? shelf.active : tanks[0].id;
  const build = data.whats_new_build;
  return { tanks, activeId: active, updatedAt, appBuild: typeof build === "number" ? build : undefined };
}

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Same rule as the app's Todo.isVisible: not done, and today is on or after showFrom */
export function isVisible(t: WebTodo, now: Date) {
  return !t.doneAt && (!t.showFrom || dayStart(now) >= dayStart(t.showFrom));
}

export function doneToday(t: WebTodo, now: Date) {
  return !!t.doneAt && dayStart(t.doneAt).getTime() === dayStart(now).getTime();
}

/** Same order as the app (Todo.byRank): a dragged to-do keeps its `order`, others go by when they were written; bigger is higher, so new ones come first */
const rank = (t: WebTodo) => t.order ?? t.createdAt.getTime();

export function sortTodos(list: WebTodo[]) {
  return [...list].sort((a, b) => rank(b) - rank(a));
}

/** A new id like the app makes (microseconds since 1970), so web and phone ids look the same */
export function newId(prefix = "") {
  return `${prefix}${Date.now() * 1000 + Math.floor(Math.random() * 1000)}`;
}

const clip = (s: string, n: number) => Array.from(s).slice(0, n).join("");

/** "2026-10-30" for a local date (FishHealth.dayKey in the app) */
export function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "2026-10-31" → that day at midnight (how the app stores a due date), or undefined */
export function parseDay(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
}

// ───────── Category colors (web only, 래원 2026-10-30: tell categories apart at a glance) ─────────
// Soft colors in the order categories were made, so up to 8 (the app's limit) never share one.
export const CATEGORY_COLORS = ["#7dd3fc", "#f9a8d4", "#86efac", "#fcd34d", "#c4b5fd", "#fdba74", "#5eead4", "#f0abfc"];

export function categoryColor(categories: WebCategory[], id?: string) {
  const i = categories.findIndex((c) => c.id === id);
  return i < 0 ? undefined : CATEGORY_COLORS[i % CATEGORY_COLORS.length];
}

// ───────── Month view (래원 2026-10-30) ─────────

export interface DayItem {
  title: string;
  category?: string;
  /** a to-do that is still on the list (finished ones are only titles) */
  todo?: WebTodo;
}

/** What happened on each day of one month: finished (to-dos done in the last 30 days + the year record) and due (open to-dos with that due date) */
export function monthDays(tank: WebTank, year: number, month: number, inFilter: (category?: string) => boolean) {
  const days = new Map<string, { done: DayItem[]; due: DayItem[] }>();
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const slot = (k: string) => days.get(k) ?? days.set(k, { done: [], due: [] }).get(k)!;
  for (const a of tank.archive) if (a.day.startsWith(prefix) && inFilter(a.category)) slot(a.day).done.push({ title: a.title, category: a.category });
  for (const t of tank.todos) {
    if (!inFilter(t.category)) continue;
    if (t.doneAt) {
      const k = dayKey(t.doneAt);
      if (k.startsWith(prefix)) slot(k).done.push({ title: t.title, category: t.category, todo: t });
    } else if (t.dueDate && !t.repeat) {
      const k = dayKey(t.dueDate);
      if (k.startsWith(prefix)) slot(k).due.push({ title: t.title, category: t.category, todo: t });
    }
  }
  return days;
}

/**
 * The backup with the mailbox notes that the phone hasn't applied yet laid on
 * top, in the order they were made. Mirrors InboxApply.step in the app: a note
 * that is already true (or points at a to-do that is gone) changes nothing, so
 * showing a note the phone has already applied is harmless.
 */
export function applyNotes(backup: WebBackup, notes: WebNote[]): WebBackup {
  if (!notes.length) return backup;
  const sorted = [...notes].sort((a, b) => a.at - b.at);
  const tanks = backup.tanks.map((tank) => {
    const mine = sorted.filter((n) => n.tank === tank.id);
    if (!mine.length) return tank;
    let todos = tank.todos;
    let categories = tank.categories;
    const ids = new Map<string, string | null>();
    const categoryOf = (webId?: string) => {
      if (!webId) return undefined;
      const id = ids.has(webId) ? ids.get(webId) : webId;
      return id && categories.some((c) => c.id === id) ? id : undefined;
    };
    const realId = (webId?: string) => (webId ? (ids.has(webId) ? ids.get(webId) ?? undefined : webId) : undefined);
    for (const n of mine) {
      switch (n.kind) {
        case "renameCategory": {
          const id = realId(n.category);
          const name = n.name?.trim();
          if (!id || !name) break;
          categories = categories.map((c) => (c.id === id ? { ...c, name: clip(name, MAX_CATEGORY_NAME) } : c));
          break;
        }
        case "deleteCategory": {
          const id = realId(n.category);
          if (!id || !categories.some((c) => c.id === id)) break;
          categories = categories.filter((c) => c.id !== id);
          todos = todos.map((t) => (t.category === id ? { ...t, category: undefined } : t)); // like the app: the to-dos stay, without a category
          break;
        }
        case "category": {
          const name = n.name?.trim();
          if (!n.category || !name) break;
          const same = categories.find((c) => c.name === name);
          if (same) ids.set(n.category, same.id);
          else if (categories.length >= MAX_CATEGORIES) ids.set(n.category, null);
          else {
            categories = [...categories, { id: n.category, name: clip(name, MAX_CATEGORY_NAME) }];
            ids.set(n.category, n.category);
          }
          break;
        }
        case "add": {
          const title = n.title?.trim();
          if (!n.todo || !title || todos.some((t) => t.id === n.todo)) break;
          todos = [
            ...todos,
            { id: n.todo, title: clip(title, MAX_TITLE), createdAt: new Date(n.at), dueDate: n.due ? parseDay(n.due) : undefined, repeat: false, private: false, category: categoryOf(n.category) },
          ];
          break;
        }
        case "edit":
          todos = todos.map((t) => {
            if (t.id !== n.todo) return t;
            const title = n.title?.trim();
            return {
              ...t,
              title: title ? clip(title, MAX_TITLE) : t.title,
              category: n.category === undefined ? t.category : categoryOf(n.category),
              // a repeat's due date comes from its rule, like in the app
              dueDate: n.due === undefined || t.repeat ? t.dueDate : n.due === "" ? undefined : (parseDay(n.due) ?? t.dueDate),
            };
          });
          break;
        case "delete":
          todos = todos.filter((t) => t.id !== n.todo);
          break;
        case "done":
          todos = todos.map((t) => (t.id === n.todo && !t.doneAt ? { ...t, doneAt: new Date(n.at) } : t));
          break;
        case "undo":
          todos = todos.map((t) => (t.id === n.todo && t.doneAt ? { ...t, doneAt: undefined } : t));
          break;
      }
    }
    return { ...tank, todos, categories };
  });
  return { ...backup, tanks };
}

// ───────── 🌿 Relaxed repeats refresh (the app's lib/models/repeat_refresh.dart, docs/06 "반복 할 일") ─────────
//
// In a Relaxed tank a daily or weekday repeat that was missed closes by itself
// at midnight of its next repeat day (no reward), and only today's share shows.
// The phone does this when the app opens (RepeatRefresh.apply) and saves a new
// backup; until then the web shows the same result, worked out when drawing.
// Nothing is written: a web "done" note still names the same to-do id, and the
// phone refreshes before it applies web notes, so rewards stay right. The
// one-time "residue" pollution the phone keeps (fish_health residueAt) only
// moves the fish's health, which the web shows as the phone last saved it.
// 🔥 Intense tanks and every-N-days repeats keep the missed share (it rots).

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Dart's DateTime.weekday: 1 = Monday … 7 = Sunday */
const weekday = (d: Date) => d.getDay() || 7;

/** Repeat.nextDay: the first repeat day on or after `from` (daily: `from` itself) */
function nextRepeatDay(r: WebRepeat, from: Date) {
  let d = dayStart(from);
  if (r.kind !== "weekdays" || !r.days.length) return d;
  for (let i = 0; i < 7; i++) {
    if (r.days.includes(weekday(d))) return d;
    d = addDays(d, 1);
  }
  return d;
}

/**
 * RepeatRefresh.shareDay: the day of the share this to-do shows after a
 * refresh (the latest repeat day after the missed one, up to today), or
 * undefined when there is nothing to close. A weekday repeat on a day it does
 * not repeat (Tuesday for Mon · Wed) has no next repeat day yet, so the missed
 * share stays and rots.
 */
export function repeatShareDay(t: WebTodo, now: Date): Date | undefined {
  const r = t.repeatRule;
  if (!r || r.kind === "everyNDays" || t.seriesId !== undefined || !isVisible(t, now)) return undefined;
  const today = dayStart(now);
  const due = dayStart(t.dueDate ?? t.showFrom ?? today);
  if (due >= today) return undefined;
  for (let d = today; d > due; d = addDays(d, -1)) {
    if (nextRepeatDay(r, d).getTime() === d.getTime()) return d;
  }
  return undefined;
}

/** The tank as the phone shows it after RepeatRefresh.apply (the same object when nothing closes, and always in an Intense tank) */
export function refreshRepeats(tank: WebTank, now: Date): WebTank {
  if (!tank.easy) return tank;
  let changed = false;
  const todos = tank.todos.map((t) => {
    const day = repeatShareDay(t, now);
    if (!day) return t;
    changed = true;
    return { ...t, showFrom: day, dueDate: day };
  });
  return changed ? { ...tank, todos } : tank;
}

// ───────── Rotting (same rules as the app's lib/models/rot.dart, docs/06) ─────────

export const ROT_MAX = 3;

/** When this to-do starts to rot: 24 hours after it was written, or the midnight after its due date */
function rotStart(t: WebTodo) {
  if (!t.dueDate) return t.createdAt.getTime() + DAY;
  return new Date(t.dueDate.getFullYear(), t.dueDate.getMonth(), t.dueDate.getDate() + 1).getTime();
}

/** Minutes that really rotted between from and to: each 🧹 cleaner in the tank slows it by 10%, up to 30% (CleanerCrew.rotMinutes) */
function rotMinutes(crew: CrewStay[], from: number, to: number) {
  if (to <= from) return 0;
  const edges = new Set([from, to]);
  for (const c of crew) for (const e of [c.from, c.to]) if (e > from && e < to) edges.add(e);
  const sorted = [...edges].sort((a, b) => a - b);
  let total = 0;
  for (let i = 0; i + 1 < sorted.length; i++) {
    const a = sorted[i];
    const alive = crew.filter((c) => a >= c.from && a < c.to).length;
    total += ((sorted[i + 1] - a) / 60000) * (1 - Math.min(0.3, 0.1 * alive));
  }
  return total;
}

/** 0 = fresh, 1 = day 1, … 3 = fully rotted (Rot.levelOf) */
export function rotLevel(t: WebTodo, now: Date, crew: CrewStay[] = []) {
  if (!isVisible(t, now)) return 0;
  const start = rotStart(t);
  if (now.getTime() < start) return 0;
  return Math.min(ROT_MAX, 1 + rotMinutes(crew, start, now.getTime()) / (24 * 60));
}

/** Calendar days from the to-do's day (due date, or the day it was written) to today (l10n daysSince) */
export function daysSince(from: Date, now: Date) {
  return Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / DAY);
}
