import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HealthCommand } from "./health.command";
import { UtilityService } from "src/services/utility.service";

@QueryHandler(HealthCommand)
export class HeathHandler implements IQueryHandler<HealthCommand> {
    constructor(
        private readonly utilityService: UtilityService
      ) { }

    async execute(query: HealthCommand): Promise<any> {
        const {path} = query

        return this.utilityService.healthCheck(path)
    }
}