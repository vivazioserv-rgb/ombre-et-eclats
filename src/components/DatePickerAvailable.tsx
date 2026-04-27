"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromIso(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const WEEKDAY_SHORT = ["L", "M", "M", "J", "V", "S", "D"];

export default function DatePickerAvailable({
  label,
  value,
  onChange,
  minDays = 2,
  openWeekdays,
  closedDates,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  minDays?: number;
  openWeekdays?: number[];
  closedDates?: string[];
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + minDays);
    return d;
  }, [minDays]);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    const base = value ? fromIso(value) : minDate;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const openDays = openWeekdays && openWeekdays.length ? openWeekdays : [0, 1, 2, 3, 4, 5, 6];
  const closedSet = useMemo(() => new Set(closedDates || []), [closedDates]);

  function isDisabled(d: Date) {
    if (d < minDate || d > maxDate) return true;
    if (!openDays.includes(d.getDay())) return true;
    if (closedSet.has(toIso(d))) return true;
    return false;
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Build month grid
  const firstOfMonth = viewMonth;
  const lastOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  // Start on Monday (French convention)
  const firstGridDay = new Date(firstOfMonth);
  const offsetToMonday = (firstOfMonth.getDay() + 6) % 7; // 0 if Monday, 6 if Sunday
  firstGridDay.setDate(firstOfMonth.getDate() - offsetToMonday);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(firstGridDay);
    d.setDate(firstGridDay.getDate() + i);
    days.push(d);
  }

  const canGoPrev =
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1).getFullYear() * 12 +
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1).getMonth() >=
    minDate.getFullYear() * 12 + minDate.getMonth();
  const canGoNext =
    viewMonth.getFullYear() * 12 + viewMonth.getMonth() <
    maxDate.getFullYear() * 12 + maxDate.getMonth();

  function prettyValue() {
    if (!value) return "Choisir une date…";
    const d = fromIso(value);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div ref={wrapRef}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border bg-[var(--muted)] px-3 py-2 text-left text-sm ${
          value ? "border-[var(--accent)] text-[var(--foreground)]" : "border-[var(--accent)] text-[var(--foreground)]/50"
        } focus:border-[var(--primary)] focus:outline-none`}
      >
        <span className="capitalize">{prettyValue()}</span>
        <Calendar className="h-4 w-4 text-[var(--foreground)]/40" />
      </button>

      {required && !value && <input type="hidden" required value="" readOnly />}

      {open && (
        <div className="relative">
          <div className="absolute z-50 mt-2 w-80 rounded-2xl border border-[var(--accent)] bg-[var(--muted)] p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                className="rounded-full p-1 text-[var(--foreground)]/60 hover:bg-[var(--muted)] disabled:opacity-30"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-serif text-sm">
                {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </div>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                className="rounded-full p-1 text-[var(--foreground)]/60 hover:bg-[var(--muted)] disabled:opacity-30"
                aria-label="Mois suivant"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-[var(--foreground)]/40">
              {WEEKDAY_SHORT.map((d, i) => (
                <div key={i} className="py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                const sameMonth = d.getMonth() === viewMonth.getMonth();
                const disabled = isDisabled(d);
                const selected = value === toIso(d);
                const isClosedDate = closedSet.has(toIso(d));
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(toIso(d));
                      setOpen(false);
                    }}
                    className={[
                      "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors",
                      !sameMonth ? "text-[var(--foreground)]/20" : "",
                      selected ? "bg-[var(--primary)] text-[var(--background)] font-semibold" : "",
                      !selected && !disabled && sameMonth ? "hover:bg-[var(--muted)] text-[var(--foreground)]" : "",
                      disabled && !selected
                        ? "cursor-not-allowed text-[var(--foreground)]/25 line-through decoration-1"
                        : "",
                      isClosedDate && !selected ? "bg-red-50" : "",
                    ].join(" ")}
                    aria-label={d.toLocaleDateString("fr-FR")}
                    title={disabled ? "Indisponible" : undefined}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-3 text-[10px] text-[var(--foreground)]/50">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-red-200" /> Fermé
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]" /> Sélectionné
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
