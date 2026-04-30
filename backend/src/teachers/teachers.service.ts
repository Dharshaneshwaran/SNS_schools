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
      ],
    };
  }
}
