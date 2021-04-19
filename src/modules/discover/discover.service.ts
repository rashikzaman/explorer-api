import { Injectable } from '@nestjs/common';
import { ResourcesService } from '../resources/services/resources.service';
import { UsersService } from '../users/services/users.service';
import { CommonWonderResourceService } from '../wonders/services/common-wonder-resource.service';
import { WondersService } from '../wonders/services/wonders.service';

@Injectable()
export class DiscoverService {
  constructor(
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
    private readonly commonwWonderResourceService: CommonWonderResourceService,
    private readonly wonderSerivce: WondersService,
  ) {}

  async findWonderers(userId: number) {
    const users = await this.usersService.getPublicUsers();
    return users;
  }

  async findResources(userId: number) {
    const users = await this.resourcesService.getPublicAndInvitedOnlyResources(
      userId,
    );
    return users;
  }

  async findWonders(userId: number) {
    const wonders = await this.wonderSerivce.getAllCommonWonders();
    return wonders;
  }
}
