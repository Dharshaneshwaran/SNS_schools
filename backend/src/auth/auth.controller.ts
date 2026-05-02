import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { AuthService } from './auth.service';
import type { LoginDto, RefreshTokenDto } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() payload: RefreshTokenDto) {
    return await this.authService.refresh(payload.refreshToken);
  }

  @Get('me')
  async me(@Req() request: AuthenticatedRequest) {
    return await this.authService.getProfile(request.user.sub);
  }

  @Post('change-password')
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return await this.authService.changePassword(
      request.user.sub,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Patch('profile')
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: { name?: string; email?: string },
  ) {
    return await this.authService.updateProfile(request.user.sub, body);
  }
}
