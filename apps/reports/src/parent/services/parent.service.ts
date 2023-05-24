import { PrismaService } from 'libs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { exportToExcel } from 'libs';

import {
  listQueryHandler,
  listQueryHandlerNested,
} from 'libs/models/queryHandlerForList.interface';
@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}
}
