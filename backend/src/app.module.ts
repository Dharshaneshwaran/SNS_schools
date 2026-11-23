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
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { LeavesModule } from './leaves/leaves.module';
import { RoleGroupsModule } from './role-groups/role-groups.module';
import { HomeworkModule } from './homework/homework.module';
import { ExamsModule } from './exams/exams.module';
import { UploadsModule } from './uploads/uploads.module';
import { AcademicsModule } from './academics/academics.module';
import { CalendarModule } from './calendar/calendar.module';
import { GalleryModule } from './gallery/gallery.module';
import { ExcelModule } from './excel/excel.module';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
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
    MessagingModule,
    NotificationsModule,
    AnnouncementsModule,
    LeavesModule,
    RoleGroupsModule,
    HomeworkModule,
    ExamsModule,
    UploadsModule,
    AcademicsModule,
    CalendarModule,
    GalleryModule,
    ExcelModule,
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
