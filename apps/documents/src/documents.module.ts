import { Logger, Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents.controller';
import { DocumentsService } from './services/documents.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileFolderRepository } from 'libs/repositories/file-folder.repository';
import { HttpExceptionFilter, PrismaService } from 'libs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from 'libs/models/request.entity';
import { LogRepository } from 'libs/repositories/log.repository';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [RequestEntity],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
  ],
  controllers: [DocumentsController],
  providers: [
    LogRepository,
    PrismaService,
    DocumentsService,
    FileFolderRepository,
  ],
})
export class DocumentsModule {}
