import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { categoryColor, dayKey, monthDays, type WebCategory, type WebTank } from "./backup";

// Month view (래원 2026-10-30): a calendar of what was finished and what is due, per day.
// Finished = to-dos done in the last 30 days (still in the backup) + the year record the app
// keeps from +24 (done_archive). Due = open to-dos with a due date. Read-only: changes happen in the list.

type Lang = "en" | "ko";

const COPY = {
  en: {
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    prev: "Previous month",
    next: "Next month",
    today: "Today",
    finished: (n: number) => `Finished (${n})`,
    due: (n: number) => `Due (${n})`,
    nothing: "Nothing on this day.",
    legendDone: "finished",
    legendDue: "due",
    note: "Finished to-dos older than 30 days show here once your phone has Doquarium 1.0.0+24 (kept for a year).",
    noteKept: "Finished to-dos stay here for a year.",
  },
  ko: {
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    prev: "이전 달",
    next: "다음 달",
    today: "오늘",
    finished: (n: number) => `끝낸 일 (${n})`,
    due: (n: number) => `마감 (${n})`,
    nothing: "이날은 기록이 없어요.",
    legendDone: "끝낸 일",
    legendDue: "마감",
    note: "30일보다 오래된 끝낸 일은 폰의 두쿠아리움이 1.0.0+24 이상이면 여기에 보여요 (1년 동안).",
    noteKept: "끝낸 일은 1년 동안 여기에 남아요.",
  },
} as const;

export default function MonthView({
  lang,
  tank,
  categories,
  filter,
  now,
  keepsYear,
}: {
  lang: Lang;
  tank: WebTank;
  categories: WebCategory[];
  /** a category id, or null for all */
  filter: string | null;
  now: Date;
  /** the phone's app keeps the year record (+24): no "update" note needed */
  keepsYear: boolean;
}) {
  const t = COPY[lang];
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [picked, setPicked] = useState(() => dayKey(now));
  const today = dayKey(now);

  const days = useMemo(
    () => monthDays(tank, month.getFullYear(), month.getMonth(), (c) => filter === null || c === filter),
    [tank, month, filter],
  );

  // Sunday-first grid: blanks before the 1st, then every day of the month
  const first = month.getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  const title = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", { year: "numeric", month: "long" }).format(month);
  const pickedLabel = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", { month: "long", day: "numeric", weekday: "short" }).format(
    new Date(`${picked}T00:00:00`),
  );
  const sel = days.get(picked) ?? { done: [], due: [] };
  // Moving to another month picks today if it's in that month, otherwise the 1st (the list below follows the month)
  const go = (delta: number) => {
    const m = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(m);
    setPicked(m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth() ? today : dayKey(m));
  };

  return (
    <div className="px-4 sm:px-6 py-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <button onClick={() => go(-1)} aria-label={t.prev} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-display font-bold text-white">{title}</h3>
          <button
            onClick={() => {
              setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              setPicked(today);
            }}
            className="h-7 px-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-display font-bold text-white/60 hover:text-white"
          >
            {t.today}
          </button>
        </div>
        <button onClick={() => go(1)} aria-label={t.next} className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {t.weekdays.map((w, i) => (
          <span key={w} className={`text-[11px] font-display font-bold ${i === 0 ? "text-[#f9a8d4]/70" : "text-white/40"}`}>
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`b${i}`} />;
          const k = dayKey(d);
          const info = days.get(k);
          const isPicked = k === picked;
          return (
            <button
              key={k}
              onClick={() => setPicked(k)}
              aria-pressed={isPicked}
              className={`min-h-[52px] sm:min-h-[64px] rounded-xl p-1 flex flex-col items-center gap-0.5 transition-colors ${
                isPicked ? "bg-white/10 border border-white/20" : "border border-transparent hover:bg-white/5"
              }`}
            >
              <span
                className={`text-xs sm:text-sm font-display font-bold h-6 w-6 rounded-full flex items-center justify-center ${
                  k === today ? "bg-[#3ef2ff] text-[#062226]" : d.getDay() === 0 ? "text-[#f9a8d4]/80" : "text-white/70"
                }`}
              >
                {d.getDate()}
              </span>
              {info && info.done.length > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#3ef2ff]/90" aria-label={`${t.legendDone} ${info.done.length}`}>
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  {info.done.length}
                </span>
              )}
              {info && info.due.length > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#fcd34d]/90" aria-label={`${t.legendDue} ${info.due.length}`}>
                  <Circle className="h-2.5 w-2.5" strokeWidth={3} />
                  {info.due.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
        <span className="flex items-center gap-1">
          <Check className="h-3 w-3 text-[#3ef2ff]" strokeWidth={3} /> {t.legendDone}
        </span>
        <span className="flex items-center gap-1">
          <Circle className="h-3 w-3 text-[#fcd34d]" strokeWidth={3} /> {t.legendDue}
        </span>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5">
        <p className="text-sm font-display font-bold text-white mb-3">{pickedLabel}</p>
        {sel.done.length === 0 && sel.due.length === 0 && <p className="text-sm text-lumora-sub">{t.nothing}</p>}
        {sel.due.length > 0 && (
          <DayList label={t.due(sel.due.length)} items={sel.due} categories={categories} kind="due" />
        )}
        {sel.done.length > 0 && (
          <DayList label={t.finished(sel.done.length)} items={sel.done} categories={categories} kind="done" />
        )}
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-white/35">{keepsYear ? t.noteKept : t.note}</p>
    </div>
  );
}

function DayList({
  label,
  items,
  categories,
  kind,
}: {
  label: string;
  items: { title: string; category?: string }[];
  categories: WebCategory[];
  kind: "done" | "due";
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-display font-bold uppercase tracking-wider text-white/40 mb-2">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((it, i) => {
          const color = categoryColor(categories, it.category);
          return (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              {kind === "done" ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3ef2ff]/80" strokeWidth={3} />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#fcd34d]/80" strokeWidth={2.5} />
              )}
              <span className={`flex-1 min-w-0 break-words ${kind === "done" ? "text-white/60" : "text-white"}`}>{it.title}</span>
              {color && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
