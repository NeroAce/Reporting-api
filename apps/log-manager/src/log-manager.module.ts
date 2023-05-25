import { Module } from '@nestjs/common';
import { LogManagerController } from './controllers/log-manager.controller';
import { LogManagerService } from './controllers/services/log-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from 'libs/models/request.entity';
import { LogRepository } from 'libs/repositories/log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [RequestEntity],
      synchronize: true,
    }),
  ],
  controllers: [LogManagerController],
  providers: [LogRepository, LogManagerService],
})
export class LogManagerModule {}
