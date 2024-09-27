import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UserRoles } from "@prisma/client";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AppService } from "src/app.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AppService
    ) {
        super({
            clientId: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'https://127.0.0.1/auth/oauth/redirect',
            scope: ['profile']
        })
    }


    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const user = this.authService.validateOAuth(profile)
        console.log(543253)
        done(null, user);
    }
}