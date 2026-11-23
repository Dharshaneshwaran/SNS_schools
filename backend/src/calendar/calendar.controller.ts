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
  CalendarService,
  CreateEventDto,
} from './calendar.service';
import type { UpdateEventDto } from './calendar.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/**
 * Academic calendar (section 12). Reads are open to every signed-in user
 * so dashboards can show what is coming up; writes are admin/leader.
 */
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @Get()
  list(@Query('month') month?: string, @Query('type') type?: string) {
    return this.calendar.list(month, type);
  }

  @Get('upcoming')
  upcoming(@Query('limit') limit?: string) {
    return this.calendar.upcoming(limit ? Number(limit) : 5);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  create(@Body() data: CreateEventDto) {
    return this.calendar.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  update(@Param('id') id: string, @Body() data: UpdateEventDto) {
    return this.calendar.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  remove(@Param('id') id: string) {
    return this.calendar.remove(id);
  }
}
