import { apiRequest } from "./api-client";

export interface Contact {
  id: string;
  name: string;
  role: string;
  type: string;
  lastMsg?: string;
  time?: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export const chatService = {
  getConversations: async (token: string): Promise<Contact[]> => {
    const rawConversations = await apiRequest<any[]>("/messaging/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Transform to frontend format
    return rawConversations.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      type: c.role === 'parent' ? 'Parent' : (c.role === 'student' ? 'Student' : 'Staff'),
      lastMsg: c.lastMsg,
      time: c.time,
      unread: c.unread,
      online: c.status === 'active'
    }));
  },

  getHistory: async (token: string, recipientId: string): Promise<Message[]> => {
    return apiRequest<Message[]>(`/messaging/history/${recipientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  sendMessage: async (token: string, recipientId: string, text: string): Promise<Message> => {
    return apiRequest<Message>("/messaging/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ recipientId, text }),
    });
  }
};
