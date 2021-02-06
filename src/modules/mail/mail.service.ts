import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMailWithVerificationCode(
    recipientMail: string,
    verificationCode: string,
  ): Promise<any> {
    const result = await this.mailerService.sendMail({
      to: recipientMail, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Verification code for Wondered', // Subject line
      template: 'verification-code', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
      context: {
        // Data to be sent to template engine.
        verificationCode: verificationCode,
      },
    });
    return result;
  }
}
