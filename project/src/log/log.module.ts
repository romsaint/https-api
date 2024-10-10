import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register({
    clients: [
      {
        name: "UTILITY_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 3003
        }
      }
    ]
  })],
  providers: [LogService]
})
export class LogModule {}
