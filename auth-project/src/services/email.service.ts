import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { Redis } from "ioredis";
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class EmailService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        @InjectRedis() private readonly redisService: Redis
    ) { }

    async verifyEmail(userIp: string, token: string): Promise<{ msg: string, token: string }> {
        try {
            const { iat, exp, ...data } = this.jwt.verify(token, { secret: this.config.get('SECRET_KEY') })
            const { profile_image, ...withoutImage } = data

            if (data.profile_image) {
                await this.prisma.$transaction(async () => {
                    const user = await this.prisma.users.create({ data: { profile_image: data.profile_image.filename, ...withoutImage } })
                    const existsUsers = JSON.parse(await this.redisService.get('users'))

                    await this.redisService.set('users', JSON.stringify(existsUsers.concat(user)))

                })
            } else {
                await this.prisma.$transaction(async () => {
                    const user = await this.prisma.users.create({ data: { ...withoutImage } })
                    const existsUsers = JSON.parse(await this.redisService.get('users'))

                    await this.redisService.set('users', JSON.stringify(existsUsers.concat(user)))
                })
            }

            await this.prisma.tokens.create({ data: { ip: userIp, jwt_token: token } })

            return { msg: "Successfully!", token }
        } catch (e) {
            throw new RpcException("User already exists!")
        }
    }
}
