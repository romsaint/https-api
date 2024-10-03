import { Injectable } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class UserCreateDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    //@IsStrongPassword()
    password: string
}
