import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class DiscoverService {
  constructor(private usersService: UsersService){}

  async findWonderers() {
    const users = await this.usersService.getPublicUsers();
    return users;
  }
}
