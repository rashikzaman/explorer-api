import { Controller, Get } from '@nestjs/common';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('wonderers')
  findWonder() {
    return this.discoverService.findWonderers();
  }
}
