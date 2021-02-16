import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceType } from '../models/entities/resource-type.entity';
import { Resource } from '../models/entities/resource.entity';

@Injectable()
export class ResourceTypesService {
  constructor(
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<ResourceType[] | undefined> {
    const result = await this.resourceTypeRepository.find({});
    return result;
  }
}
