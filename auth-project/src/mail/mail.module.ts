import {config} from 'dotenv'
config()
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"Nest rem project" <${process.env.MAIL_USER}>`, // Убедитесь, что этот адрес совпадает с адресом аутентификации
      },
    }),
  ],
  providers: [MailService]
})
export class MailModule {}