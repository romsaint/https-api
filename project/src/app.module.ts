import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { LogModule } from './log/log.module';
import { ErrorLogService } from './log/log.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOpt } from './common/constants/multer.constants';
import { LoggerModule } from 'nestjs-pino';
import { AppClusterService } from './cluster/cluster.service';
import {BullModule} from '@nestjs/bull'
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [
    ClientsModule.register({
    clients: [
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3001
        }
      },

      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3002
        }
      },
    ]
  }), 
  ConfigModule.forRoot({
    isGlobal: true
  }),
  MulterModule.register(multerOpt),
  ScheduleModule.forRoot(),
  LoggerModule.forRoot({pinoHttp: {
    level: 'error',
  }}),
  LogModule,
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379
    }
  }),
  GoogleAuthModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, ErrorLogService, AppClusterService],
})

export class AppModule { }