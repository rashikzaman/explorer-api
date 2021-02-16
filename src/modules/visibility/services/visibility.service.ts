import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visibility } from '../models/entity/visibility.entity';

@Injectable()
export class VisibilityService {
  constructor(
    @InjectRepository(Visibility)
    private visibilityRepository: Repository<Visibility>,
  ) {}

  async getVisibilities(): Promise<Visibility[] | undefined> {
    const visibilities = await this.visibilityRepository.find({});
    return visibilities;
  }
}
