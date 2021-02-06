import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { join } from 'path';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: `smtps://${configService.get(
            'MAILGUN_SMTP_USERNAME',
          )}:${configService.get('MAILGUN_SMTP_PASSWORD')}@smtp.mailgun.org`,
          defaults: {
            from: '"mail module" <wondered@nestjs.com>',
          },
          template: {
            dir: join(__dirname, '../../', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}