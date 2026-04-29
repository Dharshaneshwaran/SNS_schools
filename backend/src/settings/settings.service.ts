import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  getSettings() {
    return {
      institution: {
        name: 'SNS Matriculation School',
        academicYear: '2026 - 2027',
        timezone: 'Asia/Kolkata',
      },
      departments: ['Mathematics', 'Science', 'Languages', 'Primary', 'Arts'],
      notifications: [
        {
          channel: 'Email digests',
          status: 'Enabled',
        },
        {
          channel: 'WhatsApp alerts',
          status: 'Planned',
        },
        {
          channel: 'Mobile push',
          status: 'Planned',
        },
      ],
    };
  }
}
