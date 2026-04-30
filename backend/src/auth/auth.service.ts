import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { appConfig } from '../config/app.config';
import { UsersService } from '../users/users.service';
import type { AuthSession, AuthTokenPayload, LoginDto } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login(payload: LoginDto): AuthSession {
    const email = payload.email?.trim().toLowerCase() ?? '';
    const password = payload.password ?? '';

    if (!email || !password) {
      throw new UnprocessableEntityException(
        'Email and password are required.',
      );
    }

    const user = this.usersService.findByEmail(email);

    if (!user || !this.safeCompare(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createSession(user);
  }

  refresh(refreshToken?: string): AuthSession {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const payload = this.verifyToken(
      refreshToken,
      appConfig.refreshSecret,
      'refresh',
    );
    const user = this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return this.createSession(user);
  }

  getProfile(userId: string) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    };
  }

  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (!this.safeCompare(currentPassword, user.password)) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    if (newPassword.length < 6) {
      throw new UnprocessableEntityException(
        'New password must be at least 6 characters.',
      );
    }

    this.usersService.updatePassword(userId, newPassword);

    return { message: 'Password changed successfully.' };
  }

  updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (data.email && data.email !== user.email) {
      const existing = this.usersService.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new UnprocessableEntityException('Email is already in use.');
      }
    }

    this.usersService.updateProfile(userId, data);
    const updated = this.usersService.findById(userId);

    return {
      message: 'Profile updated successfully.',
      user: {
        id: updated!.id,
        name: updated!.name,
        email: updated!.email,
        role: updated!.role,
        department: updated!.department,
        status: updated!.status,
      },
    };
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    return this.verifyToken(token, appConfig.jwtSecret, 'access');
  }

  private createSession(
    user: ReturnType<UsersService['findByEmail']>,
  ): AuthSession {
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const accessToken = this.signToken(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      appConfig.jwtSecret,
      appConfig.accessTokenTtlSeconds,
      'access',
    );
    const refreshToken = this.signToken(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      appConfig.refreshSecret,
      appConfig.refreshTokenTtlSeconds,
      'refresh',
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: appConfig.accessTokenTtlSeconds,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
      },
    };
  }

  private signToken(
    payload: Omit<AuthTokenPayload, 'exp' | 'iat' | 'type'>,
    secret: string,
    ttlSeconds: number,
    type: 'access' | 'refresh',
  ) {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: AuthTokenPayload = {
      ...payload,
      type,
      iat: now,
      exp: now + ttlSeconds,
    };

    const encodedHeader = this.toBase64Url(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.toBase64Url(JSON.stringify(fullPayload));
    const signature = this.createSignature(
      `${encodedHeader}.${encodedPayload}`,
      secret,
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private verifyToken(
    token: string,
    secret: string,
    expectedType: 'access' | 'refresh',
  ): AuthTokenPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token format.');
    }

    const expectedSignature = this.createSignature(
      `${encodedHeader}.${encodedPayload}`,
      secret,
    );

    if (!this.safeCompare(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid token signature.');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as AuthTokenPayload;

    if (payload.type !== expectedType) {
      throw new UnauthorizedException('Invalid token type.');
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token has expired.');
    }

    return payload;
  }

  private createSignature(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private toBase64Url(value: string) {
    return Buffer.from(value, 'utf8').toString('base64url');
  }

  private safeCompare(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  }
}
