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
      classWiseAttendance: [
        { class: '10-A', total: 40, present: 38, absent: 2, percentage: '95%' },
        { class: '10-B', total: 38, present: 35, absent: 3, percentage: '92%' },
        { class: '9-A', total: 42, present: 42, absent: 0, percentage: '100%' },
        { class: '9-B', total: 40, present: 37, absent: 3, percentage: '92.5%' },
        { class: '8-A', total: 35, present: 33, absent: 2, percentage: '94.2%' },
      ],
      studentsAttendance: {
        '10-A': [
          { rollNo: '101', name: 'Arjun Kumar', status: 'Present', photo: 'https://i.pravatar.cc/150?u=101' },
          { rollNo: '102', name: 'Bhavya Sri', status: 'Present', photo: 'https://i.pravatar.cc/150?u=102' },
          { rollNo: '103', name: 'Charan Raj', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=103' },
          { rollNo: '104', name: 'Divya S', status: 'Present', photo: 'https://i.pravatar.cc/150?u=104' },
          { rollNo: '105', name: 'Eshwar Rao', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=105' },
        ],
        '10-B': [
          { rollNo: '201', name: 'Farhan Khan', status: 'Present', photo: 'https://i.pravatar.cc/150?u=201' },
          { rollNo: '202', name: 'Gita Rani', status: 'Present', photo: 'https://i.pravatar.cc/150?u=202' },
          { rollNo: '203', name: 'Hari Prasad', status: 'Present', photo: 'https://i.pravatar.cc/150?u=203' },
        ],
        '9-A': [
          { rollNo: '301', name: 'Isha Reddy', status: 'Present', photo: 'https://i.pravatar.cc/150?u=301' },
          { rollNo: '302', name: 'Jayesh Nair', status: 'Present', photo: 'https://i.pravatar.cc/150?u=302' },
          { rollNo: '303', name: 'Kavya Mohan', status: 'Present', photo: 'https://i.pravatar.cc/150?u=303' },
          { rollNo: '304', name: 'Lakshmi P', status: 'Present', photo: 'https://i.pravatar.cc/150?u=304' },
        ],
        '9-B': [
          { rollNo: '401', name: 'Manish Verma', status: 'Present', photo: 'https://i.pravatar.cc/150?u=401' },
          { rollNo: '402', name: 'Neha Sharma', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=402' },
          { rollNo: '403', name: 'Om Prakash', status: 'Present', photo: 'https://i.pravatar.cc/150?u=403' },
          { rollNo: '404', name: 'Preethi R', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=404' },
          { rollNo: '405', name: 'Ravi Shankar', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=405' },
        ],
        '8-A': [
          { rollNo: '501', name: 'Sanjana V', status: 'Present', photo: 'https://i.pravatar.cc/150?u=501' },
          { rollNo: '502', name: 'Tarun Kumar', status: 'Present', photo: 'https://i.pravatar.cc/150?u=502' },
          { rollNo: '503', name: 'Uma Devi', status: 'Absent', photo: 'https://i.pravatar.cc/150?u=503' },
          { rollNo: '504', name: 'Varun J', status: 'Present', photo: 'https://i.pravatar.cc/150?u=504' },
        ],
      }

    };
  }
}
