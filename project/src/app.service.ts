import { ExecutionContext, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserCreateDto } from './dto/userCreate.dto';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import {Cron, CronExpression} from '@nestjs/schedule'
import { IReturnUser } from './common/interface/returnUser.interface';
import { IAppService } from './common/interface/appService.interface';
import axios from 'axios'
import { Request } from 'express';
import * as fs from 'fs'
import * as https from 'https';

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

  async verifyEmail(ip, token: string): Promise<Observable<{msg: string}>> {
    return this.authClient.send({cmd: "VERIFY_EMAIL"}, {ip, token}).pipe(catchError(err => {
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

  async sendEmail(ip) {
    if(ip) {
      await this.authClient.emit({cmd: "SEND_EMAIL"}, ip)

      return 
    }
  
    throw new UnauthorizedException()
  }

  async sendEmailCron() {
    try{
      const httpsAgent = new https.Agent({
        cert: fs.readFileSync('./src/secrets/cert.pem'),
        key: fs.readFileSync('./src/secrets/key.pem'),
        rejectUnauthorized: false,
      });
      
      await axios.get('https://127.0.0.1:5000/send-email', {
        httpsAgent: httpsAgent,
      });
    }catch(e){
      throw new Error(e)
    }
  }
}
