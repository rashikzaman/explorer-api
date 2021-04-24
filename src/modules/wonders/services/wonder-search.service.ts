import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wonder } from '../models/entities/wonder.entity';
import { User } from '../../users/models/entity/user.entity';
import { VisibilityService } from '../../visibility/services/visibility.service';
import { Like } from 'typeorm';
import { WondersService } from './wonders.service';

@Injectable()
export class WonderSearchService {
  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private visibilityService: VisibilityService,
    private wonderService: WondersService,
  ) {}

  async searchWonders(
    searchTerm,
    userId = null,
    forProfile = false,
    limit = 12,
  ): Promise<Wonder[] | undefined> {
    let sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where(
        `MATCH(wonder.title) AGAINST ('${searchTerm}' IN NATURAL LANGUAGE MODE)`,
      );

    if (forProfile) {
      sqlQuery = sqlQuery.andWhere('wonder.userId = :userId', {
        userId: userId,
      });
    }

    const wonders = await sqlQuery.take(limit).getMany();

    await Promise.all(
      wonders.map(async (wonder) => {
        wonder.coverPhotoUrl = await this.wonderService.addCoverPhotoOfWonder(
          wonder.id,
          +userId,
        );
      }),
    );

    return wonders;
  }
}
