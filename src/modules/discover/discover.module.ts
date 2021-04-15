import { Module } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { DiscoverController } from './discover.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [DiscoverController],
  providers: [DiscoverService],
  imports: [UsersModule],
})
export class DiscoverModule {}
