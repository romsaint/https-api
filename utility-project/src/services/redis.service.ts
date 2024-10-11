import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisLockService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis
  ) {}
  
  async acquireLock(key: string, ttl: number): Promise<boolean> {
    try{

      const result = await this.redisClient.set(key, 'locked', 'EX', ttl, 'NX');

      return result === 'OK';
    }catch(e) {
      console.log(e)
    }
  }
  
  async releaseLock(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}