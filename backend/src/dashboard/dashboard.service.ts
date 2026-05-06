import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
  constructor(private readonly usersService: UsersService) {}

  async getOverview() {
    const stats = await this.usersService.getSystemStats();
    
    return {
      stats: [
        {
          label: 'Total Students',
          value: stats.totalStudents.toString(),
          hint: 'Live count of enrolled students in the database.',
          trend: 'Live',
        },
        {
          label: 'Total Staff',
          value: stats.totalTeachers.toString(),
          hint: 'Active faculty and administrators.',
          trend: 'Live',
        },
        {
          label: 'Attendance Coverage',
          value: '94.6%',
          hint: 'Live daily attendance completion across active departments.',
          trend: '+2.3%',
        },
        {
          label: 'Pending Approvals',
          value: '08',
          hint: 'Requests waiting for approval or final teacher confirmation.',
          trend: 'Stable',
        },
      ],
      // ... rest of hardcoded panels for now
      panels: [
        {
          title: 'Attendance Summary',
          body: 'Morning attendance is open for 14 departments, with only 2 pending staff entries.',
        },
        {
          title: 'Leader Queue',
          body: '3 substitution approvals and 1 late-arrival escalation still need review.',
        },
        {
          title: 'Staff Availability',
          body: 'Most departments are green. Mathematics and Primary Science remain thin for backup coverage.',
        },
        {
          title: 'Timetable Readiness',
          body: 'Weekly schedule draft is stable, with only 3 conflict alerts waiting for next phase tooling.',
        },
      ],
      quickActions: [
        {
          title: 'Create attendance window',
          description: 'Open the daily attendance flow for all departments.',
        },
        {
          title: 'Review substitutions',
          description: 'Approve emergency replacements and reassign periods.',
        },
        {
          title: 'Audit teacher load',
          description: 'Check workload balance before timetable publishing.',
        },
      ],
    };
  }
}
