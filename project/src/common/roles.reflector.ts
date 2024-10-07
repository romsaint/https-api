import { Reflector } from "@nestjs/core";
import { UserRoles } from "common-lib-nestjs-https-api/dist";

export const RolesReflector = Reflector.createDecorator<UserRoles>()