import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getOverview() {
    return {
      stats: [
        {
          label: 'Attendance Coverage',
          value: '94.6%',
          hint: 'Live daily attendance completion across active departments.',
          trend: '+2.3%',
        },
        {
          label: 'Pending Substitutions',
          value: '08',
          hint: 'Requests waiting for approval or final teacher confirmation.',
          trend: 'Stable',
        },
        {
          label: 'Staff Available',
          value: '126',
          hint: 'Teachers currently marked active and available for scheduling.',
          trend: '+6',
        },
        {
          label: 'Conflict Alerts',
          value: '03',
          hint: 'Timetable or leave overlaps requiring admin review.',
          trend: 'Watch',
        },
      ],
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
