import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';

export const authEventsType = {
  userRegistered: 'user.registered',
  resetPasswordTokenGenerated: 'reset.password.token.generated',
};

@Injectable()
export class AuthEvents {
  constructor(
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {}

  @OnEvent(authEventsType.userRegistered)
  handleUserRegistration(payload: { email: string; verificationCode: string }) {
    this.mailService.sendMailWithVerificationCode(
      payload.email,
      payload.verificationCode,
    );
  }

  @OnEvent(authEventsType.resetPasswordTokenGenerated)
  sendMailWithResetPassword(payload: { email: string; token: string }) {
    this.mailService.sendMailWithVerificationCode(payload.email, payload.token);
  }
}
