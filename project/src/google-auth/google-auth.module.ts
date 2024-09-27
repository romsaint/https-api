import { Module } from '@nestjs/common';
import { GoogleServiceStrategy } from './google-auth.service';
import { AppService } from 'src/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  ConfigModule.forRoot()
]
  ,
  providers: [GoogleServiceStrategy, AppService, ConfigService]
})
export class GoogleAuthModule {}
