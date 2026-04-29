"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearSession, readSession, writeSession } from "../lib/session-storage";
import { canAccessWebDashboard } from "../lib/role-access";
import {
  getProfile,
  login as loginRequest,
  refresh as refreshRequest,
} from "../services/auth-service";
import type { AuthSession, LoginPayload } from "../types/auth";

type AuthContextValue = {
  isBootstrapping: boolean;
  session: AuthSession | null;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => void;
  refreshSession: () => Promise<AuthSession | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const storedSession = readSession();

      if (!storedSession) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const profile = await getProfile(storedSession.accessToken);
        const nextSession = {
          ...storedSession,
          user: profile,
        };

        writeSession(nextSession);
        setSession(nextSession);
      } catch {
        try {
          const nextSession = await refreshRequest(storedSession.refreshToken);
          writeSession(nextSession);
          setSession(nextSession);
        } catch {
          clearSession();
          setSession(null);
        }
      } finally {
        setIsBootstrapping(false);
      }
    }

    void bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isBootstrapping,
      session,
      async login(payload) {
        const nextSession = await loginRequest(payload);

        if (!canAccessWebDashboard(nextSession.user.role)) {
          throw new Error(
            "This account is reserved for the mobile teacher app. Please sign in with an admin, leader, or superadmin account.",
          );
        }

        writeSession(nextSession);
        setSession(nextSession);
        return nextSession;
      },
      logout() {
        clearSession();
        setSession(null);
      },
      async refreshSession() {
        if (!session) {
          return null;
        }

        const nextSession = await refreshRequest(session.refreshToken);
        writeSession(nextSession);
        setSession(nextSession);
        return nextSession;
      },
    }),
    [isBootstrapping, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
