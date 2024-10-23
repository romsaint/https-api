import { UserCreateDto } from "common-lib-nestjs-https-api/dist";

export class LoginCommand {
    constructor(
        public userDto: Omit<UserCreateDto, 'username'>
    ) {}
}