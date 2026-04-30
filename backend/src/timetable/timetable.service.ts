import { Injectable } from '@nestjs/common';

@Injectable()
export class TimetableService {
  getTimetable() {
    return {
      weekLabel: 'Academic Week 18',
      conflicts: [
        'Grade 8 Mathematics overlaps with a planned science lab on Thursday period 4.',
        'Leader approval required for Friday afternoon split section reassignment.',
      ],
      schedule: [
        {
          day: 'Monday',
          periods: [
            { slot: 'P1', subject: 'Math VIII', teacher: 'Sahana Iyer' },
            { slot: 'P2', subject: 'Physics IX', teacher: 'Rahul Menon' },
            { slot: 'P3', subject: 'English VII', teacher: 'Nivetha Arun' },
          ],
        },
        {
          day: 'Tuesday',
          periods: [
            { slot: 'P1', subject: 'Chemistry X', teacher: 'Deepak Raj' },
            { slot: 'P2', subject: 'Math IX', teacher: 'Sahana Iyer' },
            { slot: 'P3', subject: 'Primary EVS', teacher: 'Aarthi Prakash' },
          ],
        },
        {
          day: 'Wednesday',
          periods: [
            { slot: 'P1', subject: 'Biology VIII', teacher: 'R. Kavitha' },
            { slot: 'P2', subject: 'English IX', teacher: 'Nivetha Arun' },
            { slot: 'P3', subject: 'Math VII', teacher: 'Sahana Iyer' },
          ],
        },
      ],
    };
  }
}
