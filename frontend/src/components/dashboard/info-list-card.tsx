export function InfoListCard({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    description: string;
  }[];
}) {
  return (
    <section className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="rounded-[1.3rem] border border-[var(--border)] bg-[#fbfcff] p-4"
          >
            <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
