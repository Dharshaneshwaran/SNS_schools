export function ResourceLoading({ label }: { label: string }) {
  return (
    <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 text-sm text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      Loading {label}...
    </div>
  );
}

export function ResourceError({
  label,
  message,
}: {
  label: string;
  message: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
      Unable to load {label}: {message}
    </div>
  );
}
