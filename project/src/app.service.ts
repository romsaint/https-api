import { ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserCreateDto } from './dto/userCreate.dto';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import {Cron, CronExpression} from '@nestjs/schedule'
import { IReturnUser } from './common/interface/returnUser.interface';
import { IAppService } from './common/interface/appService.interface';

@Injectable()
export class AppService implements IAppService{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy
  ) { }

  async registration(userDto: UserCreateDto, profile_image: Express.Multer.File): Promise<Observable<{ confirmationLink: string, email:  string, username:  string }>> {
    return this.authClient.send({ cmd: "REG" }, {userDto, profile_image}).pipe(
      catchError((error) => {
        return throwError(() => new HttpException(error.message, HttpStatus.BAD_REQUEST));
      })
    )
  }

  async login(userDto: Omit<UserCreateDto, 'username'>): Promise<Observable<{userWithoutPassword: IReturnUser, token: string}>> {
    return this.authClient.send({ cmd: "LOGIN" }, userDto).pipe(catchError(error => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }))
  }

  async generateUser(count: number): Promise<Observable<{ msg: string }>> {
    return this.userClient.send({cmd: "GENERATE_USER"}, count).pipe(catchError(err => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }))
  }

  async verifyEmail(token: string): Promise<Observable<{msg: string}>> {
    return this.authClient.send({cmd: "VERIFY_EMAIL"}, token).pipe(catchError(err => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }))
  }

  async allUsers(limit: number, offset: number): Promise<IReturnUser[]>  {
    try{
      const users = this.userClient.send({cmd: "ALL_USERS"}, {limit, offset})
      const data = await firstValueFrom(users)
  
      return data
    }catch(e) {
      throw new RpcException(e.message || "All users error")
    }
  }
}