import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { UserCreateDto } from '../dto/userCreate.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from '../dto/user.dto';
import { UserRoles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js'
import bcryptjs from 'bcryptjs'
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { verifyPassword } from '../common/utils/verifyPassword.utils';
import * as uuid from 'uuid'
import { MailService } from '../mail/mail.service';
import { generateHtmlContent } from '../common/constants/mail.constants';
import { IReturnUser } from '../common/interface/returnUser.interface';
import { faker } from '@faker-js/faker';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService
  ) { }

  async registration(userDto: UserCreateDto, profile_image): Promise<{ email: string, username: string }> {
    try {
      const isUserExists = await this.prisma.users.findFirst({ where: { email: userDto.email } });

      if (isUserExists) {
        throw new Error('User already exists!');
      }

      const mySalt = CryptoJS.lib.WordArray.random(32).toString(); // Генерация случайной соли

      const hashedPassword = CryptoJS.PBKDF2(userDto.password, mySalt, {
        keySize: 16, // 16 * 32 бит = 512 бит (64 байта)
        iterations: 1000,
      }).toString();

      // Создание пользователя в базе данных
      const userCreate = {
        email: userDto.email,
        username: userDto.username,
        password: hashedPassword,
        role: UserRoles.DEFAULT_USER,
        salt: mySalt,
        profile_image: profile_image
      };
      const uuidV4 = uuid.v4()

      const token = this.jwt.sign(userCreate, { secret: this.config.get('SECRET_KEY') });

      const confirmationLink = `https://127.0.0.1:5000/auth/verify-email/${uuidV4}?token=${token}`
      // const confirmationLink = `https://127.0.0.1:5000/auth/verify-email?token=${token}`
      const htmlContent = generateHtmlContent(userCreate.username, confirmationLink);

      await this.mailService.sendEmail(userCreate.email, 'Confirm your email', htmlContent)

      return { email: userCreate.email, username: userCreate.username };
    } catch (e) {
      throw new RpcException(e.message || 'Server error :(')
    }
  }


  async login(userDto: Omit<UserCreateDto, 'username'>): Promise<{ userWithoutPassword: IReturnUser, token: string }> {
    try {
      const isUserExists = await this.prisma.users.findFirst({ where: { email: userDto.email } });

      if (!isUserExists) {
        throw new RpcException('User does not exists!');
      }

      const isPasswordCorrect = verifyPassword(userDto.password, isUserExists.salt, isUserExists.password)

      if (!isPasswordCorrect) {
        throw new RpcException("Password didn't match")
      }

      const payload = { email: isUserExists.email, sub: isUserExists.id, role: isUserExists.role };
      const token = this.jwt.sign(payload, { secret: this.config.get('SECRET_KEY') });

      const { password, salt, ...userWithoutPassword } = isUserExists

      return { userWithoutPassword, token }
    } catch (e) {
      throw new RpcException(e.message || 'Server error :(')
    }
  }


  async validateOAuth(profile) {

    const user = {
      email: profile.emails[0].value,
      username: profile.name.givenName,
      profile_image: profile.photos[0].value,
      role: UserRoles.DEFAULT_USER
    };

    return user
  }

  async createOAuthUser(profile) {
    try{
    const mySalt = CryptoJS.lib.WordArray.random(32).toString(); // Генерация случайной соли
    const randomStr = faker.word.words({count: 15})
    
    let arr = randomStr.split(' ')

    let password = ''

    for(let i = 0; i < randomStr.length; i++) {
      if(arr[i]) {
        password += arr[i][0]
      }
      
    }
    const hashedPassword = CryptoJS.PBKDF2(password, mySalt, {
      keySize: 16, // 16 * 32 бит = 512 бит (64 байта)
      iterations: 1000,
    }).toString();

    const user = {
      username: profile.name, 
      email: profile.email, 
      password: hashedPassword, 
      role: UserRoles.DEFAULT_USER, 
      profile_image: profile.picture,
      salt: mySalt
    }
    const isUserExists = await this.prisma.users.findFirst({where: {email: user.email}})

    if(isUserExists) {
      const {password, salt, ...retunUser} = isUserExists
      const payload = { email: isUserExists.email, sub: isUserExists.id, role: isUserExists.role };
      const token = this.jwt.sign(payload, { secret: this.config.get('SECRET_KEY') });

      return {msg: "You already registred!", retunUser, token}
    }
    
    const created = await this.prisma.users.create({data: user})

    const payload = { email: created.email, sub: created.id, role: created.role };
    const token = this.jwt.sign(payload, { secret: this.config.get('SECRET_KEY') });

    return {user, token, msg: "Successfully"}
  }catch(e) {
      throw new RpcException(e.message)
  }
  }
}