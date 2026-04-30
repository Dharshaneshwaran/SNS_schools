import type { Request } from 'express';
import type { AuthTokenPayload } from '../../auth/auth.types';

export interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload;
}
