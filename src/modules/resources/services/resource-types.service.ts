import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationHelper } from '../../core/helpers/pagination-helper';
import { WondersService } from '../../wonders/services/wonders.service';
import { Repository } from 'typeorm';
import { ResourceHelper } from '../helpers/resource-helper';
import { ResourceGroupByResourceTypeInterface } from '../interfaces/resource-group-by-resourceType.interface';
import { ResourceType } from '../models/entities/resource-type.entity';
import { Resource } from '../models/entities/resource.entity';

@Injectable()
export class ResourceTypesService {
  constructor(
    @InjectRepository(ResourceType)
    private readonly resourceTypeRepository: Repository<ResourceType>,
    private readonly configService: ConfigService,
    private readonly wondersService: WondersService,
    private readonly paginationHelper: PaginationHelper,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly resourceHelper: ResourceHelper,
  ) { }

  async findAll(): Promise<ResourceType[] | undefined> {
    const result = await this.resourceTypeRepository.find({});
    return result;
  }

  async findOne(id: number): Promise<ResourceType | undefined> {
    const resourceType = await this.resourceTypeRepository.findOne(id);
    return resourceType;
  }

  async groupUserResourcesByResourceType(
    userId: number,
    query: { wonderId: number; pageSize: number; pageNumber: number },
  ): Promise<Array<ResourceGroupByResourceTypeInterface>> {
    const resourceTypes = await this.findAll();
    const resourceGroupData = [];
    if (query.wonderId) {
      const wonder = await this.wondersService.findOne(
        query.wonderId,
        userId,
        false,
      );
      if (!wonder) throw new NotFoundException('Wonder not found');
    }

    const {
      pageSize,
      skippedItems,
      pageNumber,
    } = this.paginationHelper.getPageSizeAndNumber({
      pageSize: query.pageSize,
      pageNumber: query.pageSize,
    });

    await Promise.all(
      resourceTypes.map(async (item) => {
        const {
          resources,
          resourcesCount,
        } = await this.getUserResourcesByResourceType(
          item,
          +userId,
          pageSize,
          skippedItems,
          query.wonderId,
        );

        const data: ResourceGroupByResourceTypeInterface = {
          id: item.id,
          type: item.type,
          resources: resources,
          resourcesCount: resourcesCount,
        };
        resourceGroupData.push(data);
        return item;
      }),
    );

    return resourceGroupData;
  }

  async getUserResourcesByResourceType(
    resourceType: ResourceType,
    userId: number,
    pageSize,
    skippedItems,
    wonderId = null,
    wonderIds: Array<number> | null = null,
  ) {
    let sqlQuery = this.resourceRepository
      .createQueryBuilder('resource')
      .where('resource.userId = :userId', { userId: userId })
      .andWhere('resource.resourceTypeId = :resourceTypeId', {
        resourceTypeId: resourceType.id,
      });

    if (wonderId) {
      sqlQuery = sqlQuery.andWhere('resource.wonderId = :wonderId', {
        wonderId: wonderId,
      });
    }
    if (wonderIds) {
      sqlQuery = sqlQuery.andWhere('resource.wonderId In (:wonderIds)', {
        wonderIds: wonderIds,
      });
    }

    const count = await sqlQuery.getCount();

    const resources = await sqlQuery
      .orderBy({ id: 'DESC' })
      .take(pageSize)
      .skip(skippedItems)
      .getMany();

    resources.map((item) => {
      item.resourceType = resourceType;
      return this.resourceHelper.prepareResourceAfterFetch(item);
    });

    return {
      resources: resources,
      resourcesCount: count,
    };
  }
}
