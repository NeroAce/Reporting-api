import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { PrismaService } from 'libs/database/prisma.service';
import { JWTModule } from 'libs/guards/jwt.module';
import { UserRepository } from 'libs';

@Module({
  imports: [JWTModule],
  controllers: [StudentController],
  providers: [StudentService, PrismaService, UserRepository],
})
export class StudentModule {}
