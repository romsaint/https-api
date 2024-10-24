import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailCommand } from "./verifyEmail.command";
import { AuthService } from "src/services/auth.service";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(    
        private readonly authService: AuthService
    ) { }

    async execute(command: VerifyEmailCommand): Promise<any> {
        const {ip, token} = command

        return this.authService.verifyEmail(ip, token)
    }
}