import { Module } from '@nestjs/common';
import { WondersService } from './wonders.service';
import { WondersController } from './wonders.controller';

@Module({
  controllers: [WondersController],
  providers: [WondersService]
})
export class WondersModule {}
