import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import type { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthTokenPayload } from '../auth/auth.types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FOLDERS = [
  'avatars',
  'chat',
  'documents',
  'announcements',
  'gallery',
];
const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.csv',
]);

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

interface UploadedFileLike {
  originalname: string;
  size: number;
  buffer: Buffer;
}

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @UploadedFile() file: UploadedFileLike | undefined,
    @Query('folder') folder = 'documents',
    @Req() request: Request & { user?: AuthTokenPayload },
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      throw new BadRequestException('Invalid upload folder.');
    }

    // Anything written to the public gallery is school-facing content, so
    // it takes the same admin/leader gate as the gallery API itself.
    if (folder === 'gallery') {
      const role = request.user?.role;
      const canPublish = ['admin', 'leader', 'principal', 'coordinator', 'superadmin'].includes(
        role ?? '',
      );
      if (!canPublish) {
        throw new ForbiddenException(
          'Only school leadership may add gallery images.',
        );
      }
    }

    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new BadRequestException('This file type is not allowed.');
    }

    const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
    const dir = join(UPLOADS_ROOT, folder);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), file.buffer);

    return { path: `/files/${folder}/${name}` };
  }
}
