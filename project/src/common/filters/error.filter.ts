import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LogService } from 'src/log/log.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logService: LogService) {
    super();
  }
  
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // Сохраняем ошибку в базу данных
    await this.logService.createLog('error', message, request.url, );
    const res = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    }
    console.log(res)
    response.status(status).json(res);
  }
}