import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationCommand } from "./registration.commands";
import { AppService } from "src/services/app.service";

@CommandHandler(RegistrationCommand)
export class RegistrationHandler implements ICommandHandler<RegistrationCommand> {
    constructor(    
        private readonly appService: AppService
    ) { }
    async execute(command: RegistrationCommand): Promise<any> {
        const {userDto, profileImage} = command

        return await this.appService.registration(userDto, profileImage)
    }
}