import { Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents.controller';
import { DocumentsService } from './services/documents.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from 'libs';
import { FileFolderRepository } from 'libs/repositories/file-folder.repository';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
  ],
  controllers: [DocumentsController],
  providers: [PrismaService, DocumentsService, FileFolderRepository],
})
export class DocumentsModule {}
