import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Ip, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { UserCreateDto } from 'common-lib-nestjs-https-api/dist';
import { RolesReflector } from '../common/roles.reflector';
import { UserRoles } from 'common-lib-nestjs-https-api/dist';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
@RolesReflector(UserRoles.ADMIN)
export class AuthController {
  constructor(private readonly appService: AppService) { }

  @Post('registration')
  @UseInterceptors(FileInterceptor('avatar'))
  async registration(@Body() userDto: UserCreateDto, @UploadedFile() profile_image) {
    return await this.appService.registration(userDto, profile_image);
  }
  @Post('login')
  async login(@Body() userDto: Omit<UserCreateDto, 'username'>) {
    return this.appService.login(userDto)
  }

  @Get('verify-email/:uuid')
  async verifyEmail(@Ip() ip, @Query('token') token: string) {
    return this.appService.verifyEmail(ip, token)
  }

  @Get('oauth')
  @UseGuards(AuthGuard('google'))
  async googleOAuth(@Req() req) {}

  @Get('oauth/redirect')
  @UseGuards(AuthGuard('google'))
  async googleOAuthRediect(@Req() req) {
    return req.user
  }
}