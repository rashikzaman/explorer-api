import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UsersAuthService } from './services/user-auth.service';
import { ProfileController } from './controllers/profile.controller';

@Module({
  controllers: [UsersController, ProfileController],
  providers: [UsersService, UsersAuthService],
  exports: [UsersService, UsersAuthService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
