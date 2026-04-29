"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getSettings } from "../../services/mock-data-service";
import { InfoListCard } from "./info-list-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function SettingsPage() {
  const loadSettings = useCallback(
    (accessToken: string) => getSettings(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadSettings);

  return (
    <PageSection
      eyebrow="Settings"
      title="Institution settings"
      description="This page gives your team a working admin settings shell with academic year, department, and notification mock data."
    >
      {isLoading ? <ResourceLoading label="settings" /> : null}
      {error ? <ResourceError label="settings" message={error} /> : null}
      {data ? (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <InfoListCard
            title="Institution profile"
            items={[
              {
                title: data.institution.name,
                description: `Academic year ${data.institution.academicYear} • ${data.institution.timezone}`,
              },
            ]}
          />
          <div className="grid gap-5">
            <InfoListCard
              title="Departments"
              items={data.departments.map((department) => ({
                title: department,
                description: "Available for teacher mapping and timetable planning.",
              }))}
            />
            <InfoListCard
              title="Notification channels"
              items={data.notifications.map((notification) => ({
                title: notification.channel,
                description: notification.status,
              }))}
            />
          </div>
        </div>
      ) : null}
    </PageSection>
  );
}
