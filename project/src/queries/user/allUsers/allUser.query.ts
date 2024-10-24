import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AllUsersCommands } from "./allUsers.commands";
import { UsersService } from "src/services/users.service";

@QueryHandler(AllUsersCommands)
export class AllUsersHandler implements IQueryHandler<AllUsersCommands> {
    constructor(
        private readonly usersService: UsersService
    ) { }
    async execute(query: AllUsersCommands): Promise<any> {
        const {limit, offset} = query

        return this.usersService.allUsers(limit, offset)
    }
}