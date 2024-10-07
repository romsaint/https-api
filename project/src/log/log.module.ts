import { Module } from '@nestjs/common';
import { LogService } from './log.service';
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
  providers: [LogService]
})
export class LogModule {}
