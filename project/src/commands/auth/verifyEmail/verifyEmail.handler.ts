import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailCommand } from "./verifyEmail.command";
import { AppService } from "src/services/app.service";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: VerifyEmailCommand): Promise<any> {
        const {ip, token} = command

        return this.appService.verifyEmail(ip, token)
    }
}