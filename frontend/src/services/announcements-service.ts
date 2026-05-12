import { apiRequest } from "./api-client";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'parents' | 'staff';
  imageUrl?: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  target: 'all' | 'parents' | 'staff';
  imageUrl?: string;
}

export async function createAnnouncement(data: CreateAnnouncementDto): Promise<Announcement> {
  return apiRequest<Announcement>("/announcements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAnnouncements(skip = 0, take = 50): Promise<Announcement[]> {
  return apiRequest<Announcement[]>(`/announcements?skip=${skip}&take=${take}`);
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  return apiRequest<Announcement>(`/announcements/${id}`);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await apiRequest(`/announcements/${id}`, { method: "DELETE" });
}

export async function updateAnnouncement(id: string, data: Partial<CreateAnnouncementDto>): Promise<Announcement> {
  return apiRequest<Announcement>(`/announcements/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAnnouncementCount(): Promise<{ count: number }> {
  return apiRequest<{ count: number }>("/announcements/count");
}
