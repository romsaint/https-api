import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogService } from './log/log.service';
import { AllExceptionsFilter } from './common/filters/error.filter';
import * as fs from 'fs'
import { AppClusterService } from './cluster/cluster.service';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/secrets/key.pem'),
    cert: fs.readFileSync('./src/secrets/cert.pem')
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true, httpsOptions });

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  const logger = app.get(LogService)

  // app.useLogger(['error', 'debug'])

  app.useGlobalFilters(new AllExceptionsFilter(logger))

  await app.listen(5000, '127.0.0.1');
}

AppClusterService.clusterize(bootstrap)