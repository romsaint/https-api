import { Controller, Get, Ip } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "src/services/app.service";

@ApiTags('utility')
@Controller('utility')
export class UtilityController {
  constructor(
    private readonly appService: AppService
  ) { }
  @Get('send-email')

  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendEmail(@Ip() ip: string) {
    await this.appService.sendEmail(ip)
  }

  @Cron('0 0 */10 * *')
  async sendEmailCron() {
    await this.appService.sendEmailCron()
  }
}