import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: {
    email: string;
    name: string;
  };
}

@Injectable()
export class AuthService {
  login(payload: LoginPayload): LoginResponse {
    const email = payload.email?.trim().toLowerCase() ?? '';
    const password = payload.password ?? '';
    const expectedEmail =
      process.env.DEMO_USER_EMAIL?.trim().toLowerCase() ??
      'admin@sns-erp.local';
    const expectedPassword =
      process.env.DEMO_USER_PASSWORD ?? 'ChangeMe123!';
    const userName = process.env.DEMO_USER_NAME?.trim() || 'SNS ERP Admin';

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required.');
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      accessToken: 'demo-auth-token',
      expiresIn: 3600,
      user: {
        email: expectedEmail,
        name: userName,
      },
    };
  }
}
