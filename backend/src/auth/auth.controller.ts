import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { AuthService } from './auth.service';
import type { LoginDto, RefreshTokenDto } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() payload: RefreshTokenDto) {
    return this.authService.refresh(payload.refreshToken);
  }

  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.getProfile(request.user.sub);
  }
}
