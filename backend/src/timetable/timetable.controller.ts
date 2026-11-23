import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  TimetableService,
  CreateEntryDto,
} from './timetable.service';
import type { UpdateEntryDto } from './timetable.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  getTimetable(@Query('class') classLabel?: string) {
    return this.timetableService.getTimetable(classLabel);
  }

  @Get('student')
  getStudentTimetable(
    @Query('class') cls: string,
    @Query('section') section: string,
  ) {
    return this.timetableService.getStudentTimetable(cls, section);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  createEntry(@Body() data: CreateEntryDto) {
    return this.timetableService.createEntry(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  updateEntry(@Param('id') id: string, @Body() data: UpdateEntryDto) {
    return this.timetableService.updateEntry(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  deleteEntry(@Param('id') id: string) {
    return this.timetableService.deleteEntry(id);
  }
}
