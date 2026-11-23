import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  // AuthModule is required because UploadsController guards itself with
  // AuthGuard, which injects AuthService. Without it the whole app fails
  // to boot with UnknownDependenciesException.
  imports: [AuthModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
