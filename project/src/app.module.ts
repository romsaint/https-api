import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AppService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { LogModule } from './log/log.module';
import { LogService } from './log/log.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOpt } from './common/constants/multer.constants';
import { LoggerModule } from 'nestjs-pino';
import { AppClusterService } from './cluster/cluster.service';
import { BullModule } from '@nestjs/bull'
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './controllers/user.controller';
import { UtilityController } from './controllers/utility.controller';
import { HealthCotroller } from './controllers/health.controller';
import { AuthService } from './services/auth.service';
import { UtilityService } from './services/utility.service';
import { UsersService } from './services/users.service';
import { ApiKeyService } from './api-key/api-key.service';
import { ApiKeyAuthStrategy } from './api-key/api-key.strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationHandler } from './commands/auth/registration/registration.handler';
import { AllUsersHandler } from './queries/user/allUsers/allUser.query';
import { GenerateUserHandler } from './commands/user/generateUser/generateUser.handler';
import { LoginHandler } from './commands/auth/login/login.handler';
import { HeathHandler } from './queries/health/healt.handler';
import { CronHealthHandler } from './commands/health/cronHealth.handler';
import { VerifyEmailHandler } from './commands/auth/verifyEmail/verifyEmail.handler';
import { SendEmailHandler } from './commands/utility/sendEmail/sendEmail.handler';
import { CronSendEmailHandler } from './commands/utility/cronEmail/cronSendEmail.handler';

@Module({
  imports: [
    CqrsModule, 
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
        {
          name: "UTILITY_SERVICE",
          transport: Transport.TCP,
          options: {
            port: 3003
          }
        }
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MulterModule.register(multerOpt),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'error',
      }
    }),
    LogModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    GoogleAuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/build'),
      // exclude: ['/api*']
    }),

    TerminusModule,
    HttpModule.register({
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false,
      }),
    }),
    PassportModule
  ],
  controllers: [AuthController, UserController, UtilityController, HealthCotroller],
  providers: [
    AppService, 
    JwtService, 
    LogService, 
    AppClusterService, 
    AuthService, 
    UtilityService, 
    UsersService, 
    ApiKeyService,
    ApiKeyAuthStrategy,
    RegistrationHandler,
    AllUsersHandler,
    GenerateUserHandler,
    LoginHandler,
    HeathHandler,
    CronHealthHandler,
    VerifyEmailHandler,
    SendEmailHandler,
    CronSendEmailHandler
  ],
})

export class AppModule { }