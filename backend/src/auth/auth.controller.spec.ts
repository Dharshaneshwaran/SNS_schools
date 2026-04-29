import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    process.env.DEMO_USER_PASSWORD = 'ChangeMe123!';
    process.env.DEMO_USER_EMAIL = 'teacher@sns-erp.local';

    const app: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('returns a token pair on login', () => {
    const response = authController.login({
      email: 'admin@sns-erp.local',
      password: 'ChangeMe123!',
    });

    expect(response.accessToken).toEqual(expect.any(String));
    expect(response.refreshToken).toEqual(expect.any(String));
    expect(response.user.role).toBe('admin');
  });
});
