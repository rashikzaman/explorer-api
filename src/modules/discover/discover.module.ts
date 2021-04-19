import { Module } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { DiscoverController } from './discover.controller';
import { UsersModule } from '../users/users.module';
import { ResourcesModule } from '../resources/resources.module';
import { WondersModule } from '../wonders/wonders.module';

@Module({
  controllers: [DiscoverController],
  providers: [DiscoverService],
  imports: [UsersModule, ResourcesModule, WondersModule],
})
export class DiscoverModule {}
