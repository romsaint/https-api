import { Controller, Get, Ip} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AppService } from "src/services/app.service";

@Controller()
export class UtitlityController {
    constructor(
        private readonly appService: AppService
    ) {}
    @Get('send-email')
    async sendEmail(@Ip() ip: string) {
      await this.appService.sendEmail(ip)
    }
  
    @Cron('0 0 */10 * *')
    async sendEmailCron() {
      await this.appService.sendEmailCron()
    }
}