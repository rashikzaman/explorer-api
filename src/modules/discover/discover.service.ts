import { Injectable } from '@nestjs/common';
import { ResourcesService } from '../resources/services/resources.service';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class DiscoverService {
  constructor(
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
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
}
