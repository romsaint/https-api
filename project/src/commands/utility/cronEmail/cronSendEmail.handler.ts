import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CronSendEmailCommand } from "./cronSendEmail.command";
import { UtilityService } from "src/services/utility.service";

@CommandHandler(CronSendEmailCommand)
export class CronSendEmailHandler implements ICommandHandler<CronSendEmailCommand> {
    constructor(    
        private readonly utilityService: UtilityService
    ) { }

    async execute(command: CronSendEmailCommand): Promise<any> {
        return this.utilityService.sendEmailCron()
    }
}