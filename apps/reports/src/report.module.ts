import { Module } from '@nestjs/common';
import { ParentModule } from './parent/parent.module';

import { StudentModule } from './student/student.module';

@Module({
  imports: [ParentModule, StudentModule],
})
export class ReportModule {}
