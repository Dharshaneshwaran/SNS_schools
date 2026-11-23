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
import { effectiveRoles } from '../constants/roles';
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

    if (!user) {
      throw new ForbiddenException('You do not have access to this resource.');
    }

    // Expand leadership roles (principal/coordinator) into the guard labels
    // they inherit before comparing. Roles absent from ROLE_INHERITANCE map
    // to themselves, so behaviour for the original roles is unchanged.
    const granted = effectiveRoles(user.role);
    if (!requiredRoles.some((role) => granted.includes(role))) {
      throw new ForbiddenException('You do not have access to this resource.');
    }

    return true;
  }
}
