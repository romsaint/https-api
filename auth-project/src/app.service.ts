import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { UserCreateDto } from './user-project-dto/userCreate.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './user-project-dto/user.dto';
import { UserRoles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js'
import bcryptjs from 'bcryptjs'
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { verifyPassword } from './common/utils/verifyPassword.utils';
import * as uuid from 'uuid'
import { MailService } from './mail/mail.service';
import { generateHtmlContent } from './common/constants/mail.constants';
import { IReturnUser } from './common/interface/returnUser.interface';


@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService
  ) { }

  async registration(userDto: UserCreateDto, profile_image): Promise<{ confirmationLink: string, email: string, username: string }> {
    try {
      // Проверка существования пользователя

      const isUserExists = await this.prisma.user.findFirst({ where: { email: userDto.email } });

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

      const confirmationLink = `https://127.0.0.1:3000/verify-email/${uuidV4}?token=${token}`
      const htmlContent = generateHtmlContent(userCreate.username, confirmationLink);

      await this.mailService.sendEmail(userCreate.email, 'Confirm your email', htmlContent)

      return { confirmationLink, email: userCreate.email, username: userCreate.username };
    } catch (e) {
      throw new RpcException(e.message)
    }
  }


  async login(userDto: Omit<UserCreateDto, 'username'>): Promise<{ userWithoutPassword: IReturnUser, token: string }> {
    try {
      const isUserExists = await this.prisma.user.findFirst({ where: { email: userDto.email } });

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
      throw new RpcException(e.message)
    }
  }

  async verifyEmail(token: string): Promise<{msg: string}> {
    try {
      const { iat, exp, ...data } = this.jwt.verify(token, { secret: this.config.get('SECRET_KEY') })
      const { profile_image, ...withoutImage } = data

      await this.prisma.user.create({ data: { profile_image: data.profile_image.filename, ...withoutImage } })

      return {msg: "Successfully!"}
    } catch (e) {
      throw new RpcException("User already exists! DON'T CLICK f5")
    }
  }
}
