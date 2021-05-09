import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pagination from '../interfaces/pagination.interface';

@Injectable()
export class PaginationHelper {
  constructor(private configService: ConfigService) {}
  getPageSizeAndNumber(paginationQuery: Pagination): Pagination {
    const pageSize = paginationQuery.pageSize
      ? paginationQuery.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = isNaN(paginationQuery.pageNumber)
      ? 1
      : paginationQuery.pageNumber;
    const skippedItems: number = (pageNumber - 1) * pageSize;

    const pagination: Pagination = {
      pageSize: pageSize,
      pageNumber: pageNumber,
      skippedItems: skippedItems,
    };
    return pagination;
  }
}
