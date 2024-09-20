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



@Module({
  imports: [
    JwtModule.register(jwtOpt),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService],
})
export class AuthModule { }
