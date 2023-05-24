import { Module } from '@nestjs/common';
import { ParentService } from './services/parent.service';
import { ParentController } from './controllers/parent.controller';
import { PrismaService } from 'libs/database/prisma.service';
import { JWTModule } from 'libs/guards/jwt.module';
import { UserRepository } from 'libs';

@Module({
  imports: [JWTModule],
  controllers: [ParentController],
  providers: [ParentService, PrismaService, UserRepository],
})
export class ParentModule {}
