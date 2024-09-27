import { Controller, Get, HttpException, HttpStatus, Post, Query, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { EventPattern, MessagePattern, RpcException, Transport } from '@nestjs/microservices';
import { Request } from 'express';
import { IPVersion } from 'net';
import { AuthGuard } from '@nestjs/passport';

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
  async verifyEmail({ip, token}) {
    return await this.appService.verifyEmail(ip, token)
  }

  @EventPattern({cmd: "SEND_EMAIL"}, Transport.TCP)
  async sendMail(ip) {
    await this.appService.sendEmail(ip)
  }

  @MessagePattern({cmd: "CREATE_OAUTH_USER"}, Transport.TCP)
  async createOAuthUser(profile) {
    return await this.appService.createOAuthUser(profile)
  }
}