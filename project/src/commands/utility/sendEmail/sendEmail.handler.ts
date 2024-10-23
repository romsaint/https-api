import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailCommand } from "./sendEmail.command";
import { AppService } from "src/services/app.service";

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: SendEmailCommand): Promise<any> {
        const {ip} = command

        return this.appService.sendEmail(ip)
    }
}