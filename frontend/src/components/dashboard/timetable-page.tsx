"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getTimetable } from "../../services/mock-data-service";
import { InfoListCard } from "./info-list-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function TimetablePage() {
  const loadTimetable = useCallback(
    (accessToken: string) => getTimetable(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadTimetable);

  return (
    <PageSection
      eyebrow="Timetable"
      title="Weekly timetable"
      description="This working mock page shows the current week draft, period allocations, and conflict cues your team can replace with real validation later."
    >
      {isLoading ? <ResourceLoading label="timetable" /> : null}
      {error ? <ResourceError label="timetable" message={error} /> : null}
      {data ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              {data.weekLabel}
            </p>
            <div className="mt-5 space-y-4">
              {data.schedule.map((day) => (
                <div
                  key={day.day}
                  className="rounded-[1.4rem] border border-[var(--border)] bg-[#fcfcfb] p-5"
                >
                  <h2 className="text-lg font-semibold text-slate-900">{day.day}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {day.periods.map((period) => (
                      <div
                        key={`${day.day}-${period.slot}`}
                        className="rounded-[1.1rem] border border-[var(--border)] bg-white p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                          {period.slot}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {period.subject}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{period.teacher}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <InfoListCard
            title="Conflict alerts"
            items={data.conflicts.map((conflict) => ({
              title: "Schedule review",
              description: conflict,
            }))}
          />
        </div>
      ) : null}
    </PageSection>
  );
}
