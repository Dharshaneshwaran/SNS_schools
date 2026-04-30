export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.05)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
