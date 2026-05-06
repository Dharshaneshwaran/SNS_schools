"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "../../hooks/use-auth";
import { requestForToken, onMessageListener } from "../../lib/firebase";
import { apiRequest } from "../../services/api-client";
import { Toaster, toast } from "sonner";

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      const setupNotifications = async () => {
        try {
          const token = await requestForToken();
          if (token) {
            await apiRequest("/notifications/token", {
              method: "POST",
              body: JSON.stringify({ token, device: "web" }),
            });
          }
        } catch (err) {
          console.error("FCM Setup Error:", err);
        }
      };
      setupNotifications();

      // Listen for foreground messages
      onMessageListener().then((payload: any) => {
        if (payload?.notification) {
          toast(payload.notification.title, {
            description: payload.notification.body,
          });
        }
      });
    }
  }, [session]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <Toaster position="top-right" richColors />
      </NotificationProvider>
    </AuthProvider>
  );
}
