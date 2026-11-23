import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  GalleryService,
  CreateImageDto,
} from './gallery.service';
import type { UpdateImageDto } from './gallery.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/** School image gallery (section 17). Anyone signed in may browse. */
@Controller('gallery')
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @Get()
  list() {
    return this.gallery.list();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  create(@Body() data: CreateImageDto) {
    return this.gallery.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  update(@Param('id') id: string, @Body() data: UpdateImageDto) {
    return this.gallery.update(id, data);
  }

  @Post('reorder')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  reorder(@Body('ids') ids: string[]) {
    return this.gallery.reorder(ids);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  remove(@Param('id') id: string) {
    return this.gallery.remove(id);
  }
}
