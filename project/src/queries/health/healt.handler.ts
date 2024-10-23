import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HealthCommand } from "./health.command";
import { AppService } from "src/services/app.service";

@QueryHandler(HealthCommand)
export class HeathHandler implements IQueryHandler<HealthCommand> {
    constructor(
        private readonly appService: AppService
      ) { }

    async execute(query: HealthCommand): Promise<any> {
        const {path} = query

        return this.appService.healthCheck(path)
    }
}