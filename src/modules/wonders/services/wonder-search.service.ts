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

  async searchWonders(searchTerm, limit: 12): Promise<Wonder[] | undefined> {
    const wonders = await this.wonderRepository.find({
      where: { title: Like(`%${searchTerm}%`) },
      order: { id: 'DESC' },
      take: limit,
    });
    return wonders;
  }
}
