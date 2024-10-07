import { Injectable} from '@nestjs/common';
import { UserCreateDto } from 'common-lib-nestjs-https-api/dist';
import { Observable} from 'rxjs';
import { IReturnUser } from '../common/interface/returnUser.interface';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UtilityService } from './utility.service';


@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly utilityService: UtilityService
  ) { }

  // AUTH
  async validateOAuth(profile) {
    return this.authService.validateOAuth(profile)
  }

  async registration(userDto: UserCreateDto, profile_image: Express.Multer.File): Promise<Observable<{ confirmationLink: string, email: string, username: string }>> {
    return this.authService.registration(userDto, profile_image)
  }

  async verifyEmail(ip: string, token: string): Promise<Observable<{ msg: string }>> {
    return this.authService.verifyEmail(ip, token)
  }

  async login(userDto: Omit<UserCreateDto, 'username'>): Promise<Observable<{ userWithoutPassword: IReturnUser, token: string }>> {
    return this.authService.login(userDto)
  }

  //  USERS
  async generateUser(count: number): Promise<Observable<{ msg: string }>> {
    return this.usersService.generateUser(count)
  }

  async allUsers(limit: number, offset: number): Promise<IReturnUser[]> {
    return this.usersService.allUsers(limit, offset)
  }

  // UTILITY
  async sendEmail(ip: string) {
    return this.utilityService.sendEmail(ip)
  }

  async everyHourHealthTest() {
    return this.utilityService.everyHourHealthTest()
  }

  async healthCheck(path) {
    return this.utilityService.healthCheck(path)
  }

  async sendEmailCron() { 
    return this.utilityService.sendEmailCron()
  }
}