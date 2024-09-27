import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/userCreate.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
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
import { Request } from 'express';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RedisLockService } from './redis.service';
import { htmlNotification } from './common/constants/htmlNotification'
import { faker } from '@faker-js/faker';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    @InjectRedis() private readonly redisService: Redis,
    private readonly redisLockService: RedisLockService
  ) { }

  async registration(userDto: UserCreateDto, profile_image): Promise<{ email: string, username: string }> {
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

      const confirmationLink = `https://127.0.0.1:5000/auth/verify-email/${uuidV4}?token=${token}`
      const htmlContent = generateHtmlContent(userCreate.username, confirmationLink);

      await this.mailService.sendEmail(userCreate.email, 'Confirm your email', htmlContent)

      return { email: userCreate.email, username: userCreate.username };
    } catch (e) {
      throw new RpcException(e.message || 'Server error :(')
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
      throw new RpcException(e.message || 'Server error :(')
    }
  }

  async verifyEmail(userIp, token: string): Promise<{ msg: string, token: string }> {
    try {
      const { iat, exp, ...data } = this.jwt.verify(token, { secret: this.config.get('SECRET_KEY') })
      const { profile_image, ...withoutImage } = data

      await this.prisma.tokens.create({ data: { ip: userIp, jwt_token: token } })
      await this.prisma.user.create({ data: { profile_image: data.profile_image.filename, ...withoutImage } })

      return { msg: "Successfully!", token }
    } catch (e) {

      throw new RpcException("User already exists!")
    }
  }

  async sendEmail(ip: string) {
    const lockKey = `lock:sendEmail:${ip}`;
    const ttl = 5; // Время жизни блокировки в секундах

    const lockAcquired = await this.redisLockService.acquireLock(lockKey, ttl);

    if (!lockAcquired) {
      return;
    }

    try {
      const tokens = await this.prisma.tokens.findFirst({ where: { ip } });

      if (tokens) {
        const { iat, exp, ...data } = this.jwt.verify(tokens.jwt_token, { secret: this.config.get('SECRET_KEY') });
        const htmlContent = htmlNotification(data)
        await this.mailService.sendEmail(data.email, 'Every 10 days notification', htmlContent);
      }
    } finally {
      await this.redisLockService.releaseLock(lockKey);
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

    console.log(password)

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

    await this.prisma.user.create({data: user})

    return user
  }catch(e) {
    if(e.code === 'P2002') {
      throw new RpcException('User already exists')
    }else{
      throw new RpcException(e.message)
    }
  }
  }
}