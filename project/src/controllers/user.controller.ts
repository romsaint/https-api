import { Controller, DefaultValuePipe, Get, Ip, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { AppService } from "src/services/app.service";
import { RolesReflector } from "src/common/roles.reflector";
import { UserRoles } from "common-lib-nestjs-https-api/dist";
import { RolesGuard } from "src/guards/roles.guard";
import { JwtGuard } from "src/guards/verify.guard";

@RolesReflector(UserRoles.ADMIN)
@Controller('user')
export class UserController {
    constructor(private readonly appService: AppService) {}

    @Get('all-users')
    @RolesReflector(UserRoles.MODERATOR)
    @UseGuards(JwtGuard, RolesGuard)
    async allUsers(
      @Query('limit', new DefaultValuePipe(99999999), ParseIntPipe) limit,
      @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset) {
        
      return this.appService.allUsers(limit, offset)
    }
  
    @Get('generate-user')
    @UseGuards(RolesGuard, JwtGuard)
    generateUser(@Query('count') count: number) {
      return this.appService.generateUser(count)
    }
}