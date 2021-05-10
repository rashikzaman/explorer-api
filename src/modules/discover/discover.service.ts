import { BadRequestException, Injectable } from '@nestjs/common';
import Pagination from '../core/interfaces/pagination.interface';
import { Resource } from '../resources/models/entities/resource.entity';
import { ResourcesService } from '../resources/services/resources.service';
import { User } from '../users/models/entity/user.entity';
import { UsersService } from '../users/services/users.service';
import { VisibilityService } from '../visibility/services/visibility.service';
import { CommonWonderResourceService } from '../wonders/services/common-wonder-resource.service';
import { WondersService } from '../wonders/services/wonders.service';

@Injectable()
export class DiscoverService {
  constructor(
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
    private readonly commonwWonderResourceService: CommonWonderResourceService,
    private readonly wonderSerivce: WondersService,
    private readonly visibilityService: VisibilityService,
  ) {}

  async findWonderers(
    userId: number,
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    const users = await this.usersService.getPublicUsers(query);
    return users;
  }

  async findWonderer(wondererId: number) {
    const user: User = await this.usersService.getPublicUser(wondererId);
    if (!user) throw new BadRequestException('Wonderer not found!');
    return user;
  }

  async findResources(
    userId: number,
    query: {
      pageSize: number;
      pageNumber: number;
      resourceTypeId?: number;
      wonderId?: number;
      searchTerm?: string;
    },
  ) {
    const resources = await this.resourcesService.findAll(
      {
        pageSize: query.pageSize,
        pageNumber: query.pageNumber,
      },
      {
        resourceTypeId: query.resourceTypeId,
        wonderId: query.wonderId,
        searchTerm: query.searchTerm,
        userId: userId,
        checkPublicPrivateVisibility: true,
      },
    );
    return resources;
  }

  async findResource(resourceId: number, userId: number): Promise<Resource> {
    const resource: Resource = await this.resourcesService.findOne({
      resourceId: resourceId,
      userId: userId,
      withRelation: true,
      checkPublicPrivateVisibility: true,
    });
    return resource;
  }

  async findWonders(
    userId: number,
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    const wonders = await this.wonderSerivce.getAllCommonWonders(userId, query);
    return wonders;
  }

  async findWonder(wonderTitle: string, userId: number) {
    const wonders = await this.wonderSerivce.getCommonWonderWithResources(
      wonderTitle,
      userId,
    );
    return wonders;
  }

  async findResourceGroupsByResources(
    wonderTitle: string,
    userId: number,
    query: Pagination,
  ) {
    const wonderWithResources = await this.resourcesService.groupVisibleResourcesByResourceTypeAndWonderTitle(
      wonderTitle,
      userId,
      query,
    );
    return wonderWithResources;
  }
}
