import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  if (
    configService.get('ENVIRONMENT') &&
    configService.get('ENVIRONMENT') !== 'production'
  ) {
    const config = new DocumentBuilder()
      .setTitle('Wondered Backend')
      .setDescription('Wondered Backend Api Description')
      .setVersion('1.0')
      .addTag('docs')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
