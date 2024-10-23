import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GenerateUserCommand } from "./generateUser.commands";
import { AppService } from "src/services/app.service";

@CommandHandler(GenerateUserCommand)
export class GenerateUserHandler implements ICommandHandler<GenerateUserCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: GenerateUserCommand): Promise<any> {
        const {count} = command

        return this.appService.generateUser(count)
    }
}