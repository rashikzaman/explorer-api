import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../models/entities/resource.entity';
import { ResourceKeyword } from '../models/entities/resource-keyword.entity';

@Injectable()
export class ResourceKeywordsService {
  constructor(
    @InjectRepository(ResourceKeyword)
    private resourceKeywordRepository: Repository<ResourceKeyword>,
  ) {}

  async create(
    keywords: Array<string>,
    resource: Resource,
  ): Promise<Array<ResourceKeyword>> {
    if (keywords) {
      const keywordsEntity = [];
      keywords.forEach((keyword) => {
        const resourceKeyword = new ResourceKeyword();
        resourceKeyword.name = keyword;
        resourceKeyword.resource = resource;
        keywordsEntity.push(resourceKeyword);
      });
      const savedKeywords = await this.resourceKeywordRepository.save(
        keywordsEntity,
      );
      return savedKeywords;
    }
    return [];
  }

  async update(
    keywords: Array<string>,
    resource: Resource,
  ): Promise<Array<ResourceKeyword>> {
    const keywordsEntity = [];
    if (keywords) {
      await this.resourceKeywordRepository.delete({ resource: resource }); // at first delete all keywords
      keywords.forEach((keyword) => {
        const resourceKeyword = new ResourceKeyword();
        resourceKeyword.name = keyword;
        resourceKeyword.resource = resource;
        keywordsEntity.push(resourceKeyword);
      });
      const savedKeywords = await this.resourceKeywordRepository.save(
        keywordsEntity,
      );
      return savedKeywords;
    }
    return [];
  }
}
