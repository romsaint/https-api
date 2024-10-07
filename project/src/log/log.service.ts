import { Inject, Injectable, LogLevel } from '@nestjs/common';
import { LoggerService } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class LogService implements LoggerService {
    constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) { }

    createLog(level: LogLevel, message, url): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level, message, url })
    }

    debug(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'debug', message })
    }

    error(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'error', message })
    }

    fatal(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'fatal', message })
    }

    log(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'log', message })
    }

    verbose(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'verbose', message })
    }

    warn(message: any, ...optionalParams: any[]): void {
        this.client.emit({ cmd: "SAVE_LOG" }, { level: 'warn', message })
    }
}