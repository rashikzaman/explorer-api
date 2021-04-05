import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  checkIfMailEnabled() {
    if (
      this.configService.get('ENVIRONMENT') &&
      this.configService.get('ENVIRONMENT') !== 'development'
    )
      return true;
    return false;
  }

  async sendMailWithVerificationCode(
    recipientMail: string,
    verificationCode: string,
  ): Promise<any> {
    if (this.checkIfMailEnabled()) {
      const result = await this.mailerService.sendMail({
        to: recipientMail, // list of receivers
        from: 'mail@wondered.io', // sender address
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

  async sendMailWithResetPassword(
    recipientMail: string,
    token: string,
  ): Promise<any> {
    if (this.checkIfMailEnabled()) {
      const result = await this.mailerService.sendMail({
        to: recipientMail, // list of receivers
        from: 'mail@wondered.io', // sender address
        subject: 'Password Reset Token For Wondered', // Subject line
        template: 'password-reset-token', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          resetToken: token,
        },
      });
      return result;
    }
  }
}
