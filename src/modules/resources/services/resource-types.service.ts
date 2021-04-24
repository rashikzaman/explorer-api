import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceType } from '../models/entities/resource-type.entity';

@Injectable()
export class ResourceTypesService {
  constructor(
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    private configService: ConfigService,
  ) { }

  async findAll(): Promise<ResourceType[] | undefined> {
    const result = await this.resourceTypeRepository.find({});
    return result;
  }

  async findOne(id: number): Promise<ResourceType | undefined> {
    const resourceType = await this.resourceTypeRepository.findOne(id);
    return resourceType;
  }
}
