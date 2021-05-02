import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesModule } from '../resources/resources.module';
import { WondersModule } from '../wonders/wonders.module';
import { InviteController } from './controllers/invite.controller';
import { Invite } from './models/entity/invite.entity';
import { InviteService } from './services/invite.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [TypeOrmModule.forFeature([Invite]), WondersModule, ResourcesModule],
  exports: [],
})
export class InviteModule {}
