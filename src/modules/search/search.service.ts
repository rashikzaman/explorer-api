import { Injectable } from '@nestjs/common';
import Collection from '../core/interfaces/collection/collection.interface';
import Pagination from '../core/interfaces/pagination.interface';
import { ResourcesService } from '../resources/services/resources.service';
import { WondersService } from '../wonders/services/wonders.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { SearchCollection } from './interfaces/search-collection';

@Injectable()
export class SearchService {
  constructor(
    private resourceService: ResourcesService,
    private wonderService: WondersService,
  ) {}

  async search(
    searchTerm: string,
    userId = null,
    forProfile = false,
    pagination: Pagination,
  ): Promise<SearchCollection> {
    const resourcesData: Collection = await this.resourceService.findAll(
      pagination,
      {
        searchTerm: searchTerm,
        checkPublicPrivateVisibility: !forProfile,
        userId: userId,
      },
    );
    const resources = resourcesData.items;
    const wondersData = await this.wonderService.findAll(pagination, {
      searchTerm: searchTerm,
      userId: userId,
      checkPublicPrivateVisibility: !forProfile,
    });
    const wonders = wondersData.items;
    return {
      resources: resources,
      wonders: wonders,
    };
  }
}
