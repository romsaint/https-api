import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    
    async sendEmail(to: string, subject: string, htmlContent: string) {
        try{
            await this.mailerService.sendMail({to, subject, html: htmlContent});
        }catch(e){
            throw new RpcException(e.message)
        }
    }
}
