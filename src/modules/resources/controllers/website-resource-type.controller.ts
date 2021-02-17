import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { WebsiteResourceType } from '../models/entities/website-resource-type.entity';
import { ResourcesService } from '../services/resources.service';
import { WebsiteResourceTypeService } from '../services/website-resource-type.service';

@Controller('website-resource-types')
export class WebsiteResourceTypeController {
  constructor(
    private readonly websiteResourceTypeService: WebsiteResourceTypeService,
  ) {}

  @ApiOkResponse()
  @Get('/')
  async getWebsiteResources(): Promise<WebsiteResourceType[] | undefined> {
    const result = await this.websiteResourceTypeService.findAll();
    return result;
  }
}
