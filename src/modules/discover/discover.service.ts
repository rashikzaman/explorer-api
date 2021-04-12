import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscoverService {
  findWonderers() {
    return `This action returns all wonderers`;
  }
}
