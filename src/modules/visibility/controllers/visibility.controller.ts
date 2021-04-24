import { Controller, Get } from '@nestjs/common';
import { Visibility } from '../models/entity/visibility.entity';
import { VisibilityService } from '../services/visibility.service';

@Controller('visibilities')
export class VisibilityController {
  constructor(private readonly visibilityService: VisibilityService) {}
  @Get('/')
  async getVisibility(): Promise<Visibility[] | undefined> {
    const result = await this.visibilityService.findAll();
    return result;
  }
}
