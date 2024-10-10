import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { HealthService } from './services/health.service';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ExcelService } from './excel/excel.service';
import { LogService } from './services/log.service';
import { RedisLockService } from './services/redis.service';
import { ApiKeyService } from './common/api-key/api-key.service';


@Module({
  imports: [RedisModule.forRoot({
    config: {
      port: 6379,
      host: "localhost"
    }
  }),
  JwtModule.register({}),
  ConfigModule.forRoot({
    envFilePath: "../.env"
  }),
  MailModule,
  TerminusModule,
  HttpModule.register({
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false,
      cert: "../../project/src/secrets/cert.pem",
      key: "../../project/src/secrets/key.pem"
    }),
  }),
],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService, HealthService, ExcelService, LogService, RedisLockService, ApiKeyService],
})

export class AppModule {}