import { Controller, Get, Ip, Param } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "src/services/app.service";

@Controller('health')
export class HealthCotroller {
    constructor(
        private readonly appService: AppService
    ) {}

    @Get('*')
    async healthCheck(@Param('0') path) {

      return this.appService.healthCheck(path)
    }

    @Cron(CronExpression.EVERY_HOUR)
    async everyHourHealthTest() {
      await this.appService.everyHourHealthTest()
    }
}