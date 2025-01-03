import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const req = context.switchToHttp().getRequest();
        
            if (!req.headers.authorization) {
                throw new UnauthorizedException();
            }
    
            const token = req.headers.authorization.split(' ')[1]; 
            const user = this.jwtService.verify(token, {secret: this.config.get('SECRET_KEY')}); 
            
            if (!user) {
                throw new UnauthorizedException();
            }
          
            req.user = user;
            
            return true;
        }catch(e) {
            throw new Error(e.message)
        }
    }
}