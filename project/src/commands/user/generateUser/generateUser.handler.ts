import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GenerateUserCommand } from "./generateUser.commands";
import { UsersService } from "src/services/users.service";

@CommandHandler(GenerateUserCommand)
export class GenerateUserHandler implements ICommandHandler<GenerateUserCommand> {
    constructor(    
        private readonly usersService: UsersService
    ) { }

    async execute(command: GenerateUserCommand): Promise<any> {
        const {count} = command

        return this.usersService.generateUser(count)
    }
}