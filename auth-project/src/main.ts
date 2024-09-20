import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001
    }
  })

  await app.useGlobalPipes(new ValidationPipe())
  await app.listen()
}
bootstrap();
