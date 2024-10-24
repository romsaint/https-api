import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.commands";
import { AuthService } from "src/services/auth.service";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(    
        private readonly authService: AuthService
    ) { }

    async execute(command: LoginCommand): Promise<any> {
        const {userDto} = command

        return this.authService.login(userDto)
    }
}