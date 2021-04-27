import { forwardRef, Module } from '@nestjs/common';
import { WondersService } from './services/wonders.service';
import { WondersController } from './controllers/wonders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wonder } from './models/entities/wonder.entity';
import { User } from '../users/models/entity/user.entity';
import { VisibilityService } from '../visibility/services/visibility.service';
import { Visibility } from '../visibility/models/entity/visibility.entity';
import { WonderSearchService } from './services/wonder-search.service';
import { ResourcesModule } from '../resources/resources.module';
import { CommonWonderResourceService } from './services/common-wonder-resource.service';
import { CommonWonderWithResource } from './models/entities/common-wonder-with-resource.entity';
import { VisibilityModule } from '../visibility/visibility.module';
import { Resource } from '../resources/models/entities/resource.entity';

@Module({
  controllers: [WondersController],
  providers: [
    WondersService,
    VisibilityService,
    WonderSearchService,
    CommonWonderResourceService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Wonder,
      User,
      Visibility,
      CommonWonderWithResource,
      Resource,
    ]),
    forwardRef(() => ResourcesModule),
    VisibilityModule,
  ],
  exports: [WondersService, WonderSearchService, CommonWonderResourceService],
})
export class WondersModule {}
