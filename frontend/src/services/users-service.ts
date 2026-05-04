import { apiRequest } from "./api-client";
import { readSession } from "../lib/session-storage";

export function createTeacher(data: {
  name: string;
  email: string;
  department: string;
  employeeId: string;
  designation: string;
  specialization: string;
  password?: string;
}) {
  const session = readSession();
  return apiRequest("/users/teacher", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

export function createStudent(data: any) {
  const session = readSession();
  return apiRequest("/users/student", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

export function getAllUsers() {
  const session = readSession();
  return apiRequest("/users", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}

export function deleteUser(id: string) {
  const session = readSession();
  return apiRequest(`/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
}
