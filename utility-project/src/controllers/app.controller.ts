import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';
import { HealthService } from 'src/services/health.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService
  ) {}

  @MessagePattern({cmd: "SEND_EMAIL"}, Transport.TCP)
  async sendMail(ip) {
    return await this.appService.sendEmail(ip)
  }

  @MessagePattern({cmd: 'HEALTH_CHECK'})
  check(path) {
    return this.healthService.healthCheck(path)
  }

  @EventPattern({cmd: "TEST_HEALTH_PER_HOUR"}, Transport.TCP)
  async testHealthPerHour() {
    await this.healthService.everyHourHealthTest()
  }
}
