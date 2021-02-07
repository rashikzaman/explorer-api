import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';

export const authEventsType = {
  userRegistered: 'user.registered',
};

@Injectable()
export class AuthEvents {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(authEventsType.userRegistered)
  handleUserRegistration(payload: { email: string; verificationCode: string }) {
    // this.mailService.sendMailWithVerificationCode(
    //   payload.email,
    //   payload.verificationCode,
    // );
  }
}
