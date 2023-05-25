import { Injectable, NotFoundException } from '@nestjs/common';
import { LogRepository } from 'libs/repositories/log.repository';

@Injectable()
export class LogManagerService {
  constructor(private logRepository: LogRepository) {}
  async getRequests() {
    const data = await this.logRepository.getRequests();

    if (!data) {
      throw new NotFoundException('nothing found');
    }

    return {
      code: 200,
      status: 'success',
      message: '',
      data: data,
    };
  }
}
