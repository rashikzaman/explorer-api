import { Controller } from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}
}
