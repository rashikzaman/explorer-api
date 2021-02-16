import { Module } from '@nestjs/common';
import { ResourcesService } from './services/resources.service';
import { ResourcesController } from './controllers//resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteResourceType } from './models/entities/website-resource-type.entity';
import { Resource } from './models/entities/resource.entity';
import { User } from '../users/models/user.entity';
import { UsersModule } from '../users/users.module';
import { Visibility } from '../visibility/models/entity/visibility.entity';
import { ResourceType } from './models/entities/resource-type.entity';
import { ResourceTypesController } from './controllers/resource-types.controller';
import { ResourceTypesService } from './services/resource-types.service';
import { UserResourcesController } from './controllers/user-resources.controller';

@Module({
  controllers: [
    ResourcesController,
    ResourceTypesController,
    UserResourcesController,
  ],
  providers: [ResourcesService, ResourceTypesService],
  imports: [
    TypeOrmModule.forFeature([
      WebsiteResourceType,
      Resource,
      User,
      Visibility,
      ResourceType,
    ]),
  ],
})
export class ResourcesModule {}
