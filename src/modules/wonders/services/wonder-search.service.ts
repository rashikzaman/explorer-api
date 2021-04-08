import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wonder } from '../models/entities/wonder.entity';
import { User } from '../../users/models/entity/user.entity';
import { VisibilityService } from '../../visibility/services/visibility.service';
import { Like } from 'typeorm';

@Injectable()
export class WonderSearchService {
  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private visibilityService: VisibilityService,
  ) {}

  async searchWonders(
    searchTerm,
    userId = null,
    forProfile = false,
    limit = 12,
  ): Promise<Wonder[] | undefined> {
    let sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where('wonder.title like :title', { title: `%${searchTerm}%` });

    if (forProfile) {
      sqlQuery = sqlQuery.andWhere('wonder.userId = :userId', {
        userId: userId,
      });
    }

    const wonders = sqlQuery.take(limit).getMany();
    return wonders;
  }
}
