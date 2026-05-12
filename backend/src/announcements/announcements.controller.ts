import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import type { CreateAnnouncementDto } from './announcements.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface UserPayload {
  sub: string;
  email: string;
  role: string;
}

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  async create(@CurrentUser() user: UserPayload, @Body() data: CreateAnnouncementDto) {
    return this.announcementsService.create(user.sub, data);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.announcementsService.findAll(Number(skip), Number(take));
  }

  @Get('count')
  async count() {
    return { count: await this.announcementsService.count() };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.announcementsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  async update(@Param('id') id: string, @Body() data: Partial<CreateAnnouncementDto>) {
    return this.announcementsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.announcementsService.delete(id);
  }
}
