import { Controller, Get, Request } from '@nestjs/common';
import { UserAuthFind } from '../core/decorators/auth.decorator';
import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('wonderers')
  @UserAuthFind()
  findWonder(@Request() req) {
    return this.discoverService.findWonderers(req.user.userId);
  }
}
