import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LogService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async saveLog(message: string, level: string, url: string): Promise<void> {

        try {
            await this.prisma.logs.create({ data: { level, message, url } });
        } catch (e) {
            throw new RpcException(e.message || 'Error saving log');
        }
    }
}