"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getReports } from "../../services/mock-data-service";
import { InfoListCard } from "./info-list-card";
import { MetricCard } from "./metric-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function ReportsPage() {
  const loadReports = useCallback(
    (accessToken: string) => getReports(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadReports);

  return (
    <PageSection
      eyebrow="Reports"
      title="Reports and exports"
      description="The reporting section now works with mock analytics, export-ready summaries, and report catalog cards."
    >
      {isLoading ? <ResourceLoading label="reports" /> : null}
      {error ? <ResourceError label="reports" message={error} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {data.highlights.map((highlight) => (
              <MetricCard
                key={highlight.metric}
                label={highlight.metric}
                value={highlight.value}
              />
            ))}
          </div>
          <InfoListCard
            title="Available reports"
            items={data.availableReports.map((report) => ({
              title: `${report.title} • ${report.format}`,
              description: report.description,
            }))}
          />
        </>
      ) : null}
    </PageSection>
  );
}
