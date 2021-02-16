import { Controller, Get } from '@nestjs/common';
import { ResourceTypesService } from '../services/resource-types.service';

@Controller('resource-types')
export class ResourceTypesController {
  constructor(private readonly resourceTypesService: ResourceTypesService) {}
  @Get()
  findAll() {
    return this.resourceTypesService.findAll();
  }
}
