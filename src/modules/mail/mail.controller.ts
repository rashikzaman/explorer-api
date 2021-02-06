import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async sendMai(): Promise<any> {
    return this.mailService.sendMailWithVerificationCode(
      'rashikzaman13@gmail.com',
      '1234123',
    );
  }
}
