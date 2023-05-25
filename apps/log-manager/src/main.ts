import { NestFactory } from '@nestjs/core';
import { LogManagerModule } from './log-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(LogManagerModule);
  await app.listen(3000);
}
bootstrap();
