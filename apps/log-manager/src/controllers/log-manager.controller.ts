import { Controller, Get } from '@nestjs/common';
import { LogManagerService } from './services/log-manager.service';

@Controller('log')
export class LogManagerController {
  constructor(private readonly logManagerService: LogManagerService) {}

  @Get()
  async getHello() {
    return await this.logManagerService.getRequests();
  }
}
