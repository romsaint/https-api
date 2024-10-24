import { Module } from '@nestjs/common';
import { GoogleServiceStrategy } from './google-auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/users.service';
import { UtilityService } from 'src/services/utility.service';

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
        {
          name: "UTILITY_SERVICE",
          transport: Transport.TCP,
          options: {
            port: 3003
          }
        }
      ]
    }),
    ConfigModule.forRoot()
  ],
  providers: [GoogleServiceStrategy, ConfigService, AuthService, UsersService, UtilityService]
})

export class GoogleAuthModule { }