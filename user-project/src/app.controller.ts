import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({cmd: "GENERATE_USER"}, Transport.TCP)
  async generaeteUser(count: number) {
    return await this.appService.generateUsers(count)
  }

  @MessagePattern({cmd: "ALL_USERS"}, Transport.TCP)
  async allUsers(data: {limit: number, offset: number}) {
    return await this.appService.allUsers(data.limit, data.offset)
  }

  @EventPattern({cmd: "SAVE_LOG"}, Transport.TCP)
  async saveLog({message, level}) {
    await this.appService.saveLog(message, level)  
  }
}