import { Decimal } from "@prisma/client/runtime/library";
import { UserRoles } from "common-lib-nestjs-https-api/dist";

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