import { Controller, Get } from '@nestjs/common';
import { UserService } from './services/user.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(
    private readonly userService: UserService
  ) {}

  @MessagePattern({cmd: "GENERATE_USER"}, Transport.TCP)
  async generaeteUser(count: number) {
    return await this.userService.generateUsers(count)
  }

  @MessagePattern({cmd: "ALL_USERS"}, Transport.TCP)
  async allUsers(data: {limit: number, offset: number}) {
    return await this.userService.allUsers(data.limit, data.offset)
  }
}