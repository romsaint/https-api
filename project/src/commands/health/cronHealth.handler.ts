import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CronHealthCommad } from "./cronHealth.command";
import { UtilityService } from "src/services/utility.service";

@CommandHandler(CronHealthCommad)
export class CronHealthHandler implements ICommandHandler<CronHealthCommad> {
    constructor(    
        private readonly utilityService: UtilityService
    ) { }

    async execute(command: CronHealthCommad): Promise<any> {
        return this.utilityService.everyHourHealthTest()
    }
}