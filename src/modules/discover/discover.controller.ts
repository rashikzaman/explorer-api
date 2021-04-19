import { Controller, Get, Request } from '@nestjs/common';
import { UserAuthFind } from '../core/decorators/auth.decorator';
import { ResourcesService } from '../resources/services/resources.service';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('wonderers')
  @UserAuthFind()
  async findWonderers(@Request() req) {
    return await this.discoverService.findWonderers(req.user.userId);
  }

  @Get('resources')
  @UserAuthFind()
  async findResources(@Request() req) {
    return await this.discoverService.findResources(req.user.userId);
  }

  @Get('wonders')
  @UserAuthFind()
  async findWonders(@Request() req) {
    return await this.discoverService.findWonders(req.user.userId);
  }
}
