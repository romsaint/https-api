import { Controller, Get, Ip, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CronHealthCommad } from "src/commands/health/cronHealth.command";
import { HealthCommand } from "src/queries/health/health.command";

@ApiTags('Health')
@Controller('health')
export class HealthCotroller {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @Get('*')

  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  @ApiParam({ name: 'path', description: 'Any path for health check', required: false })
  async healthCheck(@Param('0') path: string) {
    return this.queryBus.execute(new HealthCommand(path))
  }

  @Cron(CronExpression.EVERY_HOUR)
  async everyHourHealthTest() {
    await this.commandBus.execute(new CronHealthCommad())
  }
}