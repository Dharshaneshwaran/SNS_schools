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
            { slot: '08:30 - 09:20', subject: 'Math VIII', teacher: 'Sahana Iyer' },
            { slot: '09:20 - 10:10', subject: 'Physics IX', teacher: 'Rahul Menon' },
            { slot: '10:30 - 11:20', subject: 'English VII', teacher: 'Nivetha Arun' },
            { slot: '11:20 - 12:10', subject: 'EVS V', teacher: 'Aarthi Prakash' },
            { slot: '01:00 - 01:50', subject: 'Calculus XII', teacher: 'Vikram Singh' },
            { slot: '01:50 - 02:40', subject: 'Chemistry X', teacher: 'Priya Sharma' },
            { slot: '02:40 - 03:30', subject: 'Hindi IX', teacher: 'Anil Kumar' },
            { slot: '03:30 - 04:20', subject: 'Bio Lab XI', teacher: 'Sunita Rao' },
          ],
        },
        {
          day: 'Tuesday',
          periods: [
            { slot: '08:30 - 09:20', subject: 'Robotics X', teacher: 'Rahul Menon' },
            { slot: '09:20 - 10:10', subject: 'Math VII', teacher: 'Sahana Iyer' },
            { slot: '10:30 - 11:20', subject: 'Literature VIII', teacher: 'Nivetha Arun' },
            { slot: '11:20 - 12:10', subject: 'Art VI', teacher: 'Kareena Kapoor' },
            { slot: '01:00 - 01:50', subject: 'Physics XI', teacher: 'Ritu Desai' },
            { slot: '01:50 - 02:40', subject: 'Statistics XII', teacher: 'Manoj Tiwari' },
            { slot: '02:40 - 03:30', subject: 'French VIII', teacher: 'Arun Reddy' },
            { slot: '03:30 - 04:20', subject: 'Math IX', teacher: 'Sanjay Gupta' },
          ],
        },
        {
          day: 'Wednesday',
          periods: [
            { slot: '08:30 - 09:20', subject: 'Biology VIII', teacher: 'R. Kavitha' },
            { slot: '09:20 - 10:10', subject: 'English IX', teacher: 'Nivetha Arun' },
            { slot: '10:30 - 11:20', subject: 'Math VII', teacher: 'Sahana Iyer' },
            { slot: '11:20 - 12:10', subject: 'Science V', teacher: 'Deepa Patel' },
            { slot: '01:00 - 01:50', subject: 'History X', teacher: 'Amitabh Bachchan' },
            { slot: '01:50 - 02:40', subject: 'Chemistry XI', teacher: 'Neha Dhupia' },
            { slot: '02:40 - 03:30', subject: 'Algebra VIII', teacher: 'Vikram Singh' },
            { slot: '03:30 - 04:20', subject: 'English X', teacher: 'Arun Reddy' },
          ],
        },
        {
          day: 'Thursday',
          periods: [
            { slot: '08:30 - 09:20', subject: 'Physics Lab IX', teacher: 'Rahul Menon' },
            { slot: '09:20 - 10:10', subject: 'Math XII', teacher: 'Suresh Raina' },
            { slot: '10:30 - 11:20', subject: 'Hindi VII', teacher: 'Rajesh Khanna' },
            { slot: '11:20 - 12:10', subject: 'EVS IV', teacher: 'Kavita Joshi' },
            { slot: '01:00 - 01:50', subject: 'Civics IX', teacher: 'Amitabh Bachchan' },
            { slot: '01:50 - 02:40', subject: 'Geometry VIII', teacher: 'Sahana Iyer' },
            { slot: '02:40 - 03:30', subject: 'Biology XII', teacher: 'Sunita Rao' },
            { slot: '03:30 - 04:20', subject: 'Chemistry X', teacher: 'Priya Sharma' },
          ],
        },
        {
          day: 'Friday',
          periods: [
            { slot: '08:30 - 09:20', subject: 'Math X', teacher: 'Sanjay Gupta' },
            { slot: '09:20 - 10:10', subject: 'Physics XII', teacher: 'Ritu Desai' },
            { slot: '10:30 - 11:20', subject: 'English VIII', teacher: 'Nivetha Arun' },
            { slot: '11:20 - 12:10', subject: 'Art V', teacher: 'Kareena Kapoor' },
            { slot: '01:00 - 01:50', subject: 'Drama XI', teacher: 'Amitabh Bachchan' },
            { slot: '01:50 - 02:40', subject: 'Math IX', teacher: 'Sahana Iyer' },
            { slot: '02:40 - 03:30', subject: 'Lab Science IX', teacher: 'Neha Dhupia' },
            { slot: '03:30 - 04:20', subject: 'Statistics XI', teacher: 'Manoj Tiwari' },
          ],
        },
      ],
    };
  }
}
