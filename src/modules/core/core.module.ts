import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { PaginationHelper } from './helpers/pagination-helper';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CoreController],
  providers: [CoreService, PaginationHelper, ConfigService],
  exports: [PaginationHelper]
})
export class CoreModule {}
