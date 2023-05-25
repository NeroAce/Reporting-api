import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from 'libs/models/request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(RequestEntity)
    private logRepository: Repository<RequestEntity>,
  ) {}

  async getRequests(): Promise<RequestEntity[]> {
    return await this.logRepository.find();
  }

  async createRequestLog(data) {
    const logs = await this.logRepository.create(data);
    return await this.logRepository.save(logs);
  }

  async createErrorLog(data) {
    const logs = await this.logRepository.create(data);
    return await this.logRepository.save(logs);
  }

  async remove(id: number): Promise<void> {
    await this.logRepository.delete(id);
  }
}
