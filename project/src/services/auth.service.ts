import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserCreateDto } from 'common-lib-nestjs-https-api/dist';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { IReturnUser } from '../common/interface/returnUser.interface';


@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) { }

  async registration(userDto: UserCreateDto, profile_image: Express.Multer.File): Promise<Observable<{ confirmationLink: string, email: string, username: string }>> {
    return this.authClient.send({ cmd: "REG" }, { userDto, profile_image }).pipe(
      catchError((error) => {
        return throwError(() => new HttpException(error.message, HttpStatus.BAD_REQUEST));
      })
    )
  }

  async login(userDto: Omit<UserCreateDto, 'username'>): Promise<Observable<{ userWithoutPassword: IReturnUser, token: string }>> {
    return this.authClient.send({ cmd: "LOGIN" }, userDto).pipe(catchError(error => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }))
  }

  async verifyEmail(ip, token: string): Promise<Observable<{ msg: string }>> {
    return this.authClient.send({ cmd: "VERIFY_EMAIL" }, { ip, token }).pipe(catchError(err => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }))
  }

  async validateOAuth(profile) {
    const user = await firstValueFrom(this.authClient.send({ cmd: "CREATE_OAUTH_USER" }, profile._json).pipe(catchError(err => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })))

    return user
  }
}