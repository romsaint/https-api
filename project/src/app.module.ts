import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
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
          transport: Transport.RMQ,
          
          options: {
            noAck: true,
            queue: "auth-queue",
            urls: [`amqp://${process.env.ENVIRONMENT == 'dev' ? 'localhost' : process.env.RABBITMQ_HOST}:5672`],

          }
        },

        {
          name: "USER_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${process.env.ENVIRONMENT == 'dev' ? 'localhost' : process.env.RABBITMQ_HOST}:5672`],
            noAck: true,
            queue: "users-queue"
          }
        },
        {
          name: "UTILITY_SERVICE",
          transport: Transport.RMQ,
          options: {
            noAck: true,
            queue: "utility-queue",
            urls: [`amqp://${process.env.ENVIRONMENT == 'dev' ? 'localhost' : process.env.RABBITMQ_HOST}:5672`]
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
        host: process.env.ENVIRONMENT == 'dev' ? 'localhost' : process.env.REDIS_HOST,
        port: process.env.ENVIRONMENT == 'dev' ? 6379 : parseInt(process.env.REDIS_PORT)
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