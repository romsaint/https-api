import { Injectable } from "@nestjs/common";
import { UserRoles } from "src/common/userRoles";
import { IsDate, IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    //@IsStrongPassword()
    password: string

    @IsNotEmpty()
    @IsUUID()
    id: string

    @IsNotEmpty()
    role: UserRoles

    @IsNotEmpty()
    social_rating: number

    @IsNotEmpty()
    salt: string

    profile_image: string

    @IsNotEmpty()
    @IsDate()
    created_at: Date
    
    @IsNotEmpty()
    @IsDate()
    updated_at: Date
}