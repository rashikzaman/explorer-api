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
import { WonderResourceModule } from './modules/wonder-resource/wonder-resource.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './modules/core/core.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { AwsModule } from './modules/aws/aws.module';

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
    TypeOrmModule.forRoot(),
    MailModule,
    EventEmitterModule.forRoot(),
    ResourcesModule,
    WondersModule,
    VisibilityModule,
    WonderResourceModule,
    CoreModule,
    MetadataModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
