import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import {
  UserAuthFind,
  UserOptionalAuthFind,
  UserOptionalAuthFindAll,
} from '../core/decorators/auth.decorator';
import Pagination from '../core/interfaces/pagination.interface';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('wonderers')
  @UserOptionalAuthFindAll()
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
    return await this.discoverService.findWonderers(req.user.id, query);
  }

  @Get('wonderers/:id')
  @UserOptionalAuthFind()
  async findWonderer(@Request() req, @Param('id') id: string) {
    return await this.discoverService.findWonderer(+id);
  }

  @Get('resources')
  @UserOptionalAuthFindAll()
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
    return await this.discoverService.findResources(req.user.id, query);
  }

  @Get('resources/:id')
  @UserOptionalAuthFind()
  async findResource(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    const resource = await this.discoverService.findResource(+id, +userId);
    if (!resource) throw new NotFoundException('Resource not found!');
    return resource;
  }

  @Get('wonders')
  @UserOptionalAuthFindAll()
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
    return await this.discoverService.findWonders(req.user.id, query);
  }

  @Get('wonders/:title')
  @UserOptionalAuthFind()
  async findWonder(@Request() req, @Param('title') title: string) {
    const userId = req.user.id;
    return await this.discoverService.findWonder(title, userId);
  }

  @Get('resources/group/resource-type')
  @UserOptionalAuthFindAll()
  async findResourceGroupsByResources(
    @Request() req,
    @Query('wonderTitle') wonderTitle: string,
    @Query()
    query: Pagination,
  ) {
    const userId = req.user.id;
    if (!wonderTitle) throw new BadRequestException('Wonder title not found');
    return await this.discoverService.findResourceGroupsByResources(
      wonderTitle,
      userId,
      query,
    );
  }
}
