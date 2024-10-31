import { Controller, Get } from '@nestjs/common';
import { UserService } from './services/user.service';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(
    private readonly userService: UserService
  ) {}

  @MessagePattern({cmd: "GENERATE_USER"}, Transport.RMQ)
  async generaeteUser(@Payload() count: number) {
    return await this.userService.generateUsers(count)
  }

  @MessagePattern({cmd: "ALL_USERS"}, Transport.RMQ)
  async allUsers(@Payload() data: {limit: number, offset: number}) {
    return await this.userService.allUsers(data.limit, data.offset)
  }
}