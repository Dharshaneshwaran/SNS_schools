import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export class CreateImageDto {
  url: string;
  caption?: string;
  sortOrder?: number;
}

export type UpdateImageDto = Partial<CreateImageDto>;

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.schoolImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  private assertUrl(url: string | undefined) {
    if (!url || !url.trim()) {
      throw new BadRequestException('Image url is required.');
    }
    // Only accept paths this app actually serves - never an arbitrary
    // external URL, which would let an admin embed trackable content.
    if (!url.startsWith('/files/')) {
      throw new BadRequestException(
        'url must be an uploaded path beginning with /files/.',
      );
    }
    return url.trim();
  }

  async create(data: CreateImageDto) {
    const url = this.assertUrl(data.url);
    const existing = await this.prisma.schoolImage.findFirst({ where: { url } });
    if (existing) throw new BadRequestException('That image is already in the gallery.');

    return this.prisma.schoolImage.create({
      data: {
        url,
        caption: data.caption?.trim() ?? '',
        sortOrder: data.sortOrder ?? (await this.prisma.schoolImage.count()),
      },
    });
  }

  async update(id: string, data: UpdateImageDto) {
    const existing = await this.prisma.schoolImage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Image not found.');

    return this.prisma.schoolImage.update({
      where: { id },
      data: {
        ...(data.url !== undefined && { url: this.assertUrl(data.url) }),
        ...(data.caption !== undefined && { caption: data.caption.trim() }),
        ...(data.sortOrder !== undefined && { sortOrder: Number(data.sortOrder) }),
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.schoolImage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Image not found.');
    // Only the database row is removed; the file on disk is left alone so
    // an image referenced by an announcement cannot disappear from it.
    return this.prisma.schoolImage.delete({ where: { id } });
  }

  /** Persist a full drag-reorder in one call. */
  async reorder(ids: string[]) {
    if (!Array.isArray(ids)) {
      throw new BadRequestException('ids must be an array.');
    }
    const rows = await this.prisma.schoolImage.findMany({
      where: { id: { in: ids } },
    });
    if (rows.length !== ids.length) {
      throw new NotFoundException('One or more images no longer exist.');
    }

    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.schoolImage.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
    return this.list();
  }
}
