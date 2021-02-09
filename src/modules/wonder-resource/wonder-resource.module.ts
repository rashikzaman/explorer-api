import { Module } from '@nestjs/common';
import { WonderResourceService } from './wonder-resource.service';
import { WonderResourceController } from './wonder-resource.controller';

@Module({
  controllers: [WonderResourceController],
  providers: [WonderResourceService]
})
export class WonderResourceModule {}
