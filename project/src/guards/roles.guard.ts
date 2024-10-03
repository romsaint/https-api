import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesReflector } from "src/common/roles.reflector";

@Injectable()
export class RolesGuard implements CanActivate { 
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const rolesAccess = this.reflector.getAllAndMerge(RolesReflector, [context.getHandler(), context.getClass()])
      
        if(!rolesAccess.includes(req.user?.role)) {
            throw new ForbiddenException()
        }

        return true
    }
}