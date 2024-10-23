import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CronSendEmailCommand } from "./cronSendEmail.command";
import { AppService } from "src/services/app.service";

@CommandHandler(CronSendEmailCommand)
export class CronSendEmailHandler implements ICommandHandler<CronSendEmailCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: CronSendEmailCommand): Promise<any> {
        return this.appService.sendEmailCron()
    }
}