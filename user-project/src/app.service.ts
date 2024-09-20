import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateUser } from './common/utils/userGenerate';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { UserDto } from './dto/user.dto';
import { IReturnUser } from './common/interface/returnUser.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redisService: Redis
  ) {}

  async generateUsers(count: number): Promise<{ msg: string }> {
    try {
      for (let i = 0; i < count; i++) {
        const user = generateUser();
        await this.prisma.user.create({ data: user });
      }
      return { msg: 'Created' };
    } catch (e) {
      throw new RpcException(e.message || 'Error generating users');
    }
  }

  async allUsers(limit: number, offset: number): Promise<IReturnUser[]> {
    try {
      const redisUsers = await this.redisService.get('users');
      if (redisUsers) {
        await this.redisService.del('users');
        return JSON.parse(redisUsers);
      }

      const users = await this.prisma.user.findMany({
        select: {
          created_at: true,
          email: true,
          id: true,
          role: true,
          social_rating: true,
          updated_at: true,
          username: true,
          profile_image: true,
        },
        take: limit ?? 9999999999,
        skip: offset ?? 0,
      });

      await this.redisService.set('users', JSON.stringify(users));
      return users;
    } catch (e) {
      throw new RpcException(e.message || 'Error fetching users');
    }
  }

  async saveLog(message: string, level: string): Promise<void> {
    try {
      await this.prisma.log.create({ data: { level, message } });
    } catch (e) {
      throw new RpcException(e.message || 'Error saving log');
    }
  }
}