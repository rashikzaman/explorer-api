import { Controller, Get, Query, Request } from '@nestjs/common';
import { UserAuthFind } from '../core/decorators/auth.decorator';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('term') term: string) {
    return this.searchService.search(term);
  }

  @Get('/profile')
  @UserAuthFind()
  searchInProfile(@Query('term') term: string, @Request() req) {
    return this.searchService.search(term, req.user.userId, true);
  }
}
