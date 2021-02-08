import { Module } from '@nestjs/common';
import { ResourcesService } from './services/resources.service';
import { ResourcesController } from './controllers//resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteResourceType } from './models/entities/website-resource-type.entity';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports: [TypeOrmModule.forFeature([WebsiteResourceType])],
})
export class ResourcesModule {}
