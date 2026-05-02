import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import type { AppRole } from '../common/constants/roles';

@Injectable()
export class UsersService {
  private readonly users: AuthUser[] = this.buildSeedUsers();
  
  findAll() {
    return this.users;
  }

  findByEmail(email: string) {
    return (
      this.users.find((user) => user.email === email.toLowerCase()) ?? null
    );
  }

  findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  updatePassword(id: string, newPassword: string): boolean {
    const user = this.findById(id);
    if (!user) return false;
    user.password = newPassword;
    return true;
  }

  updateProfile(
    id: string,
    data: { name?: string; email?: string },
  ): boolean {
    const user = this.findById(id);
    if (!user) return false;
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email.toLowerCase();
    return true;
  }

  private buildSeedUsers(): AuthUser[] {
    const sharedPassword = process.env.DEMO_USER_PASSWORD ?? 'ChangeMe123!';

    return [
      this.createSeedUser(
        'superadmin-1',
        'Superadmin',
        'superadmin@sns-erp.local',
        'superadmin',
        'Central Operations',
        sharedPassword,
      ),
      this.createSeedUser(
        'admin-1',
        'School Admin',
        'admin@sns-erp.local',
        'admin',
        'Administration',
        sharedPassword,
      ),
      this.createSeedUser(
        'leader-1',
        'Assigned Leader',
        'leader@sns-erp.local',
        'leader',
        'Academic Leadership',
        sharedPassword,
      ),
      this.createSeedUser(
        'teacher-1',
        'Teacher User',
        'teacher@sns-erp.local',
        'teacher',
        'Mathematics',
        sharedPassword,
      ),
      this.createSeedUser(
        'parent-1',
        'Sharma Parent',
        '1234567890',
        'parent',
        'Parent Portal',
        sharedPassword,
      ),
      // Mock Students (Parent role for login, but represented as students in UI)
      ...Array.from({ length: 10 }).map((_, i) => 
        this.createSeedUser(
          `student-${i + 1}`,
          `Student ${String.fromCharCode(65 + i)}`,
          `student${i + 1}@sns.edu`,
          'parent',
          'Academic',
          sharedPassword,
        )
      ),
      // Mock Teachers (Additional accounts for the teachers already in TeachersService)
      ...Array.from({ length: 10 }).map((_, i) => 
        this.createSeedUser(
          `teacher-mock-${i + 1}`,
          `Teacher ${i + 1}`,
          `teacher${i + 1}@sns.edu`,
          'teacher',
          'Education',
          sharedPassword,
        )
      ),
    ];
  }

  private createSeedUser(
    id: string,
    name: string,
    email: string,
    role: AppRole,
    department: string,
    password: string,
  ): AuthUser {
    return {
      id,
      name,
      email: email.toLowerCase(),
      password,
      role,
      department,
      status: role === 'teacher' ? 'away' : 'active',
    };
  }
}
