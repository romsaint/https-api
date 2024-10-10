import { Controller, Get, Ip, Param } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "src/services/app.service";

@ApiTags('Health')
@Controller('health')
export class HealthCotroller {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get('*')

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  @ApiParam({ name: 'path', description: 'Any path for health check', required: false })
  async healthCheck(@Param('0') path) {

    return this.appService.healthCheck(path)
  }

  @Cron(CronExpression.EVERY_HOUR)
  async everyHourHealthTest() {
    await this.appService.everyHourHealthTest()
  }
}