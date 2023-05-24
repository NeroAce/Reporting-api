import { PrismaService } from 'libs';
import { Injectable } from '@nestjs/common';
import { exportToExcel } from 'libs';
import { listQueryHandler, listQueryHandlerNested } from 'libs';
@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
}
