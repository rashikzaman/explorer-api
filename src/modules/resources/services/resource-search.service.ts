import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/entity/user.entity';
import { Repository } from 'typeorm';
import { Resource } from '../models/entities/resource.entity';
import { Visibility } from '../../visibility/models/entity/visibility.entity';
import { ResourceType } from '../models/entities/resource-type.entity';
import { ResourceKeyword } from '../models/entities/resource-keyword.entity';
import { ResourceKeywordsService } from './resource-keywords.service';
import { ConfigService } from '@nestjs/config';
import { Like } from 'typeorm';
import { ResourceHelper } from '../helpers/resource-helper';

@Injectable()
export class ResourceSearchService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Visibility)
    private visibilityRepository: Repository<Visibility>,
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    @InjectRepository(ResourceKeyword)
    private resourceKeywordRepository: Repository<ResourceKeyword>,
    private resourceKeywordsService: ResourceKeywordsService,
    private configService: ConfigService,
    private resourceHelper: ResourceHelper,
  ) {}

  async searchResources(
    searchTerm: string,
    limit: 12,
  ): Promise<Array<Resource>> {
    const resources = await this.resourceRepository.find({
      where: { title: Like(`%${searchTerm}%`) },
      order: { id: 'DESC' },
      take: limit,
      relations: ['visibility', 'resourceType'],
    });

    resources.map((item) => {
      return this.resourceHelper.prepareResourceAfterFetch(item);
    });

    return resources;
  }
}
