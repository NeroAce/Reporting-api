import { Test, TestingModule } from '@nestjs/testing';
import { LogManagerController } from './controllers/log-manager.controller';
import { LogManagerService } from './controllers/services/log-manager.service';

describe('LogManagerController', () => {
  let logManagerController: LogManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LogManagerController],
      providers: [LogManagerService],
    }).compile();

    logManagerController = app.get<LogManagerController>(LogManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(logManagerController.getHello()).toBe('Hello World!');
    });
  });
});
