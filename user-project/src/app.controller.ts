import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({cmd: "GENERATE_USER"})
  async generaeteUser(count: number) {
    return await this.appService.generateUsers(count)
  }

  @MessagePattern({cmd: "ALL_USERS"})
  async allUsers(data: {limit: number, offset: number}) {
    return this.appService.allUsers(data.limit, data.offset)
  }

  @EventPattern({cmd: "SAVE_LOG"})
  async saveLog({message, level}) {
    this.appService.saveLog(message, level)  
  }
}