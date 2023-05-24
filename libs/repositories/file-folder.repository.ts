import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/database/prisma.service';
import { CreateFolderDto } from 'libs';

@Injectable()
export class FileFolderRepository {
  constructor(private prisma: PrismaService) {}

  async createFolder(data: CreateFolderDto) {
    return await this.prisma.filesystem.create({ data: data });
  }

  async getAllFilesAndFolder(path: string) {
    return await this.prisma.filesystem.findMany({
      where: { path: path },
      orderBy: { type: 'desc' },
    });
  }
}
