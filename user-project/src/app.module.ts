import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule.forRoot({
    config: {
      port: 6379,
      host: 'localhost'
    }
  })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
