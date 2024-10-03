import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { HealthService } from './services/health.service';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { HealthCheckService, HttpHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { HttpModule } from '@nestjs/axios';
import { Agent } from 'http';

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
  providers: [AppService, PrismaService, MailService, HealthService],
})
export class AppModule {}
