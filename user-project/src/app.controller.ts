import { Controller, Get } from '@nestjs/common';
import { UserService } from './services/user.service';
import { LogService } from './services/log.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly logService: LogService
  ) {}

  @MessagePattern({cmd: "GENERATE_USER"}, Transport.TCP)
  async generaeteUser(count: number) {
    return await this.userService.generateUsers(count)
  }

  @MessagePattern({cmd: "ALL_USERS"}, Transport.TCP)
  async allUsers(data: {limit: number, offset: number}) {
    return await this.userService.allUsers(data.limit, data.offset)
  }

  @EventPattern({cmd: "SAVE_LOG"}, Transport.TCP)
  async saveLog({level, url, message}) {
    await this.logService.saveLog(message, level, url)  
  }
}