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
  category?: string;
  private: boolean;
  order?: number;
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
}

/** Same limits as the app (lib/models/todo.dart Todo.maxTitle, todo_category.dart) and firestore.rules */
export const MAX_TITLE = 100;
export const MAX_CATEGORIES = 8;
export const MAX_CATEGORY_NAME = 12;

export type NoteKind = "add" | "done" | "undo" | "edit" | "delete" | "category";

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

const date = (v: unknown) => (typeof v === "string" && v ? new Date(v) : undefined);

function parseJson<T>(raw: unknown): T | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function parseCategories(raw: unknown): WebCategory[] {
  const list = parseJson<Record<string, unknown>[]>(raw) ?? [];
  return list
    .filter((c) => typeof c?.id === "string" && typeof c?.name === "string")
    .map((c) => ({ id: c.id as string, name: c.name as string }));
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

export function sortTodos(list: WebTodo[]) {
  return [...list].sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || a.createdAt.getTime() - b.createdAt.getTime());
}

/** A new id like the app makes (microseconds since 1970), so web and phone ids look the same */
export function newId(prefix = "") {
  return `${prefix}${Date.now() * 1000 + Math.floor(Math.random() * 1000)}`;
}

const clip = (s: string, n: number) => Array.from(s).slice(0, n).join("");

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
    for (const n of mine) {
      switch (n.kind) {
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
          todos = [...todos, { id: n.todo, title: clip(title, MAX_TITLE), createdAt: new Date(n.at), repeat: false, private: false, category: categoryOf(n.category) }];
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
