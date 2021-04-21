import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { UserAuthFind } from '../core/decorators/auth.decorator';
import { ResourcesService } from '../resources/services/resources.service';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('wonderers')
  @UserAuthFind()
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  async findWonderers(
    @Request() req,
    @Query()
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    return await this.discoverService.findWonderers(req.user.userId, query);
  }

  @Get('resources')
  @UserAuthFind()
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  async findResources(
    @Request() req,
    @Query()
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    return await this.discoverService.findResources(req.user.userId, query);
  }

  @Get('wonders')
  @UserAuthFind()
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  async findWonders(
    @Request() req,
    @Query()
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    return await this.discoverService.findWonders(req.user.userId, query);
  }
}
