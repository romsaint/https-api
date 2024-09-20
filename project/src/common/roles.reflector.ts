import { Reflector } from "@nestjs/core";
import { UserRoles } from "./userRoles";

export const RolesReflector = Reflector.createDecorator<UserRoles>()