import { Module } from '@nestjs/common';
import { ResourcesService } from './services/resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteResourceType } from './models/entities/website-resource-type.entity';
import { Resource } from './models/entities/resource.entity';
import { User } from '../users/models/entity/user.entity';
import { UsersModule } from '../users/users.module';
import { Visibility } from '../visibility/models/entity/visibility.entity';
import { ResourceType } from './models/entities/resource-type.entity';
import { ResourceTypesController } from './controllers/resource-types.controller';
import { ResourceTypesService } from './services/resource-types.service';
import { ResourcesController } from './controllers/resources.controller';
import { WebsiteResourceTypeController } from './controllers/website-resource-type.controller';
import { WebsiteResourceTypeService } from './services/website-resource-type.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    ResourcesController,
    ResourceTypesController,
    WebsiteResourceTypeController,
  ],
  providers: [
    ResourcesService,
    ResourceTypesService,
    WebsiteResourceTypeService,
    ConfigService,
  ],
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
