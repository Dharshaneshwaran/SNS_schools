import { apiRequest } from "./api-client";
import type { AuthSession, LoginPayload, UserProfile } from "../types/auth";

export function login(payload: LoginPayload) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refresh(refreshToken: string) {
  return apiRequest<AuthSession>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getProfile(accessToken: string) {
  return apiRequest<UserProfile>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
