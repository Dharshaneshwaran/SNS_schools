const apiBaseUrl =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

import { readSession, clearSession } from "../lib/session-storage";

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const session = readSession();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${cleanPath}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data = {} as T & { message?: string };
  
  try {
    data = text ? (JSON.parse(text) as T & { message?: string }) : ({} as T & { message?: string });
  } catch {
    // Response is not valid JSON
    data = {} as T & { message?: string };
  }

  if (!response.ok) {
    // A 401 from a credential-check endpoint means "those details are wrong",
    // which is an ordinary form error the caller renders inline. Hard-redirecting
    // here reloads the page and wipes the message before the user can read it
    // (a typo'd password on /login used to just flash and show nothing).
    const isCredentialCheck =
      cleanPath === "/auth/login" ||
      cleanPath === "/auth/change-password" ||
      cleanPath === "/auth/verify-student";

    if (response.status === 401 && !isCredentialCheck) {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    
    const errorPayload = data as unknown as { message?: string; error?: string };
    const errorMessage = errorPayload.message || errorPayload.error || text || `HTTP ${response.status}`;
    console.error(`API Error [${response.status}] ${cleanPath}:`, errorMessage);
    throw new Error(errorMessage);
  }

  return data;
}

export { apiBaseUrl };
