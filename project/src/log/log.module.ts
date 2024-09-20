import { Module } from '@nestjs/common';
import { ErrorLogService } from './log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register({
    clients: [
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3002
        }
      },
    ]
  })],
  providers: [ErrorLogService]
})
export class LogModule {}
