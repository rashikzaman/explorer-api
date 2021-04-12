import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommonWonderResourceService } from './modules/wonders/services/common-wonder-resource.service';
import { WondersService } from './modules/wonders/services/wonders.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];

  switch (command) {
    case 'run-wonders':
      const commonWonderWithResource = application.get(
        CommonWonderResourceService,
      );
      await commonWonderWithResource.loadCommonWonders();
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
