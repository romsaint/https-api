import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Ip, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { JwtGuard } from './guards/verify.guard';
import { RolesGuard } from './guards/roles.guard';
import { RolesReflector } from './common/roles.reflector';
import { UserRoles } from './common/userRoles';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';


@Controller()
@RolesReflector(UserRoles.ADMIN)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('auth/registration')
  @UseInterceptors(FileInterceptor('avatar'))
  async registration(@Body() userDto: UserCreateDto, @UploadedFile() profile_image) {
    return await this.appService.registration(userDto, profile_image);
  }

  @Post('auth/login')
  async login(@Body() userDto: Omit<UserCreateDto, 'username'>) {
    return this.appService.login(userDto)
  }


  @Get('user/generate-user')
  @UseGuards(RolesGuard, JwtGuard)
  generateUser(@Query('count') count: number) {
    return this.appService.generateUser(count)
  }


  @Get('auth/verify-email/:uuid')
  async verifyEmail(@Ip() ip, @Query('token') token: string) {
    return this.appService.verifyEmail(ip, token)
  }

  @Get('user/all-users')
  @RolesReflector(UserRoles.MODERATOR)
  @UseGuards(RolesGuard, JwtGuard)
  async allUsers(
    @Query('limit', new DefaultValuePipe(99999999), ParseIntPipe) limit,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset) {
      
    return this.appService.allUsers(limit, offset)
  }

  @Get('send-email')
  async sendEmail(@Ip() ip) {
    await this.appService.sendEmail(ip)
  }

  @Cron('0 0 */10 * *')
  async sendEmailCron() {
    await this.appService.sendEmailCron()
  }
}
