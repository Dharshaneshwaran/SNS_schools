import { apiRequest } from "./api-client";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'alert' | 'info';
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (token: string): Promise<AppNotification[]> => {
    return apiRequest<AppNotification[]>("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  markAsRead: async (token: string, id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  markAllAsRead: async (token: string): Promise<void> => {
    await apiRequest("/notifications/read-all", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};
