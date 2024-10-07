import { Controller} from '@nestjs/common';
import { AppService } from './services/app.service';
import { UserCreateDto } from 'common-lib-nestjs-https-api/dist';
import { MessagePattern, Transport } from '@nestjs/microservices';

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

  @MessagePattern({cmd: "CREATE_OAUTH_USER"}, Transport.TCP)
  async createOAuthUser(profile) {
    return await this.appService.createOAuthUser(profile)
  }
}