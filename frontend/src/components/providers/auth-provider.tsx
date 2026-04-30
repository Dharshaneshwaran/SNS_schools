"use client";

import { AuthProvider } from "../../hooks/use-auth";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
