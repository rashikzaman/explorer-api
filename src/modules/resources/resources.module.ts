import { Module } from '@nestjs/common';
import { ResourcesService } from './services/resources.service';
import { ResourcesController } from './controllers//resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteResourceType } from './models/entities/website-resource-type.entity';
import { Resource } from './models/entities/resource.entity';
import { User } from '../users/models/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports: [TypeOrmModule.forFeature([WebsiteResourceType, Resource, User])],
})
export class ResourcesModule {}
