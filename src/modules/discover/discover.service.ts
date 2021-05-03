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
    },
  ) {
    const users = await this.resourcesService.getPublicAndInvitedOnlyResources(
      userId,
      query,
    );
    return users;
  }

  async findResource(resourceId: number, userId: number): Promise<Resource> {
    const resource: Resource = await this.resourcesService.findOne(
      resourceId,
      userId,
      true,
      true,
    );
    // if (resource.userId === userId) return resource;
    // const publicVisibility = await this.visibilityService.getPublicVisibility();
    // if (resource.visibilityId === publicVisibility.id) return resource;
    // else throw new BadRequestException('This is not a public resource');
    return resource;
  }

  async findWonders(
    userId: number,
    query: {
      pageSize: number;
      pageNumber: number;
    },
  ) {
    const wonders = await this.wonderSerivce.getAllCommonWonders(query);
    return wonders;
  }

  async findWonder(wonderTitle: string, userId: number) {
    const wonders = await this.wonderSerivce.getCommonWonderWithResources(
      wonderTitle,
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
