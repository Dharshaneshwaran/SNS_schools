"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getDashboardOverview } from "../../services/mock-data-service";
import { InfoListCard } from "./info-list-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";
import { StatCard } from "./stat-card";

export function DashboardOverview() {
  const loadOverview = useCallback(
    (accessToken: string) => getDashboardOverview(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadOverview);

  return (
    <PageSection
      eyebrow="Overview"
      title="Operational dashboard"
      description="Attendance coverage, substitution queue, staff availability, and quick actions are all fed from the protected mock API."
    >
      {isLoading ? <ResourceLoading label="dashboard overview" /> : null}
      {error ? <ResourceError label="dashboard overview" message={error} /> : null}
      {data ? (
        <>
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.05)] sm:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Teacher Roster & Deployment
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                  Staffing Overview
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-500">
                  A denser control room for staffing, subject readiness, and
                  teacher workload coordination across the week.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
                    20 Teachers
                  </span>
                  <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
                    11 Subjects
                  </span>
                  <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
                    18 Ready for Scheduling
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 xl:max-w-md xl:justify-end">
                <button className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(79,70,229,0.24)] transition hover:bg-[var(--accent-strong)]">
                  Review approvals
                </button>
                <button className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(79,70,229,0.24)] transition hover:bg-[var(--accent-strong)]">
                  Special classes
                </button>
                <button className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(79,70,229,0.24)] transition hover:bg-[var(--accent-strong)]">
                  Manage absences
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <InfoListCard
              title="Operational Snapshot"
              items={data.panels.map((panel) => ({
                title: panel.title,
                description: panel.body,
              }))}
            />
            <InfoListCard title="Quick Actions" items={data.quickActions} />
          </div>
        </>
      ) : null}
    </PageSection>
  );
}
