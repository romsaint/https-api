import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { PrismaService } from "prisma/prisma.service";
import { ExcelService } from "src/excel/excel.service";
import { RedisLockService } from "./redis.service";

@Injectable()
export class LogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly excelService: ExcelService,
        private readonly redisService: RedisLockService
    ) { }

    async saveLog(message: string, level: string, url: string): Promise<void> {
        // const lockKey = 'error-locked';
        // const ttl = 1;

        try {
            // const ok = await this.redisService.acquireLock(lockKey, ttl);

            // if (!ok) {
                // throw new RpcException('Failed to acquire lock');
            // }

            await this.excelService.updateExcelFile([{ level, message, url }]);
            await this.prisma.logs.create({ data: { level, message, url } });
        } catch (e) {
            throw new RpcException(e.message || 'Error saving log');
        } 
    }
}