import { Injectable } from "@nestjs/common";
import { UserCreateDto } from "src/dto/userCreate.dto";
import { AuthService } from "./auth.service";
import { EmailService } from "./email.service";
import { IReturnUser } from "src/common/interface/returnUser.interface";

@Injectable()
export class AppService {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) {}

    async registration(userDto: UserCreateDto, profile_image): Promise<{ email: string, username: string }> {
        return this.authService.registration(userDto, profile_image)
    }
    async login(userDto: Omit<UserCreateDto, 'username'>): Promise<{ userWithoutPassword: IReturnUser, token: string }> {
        return this.authService.login(userDto)
    }
    async validateOAuth(profile) {
        return this.authService.validateOAuth(profile)
    }
    async createOAuthUser(profile) {
        return this.authService.createOAuthUser(profile)
    }

    async verifyEmail(userIp: string, token: string): Promise<{ msg: string, token: string }> {
        return this.emailService.verifyEmail(userIp, token)
    }
}