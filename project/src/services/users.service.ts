import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { IReturnUser } from '../common/interface/returnUser.interface';


@Injectable()
export class UsersService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy
  ) { }

  async generateUser(count: number): Promise<Observable<{ msg: string }>> {
    return this.userClient.send({ cmd: "GENERATE_USER" }, count).pipe(catchError(err => {

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
   
    }))
  }

  async allUsers(limit: number, offset: number): Promise<IReturnUser[]> {
    try {
      const users = this.userClient.send({ cmd: "ALL_USERS" }, { limit, offset })

      const data = await firstValueFrom(users)
      
      return data
    } catch (e) {
      console.log(e)
      throw new HttpException(e.message || "All users error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getUser() {
    
  }
}