import { Controller, Get, Ip } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CronSendEmailCommand } from "src/commands/utility/cronEmail/cronSendEmail.command";
import { SendEmailCommand } from "src/commands/utility/sendEmail/sendEmail.command";
import { AppService } from "src/services/app.service";

@ApiTags('utility')
@Controller('utility')
export class UtilityController {
  constructor(
    private readonly commandBus: CommandBus
  ) { }
  @Get('send-email')

  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendEmail(@Ip() ip: string) {
    await this.commandBus.execute(new SendEmailCommand(ip))
  }

  @Cron('0 0 */10 * *')
  async sendEmailCron() {
    await this.commandBus.execute(new CronSendEmailCommand())
  }
}
