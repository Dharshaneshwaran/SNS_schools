import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  getAttendance() {
    return {
      summary: {
        present: 121,
        onLeave: 5,
        lateArrivals: 3,
      },
      leaveRequests: [
        {
          teacher: 'Aarthi Prakash',
          type: 'Medical Leave',
          duration: '2 days',
          status: 'Approved',
        },
        {
          teacher: 'R. Kavitha',
          type: 'Half Day',
          duration: 'Today',
          status: 'Pending',
        },
      ],
      lateArrivals: [
        {
          teacher: 'Rahul Menon',
          expected: '08:20 AM',
          actual: '08:34 AM',
        },
        {
          teacher: 'S. Janani',
          expected: '08:20 AM',
          actual: '08:29 AM',
        },
      ],
    };
  }
}
