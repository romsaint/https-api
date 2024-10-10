import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './services/user.service';
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
  providers: [UserService, PrismaService],
})
export class AppModule {}
