import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationHelper } from '../../core/helpers/pagination-helper';
import { WondersService } from '../../wonders/services/wonders.service';
import { Repository } from 'typeorm';
import { Invite } from '../models/entity/invite.entity';
import { ResourcesService } from '../../resources/services/resources.service';
import { CreateInviteDto } from '../models/dto/create-invite.dto';
import { Resource } from 'src/modules/resources/models/entities/resource.entity';
import { Wonder } from 'src/modules/wonders/models/entities/wonder.entity';
import { throwError } from 'rxjs';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class InviteService {
  constructor(
    private readonly configService: ConfigService,
    private readonly wondersService: WondersService,
    private readonly resourcesService: ResourcesService,
    private readonly userService: UsersService,
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    const resourceId = createInviteDto.resourceId
      ? +createInviteDto.resourceId
      : null;
    const wonderId = createInviteDto.wonderId
      ? +createInviteDto.wonderId
      : null;
    const hostId = +createInviteDto.hostId;
    const inviteeId = +createInviteDto.inviteeId;

    const invitee = await this.userService.findOne(createInviteDto.inviteeId);
    if (!invitee) throw new BadRequestException('Invitee not found!');

    if (resourceId) {
      const resource: Resource = await this.resourcesService.findOne(
        resourceId,
        null,
        false,
      );
      if (!resource) throw new NotFoundException('Resource not found!');
      if (resource.userId !== hostId)
        throw new BadRequestException("User doesn't own this resource!");
    }

    if (wonderId) {
      const wonder: Wonder = await this.wondersService.findOne(
        wonderId,
        null,
        false,
      );
      if (!wonder) throw new NotFoundException('Wonder not found!');
      if (wonder.userId !== hostId)
        throw new BadRequestException("User doesn't own this wonder!");
    }

    const invite = await this.inviteRepository.save({
      resourceId: resourceId,
      wonderId: wonderId,
      hostId: hostId,
      inviteeId: inviteeId,
    });
    return invite;
  }

  async delete(inviteId: number, userId: number): Promise<boolean> {
    const invite = await this.inviteRepository.findOne(inviteId);
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.hostId !== userId)
      throw new BadRequestException("Invite doesn't belong to the host");
    const result = await this.inviteRepository.delete({ id: inviteId });
    return true;
  }
}
