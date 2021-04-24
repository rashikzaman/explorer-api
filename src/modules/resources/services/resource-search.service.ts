import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/entity/user.entity';
import { Repository } from 'typeorm';
import { Resource } from '../models/entities/resource.entity';
import { Visibility } from '../../visibility/models/entity/visibility.entity';
import { ResourceType } from '../models/entities/resource-type.entity';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
    private resourceHelper: ResourceHelper,
  ) {}

  async searchResources(
    searchTerm: string,
    userId: number,
    forProfile = false,
    limit = 12,
  ): Promise<Array<Resource>> {
    let sqlQuery = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.resourceType', 'resoureceType')
      .leftJoinAndSelect('resource.visibility', 'visibility')
      .leftJoinAndSelect('resource.wonder', 'wonder')
      .where(
        'MATCH(resource.title) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
        { searchTerm: searchTerm },
      )
      .orWhere(
        'MATCH(resource.keywords) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
        { searchTerm: searchTerm },
      );

    if (forProfile) {
      sqlQuery = sqlQuery.andWhere('resource.userId = :userId', {
        userId: userId,
      });
    }

    const resources = await sqlQuery.take(limit).getMany();

    resources.map((item) => {
      return this.resourceHelper.prepareResourceAfterFetch(item);
    });
    return resources;
  }
}

// .select([
//   'resource.id',
//   'resource.title',
//   `MATCH(resource.title) AGAINST ('${searchTerm}' IN NATURAL LANGUAGE MODE) > 0 AS score`,
// ]).having('score > 0')
// .orderBy('score', 'DESC')
