import { Controller, Get, NotFoundException } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('*') //core module needs to be imported at last so that a notFoundException could be thrown if api is not found
  returnNotFound(): string {
    throw new NotFoundException('Route Not Found');
  }
}
