import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class EmailService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async verifyEmail(userIp: string, token: string): Promise<{ msg: string, token: string }> {
        try {
            const { iat, exp, ...data } = this.jwt.verify(token, { secret: this.config.get('SECRET_KEY') })
            const { profile_image, ...withoutImage } = data

            await this.prisma.tokens.create({ data: { ip: userIp, jwt_token: token } })
            await this.prisma.users.create({ data: { profile_image: data.profile_image.filename, ...withoutImage } })

            return { msg: "Successfully!", token }
        } catch (e) {
            throw new RpcException("User already exists!")
        }
    }
}
