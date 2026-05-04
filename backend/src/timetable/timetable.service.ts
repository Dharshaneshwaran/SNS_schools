import { Injectable } from '@nestjs/common';

@Injectable()
export class TimetableService {
  getTimetable() {
    const periodTimes = [
      '08:30 AM', '09:20 AM', '10:30 AM', '11:20 AM', 
      '12:10 PM', '01:00 PM', '01:50 PM', '02:40 PM'
    ];
    
    const subjects = ['Math', 'Physics', 'English', 'EVS', 'Chemistry', 'Biology', 'History', 'Art'];
    const teachers = ['Sahana Iyer', 'Rahul Menon', 'Nivetha Arun', 'Aarthi Prakash', 'Priya Sharma', 'Sunita Rao', 'Amitabh Bachchan', 'Kareena Kapoor'];

    const generatePeriods = (day: string) => {
      return periodTimes.map((time, index) => ({
        time,
        subject: subjects[(index + day.length) % subjects.length],
        teacher: teachers[(index + day.length) % teachers.length],
        grade: '10-A', // Default for demonstration, frontend will filter/use this
        room: `Room ${100 + index + 1}`
      }));
    };

    return {
      weekLabel: 'Academic Week 18',
      conflicts: [
        'Grade 8 Mathematics overlaps with a planned science lab on Thursday period 4.',
      ],
      schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => ({
        day,
        periods: generatePeriods(day)
      })),
    };
  }
}
