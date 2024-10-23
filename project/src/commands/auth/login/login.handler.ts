import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.commands";
import { AppService } from "src/services/app.service";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }

    async execute(command: LoginCommand): Promise<any> {
        const {userDto} = command

        return this.appService.login(userDto)
    }
}