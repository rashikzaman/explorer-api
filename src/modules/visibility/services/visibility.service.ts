import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visibility, VisibilityEnum } from '../models/entity/visibility.entity';

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

  async getVisibility(id: number): Promise<Visibility | undefined> {
    const visibility = await this.visibilityRepository.findOne(id);
    return visibility;
  }

  async getPublicVisibility(): Promise<Visibility> {
    const visibility = await this.visibilityRepository.findOne({
      type: VisibilityEnum.PUBLIC,
    });
    if (!visibility) throw new Error('Public Visiblity not found in database');
    return visibility;
  }

  async getPrivateVisibility(): Promise<Visibility> {
    const visibility = await this.visibilityRepository.findOne({
      type: VisibilityEnum.PUBLIC,
    });
    if (!visibility) throw new Error('Private Visiblity not found in database');
    return visibility;
  }

  async getInviteOnlyVisibility(): Promise<Visibility> {
    const visibility = await this.visibilityRepository.findOne({
      type: VisibilityEnum.PUBLIC,
    });
    if (!visibility)
      throw new Error('Invite-only Visiblity not found in database');
    return visibility;
  }
}
