import { Module } from '@nestjs/common';
import { WondersService } from './services/wonders.service';
import { WondersController } from './controllers/wonders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wonder } from './models/entities/wonder.entity';
import { User } from '../users/models/entity/user.entity';
import { VisibilityService } from '../visibility/services/visibility.service';
import { Visibility } from '../visibility/models/entity/visibility.entity';

@Module({
  controllers: [WondersController],
  providers: [WondersService, VisibilityService],
  imports: [TypeOrmModule.forFeature([Wonder, User, Visibility])],
})
export class WondersModule {}
