import { config } from 'dotenv'
config()
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOpt } from './common/constants/multer.constants';
import { jwtOpt } from './common/constants/jwt.constants';
import {RedisModule} from '@liaoliaots/nestjs-redis';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { AppService } from './services/app.service';

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
  providers: [AuthService, EmailService, PrismaService, MailService, ConfigService, AppService],
})
export class AuthModule { }