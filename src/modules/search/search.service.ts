import { Injectable } from '@nestjs/common';
import { ResourceSearchService } from '../resources/services/resource-search.service';
import { ResourcesService } from '../resources/services/resources.service';
import { WonderSearchService } from '../wonders/services/wonder-search.service';
import { WondersService } from '../wonders/services/wonders.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { SearchCollection } from './interfaces/search-collection';

@Injectable()
export class SearchService {
  constructor(
    private resourceService: ResourcesService,
    private wonderService: WondersService,
    private resourceSearchService: ResourceSearchService,
    private wonderResourceService: WonderSearchService,
  ) {}

  async search(
    searchTerm: string,
    userId = null,
    forProfile = false,
    pageLimit = 12,
  ): Promise<SearchCollection> {
    const resources = await this.resourceSearchService.searchResources(
      searchTerm,
      userId,
      forProfile,
      pageLimit,
    );
    const wonders = await this.wonderResourceService.searchWonders(
      searchTerm,
      userId,
      forProfile,
      pageLimit,
    );

    return {
      resources: resources,
      wonders: wonders,
    };
  }
}
