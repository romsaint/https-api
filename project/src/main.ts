import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { ErrorLogService } from './log/log.service';
import { Logger } from 'nestjs-pino';
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

  const errorLlog = app.get(ErrorLogService)

  app.useGlobalFilters(new AllExceptionsFilter(errorLlog))

  await app.listen(5000, '127.0.0.1');
}

AppClusterService.clusterize(bootstrap)