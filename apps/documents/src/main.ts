import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';

import * as fs from 'fs';
import * as morgan from 'morgan';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'libs';
import { ValidationPipe } from '@nestjs/common';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});

//Swagger
const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};

const configSwager = new DocumentBuilder()
  .setTitle('API')
  .setDescription('Normal API')
  .setVersion('1.0')
  .addTag('Parents')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(DocumentsModule);

  const document = SwaggerModule.createDocument(app, configSwager, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: '*' });
  app.use(morgan('dev', { stream: logStream }));

  await app.listen(3001);
}
bootstrap();
