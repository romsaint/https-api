import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AllUsersCommands } from "./allUsers.commands";
import { AppService } from "src/services/app.service";

@QueryHandler(AllUsersCommands)
export class AllUsersHandler implements IQueryHandler<AllUsersCommands> {
    constructor(
        private readonly appService: AppService
    ) { }
    async execute(query: AllUsersCommands): Promise<any> {
        const {limit, offset} = query

        return this.appService.allUsers(limit, offset)
    }
}