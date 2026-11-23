import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { ExcelService } from './excel.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const MAX_IMPORT_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Excel import/export (section 20 - "Existing formats").
 *
 * Exports stream a real .xlsx straight to the browser; the import accepts
 * the school's own spreadsheet as long as it has a "Name" column, matching
 * every other header case-insensitively and tolerating renamed columns.
 */
@Controller('excel')
export class ExcelController {
  constructor(private readonly excel: ExcelService) {}

  private send(res: Response, file: { buffer: Buffer; fileName: string; contentType: string }) {
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
      'Cache-Control': 'no-store',
    });
    res.send(file.buffer);
  }

  @Get('students')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  async exportStudents(
    @Res() res: Response,
    @Query('class') cls?: string,
    @Query('section') section?: string,
  ) {
    this.send(res, await this.excel.exportStudents(cls, section));
  }

  @Get('marks')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  async exportMarks(
    @Res() res: Response,
    @Query('class') cls: string,
    @Query('section') section: string,
    @Query('term') term: string,
  ) {
    this.send(res, await this.excel.exportMarks(cls, section, term));
  }

  @Get('timetable')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  async exportTimetable(@Res() res: Response, @Query('class') classLabel?: string) {
    this.send(res, await this.excel.exportTimetable(classLabel));
  }

  @Get('template/students')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  async studentTemplate(@Res() res: Response) {
    this.send(res, await this.excel.studentTemplate());
  }

  /**
   * Bulk pupil import. `?dryRun=1` validates and returns the rows it would
   * create without writing - always the safe first call.
   */
  @Post('students/import')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMPORT_SIZE },
    }),
  )
  importStudents(
    @UploadedFile() file: { originalname: string; buffer: Buffer } | undefined,
    @Query('dryRun') dryRun?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }
    if (!/\.xlsx$/i.test(file.originalname ?? '')) {
      throw new BadRequestException('Please upload an .xlsx workbook.');
    }
    return this.excel.importStudents(file.buffer, {
      dryRun: dryRun === '1' || dryRun === 'true',
    });
  }
}
