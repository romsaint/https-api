import { Injectable } from '@nestjs/common';
import { RedisLockService } from './redis.service';
import { htmlNotification } from '../common/utility/htmlNotification';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AppService {
    constructor(
        @InjectRedis() private readonly redisLockService: RedisLockService,
        private readonly prisma: PrismaService,
        private readonly emailService: MailService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }
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
                await this.emailService.sendEmail(data.email, 'Every 10 days notification', htmlContent);
            }
        } finally {
            await this.redisLockService.releaseLock(lockKey);
        }
    }
}