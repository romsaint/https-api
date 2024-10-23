import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import axios from "axios";
import * as https from 'https'
import * as path from "path";
import { PrismaService } from "prisma/prisma.service";
import { adminAxios } from "src/common/consts/adminAxios.const";

@Injectable()
export class HealthService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async healthCheck(url) {
        const urlCreated = `https://127.0.0.1:5000/${url}`

        try {
            await adminAxios.get(urlCreated)

            return { status: "Successfully" }
        } catch (e) {
            throw new RpcException(e.message)
        }
    }

    async everyHourHealthTest() {
        const urls = { users: 'https://127.0.0.1:5000/health/user/all-users', oauth: 'https://127.0.0.1:5000/auth/oauh', genUser: 'https://127.0.0.1:5000/health/generate-user?count=23' }

        try {
            await adminAxios.get(urls.users)
            await this.prisma.health.create({ data: { status: "success", error: null, url: urls.users } })
        } catch (e) {
            await this.prisma.health.create({ data: { status: "error", error: e.message, url: urls.users } })
            throw new RpcException(e.message)
        }
        try {
            await adminAxios.get(urls.oauth)
            await this.prisma.health.create({ data: { status: "success", error: null, url: urls.oauth } })
        } catch (e) {
            await this.prisma.health.create({ data: { status: "error", error: e.message, url: urls.oauth } })
            throw new RpcException(e.message)
        }
        try {
            await adminAxios.get(urls.genUser)
            await this.prisma.health.create({ data: { status: "success", error: null, url: urls.genUser } })
        } catch (e) {
            await this.prisma.health.create({ data: { status: "error", error: e.message, url: urls.genUser } })
            throw new RpcException(e.message)
        }
    }
}