import { apiRequest } from "./api-client";
import { readSession } from "../lib/session-storage";

export function createTeacher(data: {
  name: string;
  email: string;
  department: string;
  employeeId: string;
  designation: string;
  specialization: string;
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

export function createStudent(data: {
  name: string;
  email: string;
  department: string;
  studentId: string;
  class: string;
  section: string;
}) {
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
