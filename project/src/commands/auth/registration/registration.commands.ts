import { UserCreateDto } from "common-lib-nestjs-https-api/dist";

export class RegistrationCommand {
    constructor(
        public userDto: UserCreateDto,
        public profileImage: any
    ) {}
}