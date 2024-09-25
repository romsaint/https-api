import { config } from 'dotenv'
config()
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOpt } from './common/constants/multer.constants';
import { jwtOpt } from './common/constants/jwt.constants';
import {RedisModule} from '@liaoliaots/nestjs-redis';
import { RedisLockService } from './redis.service';

@Module({
  imports: [
    JwtModule.register(jwtOpt),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService, RedisLockService],
})
export class AuthModule { }
