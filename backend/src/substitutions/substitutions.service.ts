import { Injectable } from '@nestjs/common';

@Injectable()
export class SubstitutionsService {
  getSubstitutions() {
    return {
      summary: {
        pendingApproval: 3,
        emergencyReplacements: 2,
        autoAssigned: 5,
      },
      requests: [
        {
          className: 'Grade 7 Science',
          absentTeacher: 'R. Kavitha',
          suggestedTeacher: 'Rahul Menon',
          mode: 'Auto',
          status: 'Leader Review',
        },
        {
          className: 'Grade 8 Mathematics',
          absentTeacher: 'Aarthi Prakash',
          suggestedTeacher: 'Sahana Iyer',
          mode: 'Manual',
          status: 'Approved',
        },
        {
          className: 'Grade 6 English',
          absentTeacher: 'Shobana Devi',
          suggestedTeacher: 'Nivetha Arun',
          mode: 'Emergency',
          status: 'Pending',
        },
      ],
    };
  }
}
