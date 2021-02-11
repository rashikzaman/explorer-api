import { Module } from '@nestjs/common';
import { WondersService } from './services/wonders.service';
import { WondersController } from './controllers/wonders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wonder } from './models/entities/wonder.entity';

@Module({
  controllers: [WondersController],
  providers: [WondersService],
  imports: [TypeOrmModule.forFeature([Wonder])],
})
export class WondersModule {}
