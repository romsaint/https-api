import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationCommand } from "./registration.commands";
import { AuthService } from "src/services/auth.service";

@CommandHandler(RegistrationCommand)
export class RegistrationHandler implements ICommandHandler<RegistrationCommand> {
    constructor(    
        private readonly authService: AuthService
    ) { }
    async execute(command: RegistrationCommand): Promise<any> {
        const {userDto, profileImage} = command

        return await this.authService.registration(userDto, profileImage)
    }
}