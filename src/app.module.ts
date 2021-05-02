import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import 'reflect-metadata';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ResourcesModule } from './modules/resources/resources.module';
import { WondersModule } from './modules/wonders/wonders.module';
import { VisibilityModule } from './modules/visibility/visibility.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './modules/core/core.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { AwsModule } from './modules/aws/aws.module';
import { SearchModule } from './modules/search/search.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { DiscoverModule } from './modules/discover/discover.module';
import { InviteModule } from './modules/invite/invite.module';
import * as winston from 'winston';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({ dest: './public/uploads' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRoot(),
    MailModule,
    EventEmitterModule.forRoot(),
    ResourcesModule,
    WondersModule,
    VisibilityModule,
    MetadataModule,
    AwsModule,
    SearchModule,
    DiscoverModule,
    InviteModule,
    CoreModule, //this module has to be the last module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
