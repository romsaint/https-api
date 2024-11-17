import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './services/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule.forRoot({
    config: {
      host: process.env.ENVIRONMENT == 'dev' ? 'localhost' : process.env.REDIS_HOST,
      port: process.env.ENVIRONMENT == 'dev' ? 6379 : parseInt(process.env.REDIS_PORT)
    }
  })],
  controllers: [AppController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
