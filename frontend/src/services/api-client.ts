const apiBaseUrl =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

import { readSession } from "../lib/session-storage";

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
  const data = text ? (JSON.parse(text) as T & { message?: string }) : ({} as T);

  if (!response.ok) {
    throw new Error((data as any).message ?? "Request failed.");
  }

  return data;
}

export { apiBaseUrl };
