import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { SubstitutionsModule } from './substitutions/substitutions.module';
import { TeachersModule } from './teachers/teachers.module';
import { TimetableModule } from './timetable/timetable.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HealthModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    TeachersModule,
    TimetableModule,
    AttendanceModule,
    SubstitutionsModule,
    ReportsModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
