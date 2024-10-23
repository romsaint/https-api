import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CronHealthCommad } from "./cronHealth.command";
import { AppService } from "src/services/app.service";

@CommandHandler(CronHealthCommad)
export class CronHealthHandler implements ICommandHandler<CronHealthCommad> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: CronHealthCommad): Promise<any> {
        return this.appService.everyHourHealthTest()
    }
}