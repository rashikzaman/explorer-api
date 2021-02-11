import { Module } from '@nestjs/common';
import { VisibilityService } from './services/visibility.service';
import { VisibilityController } from './controllers/visibility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visibility } from './models/entity/visibility.entity';

@Module({
  controllers: [VisibilityController],
  providers: [VisibilityService],
  imports: [TypeOrmModule.forFeature([Visibility])],
})
export class VisibilityModule {}
