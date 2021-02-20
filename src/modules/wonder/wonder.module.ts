import { Module } from '@nestjs/common';
import { WonderService } from './wonder.service';
import { WonderController } from './wonder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wonder } from '../wonders/models/entities/wonder.entity';

@Module({
  controllers: [WonderController],
  providers: [WonderService],
  imports: [TypeOrmModule.forFeature([Wonder])],
})
export class WonderModule {}
