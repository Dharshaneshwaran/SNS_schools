import { StatusPill } from "../ui/status-pill";

export function StatCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint: string;
  trend: string;
}) {
  return (
    <article className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <StatusPill label={trend} tone="success" />
      </div>
      <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{hint}</p>
    </article>
  );
}
