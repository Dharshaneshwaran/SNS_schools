import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react";

export function AdminStatCard({
  label,
  value,
  change,
  trend,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-[#FF7F50]">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </article>
  );
}
