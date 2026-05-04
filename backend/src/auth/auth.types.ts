import type { AppRole } from '../common/constants/roles';

export interface LoginDto {
  email?: string;
  password?: string;
}

export interface RefreshTokenDto {
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AppRole;
  department: string;
  status: 'active' | 'away';
  teacherProfile?: any;
  studentProfile?: any;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: AppRole;
  type: 'access' | 'refresh';
  exp: number;
  iat: number;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: AppRole;
    department: string;
    status: 'active' | 'away';
    teacherProfile?: any;
    studentProfile?: any;
  };
}
