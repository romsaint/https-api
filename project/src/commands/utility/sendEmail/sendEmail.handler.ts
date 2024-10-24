import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailCommand } from "./sendEmail.command";
import { UtilityService } from "src/services/utility.service";

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
    constructor(    
        private readonly utilityService: UtilityService
    ) { }

    async execute(command: SendEmailCommand): Promise<any> {
        const {ip} = command

        return this.utilityService.sendEmail(ip)
    }
}