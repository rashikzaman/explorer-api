import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { UserAuthFind } from '../core/decorators/auth.decorator';
import Pagination from '../core/interfaces/pagination.interface';
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

  @Get('wonderers/:id')
  @UserAuthFind()
  async findWonderer(@Request() req, @Param('id') id: string) {
    return await this.discoverService.findWonderer(+id);
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

  @Get('resources/:id')
  @UserAuthFind()
  async findResource(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return await this.discoverService.findResource(+id, +userId);
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

  @Get('wonders/:title')
  @UserAuthFind()
  async findWonder(@Request() req, @Param('title') title: string) {
    const userId = req.user.userId;
    return await this.discoverService.findWonder(title, userId);
  }

  @Get('resources/group/resource-type')
  @UserAuthFind()
  async findResourceGroupsByResources(
    @Request() req,
    @Query('wonderTitle') wonderTitle: string,
    @Query()
    query: Pagination,
  ) {
    const userId = req.user.userId;
    if (!wonderTitle) throw new BadRequestException('Wonder title not found');
    return await this.discoverService.findResourceGroupsByResources(
      wonderTitle,
      userId,
      query,
    );
  }
}
