import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthUser } from '../auth/auth.types';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = process.env.DEMO_USER_EMAIL ?? 'admin@sns-erp.local';
    const existing = await this.prisma.user.findUnique({
      where: { email: adminEmail.toLowerCase() },
    });

    if (!existing) {
      await this.prisma.user.create({
        data: {
          email: adminEmail.toLowerCase(),
          password: process.env.DEMO_USER_PASSWORD ?? 'ChangeMe123!',
          name: process.env.DEMO_USER_NAME ?? 'SNS ERP Admin',
          role: 'admin',
          department: 'Administration',
          status: 'active',
        },
      });
    }
  }

  async getSystemStats() {
    const [totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      this.prisma.user.count({ where: { role: 'parent' } }),
      this.prisma.user.count({ where: { role: 'teacher' } }),
      this.prisma.user.count({ where: { role: 'admin' } }),
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalUsers: totalStudents + totalTeachers + totalAdmins,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(this.mapUser);
  }

  async findByIdentifier(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier.toLowerCase(), mode: 'insensitive' } },
          { phone: { equals: identifier } },
          { studentProfile: { studentId: { equals: identifier, mode: 'insensitive' } } },
          { studentProfile: { admissionNo: { equals: identifier, mode: 'insensitive' } } },
          { studentProfile: { phone: { equals: identifier } } },
          { studentProfile: { fatherContact: { equals: identifier } } },
          { studentProfile: { motherContact: { equals: identifier } } },
          { teacherProfile: { employeeId: { equals: identifier, mode: 'insensitive' } } },
          { teacherProfile: { phone: { equals: identifier } } },
        ],
      },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });
    return user ? this.mapUser(user) : null;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user ? this.mapUser(user) : null;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapUser(user) : null;
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { password: newPassword },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateProfile(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email.toLowerCase() }),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      // Delete associated records first to avoid foreign key constraints
      await this.prisma.teacherProfile.deleteMany({ where: { userId: id } });
      await this.prisma.studentProfile.deleteMany({ where: { userId: id } });
      await this.prisma.groupMember.deleteMany({ where: { userId: id } });
      
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }

  private generatePassword(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private async generateId(prefix: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.user.count({
      where: { role: prefix === 'TCH' ? 'teacher' : 'parent' }
    });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `${prefix}-${year}-${sequence}`;
  }

  async createTeacher(data: {
    name: string;
    email: string;
    department: string;
    designation: string;
    specialization: string;
    employeeId?: string;
    password?: string;
  }) {
    const autoId = data.employeeId || await this.generateId('TCH');
    const autoPassword = data.password || this.generatePassword();

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: autoPassword,
        role: 'teacher',
        department: data.department,
        status: 'active',
        teacherProfile: {
          create: {
            employeeId: autoId,
            designation: data.designation,
            specialization: data.specialization,
            phone: data.phone,
          },
        },
      },
    });
  }

  async createStudent(data: any) {
    console.log('Creating Student with data:', { ...data, password: data.password ? '***' : 'empty' });
    const autoId = data.studentId || await this.generateId('STD');
    const autoPassword = data.password || this.generatePassword();
    console.log('Final Student Credentials:', { id: autoId, password: autoPassword });

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: autoPassword,
        role: 'parent',
        department: data.department,
        status: 'active',
        studentProfile: {
          create: {
            studentId: autoId,
            class: data.class,
            section: data.section,
            phone: data.phone || data.fatherContact || data.motherContact,
            admissionNo: data.admissionNo || data.studentId || `ADM-${Date.now()}`,
            applicationNo: data.applicationNo || `APP-${Date.now()}`,
            gender: data.gender,
            dob: data.dob,
            birthCertNo: data.birthCertNo,
            nationality: data.nationality,
            religion: data.religion,
            community: data.community,
            bloodGroup: data.bloodGroup,
            presentSchool: data.presentSchool,
            previousGrade: data.previousGrade,
            boardOfEducation: data.boardOfEducation,
            motherTongue: data.motherTongue,
            fatherName: data.fatherName,
            fatherContact: data.fatherContact,
            fatherEmail: data.fatherEmail,
            fatherEducation: data.fatherEducation,
            fatherOccupation: data.fatherOccupation,
            fatherOrganization: data.fatherOrganization,
            fatherDesignation: data.fatherDesignation,
            fatherOfficeAddress: data.fatherOfficeAddress,
            motherName: data.motherName,
            motherContact: data.motherContact,
            motherEmail: data.motherEmail,
            motherEducation: data.motherEducation,
            motherOccupation: data.motherOccupation,
            motherOrganization: data.motherOrganization,
            motherDesignation: data.motherDesignation,
            motherOfficeAddress: data.motherOfficeAddress,
          },
        },
      },
    });
  }

  private mapUser(user: any): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role.toLowerCase() as any,
      department: user.department,
      status: user.status.toLowerCase() as any,
      studentProfile: user.studentProfile,
      teacherProfile: user.teacherProfile,
    };
  }
}

