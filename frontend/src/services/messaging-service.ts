import { apiRequest } from "./api-client";
import { readSession } from "../lib/session-storage";

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: any[];
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  groupId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

export async function getGroups(): Promise<Group[]> {
  const session = readSession();
  return apiRequest<Group[]>("/messaging/groups", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}

export async function getMessages(groupId: string): Promise<Message[]> {
  const session = readSession();
  return apiRequest<Message[]>(`/messaging/messages/${groupId}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}

export async function createGroup(name: string, description: string) {
  const session = readSession();
  return apiRequest("/messaging/groups", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ name, description }),
  });
}

export async function addMember(groupId: string, userId: string) {
  const session = readSession();
  return apiRequest(`/messaging/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ userId }),
  });
}

export async function sendMessage(groupId: string, text: string) {
  const session = readSession();
  return apiRequest("/messaging/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ groupId, text }),
  });
}
