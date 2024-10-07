import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateUser } from '../common/utils/userGenerate';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { UserDto } from 'common-lib-nestjs-https-api/dist';
import { IReturnUser } from '../common/interface/returnUser.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redisService: Redis
  ) {}

  async generateUsers(count: number): Promise<{ msg: string }> {
    try {
      for (let i = 0; i < count; i++) {
        const user = generateUser();
        await this.prisma.users.create({ data: user });
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
        return JSON.parse(redisUsers);
      }

      const users = await this.prisma.users.findMany({
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
        take: limit,
        skip: offset,
      });

      await this.redisService.set('users', JSON.stringify(users));
      
      return users;
    } catch (e) {
      throw new RpcException(e.message || 'Error fetching users');
    }
  }

}