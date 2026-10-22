// Reads the Doquarium app's sign-in backup (Firestore `backups/{uid}`) into
// tanks and to-dos for the web. The backup is a copy of the phone's saved
// values (SharedPreferences): `tanks` holds the tank list as a JSON string, and
// each tank's to-dos are under `todos` (the first tank, id "") or
// `todos@{tankId}`. Field names follow the app's lib/models/todo.dart and
// tank.dart (doquarium repo). Keep in sync if those change.

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

export interface WebTank {
  id: string;
  name: string;
  shared: boolean;
  todos: WebTodo[];
}

export interface WebBackup {
  tanks: WebTank[];
  activeId: string;
  updatedAt?: Date;
}

const date = (v: unknown) => (typeof v === "string" && v ? new Date(v) : undefined);

function parseJson<T>(raw: unknown): T | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
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
    };
  });
  const active = typeof shelf?.active === "string" && tanks.some((t) => t.id === shelf.active) ? shelf.active : tanks[0].id;
  return { tanks, activeId: active, updatedAt };
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
