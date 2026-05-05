import { DashboardLayoutShell } from "../../components/dashboard/dashboard-layout-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
