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

  async search(searchTerm: string): Promise<SearchCollection> {
    const resources = await this.resourceSearchService.searchResources(
      searchTerm,
    );
    const wonders = await this.wonderResourceService.searchWonders(searchTerm);

    return {
      resources: resources,
      wonders: wonders,
    };
  }
}
