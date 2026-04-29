"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getAttendance } from "../../services/mock-data-service";
import { DataTable } from "./data-table";
import { MetricCard } from "./metric-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function AttendancePage() {
  const loadAttendance = useCallback(
    (accessToken: string) => getAttendance(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadAttendance);

  return (
    <PageSection
      eyebrow="Attendance"
      title="Attendance management"
      description="Daily presence, leave tracking, and late-arrival monitoring are now navigable with shared mock records."
    >
      {isLoading ? <ResourceLoading label="attendance" /> : null}
      {error ? <ResourceError label="attendance" message={error} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Present" value={String(data.summary.present)} />
            <MetricCard label="On leave" value={String(data.summary.onLeave)} />
            <MetricCard
              label="Late arrivals"
              value={String(data.summary.lateArrivals)}
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <DataTable
              columns={["Teacher", "Leave Type", "Duration", "Status"]}
              rows={data.leaveRequests.map((request) => [
                request.teacher,
                request.type,
                request.duration,
                request.status,
              ])}
            />
            <DataTable
              columns={["Teacher", "Expected", "Actual"]}
              rows={data.lateArrivals.map((entry) => [
                entry.teacher,
                entry.expected,
                entry.actual,
              ])}
            />
          </div>
        </>
      ) : null}
    </PageSection>
  );
}
