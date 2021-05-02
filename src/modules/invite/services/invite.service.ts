import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationHelper } from '../../core/helpers/pagination-helper';
import { WondersService } from '../../wonders/services/wonders.service';
import { Repository } from 'typeorm';
import { Invite } from '../models/entity/invite.entity';
import { ResourcesService } from '../../resources/services/resources.service';
import { CreateInviteDto } from '../models/dto/create-invite.dto';

@Injectable()
export class InviteService {
  constructor(
    private readonly configService: ConfigService,
    private readonly wondersService: WondersService,
    private readonly resourcesService: ResourcesService,
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    const resourceId = createInviteDto.resourceId;
    const wonderId = createInviteDto.wonderId;
    const userId = createInviteDto.userId;
    const invite = await this.inviteRepository.save({
      resourceId: resourceId,
      wonderId: wonderId,
      userId: userId,
    });
    return invite;
  }
}
