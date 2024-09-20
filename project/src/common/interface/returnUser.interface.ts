import { Decimal } from "@prisma/client/runtime/library";
import { UserDto } from "src/dto/user.dto";
import { UserRoles } from "../userRoles";

export interface IReturnUser {
    username: string

    email: string

    id: string

    role: UserRoles

    social_rating: number | Decimal

    profile_image: string

    created_at: Date

    updated_at: Date
}