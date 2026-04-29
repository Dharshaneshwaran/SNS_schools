"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getSubstitutions } from "../../services/mock-data-service";
import { DataTable } from "./data-table";
import { MetricCard } from "./metric-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function SubstitutionsPage() {
  const loadSubstitutions = useCallback(
    (accessToken: string) => getSubstitutions(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadSubstitutions);

  return (
    <PageSection
      eyebrow="Substitutions"
      title="Substitution management"
      description="Auto and manual substitution requests now have a live mock queue for approvals, emergency handling, and assignment review."
    >
      {isLoading ? <ResourceLoading label="substitutions" /> : null}
      {error ? <ResourceError label="substitutions" message={error} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Pending approval"
              value={String(data.summary.pendingApproval)}
            />
            <MetricCard
              label="Emergency replacements"
              value={String(data.summary.emergencyReplacements)}
            />
            <MetricCard
              label="Auto assigned"
              value={String(data.summary.autoAssigned)}
            />
          </div>
          <DataTable
            columns={[
              "Class",
              "Absent Teacher",
              "Suggested Teacher",
              "Mode",
              "Status",
            ]}
            rows={data.requests.map((request) => [
              request.className,
              request.absentTeacher,
              request.suggestedTeacher,
              request.mode,
              request.status,
            ])}
          />
        </>
      ) : null}
    </PageSection>
  );
}
