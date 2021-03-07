import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteResourceType } from '../models/entities/website-resource-type.entity';
import { Resource } from '../models/entities/resource.entity';

@Injectable()
export class WebsiteResourceTypeService {
  constructor(
    @InjectRepository(WebsiteResourceType)
    private resourceTypeRepository: Repository<WebsiteResourceType>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<WebsiteResourceType[] | undefined> {
    const result = await this.resourceTypeRepository.find({
      relations: ['resourceType'],
    });
    return result;
  }
}
