import { Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
  getTeachers() {
    return {
      summary: {
        total: 128,
        active: 121,
        overloaded: 9,
      },
      departments: [
        { name: 'Mathematics', teachers: 18 },
        { name: 'Science', teachers: 24 },
        { name: 'Languages', teachers: 29 },
        { name: 'Primary', teachers: 33 },
      ],
      teachers: [
        {
          id: 'TCH-001',
          name: 'Sahana Iyer',
          department: 'Mathematics',
          subjects: ['Algebra', 'Statistics'],
          workload: '26/30 periods',
          status: 'Active',
        },
        {
          id: 'TCH-002',
          name: 'Rahul Menon',
          department: 'Science',
          subjects: ['Physics', 'Robotics'],
          workload: '30/30 periods',
          status: 'Overloaded',
        },
        {
          id: 'TCH-003',
          name: 'Nivetha Arun',
          department: 'Languages',
          subjects: ['English', 'Literature'],
          workload: '22/30 periods',
          status: 'Active',
        },
        {
          id: 'TCH-004',
          name: 'Aarthi Prakash',
          department: 'Primary',
          subjects: ['EVS', 'Class Teacher'],
          workload: '24/30 periods',
          status: 'On Leave',
        },
        { id: 'TCH-005', name: 'Vikram Singh', department: 'Mathematics', subjects: ['Calculus', 'Geometry'], workload: '28/30 periods', status: 'Active' },
        { id: 'TCH-006', name: 'Priya Sharma', department: 'Science', subjects: ['Chemistry', 'Biology'], workload: '25/30 periods', status: 'Active' },
        { id: 'TCH-007', name: 'Anil Kumar', department: 'Languages', subjects: ['Hindi', 'Sanskrit'], workload: '20/30 periods', status: 'Active' },
        { id: 'TCH-008', name: 'Deepa Patel', department: 'Primary', subjects: ['Mathematics', 'Science'], workload: '28/30 periods', status: 'Active' },
        { id: 'TCH-009', name: 'Sanjay Gupta', department: 'Mathematics', subjects: ['Algebra'], workload: '22/30 periods', status: 'Active' },
        { id: 'TCH-010', name: 'Ritu Desai', department: 'Science', subjects: ['Physics', 'Environmental Science'], workload: '26/30 periods', status: 'Active' },
        { id: 'TCH-011', name: 'Arun Reddy', department: 'Languages', subjects: ['English', 'French'], workload: '24/30 periods', status: 'Active' },
        { id: 'TCH-012', name: 'Kavita Joshi', department: 'Primary', subjects: ['English', 'EVS'], workload: '25/30 periods', status: 'Active' },
        { id: 'TCH-013', name: 'Manoj Tiwari', department: 'Mathematics', subjects: ['Statistics'], workload: '18/30 periods', status: 'Active' },
        { id: 'TCH-014', name: 'Sunita Rao', department: 'Science', subjects: ['Biology', 'Botany'], workload: '27/30 periods', status: 'Active' },
        { id: 'TCH-015', name: 'Rajesh Khanna', department: 'Languages', subjects: ['Hindi', 'Marathi'], workload: '21/30 periods', status: 'Active' },
        { id: 'TCH-016', name: 'Meena Kumari', department: 'Primary', subjects: ['Mathematics', 'Hindi'], workload: '26/30 periods', status: 'Active' },
        { id: 'TCH-017', name: 'Suresh Raina', department: 'Mathematics', subjects: ['Geometry'], workload: '23/30 periods', status: 'Active' },
        { id: 'TCH-018', name: 'Neha Dhupia', department: 'Science', subjects: ['Chemistry', 'Zoology'], workload: '29/30 periods', status: 'Overloaded' },
        { id: 'TCH-019', name: 'Amitabh Bachchan', department: 'Languages', subjects: ['English', 'Drama'], workload: '20/30 periods', status: 'Active' },
        { id: 'TCH-020', name: 'Kareena Kapoor', department: 'Primary', subjects: ['EVS', 'Art'], workload: '24/30 periods', status: 'Active' },
      ],
    };
  }
}
