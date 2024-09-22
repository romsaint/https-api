import { Controller, Get, HttpException, HttpStatus, Post, Req, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { UserCreateDto } from './user-project-dto/userCreate.dto';
import { EventPattern, MessagePattern, RpcException, Transport } from '@nestjs/microservices';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: "REG" }, Transport.TCP)
  async registration({userDto, profile_image}) {
      return await this.appService.registration(userDto, profile_image)
  }  

  @MessagePattern({ cmd: "LOGIN" }, Transport.TCP)
  async login(userDto: Omit<UserCreateDto, 'username'>) {
      return await this.appService.login(userDto);
  }

  @MessagePattern({cmd: 'VERIFY_EMAIL'}, Transport.TCP)
  async verifyEmail(token: string) {
    return await this.appService.verifyEmail(token)
  }
}