import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Ip, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { UserCreateDto } from 'common-lib-nestjs-https-api/dist';
import { RolesReflector } from '../common/roles.reflector';
import { UserRoles } from 'common-lib-nestjs-https-api/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
@RolesReflector(UserRoles.ADMIN)
export class AuthController {
  constructor(private readonly appService: AppService) { }

  @Post('registration')
  @UseInterceptors(FileInterceptor('avatar'))

  @ApiOperation({summary: "Register a new use"})
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({type: UserCreateDto})
  @ApiConsumes('multipart/form-data') // because file upload
  async registration(@Body() userDto: UserCreateDto, @UploadedFile() profile_image) {
    return await this.appService.registration(userDto, profile_image);
  }


  @Post('login')

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: UserCreateDto })
  async login(@Body() userDto: Omit<UserCreateDto, 'username'>) {
    return this.appService.login(userDto)
  }

  @Get('verify-email/:uuid')

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'uuid', description: 'User UUID' })
  @ApiQuery({ name: 'token', description: 'Verification token' })
  async verifyEmail(@Ip() ip, @Query('token') token: string) {
    return this.appService.verifyEmail(ip, token)
  }

  @Get('oauth')
  @UseGuards(AuthGuard('google'))

  @ApiOperation({ summary: 'Initiate Google OAuth' })
  @ApiResponse({ status: 200, description: 'OAuth initiated' })
  async googleOAuth(@Req() req) {}

  @Get('oauth/redirect')
  @UseGuards(AuthGuard('google'))

  @ApiOperation({ summary: 'Handle Google OAuth redirect' })
  @ApiResponse({ status: 200, description: 'OAuth redirect handled' })
  async googleOAuthRediect(@Req() req) {
    return req.user
  }
}