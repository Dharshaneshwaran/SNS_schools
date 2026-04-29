import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  getReports() {
    return {
      availableReports: [
        {
          title: 'Monthly attendance',
          description: 'Department-wise attendance rollups with leave and late analytics.',
          format: 'PDF / Excel ready',
        },
        {
          title: 'Substitution efficiency',
          description: 'Tracks leader approvals, emergency coverage, and unresolved periods.',
          format: 'Excel ready',
        },
        {
          title: 'Teacher workload',
          description: 'Highlights overload and free-capacity distribution before publishing schedules.',
          format: 'PDF / Excel ready',
        },
      ],
      highlights: [
        {
          metric: 'Attendance trend',
          value: '+4.8%',
        },
        {
          metric: 'Average approval time',
          value: '18 mins',
        },
        {
          metric: 'Workload balance score',
          value: '87/100',
        },
      ],
    };
  }
}
