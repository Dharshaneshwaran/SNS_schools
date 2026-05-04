import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('UsersController initialized');
  }

  @Get()
  @Roles('admin', 'superadmin')
  findAll() {
    return this.usersService.findAll();
  }

  @Post('teacher')
  @Roles('admin', 'superadmin')
  createTeacher(@Body() body: any) {
    return this.usersService.createTeacher(body);
  }

  @Post('student')
  @Roles('admin', 'superadmin')
  createStudent(@Body() body: any) {
    return this.usersService.createStudent(body);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
