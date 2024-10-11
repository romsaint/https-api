import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs'
import * as path from 'path';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(to: string, subject: string, htmlContent: string) {
        // const filePath = '../utility-project/src/excel/excelData/excel-logs.xls'
        // const fileContent = fs.readFileSync(filePath)

        try {
            await this.mailerService.sendMail({
                to, subject, html: htmlContent, 
                // attachments: [
                //     {
                //         filename: path.basename(filePath),
                //         content: fileContent,
                //     },
                // ],
            });
        } catch (e) {
            throw new RpcException(e.message)
        }
    }
}
