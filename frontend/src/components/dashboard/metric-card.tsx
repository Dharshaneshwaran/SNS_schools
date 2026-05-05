export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
        {value}
      </p>
    </article>
  );
}
