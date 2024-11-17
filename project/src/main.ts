import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogService } from './log/log.service';
import { AllExceptionsFilter } from './common/filters/error.filter';
import * as fs from 'fs'
import { AppClusterService } from './cluster/cluster.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap(): Promise<void> {
  const httpsOptions = {
    key: fs.readFileSync('./src/secrets/key.pem'),
    cert: fs.readFileSync('./src/secrets/cert.pem')
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true, httpsOptions });

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  const logger = app.get(LogService)

  //app.useLogger(['error', 'debug'])

  app.useGlobalFilters(new AllExceptionsFilter(logger))

  const config = new DocumentBuilder()
    .setTitle('HTTPS api by wi3')
    .setDescription('Description of my api >')
    .setVersion('2.1.1')
    .setBasePath('/')
    .setContact('Rouse Bezotti', '', 'roma.ggg.20@list.ru')
    .addBearerAuth()
    .addOAuth2()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(5000);
}

AppClusterService.clusterize(bootstrap)