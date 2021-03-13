import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entity/user.entity';
import { UsersAuthService } from './services/user-auth.service';
import { ProfileController } from './controllers/profile.controller';
import { UserAttribute } from './models/entity/user-attribute.entity';
import { VisibilityService } from '../visibility/services/visibility.service';
import { Visibility } from '../visibility/models/entity/visibility.entity';

@Module({
  controllers: [UsersController, ProfileController],
  providers: [
    UsersService,
    UsersAuthService,
    VisibilityService,
    UsersAuthService,
  ],
  exports: [UsersService, UsersAuthService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User, UserAttribute, Visibility])],
})
export class UsersModule {}
