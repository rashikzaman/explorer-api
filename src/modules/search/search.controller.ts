import { Controller, Get, Query, Request } from '@nestjs/common';
import {
  UserAuthFind,
  UserOptionalAuthFind,
} from '../core/decorators/auth.decorator';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UserOptionalAuthFind()
  search(
    @Query()
    query: {
      pageSize: number;
      pageNumber: number;
      term: string;
    },
    @Request() req,
  ) {
    return this.searchService.search(query.term, req.user.id, false, {
      pageNumber: +query.pageNumber,
      pageSize: +query.pageNumber,
    });
  }

  @Get('/profile')
  @UserAuthFind()
  searchInProfile(
    @Query()
    query: {
      pageSize: number;
      pageNumber: number;
      term: string;
    },
    @Request() req,
  ) {
    return this.searchService.search(query.term, req.user.id, true, {
      pageNumber: +query.pageNumber,
      pageSize: +query.pageNumber,
    });
  }
}
