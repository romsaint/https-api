import { Controller, Get, Ip, Param, UseGuards } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AppService } from "src/services/app.service";
import { RolesReflector } from "src/common/roles.reflector";
import { UserRoles } from "src/common/userRoles";
import { RolesGuard } from "src/guards/roles.guard";
import { JwtGuard } from "src/guards/verify.guard";

@Controller()
export class UtitlityController {
    constructor(
        private readonly appService: AppService
    ) {}
    @Get('send-email')
    async sendEmail(@Ip() ip) {
      await this.appService.sendEmail(ip)
    }
  
    @Cron('0 0 */10 * *')
    async sendEmailCron() {
      await this.appService.sendEmailCron()
    }
}