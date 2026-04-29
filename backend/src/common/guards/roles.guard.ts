import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthTokenPayload } from '../../auth/auth.types';
import type { AppRole } from '../constants/roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<
      Request & {
        user?: AuthTokenPayload;
      }
    >();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role as AppRole)) {
      throw new ForbiddenException('You do not have access to this resource.');
    }

    return true;
  }
}
