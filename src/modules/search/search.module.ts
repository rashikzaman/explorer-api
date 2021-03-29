import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { WondersService } from '../wonders/services/wonders.service';
import { ResourcesService } from '../resources/services/resources.service';
import { Resource } from '../resources/models/entities/resource.entity';
import { WondersModule } from '../wonders/wonders.module';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [ResourcesModule, WondersModule],
})
export class SearchModule {}