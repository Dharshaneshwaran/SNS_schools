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

  async createTeacher(data: {
    name: string;
    email: string;
    department: string;
    employeeId: string;
    designation: string;
    specialization: string;
    password?: string;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password || process.env.DEMO_USER_PASSWORD || 'ChangeMe123!',
        role: 'teacher',
        department: data.department,
        status: 'active',
        teacherProfile: {
          create: {
            employeeId: data.employeeId,
            designation: data.designation,
            specialization: data.specialization,
          },
        },
      },
    });
  }

  async createStudent(data: any) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password || process.env.DEMO_USER_PASSWORD || 'ChangeMe123!',
        role: 'parent',
        department: data.department,
        status: 'active',
        studentProfile: {
          create: {
            studentId: data.studentId,
            class: data.class,
            section: data.section,
            admissionNo: data.admissionNo,
            applicationNo: data.applicationNo,
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

