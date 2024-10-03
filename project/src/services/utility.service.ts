import { HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import axios from "axios";
import * as https from "https";
import * as fs from "fs";
import { catchError } from "rxjs";

@Injectable()
export class UtilityService {
    constructor(
        @Inject('UTILITY_SERVICE') private readonly utilityService: ClientProxy
    ) { }

    async sendEmail(ip) {
        if (ip) {
            await this.utilityService.send({ cmd: "SEND_EMAIL" }, ip).pipe(catchError(err => {
                throw new HttpException(err.message, 500)
            }))

            return
        }

        throw new UnauthorizedException()
    }

    async everyHourHealthTest() {
        await this.utilityService.emit({ cmd: "TEST_HEALTH_PER_HOUR" }, {}).pipe(catchError(err => {
            throw new HttpException(err.message, 500)
        }))
    }

    async healthCheck(path) {
        return await this.utilityService.send({ cmd: "HEALTH_CHECK" }, path).pipe(catchError(err => {
            throw new HttpException(err.message, 500)
        }))
    }

    async sendEmailCron() {
        try {
            const httpsAgent = new https.Agent({
                cert: fs.readFileSync('./src/secrets/cert.pem'),
                key: fs.readFileSync('./src/secrets/key.pem'),
                rejectUnauthorized: false,
            });

            await axios.get('https://127.0.0.1:5000/utility/send-email', {
                httpsAgent: httpsAgent,
            });
        } catch (e) {
            throw new Error(e)
        }
    }
}