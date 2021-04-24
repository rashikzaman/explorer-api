import { forwardRef, Module } from '@nestjs/common';
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
import { S3FileService } from '../aws/s3/services/s3-file.service';
import { ResourceSearchService } from './services/resource-search.service';
import { ResourceHelper } from './helpers/resource-helper';
import { Wonder } from '../wonders/models/entities/wonder.entity';
import { VisibilityModule } from '../visibility/visibility.module';
import { WondersModule } from '../wonders/wonders.module';
import { UserSavedResourceService } from './services/user-saved-resource.service';
import { UserSavedResource } from './models/entities/user-saved-resource.entity';

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
    S3FileService,
    ResourceSearchService,
    ResourceHelper,
    UserSavedResourceService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      WebsiteResourceType,
      Resource,
      User,
      Visibility,
      ResourceType,
      Wonder,
      UserSavedResource,
    ]),
    VisibilityModule,
    forwardRef(() => WondersModule),
  ],
  exports: [ResourcesService, ResourceSearchService, ResourceHelper],
})
export class ResourcesModule {}
