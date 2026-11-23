import { readSession } from "../lib/session-storage";
import { apiBaseUrl, apiRequest } from "./api-client";

/**
 * School photo gallery (requirements section 17).
 *
 * Uploading is multipart, so it cannot go through `apiRequest` (which always
 * sets `Content-Type: application/json` and parses the response as JSON).
 * The CRUD side is plain JSON and uses the normal client.
 */

export interface SchoolImage {
  id: string;
  url: string;
  caption: string;
  sortOrder: number;
  createdAt: string;
}

export function listGallery(): Promise<SchoolImage[]> {
  return apiRequest<SchoolImage[]>("/gallery");
}

/** `url` must be an uploaded path beginning with `/files/`. */
export function createGalleryImage(url: string, caption?: string): Promise<SchoolImage> {
  return apiRequest<SchoolImage>("/gallery", {
    method: "POST",
    body: JSON.stringify({ url, caption }),
  });
}

export function deleteGalleryImage(id: string): Promise<SchoolImage> {
  return apiRequest<SchoolImage>(`/gallery/${id}`, { method: "DELETE" });
}

/**
 * Upload into the `gallery` folder and return the `/files/...` path to hand
 * to `createGalleryImage`. Writing to that folder is leadership-only on the
 * server, so a teacher gets a 403 with a readable message.
 */
export async function uploadGalleryFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const session = readSession();
  const response = await fetch(`${apiBaseUrl}/uploads?folder=gallery`, {
    method: "POST",
    headers: session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {},
    body: form,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const raw = body?.message;
    const message = Array.isArray(raw) ? raw[0] : raw;
    throw new Error(message || `Upload failed (HTTP ${response.status}).`);
  }

  return body.path as string;
}
